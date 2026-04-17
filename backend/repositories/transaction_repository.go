package repositories

import (
	"backend-service/config"
	"backend-service/models"
	"gorm.io/gorm"
)

func CreateTransactionTx(tx *gorm.DB, transaction *models.Transaction) error {
	return tx.Create(transaction).Error
}

func GetTransactionsByUserID(userID string) ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := config.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&transactions).Error
	return transactions, err
}
