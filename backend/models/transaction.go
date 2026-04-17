package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Transaction struct {
	ID              string    `gorm:"type:char(36);primaryKey" json:"transaction_id"`
	UserID          string    `gorm:"type:char(36);index;not null" json:"user_id"`
	TransactionType string    `gorm:"type:enum('CREDIT','DEBIT');not null" json:"transaction_type"`
	Amount          int64     `gorm:"type:bigint;not null" json:"amount"`
	BalanceBefore   int64     `gorm:"type:bigint;not null" json:"balance_before"`
	BalanceAfter    int64     `gorm:"type:bigint;not null" json:"balance_after"`
	Remarks         string    `gorm:"type:text" json:"remarks"`
	Feature         string    `gorm:"type:varchar(50)" json:"-"` // TOPUP, TRANSFER, PAYMENT
	RelatedUserID   *string   `gorm:"type:char(36)" json:"-"`
	RelatedUser     *User     `gorm:"foreignKey:RelatedUserID" json:"-"`
	CreatedAt       time.Time `gorm:"autoCreateTime" json:"created_date"`
}

func (t *Transaction) BeforeCreate(tx *gorm.DB) (err error) {
	if t.ID == "" {
		t.ID = uuid.NewString()
	}
	return
}
