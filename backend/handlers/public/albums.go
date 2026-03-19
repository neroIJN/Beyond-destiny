package public

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"

	"captured-moments-backend/models"
)

type AlbumsHandler struct {
	db *sql.DB
}

func NewAlbumsHandler(db *sql.DB) *AlbumsHandler {
	return &AlbumsHandler{db: db}
}

func (h *AlbumsHandler) ListAlbums(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, title, slug, category, cover_image_url, display_order, is_published, created_at, updated_at
		 FROM albums WHERE is_published = true ORDER BY display_order ASC, created_at DESC`,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch albums"})
		return
	}
	defer rows.Close()

	albums := []models.Album{}
	for rows.Next() {
		var a models.Album
		if err := rows.Scan(&a.ID, &a.Title, &a.Slug, &a.Category, &a.CoverImageURL,
			&a.DisplayOrder, &a.IsPublished, &a.CreatedAt, &a.UpdatedAt); err != nil {
			continue
		}
		albums = append(albums, a)
	}
	c.JSON(http.StatusOK, albums)
}

func (h *AlbumsHandler) GetAlbum(c *gin.Context) {
	slug := c.Param("slug")

	var album models.Album
	err := h.db.QueryRow(
		`SELECT id, title, slug, category, cover_image_url, display_order, is_published, created_at, updated_at
		 FROM albums WHERE slug = $1 AND is_published = true`,
		slug,
	).Scan(&album.ID, &album.Title, &album.Slug, &album.Category, &album.CoverImageURL,
		&album.DisplayOrder, &album.IsPublished, &album.CreatedAt, &album.UpdatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Album not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch album"})
		return
	}

	rows, err := h.db.Query(
		`SELECT id, album_id, url, alt_text, display_order, created_at
		 FROM photos WHERE album_id = $1 ORDER BY display_order ASC, created_at ASC`,
		album.ID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch photos"})
		return
	}
	defer rows.Close()

	photos := []models.Photo{}
	for rows.Next() {
		var p models.Photo
		if err := rows.Scan(&p.ID, &p.AlbumID, &p.URL, &p.AltText, &p.DisplayOrder, &p.CreatedAt); err != nil {
			continue
		}
		photos = append(photos, p)
	}

	c.JSON(http.StatusOK, models.AlbumWithPhotos{
		Album:  album,
		Photos: photos,
	})
}

func (h *AlbumsHandler) ListCategories(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, name, display_order, created_at FROM album_categories ORDER BY display_order ASC, name ASC`,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}
	defer rows.Close()

	cats := []models.AlbumCategory{}
	for rows.Next() {
		var cat models.AlbumCategory
		if err := rows.Scan(&cat.ID, &cat.Name, &cat.DisplayOrder, &cat.CreatedAt); err != nil {
			continue
		}
		cats = append(cats, cat)
	}
	c.JSON(http.StatusOK, cats)
}
