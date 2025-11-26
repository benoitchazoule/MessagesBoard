
# MongoDB via Docker
MONGO_CONTAINER_NAME = messagesboard-mongo
MONGO_PORT = 27017

start-mongo:
	docker rm -f $(MONGO_CONTAINER_NAME) 2>/dev/null || true
	docker run -d --name $(MONGO_CONTAINER_NAME) -p $(MONGO_PORT):27017 -v $(PWD)/mongo-data:/data/db mongo:latest

stop-mongo:
	docker stop $(MONGO_CONTAINER_NAME) || true

install-web:
	cd apps/web && npm install

install-server:
	cd apps/server && npm install

install: install-web install-server

start-web:
	cd apps/web && npm run dev

start-server:
	cd apps/server && npm start

start: start-mongo
	make start-server &
	make start-web &

stop:
	pkill -f "npm run dev" || true
	pkill -f "node index.js" || true
	make stop-mongo
