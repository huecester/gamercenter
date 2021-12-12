package database

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func Init(host, port, user, password, database string) (*sql.DB, error) {
	psqlconn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, database)
	db, err := sql.Open("postgres", psqlconn)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		defer db.Close()
		return nil, err
	}

	return db, nil
}
