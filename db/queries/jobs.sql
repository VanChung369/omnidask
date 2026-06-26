-- name: EnqueueJob :one
INSERT INTO jobs (queue, payload, run_at)
VALUES ($1, $2, $3)
RETURNING *;

-- name: ClaimJob :one
UPDATE jobs
SET
    status = 'processing',
    locked_at = now(),
    locked_by = $1,
    attempts = attempts + 1,
    updated_at = now()
WHERE id = (
    SELECT id
    FROM jobs
    WHERE status = 'pending'
        AND jobs.queue = $2
        AND run_at <= now()
    ORDER BY id
    FOR UPDATE SKIP LOCKED
    LIMIT 1
)
RETURNING *;

-- name: CompleteJob :exec
UPDATE jobs
SET
    status = 'completed',
    locked_at = NULL,
    locked_by = NULL,
    updated_at = now()
WHERE id = $1;

-- name: FailJob :exec
UPDATE jobs
SET
    status = CASE WHEN attempts >= max_attempts THEN 'failed' ELSE 'pending' END,
    run_at = CASE
        WHEN attempts >= max_attempts THEN run_at
        ELSE now() + (sqlc.arg(retry_after_seconds)::integer::text || ' seconds')::interval
    END,
    locked_at = NULL,
    locked_by = NULL,
    last_error = sqlc.arg(last_error)::text,
    updated_at = now()
WHERE id = sqlc.arg(id)::bigint;
