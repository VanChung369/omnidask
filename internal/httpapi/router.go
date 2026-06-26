package httpapi

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/coder/websocket"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"

	"omnidask/internal/auth"
	dbgen "omnidask/internal/database/gen"
	"omnidask/internal/storage"
)

type Dependencies struct {
	Logger  *slog.Logger
	Auth    auth.Service
	DB      *pgxpool.Pool
	Queries *dbgen.Queries
	Storage *storage.Client
}

type API struct {
	deps Dependencies
}

func NewRouter(deps Dependencies) http.Handler {
	api := API{deps: deps}

	router := chi.NewRouter()
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Recoverer)

	router.Get("/healthz", api.health)
	router.Get("/ws", api.websocketEcho)

	router.Route("/api/v1", func(router chi.Router) {
		router.Get("/token/dev", api.devToken)
		router.With(api.requireAuth).Get("/me", api.me)
	})

	return router
}

func (api API) health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"status":          "ok",
		"database":        api.deps.DB != nil,
		"sqlc":            api.deps.Queries != nil,
		"object_storage":  api.deps.Storage != nil && api.deps.Storage.Enabled(),
		"background_jobs": api.deps.Queries != nil,
	})
}

func (api API) devToken(w http.ResponseWriter, r *http.Request) {
	token, err := api.deps.Auth.Sign("dev-user", time.Hour)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "token_sign_failed")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"token": token})
}

func (api API) me(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(claimsContextKey{}).(*auth.Claims)
	if !ok {
		writeError(w, http.StatusUnauthorized, "missing_claims")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"subject": claims.Subject,
		"issuer":  claims.Issuer,
	})
}

func (api API) websocketEcho(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, nil)
	if err != nil {
		api.deps.Logger.Error("websocket accept failed", slog.Any("error", err))
		return
	}
	defer conn.Close(websocket.StatusNormalClosure, "closed")

	ctx := r.Context()
	for {
		messageType, payload, err := conn.Read(ctx)
		if err != nil {
			return
		}
		if err := conn.Write(ctx, messageType, payload); err != nil {
			return
		}
	}
}

type claimsContextKey struct{}

func (api API) requireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		tokenValue, ok := strings.CutPrefix(header, "Bearer ")
		if !ok || tokenValue == "" {
			writeError(w, http.StatusUnauthorized, "missing_bearer_token")
			return
		}

		claims, err := api.deps.Auth.Verify(tokenValue)
		if err != nil {
			writeError(w, http.StatusUnauthorized, "invalid_token")
			return
		}

		ctx := r.Context()
		ctx = contextWithClaims(ctx, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, code string) {
	writeJSON(w, status, map[string]string{"error": code})
}
