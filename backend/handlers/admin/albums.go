package admin

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"captured-moments-backend/models"
	"captured-moments-backend/storage"
)

type AlbumsHandler struct {
	db      *sql.DB
	storage *storage.Storage
}

func NewAlbumsHandler(db *sql.DB, storage *storage.Storage) *AlbumsHandler {
	return &AlbumsHandler{db: db, storage: storage}
}

func (h *AlbumsHandler) ListAlbums(c *gin.Context) {
	rows, err := h.db.Query(
		`SELECT id, title, slug, category, cover_image_url, display_order, is_published, created_at, updated_at
		 FROM albums ORDER BY display_order ASC, created_at DESC`,
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

func (h *AlbumsHandler) CreateAlbum(c *gin.Context) {
	var req models.CreateAlbumRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var album models.Album
	err := h.db.QueryRow(
		`INSERT INTO albums (title, slug, category, cover_image_url, display_order, is_published)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, title, slug, category, cover_image_url, display_order, is_published, created_at, updated_at`,
		req.Title, req.Slug, req.Category, req.CoverImageURL, req.DisplayOrder, req.IsPublished,
	).Scan(&album.ID, &album.Title, &album.Slug, &album.Category, &album.CoverImageURL,
		&album.DisplayOrder, &album.IsPublished, &album.CreatedAt, &album.UpdatedAt)

	if err != nil {
		if isUniqueViolation(err) {
			c.JSON(http.StatusConflict, gin.H{"error": "An album with this slug already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create album"})
		return
	}

	c.JSON(http.StatusCreated, album)
}

func (h *AlbumsHandler) UpdateAlbum(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateAlbumRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var album models.Album
	err := h.db.QueryRow(
		`UPDATE albums SET
			title = COALESCE(NULLIF($1, ''), title),
			slug = COALESCE(NULLIF($2, ''), slug),
			category = COALESCE(NULLIF($3, ''), category),
			cover_image_url = COALESCE(NULLIF($4, ''), cover_image_url),
			display_order = CASE WHEN $5 != 0 THEN $5 ELSE display_order END,
			is_published = COALESCE($6, is_published),
			updated_at = NOW()
		 WHERE id = $7
		 RETURNING id, title, slug, category, cover_image_url, display_order, is_published, created_at, updated_at`,
		req.Title, req.Slug, req.Category, req.CoverImageURL, req.DisplayOrder, req.IsPublished, id,
	).Scan(&album.ID, &album.Title, &album.Slug, &album.Category, &album.CoverImageURL,
		&album.DisplayOrder, &album.IsPublished, &album.CreatedAt, &album.UpdatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Album not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update album"})
		return
	}

	c.JSON(http.StatusOK, album)
}

func (h *AlbumsHandler) DeleteAlbum(c *gin.Context) {
	id := c.Param("id")

	// Get cover image URL to delete from storage
	var coverURL string
	h.db.QueryRow(`SELECT cover_image_url FROM albums WHERE id = $1`, id).Scan(&coverURL)

	// Get all photo URLs to delete from storage
	rows, _ := h.db.Query(`SELECT url FROM photos WHERE album_id = $1`, id)
	var photoURLs []string
	if rows != nil {
		defer rows.Close()
		for rows.Next() {
			var url string
			rows.Scan(&url)
			photoURLs = append(photoURLs, url)
		}
	}

	result, err := h.db.Exec(`DELETE FROM albums WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete album"})
		return
	}

	n, _ := result.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Album not found"})
		return
	}

	// Delete images from storage (non-blocking - don't fail if storage deletion fails)
	go func() {
		h.storage.DeleteFile(coverURL)
		for _, url := range photoURLs {
			h.storage.DeleteFile(url)
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "Album deleted"})
}

func (h *AlbumsHandler) AddPhoto(c *gin.Context) {
	albumID := c.Param("id")

	var req models.AddPhotoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify album exists
	var exists bool
	h.db.QueryRow(`SELECT EXISTS(SELECT 1 FROM albums WHERE id = $1)`, albumID).Scan(&exists)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Album not found"})
		return
	}

	var photo models.Photo
	err := h.db.QueryRow(
		`INSERT INTO photos (album_id, url, alt_text, display_order)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, album_id, url, alt_text, display_order, created_at`,
		albumID, req.URL, req.AltText, req.DisplayOrder,
	).Scan(&photo.ID, &photo.AlbumID, &photo.URL, &photo.AltText, &photo.DisplayOrder, &photo.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add photo"})
		return
	}

	c.JSON(http.StatusCreated, photo)
}

func (h *AlbumsHandler) DeletePhoto(c *gin.Context) {
	photoID := c.Param("photoId")

	var photoURL string
	h.db.QueryRow(`SELECT url FROM photos WHERE id = $1`, photoID).Scan(&photoURL)

	result, err := h.db.Exec(`DELETE FROM photos WHERE id = $1`, photoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete photo"})
		return
	}

	n, _ := result.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Photo not found"})
		return
	}

	go h.storage.DeleteFile(photoURL)

	c.JSON(http.StatusOK, gin.H{"message": "Photo deleted"})
}

func (h *AlbumsHandler) GetAlbumPhotos(c *gin.Context) {
	albumID := c.Param("id")

	// Verify album exists (admin sees all albums, not just published)
	var exists bool
	h.db.QueryRow(`SELECT EXISTS(SELECT 1 FROM albums WHERE id = $1)`, albumID).Scan(&exists)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Album not found"})
		return
	}

	rows, err := h.db.Query(
		`SELECT id, album_id, url, alt_text, display_order, created_at
		 FROM photos WHERE album_id = $1 ORDER BY display_order ASC`,
		albumID,
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
	c.JSON(http.StatusOK, photos)
}

func (h *AlbumsHandler) ReorderPhotos(c *gin.Context) {
	albumID := c.Param("id")

	var req models.ReorderPhotosRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx, err := h.db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}
	defer tx.Rollback()

	for _, p := range req.Photos {
		tx.Exec(
			`UPDATE photos SET display_order = $1 WHERE id = $2 AND album_id = $3`,
			p.DisplayOrder, p.ID, albumID,
		)
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reorder photos"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Photos reordered"})
}

// ── Album Categories ──────────────────────────────────────────────────────────

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

func (h *AlbumsHandler) CreateCategory(c *gin.Context) {
	var req models.AlbumCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cat models.AlbumCategory
	err := h.db.QueryRow(
		`INSERT INTO album_categories (name, display_order) VALUES ($1, $2)
		 RETURNING id, name, display_order, created_at`,
		req.Name, req.DisplayOrder,
	).Scan(&cat.ID, &cat.Name, &cat.DisplayOrder, &cat.CreatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category (name may already exist)"})
		return
	}
	c.JSON(http.StatusCreated, cat)
}

func (h *AlbumsHandler) UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	var req models.AlbumCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cat models.AlbumCategory
	err := h.db.QueryRow(
		`UPDATE album_categories SET name = $1, display_order = $2 WHERE id = $3
		 RETURNING id, name, display_order, created_at`,
		req.Name, req.DisplayOrder, id,
	).Scan(&cat.ID, &cat.Name, &cat.DisplayOrder, &cat.CreatedAt)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}
	c.JSON(http.StatusOK, cat)
}

func (h *AlbumsHandler) DeleteCategory(c *gin.Context) {
	id := c.Param("id")

	// Get category name first (need it for the album check)
	var name string
	err := h.db.QueryRow(`SELECT name FROM album_categories WHERE id = $1`, id).Scan(&name)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	// Guard: refuse if any albums use this category
	var count int
	h.db.QueryRow(`SELECT COUNT(*) FROM albums WHERE category = $1`, name).Scan(&count)
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{
			"error": fmt.Sprintf("Cannot delete — %d album(s) are using this category. Reassign them first.", count),
		})
		return
	}

	h.db.Exec(`DELETE FROM album_categories WHERE id = $1`, id)
	c.JSON(http.StatusOK, gin.H{"message": "Category deleted"})
}

func isUniqueViolation(err error) bool {
	return err != nil && len(err.Error()) > 0 &&
		(contains(err.Error(), "unique") || contains(err.Error(), "duplicate"))
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 &&
		func() bool {
			for i := 0; i <= len(s)-len(substr); i++ {
				if s[i:i+len(substr)] == substr {
					return true
				}
			}
			return false
		}())
}
