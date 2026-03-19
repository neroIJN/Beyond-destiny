package public

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"captured-moments-backend/email"
	"captured-moments-backend/models"
)

type ContactHandler struct {
	db    *sql.DB
	email *email.Service
}

func NewContactHandler(db *sql.DB, emailSvc *email.Service) *ContactHandler {
	return &ContactHandler{db: db, email: emailSvc}
}

func (h *ContactHandler) SubmitContact(c *gin.Context) {
	var req models.ContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var weddingDate *string
	if req.WeddingDate != "" {
		weddingDate = &req.WeddingDate
	}

	_, err := h.db.Exec(
		`INSERT INTO contact_submissions (name, email, phone, wedding_date, venue, message)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		req.Name, req.Email, req.Phone, weddingDate, req.Venue, req.Message,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save submission"})
		return
	}

	// Send email notification in background — don't block the response
	go func() {
		if err := h.email.SendContactNotification(req.Name, req.Email, req.Phone, req.Message); err != nil {
			log.Printf("Failed to send contact email notification: %v", err)
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "Thank you! We'll be in touch soon."})
}

func (h *ContactHandler) SubmitQuote(c *gin.Context) {
	var req models.QuoteRequestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var eventDate *string
	if req.EventDate != "" {
		eventDate = &req.EventDate
	}

	_, err := h.db.Exec(
		`INSERT INTO quote_requests (names, email, phone, event_type, event_date, event_venue, budget, hear_about_us, message)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		req.Names, req.Email, req.Phone, req.EventType, eventDate,
		req.EventVenue, req.Budget, req.HearAboutUs, req.Message,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save quote request"})
		return
	}

	go func() {
		if err := h.email.SendQuoteNotification(
			req.Names, req.Email, req.Phone, req.EventType, req.EventDate, req.Budget, req.Message,
		); err != nil {
			log.Printf("Failed to send quote email notification: %v", err)
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "Quote request received! We'll get back to you within 24 hours."})
}
