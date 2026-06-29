package auth

import (
	"encoding/json"
	"errors"
	"net/http"

	"omnidask/internal/platform/httpx"
)

type Handler struct {
	service      *Service
	cookieConfig RefreshCookieConfig
}

func NewHandler(
	service *Service,
	cookieConfig RefreshCookieConfig,
) *Handler {
	return &Handler{
		service:      service,
		cookieConfig: cookieConfig,
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

func (h *Handler) Login(
	w http.ResponseWriter,
	r *http.Request,
) {
	var request LoginRequest

	if !decodeJSON(w, r, &request) {
		return
	}

	result, err := h.service.Login(r.Context(), request)
	if err != nil {
		h.writeAuthError(w, err)
		return
	}

	SetRefreshCookie(w, result.RefreshToken, h.cookieConfig)
	httpx.WriteJSON(w, http.StatusOK, result.Response)
}

func (h *Handler) Refresh(
	w http.ResponseWriter,
	r *http.Request,
) {
	cookie, err := r.Cookie(refreshCookieName)
	if err != nil {
		ClearRefreshCookie(w, h.cookieConfig)

		httpx.WriteError(
			w,
			http.StatusUnauthorized,
			"invalid_session",
			"Session is invalid or expired.",
		)
		return
	}

	result, err := h.service.Refresh(r.Context(), cookie.Value)
	if err != nil {
		ClearRefreshCookie(w, h.cookieConfig)
		h.writeAuthError(w, err)
		return
	}

	SetRefreshCookie(w, result.RefreshToken, h.cookieConfig)
	httpx.WriteJSON(w, http.StatusOK, result.Response)
}

func (h *Handler) Logout(
	w http.ResponseWriter,
	r *http.Request,
) {
	cookie, err := r.Cookie(refreshCookieName)
	if err == nil {
		h.service.Logout(r.Context(), cookie.Value)
	}

	ClearRefreshCookie(w, h.cookieConfig)
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) Me(
	w http.ResponseWriter,
	r *http.Request,
) {
	userID, ok := UserIDFromContext(r.Context())
	if !ok {
		httpx.WriteError(
			w,
			http.StatusUnauthorized,
			"unauthorized",
			"Missing or invalid access token.",
		)
		return
	}

	response, err := h.service.Me(r.Context(), userID)
	if err != nil {
		httpx.WriteError(
			w,
			http.StatusInternalServerError,
			"internal_error",
			"Could not load current user.",
		)
		return
	}

	httpx.WriteJSON(w, http.StatusOK, response)
}

func (h *Handler) writeAuthError(
	w http.ResponseWriter,
	err error,
) {
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

	case errors.Is(err, ErrInvalidCredentials):
		httpx.WriteError(
			w,
			http.StatusUnauthorized,
			"invalid_credentials",
			"Email or password is incorrect.",
		)

	case errors.Is(err, ErrInvalidSession):
		httpx.WriteError(
			w,
			http.StatusUnauthorized,
			"invalid_session",
			"Session is invalid or expired.",
		)

	default:
		httpx.WriteError(
			w,
			http.StatusInternalServerError,
			"internal_error",
			"Could not complete authentication.",
		)
	}
}

func decodeJSON(
	w http.ResponseWriter,
	r *http.Request,
	target any,
) bool {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(target); err != nil {
		httpx.WriteError(
			w,
			http.StatusBadRequest,
			"invalid_json",
			"Request body is invalid.",
		)
		return false
	}

	return true
}
