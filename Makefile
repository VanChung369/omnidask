dev:
	docker compose up -d 
	go run ./cmd/server

web:
	cd web && npm run dev

build:
	./scripts/build-web.sh
	go build -o bin/server ./cmd/server

sqlc:
	go run github.com/sqlc-dev/sqlc/cmd/sqlc@latest generate


migrate-up:
	docker compose run --rm migrate