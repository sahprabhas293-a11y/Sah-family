# Sah Family Office Management — Frontend

React + Vite frontend for the existing Spring Boot and MongoDB application. The frontend is kept in a separate `frontend` folder and does not replace the backend or database.

## Requirements

- Node.js 20.19+ or 22.12+
- The existing Spring Boot backend running on `http://localhost:8080`
- MongoDB running with the configured `sah_family_db` database

## Run locally

Open a terminal in this `frontend` folder and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

In a separate terminal, start the backend from the project root:

```bash
./mvnw spring-boot:run
```

The Vite development server proxies `/api` requests to `http://localhost:8080`. This keeps the current backend endpoints unchanged and avoids local development CORS configuration.

## API endpoints used

- `GET /api/staff`
- `POST /api/staff`
- `PUT /api/staff/{id}`
- `DELETE /api/staff/{id}`
- `GET /api/departments`
- `POST /api/departments`
- `PUT /api/departments/{id}`
- `DELETE /api/departments/{id}`

The dashboard reads real records from these APIs. Staff and department forms use the existing API models and preserve the MongoDB records. Delete actions ask for confirmation before calling the API.

## Build for production

```bash
npm run build
```

Vite writes the production files to `frontend/dist/`. This is a standalone frontend build; the existing Spring Boot static page is not overwritten.
