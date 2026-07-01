package app

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"omnidask/internal/auth"
)

func TestNewRouterUsesInjectedAuthDependencies(t *testing.T) {
	router := NewRouter(RouterDependencies{
		Config: Config{
			WebOrigin: "http://localhost:5173",
		},
		AuthHandler: auth.NewHandler(
			nil,
			auth.RefreshCookieConfig{TTL: time.Hour},
		),
		RequireAccessToken: func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusTeapot)
			})
		},
	})

	request := httptest.NewRequest(
		http.MethodGet,
		"/api/v1/auth/me",
		nil,
	)
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	if response.Code != http.StatusTeapot {
		t.Fatalf(
			"expected injected auth middleware to handle request, got %d",
			response.Code,
		)
	}
}
