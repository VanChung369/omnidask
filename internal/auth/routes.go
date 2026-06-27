package auth

import "github.com/go-chi/chi/v5"

func (h *Handler) Routes(router chi.Router) {
	router.Post("/register", h.Register)
}
