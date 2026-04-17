package services

import (
    "backend-service/repositories"
    "backend-service/models"
    "errors"
)

func GetProfile(userID string) (*models.User, error) {
    user, err := repositories.FindUserByID(userID)
    if err != nil {
        return nil, errors.New("User not found")
    }
    return user, nil
}

func UpdateProfile(userID, firstName, lastName, address string) (*models.User, error) {
    user, err := repositories.FindUserByID(userID)
    if err != nil {
        return nil, errors.New("User not found")
    }

    user.FirstName = firstName
    user.LastName = lastName
    user.Address = address
    user.ID = userID

    err = repositories.UpdateUser(user)
    if err != nil {
        return nil, errors.New("Failed to update profile")
    }
    return user, nil
}
