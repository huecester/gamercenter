package posts

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

type post struct {
	ID int64 `json:"id"`
	Title string `json:"title"`
	Content string `json:"content"`
	Creation string `json:"creation"`
}

func getPosts(c *gin.Context, db *sql.DB) {
	rows, err := db.Query(`SELECT * FROM posts`)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}
	defer rows.Close()

	var posts []post
	for rows.Next() {
		var p post
		if err = rows.Scan(&p.ID, &p.Title, &p.Content, &p.Creation); err != nil {
			c.AbortWithError(500, err)
			return
		}
		posts = append(posts, p)
	}

	c.JSON(200, posts)
}

func Init(g *gin.RouterGroup, db *sql.DB) {
	posts := g.Group("/posts")

	posts.GET("", func(c *gin.Context) {
		getPosts(c, db)
	})
}
