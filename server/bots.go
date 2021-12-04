package main

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

type bot struct {
	ID int64 `json:"id"`
	Name string `json:"name"`
	Description string `json:"description"`
	Link string `json:"link"`
}

func getBots(c *gin.Context, db *sql.DB) {
	rows, err := db.Query(`SELECT * FROM bots`)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}
	defer rows.Close()

	var bots []bot
	for rows.Next() {
		var b bot
		if err = rows.Scan(&b.ID, &b.Name, &b.Description, &b.Link); err != nil {
			c.AbortWithError(500, err)
			return
		}
		bots = append(bots, b)
	}

	c.JSON(200, bots)
}

func bots(r *gin.Engine, db *sql.DB) {
	bots := r.Group("/bots")

	bots.GET("/", func(c *gin.Context) {
		getBots(c, db)
	})
}
