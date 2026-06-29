package auth

import (
	"net/http"
	"time"
)

const refreshCookieName = "omnidask_refresh_token"

type RefreshCookieConfig struct {
	Secure bool
	TTL    time.Duration
}

func SetRefreshCookie(
	w http.ResponseWriter,
	value string,
	config RefreshCookieConfig,
) {
	http.SetCookie(w, &http.Cookie{
		Name:     refreshCookieName,
		Value:    value,
		Path:     "/api/v1/auth",
		HttpOnly: true,
		Secure:   config.Secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   int(config.TTL.Seconds()),
		Expires:  time.Now().Add(config.TTL),
	})
}

func ClearRefreshCookie(
	w http.ResponseWriter,
	config RefreshCookieConfig,
) {
	http.SetCookie(w, &http.Cookie{
		Name:     refreshCookieName,
		Value:    "",
		Path:     "/api/v1/auth",
		HttpOnly: true,
		Secure:   config.Secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
		Expires:  time.Unix(1, 0),
	})
}
