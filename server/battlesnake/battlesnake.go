package battlesnake

import (
	"database/sql"

	"github.com/huecester/gamercenter/server/id"

	"github.com/gin-gonic/gin"
)

type player struct {
	Username string `json:"username"`
	ID string `json:"id"`
}

type newRoom struct {
	Name string `json:"name" binding:"required,min=1,max=32"`
	Password string `json:"password" binding:"max=32"`
}

type room struct {
	Name string `json:"name"`
	ID string `json:"id"`
	Players []player `json:"players"`
	Password string `json:"-"`
	HasPassword bool `json:"password"`
}

var rooms []room

func getRooms(c *gin.Context) {
	c.JSON(200, rooms)
}

func createRoom(c *gin.Context) {
	var n newRoom
	if err := c.BindJSON(&n); err != nil {
		c.AbortWithError(400, err)
	}

	var r room
	r.Name = n.Name
	r.Password = n.Password

	r.ID = id.Gen()
	r.HasPassword = len(r.Password) > 0
	rooms = append(rooms, r)

	c.String(201, r.ID)
}

func Init(g *gin.RouterGroup, _ *sql.DB) {
	battlesnake := g.Group("/battlesnake")

	battlesnake.GET("/rooms", getRooms)
	battlesnake.POST("/rooms", createRoom)
}
