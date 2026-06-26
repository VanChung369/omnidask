# Agents Operating Guide

## Purpose

This folder defines the local agent roles and routing rules for work in this repository.

Agents must read `.agents/docs/README.md` before changing the project, then follow the relevant documentation files in `.agents/docs/`.

## Default Routing

- Frontend work goes to the `frontend` agent and should stay inside `web/` unless shared project configuration is required.
- Backend work goes to the `backend` agent and should use `cmd/server/main.go` as the entrypoint.
- DevOps work goes to the `devops` agent and covers Docker, Compose, Makefile, and environment wiring.
- Documentation and repo hygiene work goes to the `docs` agent.

## Agent Rules

- Treat `.agents/docs/` as the source of truth for project conventions.
- Keep scaffolding minimal unless the task asks for production setup.
- Do not introduce new frameworks, databases, services, or orchestration layers without an explicit request.
- Preserve user changes and avoid broad refactors.
- Prefer runnable, verified changes over speculative architecture.
- Use Vietnamese for short execution updates when the user writes in Vietnamese.

## Verification

- Frontend: run `npm run build` from `web/` after meaningful changes.
- Backend: run `go test ./...` after Go module setup exists.
- Docker/Make: run the narrowest command that validates the changed target.
