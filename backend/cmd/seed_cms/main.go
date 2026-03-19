// Seed CMS tables with the current hardcoded placeholder images.
// Downloads each Unsplash image, uploads it to your Backblaze B2 bucket,
// then inserts the resulting B2 URL into hero_slides, testimonials, and
// showcase_items.
//
// Safe to run multiple times: skips a table if it already has rows.
//
// Usage (run from the backend/ directory):
//
//	go run ./cmd/seed_cms/main.go
package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/joho/godotenv"

	"captured-moments-backend/storage"
)

// ── Data to seed ──────────────────────────────────────────────────────────────

type heroSlide struct {
	unsplashURL string
	altText     string
}

type testimonial struct {
	unsplashURL string
	quote       string
	couple      string
	location    string
	rating      int
}

type showcaseItem struct {
	unsplashURL string
	title       string
	category    string
}

var heroSlides = []heroSlide{
	{
		unsplashURL: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=85",
		altText:     "Couple under London bridge",
	},
	{
		unsplashURL: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=2400&q=85",
		altText:     "Wedding ceremony",
	},
	{
		unsplashURL: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=2400&q=85",
		altText:     "Intimate portrait",
	},
}

var testimonials = []testimonial{
	{
		unsplashURL: "https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f?auto=format&fit=crop&w=200&q=80",
		quote:       "Lensero captured every emotion, every stolen glance, and every joyful tear. Looking at our photos feels like reliving the most beautiful day of our lives.",
		couple:      "Amanda & David",
		location:    "Galle, Sri Lanka",
		rating:      5,
	},
	{
		unsplashURL: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80",
		quote:       "We were blown away by the artistic quality and attention to detail. Every photograph is a masterpiece that we will treasure for generations to come.",
		couple:      "Jessica & Michael",
		location:    "Kandy, Sri Lanka",
		rating:      5,
	},
	{
		unsplashURL: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=200&q=80",
		quote:       "From our engagement shoot to the wedding day, Lensero made us feel comfortable and the results exceeded all our expectations. Pure magic!",
		couple:      "Sarah & James",
		location:    "Colombo, Sri Lanka",
		rating:      5,
	},
}

var showcaseItems = []showcaseItem{
	{
		unsplashURL: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80",
		title:       "The First Look",
		category:    "Intimate Moments",
	},
	{
		unsplashURL: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
		title:       "Golden Hour",
		category:    "Outdoor Sessions",
	},
	{
		unsplashURL: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
		title:       "Celebration",
		category:    "Wedding Day",
	},
	{
		unsplashURL: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=800&q=80",
		title:       "Behind The Veil",
		category:    "Bridal Portraits",
	},
	{
		unsplashURL: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
		title:       "Together Forever",
		category:    "Couple Sessions",
	},
}

// ── Main ──────────────────────────────────────────────────────────────────────

func main() {
	// Load .env from current directory (run from backend/)
	godotenv.Load()

	// Connect to DB
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}
	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	fmt.Println("✓ Connected to database")

	// Init B2 storage
	store, err := storage.New(
		os.Getenv("B2_ENDPOINT"),
		os.Getenv("B2_KEY_ID"),
		os.Getenv("B2_APPLICATION_KEY"),
		os.Getenv("B2_BUCKET_NAME"),
		os.Getenv("B2_PUBLIC_BASE_URL"),
	)
	if err != nil {
		log.Fatalf("Failed to initialise storage: %v", err)
	}
	fmt.Println("✓ Connected to B2 storage")

	// ── Hero Slides ───────────────────────────────────────────────────────────
	var heroCount int
	db.QueryRow(`SELECT COUNT(*) FROM hero_slides`).Scan(&heroCount)
	if heroCount > 0 {
		fmt.Printf("⏭  hero_slides already has %d row(s) — skipping\n", heroCount)
	} else {
		fmt.Printf("\nSeeding %d hero slides…\n", len(heroSlides))
		for i, slide := range heroSlides {
			b2URL, err := mirrorImage(store, slide.unsplashURL)
			if err != nil {
				log.Printf("  ✗ slide %d: upload failed: %v", i+1, err)
				continue
			}
			_, err = db.Exec(
				`INSERT INTO hero_slides (image_url, alt_text, display_order, is_active)
				 VALUES ($1, $2, $3, true)`,
				b2URL, slide.altText, i,
			)
			if err != nil {
				log.Printf("  ✗ slide %d: DB insert failed: %v", i+1, err)
				continue
			}
			fmt.Printf("  ✓ Hero slide %d/%d: %s\n", i+1, len(heroSlides), slide.altText)
		}
	}

	// ── Testimonials ──────────────────────────────────────────────────────────
	var testimonialCount int
	db.QueryRow(`SELECT COUNT(*) FROM testimonials`).Scan(&testimonialCount)
	if testimonialCount > 0 {
		fmt.Printf("⏭  testimonials already has %d row(s) — skipping\n", testimonialCount)
	} else {
		fmt.Printf("\nSeeding %d testimonials…\n", len(testimonials))
		for i, t := range testimonials {
			b2URL, err := mirrorImage(store, t.unsplashURL)
			if err != nil {
				log.Printf("  ✗ testimonial %d: upload failed: %v", i+1, err)
				continue
			}
			_, err = db.Exec(
				`INSERT INTO testimonials (image_url, quote, couple, location, rating, display_order, is_active)
				 VALUES ($1, $2, $3, $4, $5, $6, true)`,
				b2URL, t.quote, t.couple, t.location, t.rating, i,
			)
			if err != nil {
				log.Printf("  ✗ testimonial %d: DB insert failed: %v", i+1, err)
				continue
			}
			fmt.Printf("  ✓ Testimonial %d/%d: %s\n", i+1, len(testimonials), t.couple)
		}
	}

	// ── Showcase Items ────────────────────────────────────────────────────────
	var showcaseCount int
	db.QueryRow(`SELECT COUNT(*) FROM showcase_items`).Scan(&showcaseCount)
	if showcaseCount > 0 {
		fmt.Printf("⏭  showcase_items already has %d row(s) — skipping\n", showcaseCount)
	} else {
		fmt.Printf("\nSeeding %d showcase items…\n", len(showcaseItems))
		for i, item := range showcaseItems {
			b2URL, err := mirrorImage(store, item.unsplashURL)
			if err != nil {
				log.Printf("  ✗ showcase item %d: upload failed: %v", i+1, err)
				continue
			}
			_, err = db.Exec(
				`INSERT INTO showcase_items (image_url, title, category, display_order, is_active)
				 VALUES ($1, $2, $3, $4, true)`,
				b2URL, item.title, item.category, i,
			)
			if err != nil {
				log.Printf("  ✗ showcase item %d: DB insert failed: %v", i+1, err)
				continue
			}
			fmt.Printf("  ✓ Showcase item %d/%d: %s\n", i+1, len(showcaseItems), item.title)
		}
	}

	fmt.Println("\n✅ CMS seed complete!")
	fmt.Println("   Restart the backend and open the admin panel to see all items.")
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// mirrorImage downloads an image from the given URL and uploads it to B2.
// It streams the HTTP response body directly into the uploader — no temp file needed.
func mirrorImage(store *storage.Storage, imageURL string) (string, error) {
	resp, err := http.Get(imageURL)
	if err != nil {
		return "", fmt.Errorf("download failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("download returned status %d", resp.StatusCode)
	}

	contentType := resp.Header.Get("Content-Type")
	if contentType == "" || contentType == "application/octet-stream" {
		contentType = "image/jpeg"
	}

	// Pass a .jpg filename so UploadFile picks the right extension
	return store.UploadFile("image.jpg", contentType, resp.Body)
}
