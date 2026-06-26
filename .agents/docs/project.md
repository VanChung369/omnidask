# Project Rules

## Current Shape

Omnidask currently has:

- React/Vite frontend in `web/`
- Go backend placeholder at `cmd/server/main.go`
- Reserved backend folders: `internal/` and `db/`
- Empty root infrastructure files: `Dockerfile`, `docker-compose.yml`, and `Makefile`

## Defaults

- Keep the project minimal by default.
- Do not add backend setup, database setup, Docker setup, Make targets, auth, routing, or service wiring unless the user asks for it.
- Prefer direct, conventional folder names over abstract architecture.
- Preserve existing user changes and staged files.
- Avoid broad refactors while the project is still being scaffolded.

## Communication

- Use Vietnamese for short updates when the user writes in Vietnamese.
- Say clearly what was changed and what was verified.
