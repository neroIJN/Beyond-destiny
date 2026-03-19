package admin

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

// ── Hero Slides ───────────────────────────────────────────────────────────────

func (h *CMSHandler) ListHeroSlides(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, image_url, alt_text, display_order, is_active, created_at
		 FROM hero_slides ORDER BY display_order ASC, created_at ASC`,
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

func (h *CMSHandler) CreateHeroSlide(c *gin.Context) {
	var req models.HeroSlideRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	var s models.HeroSlide
	err := h.db.QueryRow(
		`INSERT INTO hero_slides (image_url, alt_text, display_order, is_active)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, image_url, alt_text, display_order, is_active, created_at`,
		req.ImageURL, req.AltText, req.DisplayOrder, isActive,
	).Scan(&s.ID, &s.ImageURL, &s.AltText, &s.DisplayOrder, &s.IsActive, &s.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create hero slide"})
		return
	}
	c.JSON(http.StatusCreated, s)
}

func (h *CMSHandler) UpdateHeroSlide(c *gin.Context) {
	id := c.Param("id")
	var req models.HeroSlideRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var s models.HeroSlide
	err := h.db.QueryRow(
		`UPDATE hero_slides SET
			image_url = COALESCE(NULLIF($1, ''), image_url),
			alt_text = $2,
			display_order = $3,
			is_active = COALESCE($4, is_active)
		 WHERE id = $5
		 RETURNING id, image_url, alt_text, display_order, is_active, created_at`,
		req.ImageURL, req.AltText, req.DisplayOrder, req.IsActive, id,
	).Scan(&s.ID, &s.ImageURL, &s.AltText, &s.DisplayOrder, &s.IsActive, &s.CreatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hero slide not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update hero slide"})
		return
	}
	c.JSON(http.StatusOK, s)
}

func (h *CMSHandler) DeleteHeroSlide(c *gin.Context) {
	id := c.Param("id")
	result, err := h.db.Exec(`DELETE FROM hero_slides WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete hero slide"})
		return
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hero slide not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Hero slide deleted"})
}

// ── Testimonials ──────────────────────────────────────────────────────────────

func (h *CMSHandler) ListTestimonials(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, image_url, quote, couple, location, rating, display_order, is_active, created_at
		 FROM testimonials ORDER BY display_order ASC, created_at ASC`,
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

func (h *CMSHandler) CreateTestimonial(c *gin.Context) {
	var req models.TestimonialRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}
	rating := req.Rating
	if rating == 0 {
		rating = 5
	}

	var t models.Testimonial
	err := h.db.QueryRow(
		`INSERT INTO testimonials (image_url, quote, couple, location, rating, display_order, is_active)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 RETURNING id, image_url, quote, couple, location, rating, display_order, is_active, created_at`,
		req.ImageURL, req.Quote, req.Couple, req.Location, rating, req.DisplayOrder, isActive,
	).Scan(&t.ID, &t.ImageURL, &t.Quote, &t.Couple, &t.Location,
		&t.Rating, &t.DisplayOrder, &t.IsActive, &t.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create testimonial"})
		return
	}
	c.JSON(http.StatusCreated, t)
}

func (h *CMSHandler) UpdateTestimonial(c *gin.Context) {
	id := c.Param("id")
	var req models.TestimonialRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var t models.Testimonial
	err := h.db.QueryRow(
		`UPDATE testimonials SET
			image_url = COALESCE(NULLIF($1, ''), image_url),
			quote = COALESCE(NULLIF($2, ''), quote),
			couple = COALESCE(NULLIF($3, ''), couple),
			location = COALESCE(NULLIF($4, ''), location),
			rating = CASE WHEN $5 != 0 THEN $5 ELSE rating END,
			display_order = $6,
			is_active = COALESCE($7, is_active)
		 WHERE id = $8
		 RETURNING id, image_url, quote, couple, location, rating, display_order, is_active, created_at`,
		req.ImageURL, req.Quote, req.Couple, req.Location, req.Rating, req.DisplayOrder, req.IsActive, id,
	).Scan(&t.ID, &t.ImageURL, &t.Quote, &t.Couple, &t.Location,
		&t.Rating, &t.DisplayOrder, &t.IsActive, &t.CreatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Testimonial not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update testimonial"})
		return
	}
	c.JSON(http.StatusOK, t)
}

func (h *CMSHandler) DeleteTestimonial(c *gin.Context) {
	id := c.Param("id")
	result, err := h.db.Exec(`DELETE FROM testimonials WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete testimonial"})
		return
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Testimonial not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Testimonial deleted"})
}

// ── Showcase Items ────────────────────────────────────────────────────────────

func (h *CMSHandler) ListShowcaseItems(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, image_url, title, category, display_order, is_active, created_at
		 FROM showcase_items ORDER BY display_order ASC, created_at ASC`,
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

func (h *CMSHandler) CreateShowcaseItem(c *gin.Context) {
	var req models.ShowcaseItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	var s models.ShowcaseItem
	err := h.db.QueryRow(
		`INSERT INTO showcase_items (image_url, title, category, display_order, is_active)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, image_url, title, category, display_order, is_active, created_at`,
		req.ImageURL, req.Title, req.Category, req.DisplayOrder, isActive,
	).Scan(&s.ID, &s.ImageURL, &s.Title, &s.Category, &s.DisplayOrder, &s.IsActive, &s.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create showcase item"})
		return
	}
	c.JSON(http.StatusCreated, s)
}

func (h *CMSHandler) UpdateShowcaseItem(c *gin.Context) {
	id := c.Param("id")
	var req models.ShowcaseItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var s models.ShowcaseItem
	err := h.db.QueryRow(
		`UPDATE showcase_items SET
			image_url = COALESCE(NULLIF($1, ''), image_url),
			title = COALESCE(NULLIF($2, ''), title),
			category = COALESCE(NULLIF($3, ''), category),
			display_order = $4,
			is_active = COALESCE($5, is_active)
		 WHERE id = $6
		 RETURNING id, image_url, title, category, display_order, is_active, created_at`,
		req.ImageURL, req.Title, req.Category, req.DisplayOrder, req.IsActive, id,
	).Scan(&s.ID, &s.ImageURL, &s.Title, &s.Category, &s.DisplayOrder, &s.IsActive, &s.CreatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Showcase item not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update showcase item"})
		return
	}
	c.JSON(http.StatusOK, s)
}

func (h *CMSHandler) DeleteShowcaseItem(c *gin.Context) {
	id := c.Param("id")
	result, err := h.db.Exec(`DELETE FROM showcase_items WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete showcase item"})
		return
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Showcase item not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Showcase item deleted"})
}

// ── Site Settings ─────────────────────────────────────────────────────────────

func (h *CMSHandler) GetSettings(c *gin.Context) {
	rows, err := h.db.Query(`SELECT key, value FROM site_settings ORDER BY key`)
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

// ── Team Members ──────────────────────────────────────────────────────────────

func (h *CMSHandler) ListTeamMembers(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, name, role, image_url, display_order, is_active, created_at
		 FROM team_members ORDER BY display_order ASC, created_at ASC`,
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

func (h *CMSHandler) CreateTeamMember(c *gin.Context) {
	var req models.TeamMemberRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	var m models.TeamMember
	err := h.db.QueryRow(
		`INSERT INTO team_members (name, role, image_url, display_order, is_active)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, name, role, image_url, display_order, is_active, created_at`,
		req.Name, req.Role, req.ImageURL, req.DisplayOrder, isActive,
	).Scan(&m.ID, &m.Name, &m.Role, &m.ImageURL, &m.DisplayOrder, &m.IsActive, &m.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team member"})
		return
	}
	c.JSON(http.StatusCreated, m)
}

func (h *CMSHandler) UpdateTeamMember(c *gin.Context) {
	id := c.Param("id")
	var req models.TeamMemberRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var m models.TeamMember
	err := h.db.QueryRow(
		`UPDATE team_members SET
			name = COALESCE(NULLIF($1, ''), name),
			role = COALESCE(NULLIF($2, ''), role),
			image_url = COALESCE(NULLIF($3, ''), image_url),
			display_order = $4,
			is_active = COALESCE($5, is_active)
		 WHERE id = $6
		 RETURNING id, name, role, image_url, display_order, is_active, created_at`,
		req.Name, req.Role, req.ImageURL, req.DisplayOrder, req.IsActive, id,
	).Scan(&m.ID, &m.Name, &m.Role, &m.ImageURL, &m.DisplayOrder, &m.IsActive, &m.CreatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Team member not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update team member"})
		return
	}
	c.JSON(http.StatusOK, m)
}

func (h *CMSHandler) DeleteTeamMember(c *gin.Context) {
	id := c.Param("id")
	result, err := h.db.Exec(`DELETE FROM team_members WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete team member"})
		return
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Team member not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Team member deleted"})
}

func (h *CMSHandler) UpdateSettings(c *gin.Context) {
	var updates models.SettingsUpdateRequest
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx, err := h.db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}
	defer tx.Rollback()

	for key, value := range updates {
		_, err := tx.Exec(
			`INSERT INTO site_settings (key, value, updated_at)
			 VALUES ($1, $2, NOW())
			 ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
			key, value,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save settings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Settings updated"})
}

// ── Services ──────────────────────────────────────────────────────────────────

func (h *CMSHandler) ListServices(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, title, icon_name, image_url, description, features, display_order, is_active, created_at
		 FROM services ORDER BY display_order ASC, created_at ASC`,
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

func (h *CMSHandler) CreateService(c *gin.Context) {
	var req models.ServiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}
	if req.Features == nil {
		req.Features = []string{}
	}

	var s models.Service
	err := h.db.QueryRow(
		`INSERT INTO services (title, icon_name, image_url, description, features, display_order, is_active)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 RETURNING id, title, icon_name, image_url, description, features, display_order, is_active, created_at`,
		req.Title, req.IconName, req.ImageURL, req.Description,
		pq.Array(req.Features), req.DisplayOrder, isActive,
	).Scan(
		&s.ID, &s.Title, &s.IconName, &s.ImageURL, &s.Description,
		pq.Array(&s.Features), &s.DisplayOrder, &s.IsActive, &s.CreatedAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create service"})
		return
	}
	c.JSON(http.StatusCreated, s)
}

func (h *CMSHandler) UpdateService(c *gin.Context) {
	id := c.Param("id")
	var req models.ServiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Features == nil {
		req.Features = []string{}
	}

	var s models.Service
	err := h.db.QueryRow(
		`UPDATE services SET
			title         = COALESCE(NULLIF($1, ''), title),
			icon_name     = COALESCE(NULLIF($2, ''), icon_name),
			image_url     = COALESCE(NULLIF($3, ''), image_url),
			description   = $4,
			features      = $5,
			display_order = $6,
			is_active     = COALESCE($7, is_active)
		 WHERE id = $8
		 RETURNING id, title, icon_name, image_url, description, features, display_order, is_active, created_at`,
		req.Title, req.IconName, req.ImageURL, req.Description,
		pq.Array(req.Features), req.DisplayOrder, req.IsActive, id,
	).Scan(
		&s.ID, &s.Title, &s.IconName, &s.ImageURL, &s.Description,
		pq.Array(&s.Features), &s.DisplayOrder, &s.IsActive, &s.CreatedAt,
	)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update service"})
		return
	}
	c.JSON(http.StatusOK, s)
}

func (h *CMSHandler) DeleteService(c *gin.Context) {
	id := c.Param("id")
	result, err := h.db.Exec(`DELETE FROM services WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete service"})
		return
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Service deleted"})
}
