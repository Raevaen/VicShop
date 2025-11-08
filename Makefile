dev:
	cd frontend && npm run dev &
	cd backend && dotnet run

build:
	cd frontend && npm run build
	cd backend && dotnet build

run:
	docker-compose up
