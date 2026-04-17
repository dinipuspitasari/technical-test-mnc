package config

import (
	"fmt"
	"log"
	"os"

	"backend-service/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "root:@tcp(127.0.0.1:3306)/test_api?charset=utf8mb4&parseTime=True&loc=Local"
	}
	
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = db.AutoMigrate(&models.User{}, &models.Transaction{})
	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	fmt.Println("Database connection & migration successful.")
	DB = db
}
