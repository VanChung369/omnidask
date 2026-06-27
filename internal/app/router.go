package app

import (
	"context"
	"net/http"
	"time"

	"omnidask/internal/auth"
	"omnidask/internal/platform/httpx"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewRouter(config Config, db *pgxpool.Pool) http.Handler {
	router := chi.NewRouter()
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Recoverer)

	tokenManager := auth.NewTokenManager(
		config.JWTSecret,
		config.AccessTokenTTL,
	)

	authRepository := auth.NewRepository(db)
	authService := auth.NewService(authRepository, tokenManager)
	authHandler := auth.NewHandler(authService)

	router.Route("/api/v1/auth", authHandler.Routes)

	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		httpx.WriteJSON(w, http.StatusOK, map[string]string{
			"status": "ok",
		})
	})

	router.Get("/ready", func(w http.ResponseWriter, r *http.Request) {
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
	})

	return router
}
