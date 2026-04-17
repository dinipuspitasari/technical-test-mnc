package controllers

import (
	"backend-service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var input struct {
		FirstName   string `json:"first_name" binding:"required"`
		LastName    string `json:"last_name" binding:"required"`
		PhoneNumber string `json:"phone_number" binding:"required"`
		Address     string `json:"address" binding:"required"`
		Pin         string `json:"pin" binding:"required,len=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Format tidak sesuai", "error": err.Error()})
		return
	}

	user, err := services.RegisterUser(input.FirstName, input.LastName, input.PhoneNumber, input.Address, input.Pin)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "Phone Number already registered" {
			status = http.StatusBadRequest
		}
		c.JSON(status, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "SUCCESS",
		"result": gin.H{
			"user_id":      user.ID,
			"created_date": user.CreatedAt.Format("2006-01-02 15:04:05"),
		},
	})
}

func Login(c *gin.Context) {
	var input struct {
		PhoneNumber string `json:"phone_number" binding:"required"`
		Pin         string `json:"pin" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Phone Number and PIN are required."})
		return
	}

	accessToken, refreshToken, err := services.LoginUser(input.PhoneNumber, input.Pin)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "SUCCESS",
		"result": gin.H{
			"access_token":  accessToken,
			"refresh_token": refreshToken,
		},
	})
}
