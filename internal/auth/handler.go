package auth

import (
	"encoding/json"
	"errors"
	"net/http"

	"omnidask/internal/platform/httpx"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) Register(
	w http.ResponseWriter,
	r *http.Request,
) {
	var request RegisterRequest

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&request); err != nil {
		httpx.WriteError(
			w,
			http.StatusBadRequest,
			"invalid_json",
			"Request body is invalid.",
		)
		return
	}

	response, err := h.service.Register(r.Context(), request)
	if err != nil {
		switch {
		case errors.Is(err, ErrValidation):
			httpx.WriteError(
				w,
				http.StatusBadRequest,
				"validation_error",
				err.Error(),
			)

		case errors.Is(err, ErrEmailAlreadyTaken):
			httpx.WriteError(
				w,
				http.StatusConflict,
				"email_already_taken",
				"Email is already registered.",
			)

		case errors.Is(err, ErrSlugAlreadyTaken):
			httpx.WriteError(
				w,
				http.StatusConflict,
				"workspace_slug_already_taken",
				"Workspace slug is already taken.",
			)

		default:
			httpx.WriteError(
				w,
				http.StatusInternalServerError,
				"internal_error",
				"Could not create account.",
			)
		}

		return
	}

	httpx.WriteJSON(w, http.StatusCreated, response)
}
