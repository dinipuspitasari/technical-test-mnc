package workers

import (
	"backend-service/config"
	"backend-service/models"
	"log"
)

var TransferQueue = make(chan models.Transaction, 100)

func StartTransferWorker() {
	go func() {
		for tx := range TransferQueue {
			// Save the transaction mutasi to DB
			if err := config.DB.Create(&tx).Error; err != nil {
				log.Println("Background transfer mutasi error:", err)
			} else {
				log.Println("Background transfer mutasi saved successfully ID:", tx.ID)
			}
		}
	}()
}
