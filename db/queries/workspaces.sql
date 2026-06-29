-- name: CreateWorkspace :one
INSERT INTO workspaces (
  name,
  slug,
  timezone
)
VALUES (
  sqlc.arg(name),
  sqlc.arg(slug),
  sqlc.arg(timezone)
)
RETURNING
  id,
  name,
  slug,
  timezone,
  created_at;


-- name: GetWorkspaceByID :one
SELECT
  id,
  name,
  slug,
  timezone,
  created_at,
  updated_at
FROM workspaces
WHERE id = sqlc.arg(id);

-- name: GetWorkspaceBySlug :one
SELECT *
FROM workspaces
WHERE slug = sqlc.arg(slug);
