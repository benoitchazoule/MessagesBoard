# MessagesBoard Monorepo

## Structure
- `apps/web`: React frontend (Vite + Material UI)
- `apps/server`: Express.js backend (SQLite)

## Setup
1. `make install` — install dependencies for both apps
2. `make start` — start both frontend and backend
3. Access frontend at [http://localhost:5173](http://localhost:5173)
4. Backend runs at [http://localhost:4000](http://localhost:4000)

## Development
- Frontend: edit files in `apps/web/src`
- Backend: edit files in `apps/server`

## Stopping
- `make stop` — stops both servers

---

For production, further configuration is needed (env, build, deploy, etc).
