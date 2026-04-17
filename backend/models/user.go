package models

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID          string    `gorm:"type:varchar(50);primaryKey" json:"user_id"`
	FirstName   string    `gorm:"type:varchar(100);not null" json:"first_name"`
	LastName    string    `gorm:"type:varchar(100);not null" json:"last_name"`
	PhoneNumber string    `gorm:"type:varchar(50);unique;not null" json:"phone_number"`
	Address     string    `gorm:"type:text" json:"address"`
	Pin         string    `gorm:"type:varchar(255);not null" json:"-"`
	Balance     int64     `gorm:"type:bigint;default:0" json:"balance"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_date"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"-"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == "" {
		u.ID = fmt.Sprintf("%s%03d", time.Now().Format("20060102150405"), time.Now().UnixMilli()%1000)
	}
	return
}
