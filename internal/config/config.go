package config

import (
	"os"
	"time"

	"omnidask/internal/storage"
)

type Config struct {
	Port            string
	LogLevel        string
	DatabaseURL     string
	JWTSecret       string
	JWTIssuer       string
	WorkerID        string
	JobQueue        string
	JobPollInterval time.Duration
	JobRetryDelay   time.Duration
	Storage         storage.Config
}

func Load() Config {
	return Config{
		Port:            getEnv("PORT", "8080"),
		LogLevel:        getEnv("LOG_LEVEL", "info"),
		DatabaseURL:     os.Getenv("DATABASE_URL"),
		JWTSecret:       getEnv("JWT_SECRET", "dev-secret-change-me"),
		JWTIssuer:       getEnv("JWT_ISSUER", "omnidask"),
		WorkerID:        getEnv("WORKER_ID", hostname()),
		JobQueue:        getEnv("JOB_QUEUE", "default"),
		JobPollInterval: getDurationEnv("JOB_POLL_INTERVAL", 5*time.Second),
		JobRetryDelay:   getDurationEnv("JOB_RETRY_DELAY", 30*time.Second),
		Storage: storage.Config{
			Endpoint:        os.Getenv("S3_ENDPOINT"),
			AccessKeyID:     os.Getenv("S3_ACCESS_KEY_ID"),
			SecretAccessKey: os.Getenv("S3_SECRET_ACCESS_KEY"),
			Bucket:          os.Getenv("S3_BUCKET"),
			Region:          getEnv("S3_REGION", "auto"),
			UseSSL:          getBoolEnv("S3_USE_SSL", true),
		},
	}
}

func getEnv(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

func getDurationEnv(key string, fallback time.Duration) time.Duration {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	parsed, err := time.ParseDuration(value)
	if err != nil {
		return fallback
	}
	return parsed
}

func getBoolEnv(key string, fallback bool) bool {
	value := os.Getenv(key)
	switch value {
	case "true", "1", "yes", "on":
		return true
	case "false", "0", "no", "off":
		return false
	default:
		return fallback
	}
}

func hostname() string {
	name, err := os.Hostname()
	if err != nil || name == "" {
		return "omnidask-worker"
	}
	return name
}
