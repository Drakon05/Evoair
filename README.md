# EvoAir

A modern e-commerce experience for EvoAir makeup spray, featuring an immersive React storefront and a Node.js API backed by PostgreSQL.

> **Project status:** Early-stage development

## Overview

EvoAir is organized as a full-stack application with separate frontend and backend services:

- **Frontend:** React 19, Vite, Three.js, React Three Fiber, animations, and interactive 3D experiences
- **Backend:** Node.js, Express 5, PostgreSQL, Drizzle ORM, validation, authentication utilities, logging, and security middleware
- **Database:** PostgreSQL 15, provisioned locally with Docker Compose

## Repository Structure

```text
EvoAir/
├── frontend/                 # React + Vite storefront
│   ├── public/               # Static assets
│   └── src/                  # UI, scenes, components, and application logic
└── backend/                  # Express API
    ├── config/               # Environment and database client setup
    ├── controllers/          # Route handlers
    ├── db/                   # Database schema and seed scripts
    ├── middleware/           # Auth and request/error middleware
    ├── routes/               # API route definitions
    ├── services/             # Business logic
    ├── validators/           # Zod validation schemas
    ├── docker-compose.yml    # Local PostgreSQL service
    └── server.js             # API entry point
```

## Prerequisites

Install the following before getting started:

- [Node.js](https://nodejs.org/) 18 or newer
- npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine with Compose
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kirtan-thakkar/evoair.git
cd evoair
```

### 2. Start the database

From the backend directory, start the local PostgreSQL container:

```bash
cd backend
docker compose up -d
```

The database is exposed on `localhost:5432` with the development values configured in `backend/docker-compose.yml`.

> Do not use the bundled development credentials in production. Move secrets to environment variables before deploying.

### 3. Install and start the backend

```bash
npm install
npm start
```

The API runs on port `5000` by default.

### 4. Install and start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local development URL in the terminal, usually `http://localhost:5173`.

## Available Commands

### Frontend

Run these commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

### Backend

Run these commands from `backend/`:

| Command | Description |
| --- | --- |
| `npm start` | Start the Express API |
| `npm test` | Run the Vitest test suite |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed the database with development data |

## Local Services

| Service | URL / Port |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:5000` |
| PostgreSQL | `localhost:5432` |

## Development Workflow

1. Start PostgreSQL with Docker Compose.
2. Install dependencies in both `frontend/` and `backend/`.
3. Run migrations and seed data when required.
4. Start the backend API.
5. Start the frontend development server.
6. Run frontend linting and backend tests before opening a pull request.

## Stopping the Database

Stop the PostgreSQL container while preserving its data volume:

```bash
cd backend
docker compose down
```

To remove the container **and** its persisted local database data:

```bash
docker compose down -v
```

## Troubleshooting

### Port 5432 is already in use

Another PostgreSQL instance may already be running. Stop it or update the port mapping in `backend/docker-compose.yml`.

### Port 5000 is already in use

Stop the process using port `5000`, or configure the backend to use another port if supported by the server configuration.

### Frontend dependencies or assets are missing

Reinstall the frontend dependencies:

```bash
cd frontend
rm -rf node_modules
npm install
```

## Contributing

1. Create a feature branch from `main`.
2. Keep frontend and backend changes focused and independently testable.
3. Run `npm run lint` in `frontend/`.
4. Run `npm test` in `backend/`.
5. Open a pull request with a clear description of the changes.

## License

No license has been specified yet.
