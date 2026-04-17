package services

import (
	"backend-service/models"
	"backend-service/repositories"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(firstName, lastName, phone, address, pin string) (*models.User, error) {
	existingUser, _ := repositories.FindUserByPhone(phone)
	if existingUser != nil && existingUser.ID != "" {
		return nil, errors.New("Phone Number already registered")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(pin), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		FirstName:   firstName,
		LastName:    lastName,
		PhoneNumber: phone,
		Address:     address,
		Pin:         string(hash),
	}

	err = repositories.CreateUser(user)
	if err != nil {
		return nil, errors.New("Failed to register")
	}

	return user, nil
}

func LoginUser(phone, pin string) (string, string, error) {
	user, err := repositories.FindUserByPhone(phone)
	if err != nil {
		return "", "", errors.New("Phone Number and PIN doesn't match.")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Pin), []byte(pin))
	if err != nil {
		return "", "", errors.New("Phone Number and PIN doesn't match.")
	}

	accessToken, err := GenerateToken(user.ID, time.Hour*24)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := GenerateToken(user.ID, time.Hour*24*7)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func GenerateToken(userID string, duration time.Duration) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(duration).Unix(),
	})
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
