# Verification Rules

## General

Every change should include the narrowest useful verification.

## Frontend

Run from `web/`:

```powershell
npm run build
```

Use `npm run lint` when changing JavaScript, JSX, or lint configuration.

## Backend

Run from the repository root:

```powershell
go test ./...
```

Run sqlc generation after changing SQL queries or migrations:

```powershell
go run github.com/sqlc-dev/sqlc/cmd/sqlc@latest generate -f db/sqlc.yaml
```

For local smoke checks, `go run ./cmd/server` should start without `DATABASE_URL`; database-backed jobs and outbox processing start only when PostgreSQL is configured.

## Documentation

For JSON config files, parse them before finishing:

```powershell
Get-Content -Raw .\.agents\manifest.json | ConvertFrom-Json | Out-Null
```
