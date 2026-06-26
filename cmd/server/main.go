package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"omnidask/internal/auth"
	"omnidask/internal/config"
	"omnidask/internal/database"
	dbgen "omnidask/internal/database/gen"
	"omnidask/internal/httpapi"
	"omnidask/internal/jobs"
	"omnidask/internal/logging"
	"omnidask/internal/storage"
)

func main() {
	cfg := config.Load()
	logger := logging.New(cfg.LogLevel)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	pool, err := database.Open(ctx, cfg.DatabaseURL, logger)
	if err != nil {
		logger.Error("database connection failed", slog.Any("error", err))
		os.Exit(1)
	}
	if pool != nil {
		defer pool.Close()
	}

	var queries *dbgen.Queries
	if pool != nil {
		queries = dbgen.New(pool)
		worker := jobs.NewWorker(queries, logger, jobs.Config{
			WorkerID:     cfg.WorkerID,
			Queue:        cfg.JobQueue,
			PollInterval: cfg.JobPollInterval,
			RetryDelay:   cfg.JobRetryDelay,
		})
		go worker.Start(ctx)
	}

	storageClient, err := storage.NewClient(cfg.Storage)
	if err != nil {
		logger.Error("storage configuration failed", slog.Any("error", err))
		os.Exit(1)
	}

	router := httpapi.NewRouter(httpapi.Dependencies{
		Logger:  logger,
		Auth:    auth.NewService(cfg.JWTSecret, cfg.JWTIssuer),
		DB:      pool,
		Queries: queries,
		Storage: storageClient,
	})

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		logger.Info("server listening", slog.String("addr", server.Addr))
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server failed", slog.Any("error", err))
			os.Exit(1)
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		logger.Error("server shutdown failed", slog.Any("error", err))
		os.Exit(1)
	}

	logger.Info("server stopped")
}
