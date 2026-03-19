package models

import "time"

type AdminUser struct {
	ID           string     `json:"id" db:"id"`
	Email        string     `json:"email" db:"email"`
	PasswordHash string     `json:"-" db:"password_hash"`
	Name         string     `json:"name" db:"name"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	LastLoginAt  *time.Time `json:"last_login_at" db:"last_login_at"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string     `json:"token"`
	Admin *AdminUser `json:"admin"`
}
