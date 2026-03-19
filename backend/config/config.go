package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	FrontendURL string

	// Backblaze B2 / S3-compatible storage
	B2Endpoint        string
	B2KeyID           string
	B2ApplicationKey  string
	B2BucketName      string
	B2PublicBaseURL   string

	// Email (SMTP)
	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPassword string
	NotifyEmail  string
}

func Load() *Config {
	// Load .env in development (ignored if file doesn't exist in production)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	return &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: mustGetEnv("DATABASE_URL"),
		JWTSecret:   mustGetEnv("JWT_SECRET"),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"),

		B2Endpoint:       mustGetEnv("B2_ENDPOINT"),
		B2KeyID:          mustGetEnv("B2_KEY_ID"),
		B2ApplicationKey: mustGetEnv("B2_APPLICATION_KEY"),
		B2BucketName:     mustGetEnv("B2_BUCKET_NAME"),
		B2PublicBaseURL:  mustGetEnv("B2_PUBLIC_BASE_URL"),

		SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		NotifyEmail:  getEnv("NOTIFY_EMAIL", ""),
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func mustGetEnv(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("Required environment variable %s is not set", key)
	}
	return val
}
