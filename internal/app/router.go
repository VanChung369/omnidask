package app

import (
	"context"
	"net/http"
	"time"

	"omnidask/internal/auth"
	"omnidask/internal/platform/httpx"
	httpmiddleware "omnidask/internal/platform/httpx/middleware"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
)

const apiV1Prefix = "/api/v1"

type RouterDependencies struct {
	Config             Config
	DB                 *pgxpool.Pool
	AuthHandler        *auth.Handler
	RequireAccessToken func(http.Handler) http.Handler
}

func NewRouter(deps RouterDependencies) http.Handler {
	router := chi.NewRouter()
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Recoverer)
	router.Use(httpmiddleware.CORS(deps.Config.WebOrigin))

	router.Get("/health", healthHandler)
	router.Get("/ready", readyHandler(deps.DB))

	router.Route(apiV1Prefix, func(api chi.Router) {
		mountAuthRoutes(api, deps)
	})

	return router
}

func mountAuthRoutes(api chi.Router, deps RouterDependencies) {
	api.Route("/auth", func(authRouter chi.Router) {
		authRouter.Use(httpmiddleware.RateLimit(
			httpmiddleware.RateLimitConfig{
				MaxRequests: 5,
				Window:      time.Minute,
			},
		))

		deps.AuthHandler.Routes(
			authRouter,
			deps.RequireAccessToken,
		)
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	httpx.WriteJSON(w, http.StatusOK, map[string]string{
		"status": "ok",
	})
}

func readyHandler(db *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		pingCtx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		if err := db.Ping(pingCtx); err != nil {
			httpx.WriteJSON(w, http.StatusServiceUnavailable, map[string]string{
				"status": "database_unavailable",
			})
			return
		}

		httpx.WriteJSON(w, http.StatusOK, map[string]string{
			"status": "ready",
		})
	}
}
