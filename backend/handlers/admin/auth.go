package admin

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"

	"captured-moments-backend/models"
)

type AuthHandler struct {
	db        *sql.DB
	jwtSecret string
}

func NewAuthHandler(db *sql.DB, jwtSecret string) *AuthHandler {
	return &AuthHandler{db: db, jwtSecret: jwtSecret}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var admin models.AdminUser
	err := h.db.QueryRow(
		`SELECT id, email, password_hash, name, created_at, last_login_at FROM admin_users WHERE email = $1`,
		req.Email,
	).Scan(&admin.ID, &admin.Email, &admin.PasswordHash, &admin.Name, &admin.CreatedAt, &admin.LastLoginAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Update last login timestamp
	h.db.Exec(`UPDATE admin_users SET last_login_at = NOW() WHERE id = $1`, admin.ID)

	// Generate JWT token (expires in 24 hours)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": admin.ID,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
		"iat": time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	admin.PasswordHash = "" // Never send hash to client
	c.JSON(http.StatusOK, models.LoginResponse{
		Token: tokenString,
		Admin: &admin,
	})
}
