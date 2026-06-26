# Project Rules

## Current Shape

Omnidask currently has:

- React/Vite frontend in `web/`
- Go backend entrypoint at `cmd/server/main.go`
- Backend application packages under `internal/`
- Database migrations and sqlc queries under `db/`
- Root infrastructure files: `Dockerfile`, `docker-compose.yml`, and `Makefile`

## Defaults

- Keep the project minimal by default.
- Do not add Docker setup, auth flows, new databases, or extra services unless the user asks for them.
- Prefer direct, conventional folder names over abstract architecture.
- Preserve existing user changes and staged files.
- Avoid broad refactors while the project is still being scaffolded.

## Communication

- Use Vietnamese for short updates when the user writes in Vietnamese.
- Say clearly what was changed and what was verified.

## structure project

omnidask/
├─ web/ # React source
│ ├─ src/
│ └─ dist/ # build output
│
├─ cmd/
│ └─ server/
│ └─ main.go
│
├─ internal/
│ ├─ auth/
│ ├─ workspace/
│ ├─ user/
│ ├─ team/
│ ├─ customer/
│ ├─ conversation/
│ ├─ message/
│ ├─ channel/
│ │ ├─ webchat/
│ │ ├─ email/
│ │ ├─ facebook/
│ │ └─ zalo/
│ ├─ routing/
│ ├─ notification/
│ ├─ realtime/
│ ├─ jobs/
│ ├─ audit/
│ └─ platform/
│ ├─ database/
│ ├─ storage/
│ ├─ http/
│ └─ logger/
│
├─ db/
│ ├─ migrations/
│ ├─ queries/
│ └─ sqlc/
│
├─ Dockerfile
├─ docker-compose.yml
└─ Makefile
