package main

import (
	"database/sql"
	"log"
	"os"

	postgres "github.com/huecester/gamercenter/server/database"
	"github.com/huecester/gamercenter/server/posts"
	"github.com/huecester/gamercenter/server/bots"
	"github.com/huecester/gamercenter/server/battlesnake"

	"github.com/gin-gonic/gin"
)

func main() {
	// DB variables
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

	db, err := postgres.Init(dbhost, dbport, user, password, database)
	if err != nil {
		log.Fatalf("Error connecing to database: %v", err)
	}
	defer db.Close()
	log.Println("Connected to database.")


	// Gin

	// init
	r := gin.Default()
	r.SetTrustedProxies(nil)

	// routes
	api := r.Group("/api")

	for _, fn := range []func(*gin.RouterGroup, *sql.DB) {
		posts.Init,
		bots.Init,
		battlesnake.Init,
	} {
		fn(api, db)
	}

	// start
	r.Run()
}
