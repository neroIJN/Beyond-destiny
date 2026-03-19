// Run this once to create the initial admin user:
//   go run ./cmd/seed/main.go
package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/jackc/pgx/v4/stdlib"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	godotenv.Load()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	var email, password, name string

	fmt.Print("Admin email: ")
	fmt.Scanln(&email)

	fmt.Print("Admin password: ")
	fmt.Scanln(&password)

	fmt.Print("Admin name: ")
	fmt.Scanln(&name)

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	_, err = db.Exec(
		`INSERT INTO admin_users (email, password_hash, name) VALUES ($1, $2, $3)
		 ON CONFLICT (email) DO UPDATE SET password_hash = $2, name = $3`,
		email, string(hash), name,
	)
	if err != nil {
		log.Fatalf("Failed to create admin user: %v", err)
	}

	fmt.Printf("\nAdmin user '%s' created successfully!\n", email)
}
