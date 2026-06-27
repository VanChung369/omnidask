package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"omnidask/internal/app"
	"omnidask/internal/platform/database"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	ctx, stop := signal.NotifyContext(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)

	defer stop()

	config, err := app.LoadConfig()

	if err != nil {
		slog.Error("load config failed", "error", err)

		os.Exit(1)
	}

	db, err := database.New(ctx, config.DatabaseURL)

	if err != nil {
		slog.Error("database connection failed", "error", err)
		os.Exit(1)
	}

	defer db.Close()

	router := app.NewRouter(config, db)

	server := &http.Server{
		Addr:              config.HTTPAddr,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	serverErrors := make(chan error, 1)

	go func() {
		slog.Info("server started", "address", config.HTTPAddr)

		err := server.ListenAndServe()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			serverErrors <- err
		}
	}()

	select {
	case err := <-serverErrors:
		slog.Error("server failed", "error", err)

	case <-ctx.Done():
		slog.Info("shutdown signal received")
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		slog.Error("graceful shutdown failed", "error", err)
	}
}
