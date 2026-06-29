package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

func NewRefreshSecret() (string, error) {
	raw := make([]byte, 32)

	if _, err := rand.Read(raw); err != nil {
		return "", fmt.Errorf("generate refresh token: %w", err)
	}

	return base64.RawURLEncoding.EncodeToString(raw), nil
}

func HashRefreshSecret(secret string) string {
	hash := sha256.Sum256([]byte(secret))
	return fmt.Sprintf("%x", hash[:])
}

func BuildRefreshCookieValue(
	sessionID uuid.UUID,
	secret string,
) string {
	return sessionID.String() + "." + secret
}

func ParseRefreshCookieValue(
	value string,
) (uuid.UUID, string, error) {
	sessionIDRaw, secret, found := strings.Cut(value, ".")
	if !found || sessionIDRaw == "" || secret == "" {
		return uuid.Nil, "", fmt.Errorf("invalid refresh token")
	}

	sessionID, err := uuid.Parse(sessionIDRaw)
	if err != nil {
		return uuid.Nil, "", fmt.Errorf("invalid refresh token session")
	}

	return sessionID, secret, nil
}
