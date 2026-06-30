package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	httxpmiddleware "omnidask/internal/platform/httpx/middleware"
)

func TestRateLimitAllowsFiveRequestsPerWindow(t *testing.T) {
	handler := newRateLimitHandler()

	for range 5 {
		assertRequestStatus(t, handler, "192.0.2.1:1234", http.StatusNoContent)
	}

	assertRequestStatus(t, handler, "192.0.2.1:1234", http.StatusTooManyRequests)
}

func TestRateLimitTracksClientsSeparately(t *testing.T) {
	handler := newRateLimitHandler()

	for range 5 {
		assertRequestStatus(t, handler, "192.0.2.1:1234", http.StatusNoContent)
	}

	assertRequestStatus(t, handler, "198.51.100.2:1234", http.StatusNoContent)
}

func newRateLimitHandler() http.Handler {
	limiter := httxpmiddleware.RateLimit(httxpmiddleware.RateLimitConfig{
		MaxRequests: 5,
		Window:      time.Minute,
	})

	return limiter(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	}))
}

func assertRequestStatus(
	t *testing.T,
	handler http.Handler,
	remoteAddr string,
	expectedStatus int,
) {
	t.Helper()
	response := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", nil)
	request.RemoteAddr = remoteAddr

	handler.ServeHTTP(response, request)

	if response.Code != expectedStatus {
		t.Fatalf("expected status %d, got %d", expectedStatus, response.Code)
	}
}
