dev:
	docker compose up -d 
	go run ./cmd/server

web:
	cd web && npm run dev

build:
	./scripts/build-web.sh
	go build -o bin/server ./cmd/server

sqlc:
	sqlc generate


migrate-up:
	migrate -path db/migrations -database "$(DATABASE_URL)" up