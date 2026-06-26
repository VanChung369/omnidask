# Codex Project Instructions

## Project

Omnidask is a small full-stack workspace with a React/Vite frontend and a Go backend placeholder.

## Repository Layout

- `web/` contains the React/Vite app.
- Frontend source uses TypeScript (`.ts` and `.tsx`).
- Frontend app components follow Atomic Design under `web/src/components/`.
- `cmd/server/main.go` is the Go backend entrypoint placeholder.
- `internal/` is reserved for future Go application packages.
- `db/` is reserved for database assets or migrations.
- Backend stack uses chi, pgx/v5, sqlc, golang-migrate migrations, coder/websocket, PostgreSQL jobs/outbox workers, S3-compatible storage, JWT, and `log/slog`.
- `Dockerfile`, `docker-compose.yml`, and `Makefile` are present but should remain minimal until implementation is requested.

## Commands

Run frontend commands from `web/`:

```powershell
npm install
npm run dev
npm run build
npm run lint
```

Run Go commands from the repository root:

```powershell
go run ./cmd/server
go test ./...
go run github.com/sqlc-dev/sqlc/cmd/sqlc@latest generate -f db/sqlc.yaml
```

Do not add Docker content beyond explicit user requests.

## Working Rules

- Before making project changes, read `.agents/docs/README.md` and the relevant docs listed there.
- Keep changes small and aligned with the existing scaffold.
- Prefer simple defaults until the project has stronger requirements.
- Do not commit generated build artifacts, logs, `node_modules`, or frontend `dist`.
- Verify frontend changes with `npm run build` when dependencies are available.
- For backend work, keep `cmd/server/main.go` as the entrypoint and put reusable code under `internal/` once the backend grows.
