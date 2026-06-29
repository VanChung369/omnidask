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
