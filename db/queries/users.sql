-- name: CreateUser :one
INSERT INTO users (
  email,
  display_name,
  password_hash
)
VALUES (
  sqlc.arg(email),
  sqlc.arg(display_name),
  sqlc.arg(password_hash)
)
RETURNING
  id,
  email::text AS email,
  display_name,
  status,
  created_at;


-- name: CreateWorkspaceMember :exec
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role
)
VALUES (
  sqlc.arg(workspace_id),
  sqlc.arg(user_id),
  sqlc.arg(role)
);


-- name: GetActiveUserByEmail :one
SELECT
  id,
  email::text AS email,
  display_name,
  password_hash,
  status
FROM users
WHERE email = sqlc.arg(email)
  AND status = 'active';


-- name: GetActiveUserByID :one
SELECT
  id,
  email::text AS email,
  display_name,
  status
FROM users
WHERE id = sqlc.arg(id)
  AND status = 'active';


-- name: UpdateUserLastLogin :exec
UPDATE users
SET last_login_at = now()
WHERE id = sqlc.arg(id);


-- name: ListUserWorkspaces :many
SELECT
  w.id,
  w.name,
  w.slug,
  w.timezone,
  wm.role
FROM workspace_members wm
JOIN workspaces w ON w.id = wm.workspace_id
WHERE wm.user_id = sqlc.arg(user_id)
  AND wm.status = 'active'
ORDER BY w.created_at ASC;
