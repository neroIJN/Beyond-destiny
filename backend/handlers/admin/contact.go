package admin

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"captured-moments-backend/models"
)

type ContactHandler struct {
	db *sql.DB
}

func NewContactHandler(db *sql.DB) *ContactHandler {
	return &ContactHandler{db: db}
}

// ── Quote Requests ────────────────────────────────────────────────────────────

func (h *ContactHandler) ListQuoteRequests(c *gin.Context) {
	rows, err := h.db.Query(`
		SELECT id, names, email, phone, event_type,
		       event_date::text, event_venue, budget,
		       hear_about_us, message, is_read, submitted_at
		FROM quote_requests
		ORDER BY submitted_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch quote requests"})
		return
	}
	defer rows.Close()

	quotes := []models.QuoteRequest{}
	for rows.Next() {
		var q models.QuoteRequest
		err := rows.Scan(
			&q.ID, &q.Names, &q.Email, &q.Phone, &q.EventType,
			&q.EventDate, &q.EventVenue, &q.Budget,
			&q.HearAboutUs, &q.Message, &q.IsRead, &q.SubmittedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan quote request"})
			return
		}
		quotes = append(quotes, q)
	}
	c.JSON(http.StatusOK, quotes)
}

func (h *ContactHandler) MarkQuoteRead(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		IsRead bool `json:"is_read"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	_, err := h.db.Exec(
		`UPDATE quote_requests SET is_read = $1 WHERE id = $2`,
		body.IsRead, id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update quote request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"is_read": body.IsRead})
}

func (h *ContactHandler) DeleteQuoteRequest(c *gin.Context) {
	id := c.Param("id")

	_, err := h.db.Exec(`DELETE FROM quote_requests WHERE id = $1`, id)
	if err != nil {
		log.Printf("Error deleting quote request (ID: %s): %v", id, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete quote request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Quote request deleted successfully"})
}

// ── Contact Submissions ───────────────────────────────────────────────────────

func (h *ContactHandler) ListContactSubmissions(c *gin.Context) {
	rows, err := h.db.Query(`
		SELECT id, name, email, phone,
		       wedding_date::text, venue, message, is_read, submitted_at
		FROM contact_submissions
		ORDER BY submitted_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contact submissions"})
		return
	}
	defer rows.Close()

	contacts := []models.ContactSubmission{}
	for rows.Next() {
		var cs models.ContactSubmission
		err := rows.Scan(
			&cs.ID, &cs.Name, &cs.Email, &cs.Phone,
			&cs.WeddingDate, &cs.Venue, &cs.Message, &cs.IsRead, &cs.SubmittedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan contact submission"})
			return
		}
		contacts = append(contacts, cs)
	}
	c.JSON(http.StatusOK, contacts)
}

func (h *ContactHandler) MarkContactRead(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		IsRead bool `json:"is_read"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	_, err := h.db.Exec(
		`UPDATE contact_submissions SET is_read = $1 WHERE id = $2`,
		body.IsRead, id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update contact submission"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"is_read": body.IsRead})
}

func (h *ContactHandler) DeleteContactSubmission(c *gin.Context) {
	id := c.Param("id")

	_, err := h.db.Exec(`DELETE FROM contact_submissions WHERE id = $1`, id)
	if err != nil {
		log.Printf("Error deleting contact submission (ID: %s): %v", id, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete contact submission"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Contact submission deleted successfully"})
}
