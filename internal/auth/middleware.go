package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/google/uuid"

	"omnidask/internal/platform/httpx"
)

type contextKey string

const userIDContextKey contextKey = "authenticated_user_id"

func RequireAccessToken(
	tokenManager *TokenManager,
) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(
			w http.ResponseWriter,
			r *http.Request,
		) {
			authorization := r.Header.Get("Authorization")
			parts := strings.Fields(authorization)

			if len(parts) != 2 ||
				!strings.EqualFold(parts[0], "Bearer") {
				httpx.WriteError(
					w,
					http.StatusUnauthorized,
					"unauthorized",
					"Missing or invalid access token.",
				)
				return
			}

			userID, err := tokenManager.ParseUserID(parts[1])
			if err != nil {
				httpx.WriteError(
					w,
					http.StatusUnauthorized,
					"unauthorized",
					"Missing or invalid access token.",
				)
				return
			}

			ctx := context.WithValue(
				r.Context(),
				userIDContextKey,
				userID,
			)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func UserIDFromContext(ctx context.Context) (uuid.UUID, bool) {
	userID, ok := ctx.Value(userIDContextKey).(uuid.UUID)
	return userID, ok
}
