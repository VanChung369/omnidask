-- name: CreateAuthSession :one
INSERT INTO auth_sessions (
  user_id,
  refresh_token_hash,
  user_agent,
  ip_address,
  expires_at
)
VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
)
RETURNING *;


-- name: GetActiveAuthSession :one
SELECT *
FROM auth_sessions
WHERE id = $1
  AND revoked_at IS NULL
  AND expires_at > now();


-- name: RotateAuthSession :one
UPDATE auth_sessions
SET
  refresh_token_hash = $2,
  last_used_at = now()
WHERE id = $1
  AND revoked_at IS NULL
  AND expires_at > now()
RETURNING *;


-- name: RevokeAuthSession :exec
UPDATE auth_sessions
SET revoked_at = now()
WHERE id = $1
  AND revoked_at IS NULL;


-- name: RevokeAllUserSessions :exec
UPDATE auth_sessions
SET revoked_at = now()
WHERE user_id = $1
  AND revoked_at IS NULL;