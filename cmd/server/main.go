package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"omnidask/internal/app"
)

func main() {
	ctx, stop := signal.NotifyContext(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)
	defer stop()

	application, err := app.Bootstrap(ctx)
	if err != nil {
		slog.Error("bootstrap failed", "error", err)
		os.Exit(1)
	}
	defer application.Close()

	slog.Info("server started", "address", application.Config.HTTPAddr)

	if err := application.Server.Run(ctx); err != nil {
		slog.Error("server failed", "error", err)
		os.Exit(1)
	}

	slog.Info("shutdown complete")
}
