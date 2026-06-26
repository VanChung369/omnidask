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

After Go module setup exists, run from the repository root:

```powershell
go test ./...
```

Until `go.mod` exists, do not force Go verification for placeholder-only edits.

## Documentation

For JSON config files, parse them before finishing:

```powershell
Get-Content -Raw .\.agents\manifest.json | ConvertFrom-Json | Out-Null
```
