# DevOps Rules

## Files

DevOps work covers:

- `Dockerfile`
- `docker-compose.yml`
- `Makefile`

## Rules

- Keep these files empty or minimal until the user asks for Docker, Compose, or Make commands.
- Do not invent services, ports, networks, volumes, or environment variables without a concrete requirement.
- When adding targets or services, name them clearly and keep them aligned with the existing `web/` and `cmd/server` layout.
- Verify only the narrow command related to the change.
