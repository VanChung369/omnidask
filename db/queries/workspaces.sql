-- name: CreateWorkspace :one
INSERT INTO workspaces (
  name,
  slug,
  timezone
)
VALUES (
  $1,
  $2,
  $3
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
WHERE id = $1;

-- name: GetWorkspaceBySlug :one
SELECT *
FROM workspaces
WHERE slug = $1;