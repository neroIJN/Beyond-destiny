package public

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"

	"captured-moments-backend/models"
)

type CMSHandler struct {
	db *sql.DB
}

func NewCMSHandler(db *sql.DB) *CMSHandler {
	return &CMSHandler{db: db}
}

func (h *CMSHandler) GetHeroSlides(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, image_url, alt_text, display_order, is_active, created_at
		 FROM hero_slides WHERE is_active = true ORDER BY display_order ASC, created_at ASC`,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch hero slides"})
		return
	}
	defer rows.Close()

	slides := []models.HeroSlide{}
	for rows.Next() {
		var s models.HeroSlide
		if err := rows.Scan(&s.ID, &s.ImageURL, &s.AltText, &s.DisplayOrder, &s.IsActive, &s.CreatedAt); err != nil {
			continue
		}
		slides = append(slides, s)
	}
	c.JSON(http.StatusOK, slides)
}

func (h *CMSHandler) GetTestimonials(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, image_url, quote, couple, location, rating, display_order, is_active, created_at
		 FROM testimonials WHERE is_active = true ORDER BY display_order ASC, created_at ASC`,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch testimonials"})
		return
	}
	defer rows.Close()

	testimonials := []models.Testimonial{}
	for rows.Next() {
		var t models.Testimonial
		if err := rows.Scan(&t.ID, &t.ImageURL, &t.Quote, &t.Couple, &t.Location,
			&t.Rating, &t.DisplayOrder, &t.IsActive, &t.CreatedAt); err != nil {
			continue
		}
		testimonials = append(testimonials, t)
	}
	c.JSON(http.StatusOK, testimonials)
}

func (h *CMSHandler) GetShowcaseItems(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, image_url, title, category, display_order, is_active, created_at
		 FROM showcase_items WHERE is_active = true ORDER BY display_order ASC, created_at ASC`,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch showcase items"})
		return
	}
	defer rows.Close()

	items := []models.ShowcaseItem{}
	for rows.Next() {
		var s models.ShowcaseItem
		if err := rows.Scan(&s.ID, &s.ImageURL, &s.Title, &s.Category, &s.DisplayOrder, &s.IsActive, &s.CreatedAt); err != nil {
			continue
		}
		items = append(items, s)
	}
	c.JSON(http.StatusOK, items)
}

func (h *CMSHandler) GetTeamMembers(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, name, role, image_url, display_order, is_active, created_at
		 FROM team_members WHERE is_active = true ORDER BY display_order ASC, created_at ASC`,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch team members"})
		return
	}
	defer rows.Close()

	members := []models.TeamMember{}
	for rows.Next() {
		var m models.TeamMember
		if err := rows.Scan(&m.ID, &m.Name, &m.Role, &m.ImageURL, &m.DisplayOrder, &m.IsActive, &m.CreatedAt); err != nil {
			continue
		}
		members = append(members, m)
	}
	c.JSON(http.StatusOK, members)
}

// GetSiteSettings returns all settings as a flat { key: value } JSON object.
func (h *CMSHandler) GetSiteSettings(c *gin.Context) {
	rows, err := h.db.Query(`SELECT key, value FROM site_settings`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch settings"})
		return
	}
	defer rows.Close()

	settings := make(map[string]string)
	for rows.Next() {
		var s models.SiteSetting
		if err := rows.Scan(&s.Key, &s.Value); err != nil {
			continue
		}
		settings[s.Key] = s.Value
	}
	c.JSON(http.StatusOK, settings)
}

// ── Services ──────────────────────────────────────────────────────────────────

func (h *CMSHandler) GetServices(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, title, icon_name, image_url, description, features, display_order, is_active, created_at
		 FROM services WHERE is_active = true ORDER BY display_order ASC`,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch services"})
		return
	}
	defer rows.Close()

	services := []models.Service{}
	for rows.Next() {
		var s models.Service
		if err := rows.Scan(
			&s.ID, &s.Title, &s.IconName, &s.ImageURL, &s.Description,
			pq.Array(&s.Features), &s.DisplayOrder, &s.IsActive, &s.CreatedAt,
		); err != nil {
			continue
		}
		services = append(services, s)
	}
	c.JSON(http.StatusOK, services)
}
