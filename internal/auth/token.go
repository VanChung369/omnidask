package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

const (
	tokenIssuer   = "omnidask"
	tokenAudience = "omnidask-web"
)

type TokenManager struct {
	signingKey []byte
	ttl        time.Duration
}

type Claims struct {
	jwt.RegisteredClaims
}

func NewTokenManager(secret string, ttl time.Duration) *TokenManager {
	return &TokenManager{
		signingKey: []byte(secret),
		ttl:        ttl,
	}
}

func (m *TokenManager) Sign(userID uuid.UUID) (string, error) {
	now := time.Now()

	claims := Claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    tokenIssuer,
			Subject:   userID.String(),
			Audience:  jwt.ClaimStrings{tokenAudience},
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(m.ttl)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString(m.signingKey)
	if err != nil {
		return "", fmt.Errorf("sign access token: %w", err)
	}

	return signedToken, nil
}

func (m *TokenManager) ParseUserID(rawToken string) (uuid.UUID, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(
		rawToken,
		claims,
		func(token *jwt.Token) (any, error) {
			return m.signingKey, nil
		},
		jwt.WithValidMethods([]string{
			jwt.SigningMethodHS256.Alg(),
		}),
		jwt.WithIssuer(tokenIssuer),
		jwt.WithAudience(tokenAudience),
	)

	if err != nil || !token.Valid {
		return uuid.Nil, fmt.Errorf("invalid access token")
	}

	userID, err := uuid.Parse(claims.Subject)
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid token subject")
	}

	return userID, nil
}

func (m *TokenManager) ExpiresInSeconds() int64 {
	return int64(m.ttl.Seconds())
}
