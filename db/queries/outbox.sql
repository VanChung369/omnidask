-- name: CreateOutboxEvent :one
INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload, available_at)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ClaimOutboxEvent :one
UPDATE outbox
SET
    status = 'processing',
    locked_at = now(),
    locked_by = $1,
    attempts = attempts + 1,
    updated_at = now()
WHERE id = (
    SELECT id
    FROM outbox
    WHERE status = 'pending'
        AND available_at <= now()
    ORDER BY id
    FOR UPDATE SKIP LOCKED
    LIMIT 1
)
RETURNING *;

-- name: MarkOutboxPublished :exec
UPDATE outbox
SET
    status = 'published',
    locked_at = NULL,
    locked_by = NULL,
    published_at = now(),
    updated_at = now()
WHERE id = $1;

-- name: MarkOutboxFailed :exec
UPDATE outbox
SET
    status = 'pending',
    available_at = now() + (sqlc.arg(retry_after_seconds)::integer::text || ' seconds')::interval,
    locked_at = NULL,
    locked_by = NULL,
    error = sqlc.arg(error)::text,
    updated_at = now()
WHERE id = sqlc.arg(id)::bigint;
