package httpapi

import (
	"context"

	"omnidask/internal/auth"
)

func contextWithClaims(ctx context.Context, claims *auth.Claims) context.Context {
	return context.WithValue(ctx, claimsContextKey{}, claims)
}
