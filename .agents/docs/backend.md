# Backend Rules

## Location

The backend entrypoint is `cmd/server/main.go`.

## Current State

The backend is only a placeholder. Do not assume a full Go application exists yet.

## Rules

- Do not create `go.mod` unless the user asks for backend setup or Go commands require it.
- Do not add HTTP routes, database clients, config loaders, middleware, or background workers unless requested.
- Keep reusable backend packages under `internal/` once the backend grows.
- Keep database migrations or seed assets under `db/` when they are requested.

## Default Entrypoint

Until backend setup is requested, `cmd/server/main.go` may remain as:

```go
package main

func main() {
}
```
