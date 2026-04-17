package controllers

import (
	"backend-service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	user, err := services.GetProfile(userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "SUCCESS",
		"result": gin.H{
			"user_id":      user.ID,
			"first_name":   user.FirstName,
			"last_name":    user.LastName,
			"phone_number": user.PhoneNumber,
			"address":      user.Address,
			"created_date": user.CreatedAt.Format("2006-01-02 15:04:05"),
		},
	})
}

func UpdateProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input struct {
		FirstName string `json:"first_name" binding:"required"`
		LastName  string `json:"last_name" binding:"required"`
		Address   string `json:"address" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Format tidak sesuai"})
		return
	}

	user, err := services.UpdateProfile(userID.(string), input.FirstName, input.LastName, input.Address)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "SUCCESS",
		"result": gin.H{
			"user_id":      user.ID,
			"first_name":   user.FirstName,
			"last_name":    user.LastName,
			"address":      user.Address,
			"updated_date": user.UpdatedAt.Format("2006-01-02 15:04:05"),
		},
	})
}
