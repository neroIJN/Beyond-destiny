package models

import "time"

type Album struct {
	ID             string    `json:"id" db:"id"`
	Title          string    `json:"title" db:"title"`
	Slug           string    `json:"slug" db:"slug"`
	Category       string    `json:"category" db:"category"`
	CoverImageURL  string    `json:"cover_image_url" db:"cover_image_url"`
	DisplayOrder   int       `json:"display_order" db:"display_order"`
	IsPublished    bool      `json:"is_published" db:"is_published"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
}

type AlbumWithPhotos struct {
	Album
	Photos []Photo `json:"photos"`
}

type Photo struct {
	ID           string    `json:"id" db:"id"`
	AlbumID      string    `json:"album_id" db:"album_id"`
	URL          string    `json:"url" db:"url"`
	AltText      string    `json:"alt_text" db:"alt_text"`
	DisplayOrder int       `json:"display_order" db:"display_order"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type CreateAlbumRequest struct {
	Title         string `json:"title" binding:"required"`
	Slug          string `json:"slug" binding:"required"`
	Category      string `json:"category" binding:"required"`
	CoverImageURL string `json:"cover_image_url" binding:"required"`
	DisplayOrder  int    `json:"display_order"`
	IsPublished   bool   `json:"is_published"`
}

type UpdateAlbumRequest struct {
	Title         string `json:"title"`
	Slug          string `json:"slug"`
	Category      string `json:"category"`
	CoverImageURL string `json:"cover_image_url"`
	DisplayOrder  int    `json:"display_order"`
	IsPublished   *bool  `json:"is_published"`
}

type AddPhotoRequest struct {
	URL          string `json:"url" binding:"required"`
	AltText      string `json:"alt_text"`
	DisplayOrder int    `json:"display_order"`
}

type ReorderPhotosRequest struct {
	Photos []PhotoOrder `json:"photos" binding:"required"`
}

type PhotoOrder struct {
	ID           string `json:"id" binding:"required"`
	DisplayOrder int    `json:"display_order"`
}

// ── Album Categories ──────────────────────────────────────────────────────────

type AlbumCategory struct {
	ID           string    `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	DisplayOrder int       `json:"display_order" db:"display_order"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type AlbumCategoryRequest struct {
	Name         string `json:"name" binding:"required"`
	DisplayOrder int    `json:"display_order"`
}
