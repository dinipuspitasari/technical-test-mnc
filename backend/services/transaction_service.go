package services

import (
	"backend-service/config"
	"backend-service/models"
	"backend-service/repositories"
	"backend-service/workers"
	"errors"

	"github.com/google/uuid"
)

func TopUp(userID string, amount int64) (*models.Transaction, error) {
	tx := config.DB.Begin()

	user, err := repositories.FindUserByIDTx(tx, userID)
	if err != nil {
		tx.Rollback()
		return nil, errors.New("User not found")
	}

	balanceBefore := user.Balance
	user.Balance += amount

	if err := repositories.UpdateUserTx(tx, user); err != nil {
		tx.Rollback()
		return nil, errors.New("Gagal update saldo")
	}

	transaction := &models.Transaction{
		ID:              uuid.NewString(),
		UserID:          user.ID,
		TransactionType: "CREDIT",
		Amount:          amount,
		Feature:         "TOPUP",
		BalanceBefore:   balanceBefore,
		BalanceAfter:    user.Balance,
	}

	if err := repositories.CreateTransactionTx(tx, transaction); err != nil {
		tx.Rollback()
		return nil, errors.New("Gagal mencatat mutasi")
	}

	tx.Commit()
	return transaction, nil
}

func Payment(userID string, amount int64, remarks string) (*models.Transaction, error) {
	tx := config.DB.Begin()

	user, err := repositories.FindUserByIDTx(tx, userID)
	if err != nil {
		tx.Rollback()
		return nil, errors.New("User not found")
	}

	if user.Balance < amount {
		tx.Rollback()
		return nil, errors.New("Balance is not enough")
	}

	balanceBefore := user.Balance
	user.Balance -= amount

	if err := repositories.UpdateUserTx(tx, user); err != nil {
		tx.Rollback()
		return nil, errors.New("Gagal update saldo")
	}

	transaction := &models.Transaction{
		ID:              uuid.NewString(),
		UserID:          user.ID,
		TransactionType: "DEBIT",
		Amount:          amount,
		Feature:         "PAYMENT",
		Remarks:         remarks,
		BalanceBefore:   balanceBefore,
		BalanceAfter:    user.Balance,
	}

	if err := repositories.CreateTransactionTx(tx, transaction); err != nil {
		tx.Rollback()
		return nil, errors.New("Gagal mencatat mutasi")
	}

	tx.Commit()
	return transaction, nil
}

func Transfer(senderID, targetUserID string, amount int64, remarks string) (*models.Transaction, error) {
	tx := config.DB.Begin()

	sender, err := repositories.FindUserByIDTx(tx, senderID)
	if err != nil {
		tx.Rollback()
		return nil, errors.New("User pengirim not found")
	}

	target, err := repositories.FindUserByIDTx(tx, targetUserID)
	if err != nil {
		tx.Rollback()
		return nil, errors.New("Tujuan/Target User error (tidak valid atau tidak ditemukan)")
	}

	if sender.Balance < amount {
		tx.Rollback()
		return nil, errors.New("Balance is not enough")
	}

	senderBalanceBefore := sender.Balance
	sender.Balance -= amount
	if err := repositories.UpdateUserTx(tx, sender); err != nil {
		tx.Rollback()
		return nil, errors.New("Gagal potong saldo")
	}

	targetBalanceBefore := target.Balance
	target.Balance += amount
	if err := repositories.UpdateUserTx(tx, target); err != nil {
		tx.Rollback()
		return nil, errors.New("Gagal tambah saldo target")
	}

	tx.Commit()

	transferIDSender := uuid.NewString()

	senderTx := models.Transaction{
		ID:              transferIDSender,
		UserID:          sender.ID,
		TransactionType: "DEBIT",
		Amount:          amount,
		Feature:         "TRANSFER",
		Remarks:         remarks,
		BalanceBefore:   senderBalanceBefore,
		BalanceAfter:    sender.Balance,
		RelatedUserID:   &target.ID,
	}

	receiverTx := models.Transaction{
		ID:              uuid.NewString(),
		UserID:          target.ID,
		TransactionType: "CREDIT",
		Amount:          amount,
		Feature:         "TRANSFER",
		Remarks:         remarks,
		BalanceBefore:   targetBalanceBefore,
		BalanceAfter:    target.Balance,
		RelatedUserID:   &sender.ID,
	}

	workers.TransferQueue <- senderTx
	workers.TransferQueue <- receiverTx

	return &senderTx, nil
}

func GetTransactionsReport(userID string) ([]models.Transaction, error) {
	return repositories.GetTransactionsByUserID(userID)
}
