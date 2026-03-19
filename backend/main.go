package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"captured-moments-backend/config"
	"captured-moments-backend/db"
	"captured-moments-backend/email"
	adminHandlers "captured-moments-backend/handlers/admin"
	publicHandlers "captured-moments-backend/handlers/public"
	"captured-moments-backend/middleware"
	"captured-moments-backend/storage"
)

func main() {
	cfg := config.Load()

	// Connect to database
	database := db.Connect(cfg.DatabaseURL)
	defer database.Close()

	// Initialize storage (Backblaze B2 / S3-compatible)
	store, err := storage.New(
		cfg.B2Endpoint,
		cfg.B2KeyID,
		cfg.B2ApplicationKey,
		cfg.B2BucketName,
		cfg.B2PublicBaseURL,
	)
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}

	// Initialize email service
	emailSvc := email.New(
		cfg.SMTPHost,
		cfg.SMTPPort,
		cfg.SMTPUser,
		cfg.SMTPPassword,
		cfg.NotifyEmail,
	)

	// Initialize handlers
	pubAlbums := publicHandlers.NewAlbumsHandler(database)
	pubContact := publicHandlers.NewContactHandler(database, emailSvc)
	pubCMS := publicHandlers.NewCMSHandler(database)

	adminAuth := adminHandlers.NewAuthHandler(database, cfg.JWTSecret)
	adminUpload := adminHandlers.NewUploadHandler(store)
	adminAlbums := adminHandlers.NewAlbumsHandler(database, store)
	adminContact := adminHandlers.NewContactHandler(database)
	adminCMS := adminHandlers.NewCMSHandler(database)

	// Set up router
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.CORS(cfg.FrontendURL))

	// Serve static files from frontend build (for production)
	r.Static("/assets", "../frontend/dist/assets")

	// ─── Public API ─────────────────────────────────────────────────────────────
	api := r.Group("/api")
	{
		api.GET("/albums", pubAlbums.ListAlbums)
		api.GET("/albums/:slug", pubAlbums.GetAlbum)

		api.POST("/contact", pubContact.SubmitContact)
		api.POST("/quote-request", pubContact.SubmitQuote)

		// CMS — public read-only
		api.GET("/hero-slides", pubCMS.GetHeroSlides)
		api.GET("/testimonials", pubCMS.GetTestimonials)
		api.GET("/showcase", pubCMS.GetShowcaseItems)
		api.GET("/settings", pubCMS.GetSiteSettings)
		api.GET("/team-members", pubCMS.GetTeamMembers)
		api.GET("/services", pubCMS.GetServices)
		api.GET("/album-categories", pubAlbums.ListCategories)
	}

	// ─── Admin Login (no auth required) ─────────────────────────────────────────
	r.POST("/api/admin/login", adminAuth.Login)

	// ─── Admin API (JWT required) ────────────────────────────────────────────────
	admin := r.Group("/api/admin")
	admin.Use(middleware.RequireAuth(cfg.JWTSecret))
	{
		// Image upload
		admin.POST("/upload", adminUpload.UploadImage)

		// Albums
		admin.GET("/albums", adminAlbums.ListAlbums)
		admin.POST("/albums", adminAlbums.CreateAlbum)
		admin.PUT("/albums/:id", adminAlbums.UpdateAlbum)
		admin.DELETE("/albums/:id", adminAlbums.DeleteAlbum)

		// Photos within an album
		admin.GET("/albums/:id/photos", adminAlbums.GetAlbumPhotos)
		admin.POST("/albums/:id/photos", adminAlbums.AddPhoto)
		admin.DELETE("/albums/:id/photos/:photoId", adminAlbums.DeletePhoto)
		admin.PATCH("/albums/:id/photos/reorder", adminAlbums.ReorderPhotos)

		admin.GET("/quote-requests", adminContact.ListQuoteRequests)
		admin.PATCH("/quote-requests/:id/read", adminContact.MarkQuoteRead)
		admin.DELETE("/quote-requests/:id", adminContact.DeleteQuoteRequest)

		// Contact submissions
		admin.GET("/contact-submissions", adminContact.ListContactSubmissions)
		admin.PATCH("/contact-submissions/:id/read", adminContact.MarkContactRead)
		admin.DELETE("/contact-submissions/:id", adminContact.DeleteContactSubmission)

		// CMS — Hero Slides
		admin.GET("/hero-slides", adminCMS.ListHeroSlides)
		admin.POST("/hero-slides", adminCMS.CreateHeroSlide)
		admin.PUT("/hero-slides/:id", adminCMS.UpdateHeroSlide)
		admin.DELETE("/hero-slides/:id", adminCMS.DeleteHeroSlide)

		// CMS — Testimonials
		admin.GET("/testimonials", adminCMS.ListTestimonials)
		admin.POST("/testimonials", adminCMS.CreateTestimonial)
		admin.PUT("/testimonials/:id", adminCMS.UpdateTestimonial)
		admin.DELETE("/testimonials/:id", adminCMS.DeleteTestimonial)

		// CMS — Showcase Items
		admin.GET("/showcase", adminCMS.ListShowcaseItems)
		admin.POST("/showcase", adminCMS.CreateShowcaseItem)
		admin.PUT("/showcase/:id", adminCMS.UpdateShowcaseItem)
		admin.DELETE("/showcase/:id", adminCMS.DeleteShowcaseItem)

		// CMS — Team Members
		admin.GET("/team-members", adminCMS.ListTeamMembers)
		admin.POST("/team-members", adminCMS.CreateTeamMember)
		admin.PUT("/team-members/:id", adminCMS.UpdateTeamMember)
		admin.DELETE("/team-members/:id", adminCMS.DeleteTeamMember)

		// CMS — Services
		admin.GET("/services",      adminCMS.ListServices)
		admin.POST("/services",     adminCMS.CreateService)
		admin.PUT("/services/:id",  adminCMS.UpdateService)
		admin.DELETE("/services/:id", adminCMS.DeleteService)

		// CMS — Site Settings
		admin.GET("/settings", adminCMS.GetSettings)
		admin.PATCH("/settings", adminCMS.UpdateSettings)

		// Album Categories
		admin.GET("/album-categories", adminAlbums.ListCategories)
		admin.POST("/album-categories", adminAlbums.CreateCategory)
		admin.PUT("/album-categories/:id", adminAlbums.UpdateCategory)
		admin.DELETE("/album-categories/:id", adminAlbums.DeleteCategory)
	}

	// Catch-all: serve React app for non-API routes (production SPA routing)
	r.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, "/api") {
			c.JSON(http.StatusNotFound, gin.H{"error": "API endpoint not found"})
			return
		}
		c.File("../frontend/dist/index.html")
	})

	log.Printf("Server starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
