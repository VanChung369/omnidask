MIGRATIONS_PATH ?= db/migrations

.PHONY: be-run be-test sqlc-generate migrate-up migrate-down migrate-create

be-run:
	go run ./cmd/server

be-test:
	go test ./...

sqlc-generate:
	go run github.com/sqlc-dev/sqlc/cmd/sqlc@latest generate -f db/sqlc.yaml

migrate-up:
	migrate -path $(MIGRATIONS_PATH) -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path $(MIGRATIONS_PATH) -database "$(DATABASE_URL)" down 1

migrate-create:
	migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $(name)
