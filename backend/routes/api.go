package routes

import (
	"backend-service/controllers"
	"backend-service/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	api := r.Group("")
	{
		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)

		protected := api.Group("")
		protected.Use(middlewares.JWTAuth())
		{
			protected.POST("/topup", controllers.TopUp)
			protected.POST("/pay", controllers.Payment)
			protected.POST("/transfer", controllers.Transfer)
			protected.GET("/transactions", controllers.TransactionsReport)
			
			protected.GET("/profile", controllers.GetProfile)
			protected.PUT("/profile", controllers.UpdateProfile)
		}
	}

	return r
}
