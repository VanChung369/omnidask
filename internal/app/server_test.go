package app

import (
	"net/http"
	"testing"
	"time"
)

func TestNewServerConfiguresHTTPServer(t *testing.T) {
	called := false
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		called = true
	})

	server := NewServer(":9090", handler)

	if server.httpServer.Addr != ":9090" {
		t.Fatalf("expected addr :9090, got %q", server.httpServer.Addr)
	}

	server.httpServer.Handler.ServeHTTP(nil, nil)
	if !called {
		t.Fatal("expected server to use provided handler")
	}

	if server.httpServer.ReadHeaderTimeout != 5*time.Second {
		t.Fatalf(
			"expected read header timeout 5s, got %s",
			server.httpServer.ReadHeaderTimeout,
		)
	}
}
