package httpx

import (
	"encoding/json"
	"net/http"
)

type ErrorBody struct {
	Error struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}

func WriteJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	_ = json.NewEncoder(w).Encode(data)
}

func WriteError(
	w http.ResponseWriter,
	status int,
	code string,
	message string,
) {
	var body ErrorBody
	body.Error.Code = code
	body.Error.Message = message

	WriteJSON(w, status, body)
}
