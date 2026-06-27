-- name: CreateUser :one
INSERT INTO users (
  email,
  display_name,
  password_hash
)
VALUES (
  $1,
  $2,
  $3
)
RETURNING *;


-- name: GetUserByID :one
SELECT *
FROM users
WHERE id = $1;


-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1;


-- name: UpdateUserLastLogin :exec
UPDATE users
SET last_login_at = now()
WHERE id = $1;

-- name: CreateWorkspaceMember :one
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role
)
VALUES (
  $1,
  $2,
  $3
)
RETURNING *;


-- name: GetWorkspaceMember :one
SELECT *
FROM workspace_members
WHERE workspace_id = $1
  AND user_id = $2;


-- name: ListUserWorkspaces :many
SELECT
  wm.id AS membership_id,
  wm.workspace_id,
  wm.user_id,
  wm.role,
  wm.status AS member_status,
  w.name AS workspace_name,
  w.slug AS workspace_slug,
  w.timezone AS workspace_timezone
FROM workspace_members wm
JOIN workspaces w ON w.id = wm.workspace_id
WHERE wm.user_id = $1
  AND wm.status = 'active'
ORDER BY w.created_at ASC;