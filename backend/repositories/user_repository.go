package repositories

import (
	"backend-service/config"
	"backend-service/models"
	"gorm.io/gorm"
)

func CreateUser(user *models.User) error {
	return config.DB.Create(user).Error
}

func FindUserByPhone(phone string) (*models.User, error) {
	var user models.User
	err := config.DB.Where("phone_number = ?", phone).First(&user).Error
	return &user, err
}

func FindUserByID(id string) (*models.User, error) {
	var user models.User
	err := config.DB.Where("id = ?", id).First(&user).Error
	return &user, err
}

func UpdateUser(user *models.User) error {
	return config.DB.Save(user).Error
}

func UpdateUserTx(tx *gorm.DB, user *models.User) error {
	return tx.Save(user).Error
}

func FindUserByIDTx(tx *gorm.DB, id string) (*models.User, error) {
	var user models.User
	err := tx.Where("id = ?", id).First(&user).Error
	return &user, err
}
