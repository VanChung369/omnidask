package auth

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (h *Handler) Routes(
	router chi.Router,
	requireAuth func(http.Handler) http.Handler,
) {
	router.Post("/register", h.Register)
	router.Post("/login", h.Login)
	router.Post("/refresh", h.Refresh)
	router.Post("/logout", h.Logout)

	router.Group(func(router chi.Router) {
		router.Use(requireAuth)
		router.Get("/me", h.Me)
	})
}
