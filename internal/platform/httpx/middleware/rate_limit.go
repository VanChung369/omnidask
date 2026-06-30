package middleware

import (
	"net"
	"net/http"
	"strconv"
	"sync"
	"time"

	"omnidask/internal/platform/httpx"
)

type RateLimitConfig struct {
	MaxRequests int
	Window      time.Duration
}

type rateLimitBucket struct {
	count    int
	resetAt  time.Time
	lastSeen time.Time
}

func RateLimit(config RateLimitConfig) func(http.Handler) http.Handler {
	var mu sync.Mutex
	buckets := make(map[string]rateLimitBucket)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			now := time.Now()
			key := clientKey(r)

			mu.Lock()
			bucket := buckets[key]
			if bucket.resetAt.IsZero() || !now.Before(bucket.resetAt) {
				bucket = rateLimitBucket{
					resetAt: now.Add(config.Window),
				}
			}

			bucket.count++
			bucket.lastSeen = now
			buckets[key] = bucket

			for bucketKey, bucket := range buckets {
				if now.Sub(bucket.lastSeen) > config.Window {
					delete(buckets, bucketKey)
				}
			}

			limited := bucket.count > config.MaxRequests
			retryAfter := int(time.Until(bucket.resetAt).Seconds())
			mu.Unlock()

			if limited {
				if retryAfter < 1 {
					retryAfter = 1
				}

				w.Header().Set("Retry-After", strconv.Itoa(retryAfter))
				httpx.WriteError(
					w,
					http.StatusTooManyRequests,
					"rate_limited",
					"Too many requests. Please try again later.",
				)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func clientKey(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil && host != "" {
		return host
	}

	if r.RemoteAddr != "" {
		return r.RemoteAddr
	}

	return "unknown"
}
