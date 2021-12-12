package id

import (
	"crypto/rand"
	"encoding/hex"
	"log"
)

func Gen() string {
	bytes := make([]byte, 8)
	if _, err := rand.Read(bytes); err != nil {
		log.Fatalf("Failed to generate ID: %v", err)
	}
	return hex.EncodeToString(bytes)
}
