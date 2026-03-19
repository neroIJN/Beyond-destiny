package db

import (
	"database/sql"
	"log"

	_ "github.com/jackc/pgx/v4/stdlib"
)

func Connect(databaseURL string) *sql.DB {
	db, err := sql.Open("pgx", databaseURL)
	if err != nil {
		log.Fatalf("Failed to open database connection: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	log.Println("Database connected successfully")
	return db
}
