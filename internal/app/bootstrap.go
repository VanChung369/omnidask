package app

import (
	"context"
	"fmt"

	"omnidask/internal/auth"
	"omnidask/internal/platform/database"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Application struct {
	Config Config
	DB     *pgxpool.Pool
	Server *Server
}

func Bootstrap(ctx context.Context) (*Application, error) {
	config, err := LoadConfig()
	if err != nil {
		return nil, fmt.Errorf("load config: %w", err)
	}

	db, err := database.New(ctx, config.DatabaseURL)
	if err != nil {
		return nil, fmt.Errorf("connect database: %w", err)
	}

	tokenManager := auth.NewTokenManager(
		config.JWTSecret,
		config.AccessTokenTTL,
	)

	authRepository := auth.NewRepository(db)

	authService := auth.NewService(
		authRepository,
		tokenManager,
		config.RefreshTokenTTL,
	)
	
	authHandler := auth.NewHandler(
		authService,
		auth.RefreshCookieConfig{
			Secure: config.AppEnv == "production",
			TTL:    config.RefreshTokenTTL,
		},
	)

	router := NewRouter(RouterDependencies{
		Config:             config,
		DB:                 db,
		AuthHandler:        authHandler,
		RequireAccessToken: auth.RequireAccessToken(tokenManager),
	})

	return &Application{
		Config: config,
		DB:     db,
		Server: NewServer(config.HTTPAddr, router),
	}, nil
}

func (a *Application) Close() {
	if a.DB != nil {
		a.DB.Close()
	}
}
