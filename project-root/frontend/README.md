# File Share Frontend

Minimal README for the Angular frontend.

Prerequisites
- Node.js 18+ / Node 20 recommended
- npm (or yarn)
- Angular CLI (optional for local serve)

Dev (local)
1. Install dependencies:
```bash
cd frontend
npm ci
```
2. Run dev server:
```bash
npm start
# or
ng serve
```
3. The app expects the backend API at `http://localhost:8080/api` by default. Adjust `src/environments/environment.ts` if needed.

Build
```bash
npm run build
```

Docker
1. Build the image:
```bash
docker build -t file-share-frontend ./frontend
```
2. Or use `docker compose up --build` from project root to run full stack.

Notes
- The production environment uses `environment.prod.ts` which expects the API under `/api` (useful when serving frontend behind a reverse proxy).
