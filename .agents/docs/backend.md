# Backend Rules

## Location

The backend entrypoint is `cmd/server/main.go`.

## Current State

The backend now has a minimal Go runtime scaffold.

## Stack

- HTTP router: `github.com/go-chi/chi/v5`
- PostgreSQL driver/pool: `github.com/jackc/pgx/v5/pgxpool`
- Query generation: `sqlc`
- Migrations: `golang-migrate` SQL files under `db/migrations`
- WebSocket: `github.com/coder/websocket`
- Background work: Go goroutines backed by PostgreSQL `jobs` and `outbox` tables
- Object storage: S3-compatible client through MinIO SDK for MinIO, Cloudflare R2, or AWS S3
- Auth: JWT with HMAC signing
- Logging: standard library `log/slog`

## Rules

- Keep reusable backend packages under `internal/` once the backend grows.
- Keep database migrations or seed assets under `db/` when they are requested.
- Keep generated sqlc code under `internal/database/gen`.
- Prefer `slog` for structured logs.
- Prefer `chi` handlers and middleware for HTTP.
- Prefer pgx/sqlc access paths over handwritten SQL in application code.
- Keep jobs and outbox processing idempotent; workers may retry records.

## Commands

Run from the repository root:

```powershell
go run ./cmd/server
go test ./...
go run github.com/sqlc-dev/sqlc/cmd/sqlc@latest generate -f db/sqlc.yaml
```

Migration commands use the `migrate` CLI:

```powershell
migrate -path db/migrations -database "$env:DATABASE_URL" up
migrate -path db/migrations -database "$env:DATABASE_URL" down 1
```

## Default Entrypoint

`cmd/server/main.go` owns process startup, graceful shutdown, logger setup, database pool setup, worker startup, and HTTP server startup.
