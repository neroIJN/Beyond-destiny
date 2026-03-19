package admin

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"captured-moments-backend/storage"
)

type UploadHandler struct {
	storage *storage.Storage
}

func NewUploadHandler(storage *storage.Storage) *UploadHandler {
	return &UploadHandler{storage: storage}
}

var allowedMIMETypes = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/webp": true,
	"image/gif":  true,
}

func (h *UploadHandler) UploadImage(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file provided. Use multipart/form-data with field name 'file'"})
		return
	}
	defer file.Close()

	// Validate content type
	contentType := header.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "image/jpeg"
	}
	// Normalize content type (strip parameters like charset)
	contentType = strings.Split(contentType, ";")[0]
	contentType = strings.TrimSpace(contentType)

	if !allowedMIMETypes[contentType] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only JPEG, PNG, WebP, and GIF images are allowed"})
		return
	}

	// Validate file size (max 20MB)
	if header.Size > 20*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size must not exceed 20MB"})
		return
	}

	url, err := h.storage.UploadFile(header.Filename, contentType, file)
	if err != nil {
		log.Printf("B2 upload error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image", "detail": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}
