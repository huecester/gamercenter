package main

import (
	"database/sql"
	"log"
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"github.com/gin-gonic/gin"
)

func main() {
	// DB //

	// variables
	var (
		dbhost = "localhost"
		dbport = "5432"
		user = "postgres"
		password = ""
		database = ""
	)
	if envHost := os.Getenv("PGHOST"); envHost != "" {
		dbhost = envHost
	}
	if envPort := os.Getenv("PGPORT"); envPort != "" {
		dbport = envPort
	}
	if envUser := os.Getenv("PGUSER"); envUser != "" {
		user = envUser
	}
	if envPassword := os.Getenv("PGPASSWORD"); envPassword != "" {
		password = envPassword
	}
	if envDatabase := os.Getenv("PGDATABASE"); envDatabase != "" {
		database = envDatabase
	}

	// connect to db
	psqlconn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", dbhost, dbport, user, password, database)
	db, err := sql.Open("postgres", psqlconn)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer db.Close()

	// ping db
	err = db.Ping()
	if err != nil {
		log.Fatalf("Error pinging database: %v", err)
	}

	log.Println("Connected to database.")


	// Gin //

	// init
	r := gin.Default()
	r.SetTrustedProxies(nil)

	// routes
	r.LoadHTMLGlob("./dist/**/*.html")
	r.StaticFile("/", "./dist/")
	r.Static("/_nuxt", "./dist/_nuxt")

	api := r.Group("/api")
	for _, fn := range []func(*gin.RouterGroup, *sql.DB) {
		posts,
		bots,
	} {
		fn(api, db)
	}

	// start
	r.Run()
}
