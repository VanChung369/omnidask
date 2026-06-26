# Project Rules

## Current Shape

Omnidask currently has:

- React/Vite frontend in `web/`
- Go backend entrypoint at `cmd/server/main.go`
- Backend application packages under `internal/`
- Database migrations and sqlc queries under `db/`
- Root infrastructure files: `Dockerfile`, `docker-compose.yml`, and `Makefile`

The backend module tree below is the target project structure currently being
implemented. Do not remove planned folders from the structure just because they
do not exist yet.

## Defaults

- Keep the project minimal by default.
- Do not add Docker setup, auth flows, new databases, or extra services unless the user asks for them.
- Prefer direct, conventional folder names over abstract architecture.
- Preserve existing user changes and staged files.
- Avoid broad refactors while the project is still being scaffolded.

## Communication

- Use Vietnamese for short updates when the user writes in Vietnamese.
- Say clearly what was changed and what was verified.

## Project Structure

```txt
omnidask/
├─ web/ # React source
│  ├─ src/
│  └─ dist/ # build output
│
├─ cmd/
│  └─ server/
│     └─ main.go
│
├─ internal/
│  ├─ auth/
│  ├─ workspace/
│  ├─ user/
│  ├─ team/
│  ├─ customer/
│  ├─ conversation/
│  ├─ message/
│  ├─ channel/
│  │  ├─ webchat/
│  │  ├─ email/
│  │  ├─ facebook/
│  │  └─ zalo/
│  ├─ routing/
│  ├─ notification/
│  ├─ realtime/
│  ├─ jobs/
│  ├─ audit/
│  └─ platform/
│     ├─ database/
│     ├─ storage/
│     ├─ http/
│     └─ logger/
│
├─ db/
│  ├─ migrations/
│  ├─ queries/
│  └─ sqlc/
│
├─ Dockerfile
├─ docker-compose.yml
└─ Makefile
```

## Module File Rules

Each feature module must include:

- `handler.go` for HTTP handlers.
- `service.go` for business logic.
- `repository.go` for database access.
- `types.go` for request, response, and domain types.

If a module reads or writes database tables, it must also have a matching
`queries.sql` file under `db/queries/`.
