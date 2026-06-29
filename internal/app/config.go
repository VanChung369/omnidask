package app

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv          string
	HTTPAddr        string
	DatabaseURL     string
	JWTSecret       string
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
	WebOrigin       string
}

func LoadConfig() (Config, error) {

	_ = godotenv.Load()

	accessTokenTTL, err := time.ParseDuration(
		getEnv("ACCESS_TOKEN_TTL", "15m"),
	)

	if err != nil {
		return Config{}, fmt.Errorf("parse ACCESS_TOKEN_TTL: %w", err)
	}

	refreshTTL, err := time.ParseDuration(
		getEnv("REFRESH_TOKEN_TTL", "720h"),
	)

	if err != nil {
		return Config{}, fmt.Errorf("parse REFRESH_TOKEN_TTL: %w", err)
	}

	config := Config{
		AppEnv:          getEnv("APP_ENV", "development"),
		HTTPAddr:        getEnv("HTTP_ADDR", ":8080"),
		DatabaseURL:     os.Getenv("DATABASE_URL"),
		JWTSecret:       os.Getenv("JWT_SECRET"),
		AccessTokenTTL:  accessTokenTTL,
		RefreshTokenTTL: refreshTTL,
		WebOrigin:       getEnv("WEB_ORIGIN", "http://localhost:5173"),
	}

	if config.DatabaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}

	if len(config.JWTSecret) < 32 {
		return Config{}, fmt.Errorf("JWT_SECRET must be at least 32 characters")
	}

	return config, nil

}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}
