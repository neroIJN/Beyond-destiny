package models

import "time"

type ContactSubmission struct {
	ID          string     `json:"id" db:"id"`
	Name        string     `json:"name" db:"name"`
	Email       string     `json:"email" db:"email"`
	Phone       string     `json:"phone" db:"phone"`
	WeddingDate *string    `json:"wedding_date" db:"wedding_date"`
	Venue       string     `json:"venue" db:"venue"`
	Message     string     `json:"message" db:"message"`
	IsRead      bool       `json:"is_read" db:"is_read"`
	SubmittedAt time.Time  `json:"submitted_at" db:"submitted_at"`
}

type ContactRequest struct {
	Name        string `json:"name" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	Phone       string `json:"phone"`
	WeddingDate string `json:"wedding_date"`
	Venue       string `json:"venue"`
	Message     string `json:"message" binding:"required"`
}

type QuoteRequest struct {
	ID           string    `json:"id" db:"id"`
	Names        string    `json:"names" db:"names"`
	Email        string    `json:"email" db:"email"`
	Phone        string    `json:"phone" db:"phone"`
	EventType    string    `json:"event_type" db:"event_type"`
	EventDate    *string   `json:"event_date" db:"event_date"`
	EventVenue   string    `json:"event_venue" db:"event_venue"`
	Budget       string    `json:"budget" db:"budget"`
	HearAboutUs  string    `json:"hear_about_us" db:"hear_about_us"`
	Message      string    `json:"message" db:"message"`
	IsRead       bool      `json:"is_read" db:"is_read"`
	SubmittedAt  time.Time `json:"submitted_at" db:"submitted_at"`
}

type QuoteRequestBody struct {
	Names       string `json:"names" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	Phone       string `json:"phone"`
	EventType   string `json:"event_type" binding:"required"`
	EventDate   string `json:"event_date"`
	EventVenue  string `json:"event_venue"`
	Budget      string `json:"budget"`
	HearAboutUs string `json:"hear_about_us"`
	Message     string `json:"message" binding:"required"`
}
