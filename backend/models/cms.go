package models

import "time"

// ── Hero Slides ───────────────────────────────────────────────────────────────

type HeroSlide struct {
	ID           string    `json:"id" db:"id"`
	ImageURL     string    `json:"image_url" db:"image_url"`
	AltText      string    `json:"alt_text" db:"alt_text"`
	DisplayOrder int       `json:"display_order" db:"display_order"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type HeroSlideRequest struct {
	ImageURL     string `json:"image_url" binding:"required"`
	AltText      string `json:"alt_text"`
	DisplayOrder int    `json:"display_order"`
	IsActive     *bool  `json:"is_active"`
}

// ── Testimonials ──────────────────────────────────────────────────────────────

type Testimonial struct {
	ID           string    `json:"id" db:"id"`
	ImageURL     string    `json:"image_url" db:"image_url"`
	Quote        string    `json:"quote" db:"quote"`
	Couple       string    `json:"couple" db:"couple"`
	Location     string    `json:"location" db:"location"`
	Rating       int       `json:"rating" db:"rating"`
	DisplayOrder int       `json:"display_order" db:"display_order"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type TestimonialRequest struct {
	ImageURL     string `json:"image_url" binding:"required"`
	Quote        string `json:"quote" binding:"required"`
	Couple       string `json:"couple" binding:"required"`
	Location     string `json:"location" binding:"required"`
	Rating       int    `json:"rating"`
	DisplayOrder int    `json:"display_order"`
	IsActive     *bool  `json:"is_active"`
}

// ── Showcase Items ────────────────────────────────────────────────────────────

type ShowcaseItem struct {
	ID           string    `json:"id" db:"id"`
	ImageURL     string    `json:"image_url" db:"image_url"`
	Title        string    `json:"title" db:"title"`
	Category     string    `json:"category" db:"category"`
	DisplayOrder int       `json:"display_order" db:"display_order"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type ShowcaseItemRequest struct {
	ImageURL     string `json:"image_url" binding:"required"`
	Title        string `json:"title" binding:"required"`
	Category     string `json:"category" binding:"required"`
	DisplayOrder int    `json:"display_order"`
	IsActive     *bool  `json:"is_active"`
}

// ── Site Settings ─────────────────────────────────────────────────────────────

type SiteSetting struct {
	Key   string `json:"key" db:"key"`
	Value string `json:"value" db:"value"`
}

// Map of key → value for PATCH /admin/settings
type SettingsUpdateRequest map[string]string

// ── Team Members ──────────────────────────────────────────────────────────────

type TeamMember struct {
	ID           string    `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	Role         string    `json:"role" db:"role"`
	ImageURL     string    `json:"image_url" db:"image_url"`
	DisplayOrder int       `json:"display_order" db:"display_order"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type TeamMemberRequest struct {
	Name         string `json:"name" binding:"required"`
	Role         string `json:"role" binding:"required"`
	ImageURL     string `json:"image_url" binding:"required"`
	DisplayOrder int    `json:"display_order"`
	IsActive     *bool  `json:"is_active"`
}

// ── Services ──────────────────────────────────────────────────────────────────

type Service struct {
	ID           string    `json:"id" db:"id"`
	Title        string    `json:"title" db:"title"`
	IconName     string    `json:"icon_name" db:"icon_name"`
	ImageURL     string    `json:"image_url" db:"image_url"`
	Description  string    `json:"description" db:"description"`
	Features     []string  `json:"features" db:"features"`
	DisplayOrder int       `json:"display_order" db:"display_order"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type ServiceRequest struct {
	Title        string   `json:"title"         binding:"required"`
	IconName     string   `json:"icon_name"     binding:"required"`
	ImageURL     string   `json:"image_url"     binding:"required"`
	Description  string   `json:"description"`
	Features     []string `json:"features"`
	DisplayOrder int      `json:"display_order"`
	IsActive     *bool    `json:"is_active"`
}
