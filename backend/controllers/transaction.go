package controllers

import (
	"backend-service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func TopUp(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input struct {
		Amount int64 `json:"amount" binding:"required,gt=0"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Format tidak sesuai"})
		return
	}

	transaction, err := services.TopUp(userID.(string), input.Amount)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "User not found" {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "SUCCESS",
		"result": gin.H{
			"top_up_id":      transaction.ID,
			"amount_top_up":  transaction.Amount,
			"balance_before": transaction.BalanceBefore,
			"balance_after":  transaction.BalanceAfter,
			"created_date":   transaction.CreatedAt.Format("2006-01-02 15:04:05"),
		},
	})
}

func Payment(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input struct {
		Amount  int64  `json:"amount" binding:"required,gt=0"`
		Remarks string `json:"remarks" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Format tidak sesuai"})
		return
	}

	transaction, err := services.Payment(userID.(string), input.Amount, input.Remarks)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "Balance is not enough" {
			status = http.StatusBadRequest
		} else if err.Error() == "User not found" {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "SUCCESS",
		"result": gin.H{
			"payment_id":     transaction.ID,
			"amount":         transaction.Amount,
			"remarks":        transaction.Remarks,
			"balance_before": transaction.BalanceBefore,
			"balance_after":  transaction.BalanceAfter,
			"created_date":   transaction.CreatedAt.Format("2006-01-02 15:04:05"),
		},
	})
}

func Transfer(c *gin.Context) {
	userID, _ := c.Get("user_id")
	senderID := userID.(string)

	var input struct {
		TargetUser string `json:"target_user" binding:"required"`
		Amount     int64  `json:"amount" binding:"required,gt=0"`
		Remarks    string `json:"remarks" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Format tidak sesuai"})
		return
	}

	if senderID == input.TargetUser {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Can't transfer to yourself"})
		return
	}

	transaction, err := services.Transfer(senderID, input.TargetUser, input.Amount, input.Remarks)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "Balance is not enough" || err.Error() == "Tujuan/Target User error (tidak valid atau tidak ditemukan)" {
			status = http.StatusBadRequest
		} else if err.Error() == "User pengirim not found" {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "SUCCESS",
		"result": gin.H{
			"transfer_id":    transaction.ID,
			"amount":         transaction.Amount,
			"remarks":        transaction.Remarks,
			"balance_before": transaction.BalanceBefore,
			"balance_after":  transaction.BalanceAfter,
			"created_date":   transaction.CreatedAt.Format("2006-01-02 15:04:05"),
		},
	})
}

func TransactionsReport(c *gin.Context) {
	userID, _ := c.Get("user_id")

	transactions, _ := services.GetTransactionsReport(userID.(string))

	var results []gin.H
	for _, tx := range transactions {
		var targetInfo string
		if tx.Feature == "TRANSFER" && tx.RelatedUser != nil {
			if tx.TransactionType == "DEBIT" {
				targetInfo = "To: " + tx.RelatedUser.FirstName + " (" + tx.RelatedUser.PhoneNumber + ")"
			} else {
				targetInfo = "From: " + tx.RelatedUser.FirstName + " (" + tx.RelatedUser.PhoneNumber + ")"
			}
		}

		results = append(results, gin.H{
			"transaction_id":   tx.ID,
			"status":           "SUCCESS",
			"transaction_type": tx.TransactionType,
			"amount":           tx.Amount,
			"remarks":          tx.Remarks,
			"target_info":      targetInfo,
			"balance_before":   tx.BalanceBefore,
			"balance_after":    tx.BalanceAfter,
			"created_date":     tx.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}
	if len(results) == 0 {
		results = []gin.H{}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "SUCCESS",
		"result": results,
	})
}
