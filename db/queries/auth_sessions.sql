-- name: CreateAuthSession :one
INSERT INTO
  auth_sessions (id, user_id, refresh_token_hash, expires_at)
VALUES
  (
    sqlc.arg(session_id),
    sqlc.arg(user_id),
    sqlc.arg(refresh_token_hash),
    sqlc.arg(expires_at)
  ) RETURNING id,
  user_id,
  expires_at,
  created_at;

-- name: GetActiveAuthSession :one
SELECT
  id,
  user_id,
  refresh_token_hash,
  expires_at
FROM
  auth_sessions
WHERE
  id = sqlc.arg(session_id)
  AND revoked_at IS NULL
  AND expires_at > now ();

-- name: RotateAuthSession :one
UPDATE auth_sessions
SET
  refresh_token_hash = sqlc.arg(new_refresh_token_hash),
  last_used_at = now ()
WHERE
  id = sqlc.arg(session_id)
  AND refresh_token_hash = sqlc.arg(current_refresh_token_hash)
  AND revoked_at IS NULL
  AND expires_at > now () RETURNING id,
  user_id,
  expires_at;

-- name: RevokeAuthSession :exec
UPDATE auth_sessions
SET
  revoked_at = now ()
WHERE
  id = sqlc.arg(session_id)
  AND revoked_at IS NULL;
