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
RETURNING *;


-- name: GetWorkspaceByID :one
SELECT *
FROM workspaces
WHERE id = $1;

-- name: GetWorkspaceBySlug :one
SELECT *
FROM workspaces
WHERE slug = $1;