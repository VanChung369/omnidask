package jobs

import (
	"context"
	"errors"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	dbgen "omnidask/internal/database/gen"
)

type Store interface {
	ClaimJob(ctx context.Context, arg dbgen.ClaimJobParams) (dbgen.Job, error)
	CompleteJob(ctx context.Context, id int64) error
	FailJob(ctx context.Context, arg dbgen.FailJobParams) error
	ClaimOutboxEvent(ctx context.Context, lockedBy pgtype.Text) (dbgen.Outbox, error)
	MarkOutboxPublished(ctx context.Context, id int64) error
	MarkOutboxFailed(ctx context.Context, arg dbgen.MarkOutboxFailedParams) error
}

type Config struct {
	WorkerID     string
	Queue        string
	PollInterval time.Duration
	RetryDelay   time.Duration
}

type Worker struct {
	store  Store
	logger *slog.Logger
	config Config
}

func NewWorker(store Store, logger *slog.Logger, config Config) *Worker {
	if config.PollInterval <= 0 {
		config.PollInterval = 5 * time.Second
	}
	if config.RetryDelay <= 0 {
		config.RetryDelay = 30 * time.Second
	}

	return &Worker{
		store:  store,
		logger: logger,
		config: config,
	}
}

func (w *Worker) Start(ctx context.Context) {
	w.logger.Info("jobs worker started", slog.String("worker_id", w.config.WorkerID))

	ticker := time.NewTicker(w.config.PollInterval)
	defer ticker.Stop()

	for {
		w.runOnce(ctx)

		select {
		case <-ctx.Done():
			w.logger.Info("jobs worker stopped")
			return
		case <-ticker.C:
		}
	}
}

func (w *Worker) runOnce(ctx context.Context) {
	w.processJob(ctx)
	w.processOutbox(ctx)
}

func (w *Worker) processJob(ctx context.Context) {
	job, err := w.store.ClaimJob(ctx, dbgen.ClaimJobParams{
		LockedBy: pgtype.Text{String: w.config.WorkerID, Valid: true},
		Queue:    w.config.Queue,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return
	}
	if err != nil {
		w.logger.Error("claim job failed", slog.Any("error", err))
		return
	}

	w.logger.Info("processing job", slog.Int64("job_id", job.ID), slog.String("queue", job.Queue))
	if err := w.store.CompleteJob(ctx, job.ID); err != nil {
		w.logger.Error("complete job failed", slog.Int64("job_id", job.ID), slog.Any("error", err))
	}
}

func (w *Worker) processOutbox(ctx context.Context) {
	event, err := w.store.ClaimOutboxEvent(ctx, pgtype.Text{String: w.config.WorkerID, Valid: true})
	if errors.Is(err, pgx.ErrNoRows) {
		return
	}
	if err != nil {
		w.logger.Error("claim outbox event failed", slog.Any("error", err))
		return
	}

	w.logger.Info(
		"publishing outbox event",
		slog.Int64("outbox_id", event.ID),
		slog.String("event_type", event.EventType),
	)
	if err := w.store.MarkOutboxPublished(ctx, event.ID); err != nil {
		w.logger.Error("mark outbox event published failed", slog.Int64("outbox_id", event.ID), slog.Any("error", err))
	}
}
