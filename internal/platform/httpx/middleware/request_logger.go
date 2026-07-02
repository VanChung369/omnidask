package middleware

import (
	"log/slog"
	"net/http"
	"time"

	chimiddleware "github.com/go-chi/chi/v5/middleware"
)

func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startedAt := time.Now()
		wrappedWriter := chimiddleware.NewWrapResponseWriter(w, r.ProtoMajor)

		next.ServeHTTP(wrappedWriter, r)

		status := wrappedWriter.Status()
		if status == 0 {
			status = http.StatusOK
		}

		slog.Info(
			"http request",
			"method", r.Method,
			"path", r.URL.Path,
			"status", status,
			"bytes", wrappedWriter.BytesWritten(),
			"duration_ms", time.Since(startedAt).Milliseconds(),
			"remote_addr", r.RemoteAddr,
		)
	})
}
