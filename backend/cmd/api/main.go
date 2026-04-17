package main

import (
	"log"
	"os"

	"backend-service/config"
	"backend-service/routes"
	"backend-service/workers"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	config.ConnectDatabase()

	workers.StartTransferWorker()

	r := routes.SetupRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server running on port " + port)
	r.Run(":" + port)
}
