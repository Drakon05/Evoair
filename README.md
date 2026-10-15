# EvoAir

E-commerce platform for EvoAir makeup spray.

## Project Structure

```text
Evoair/
├── frontend/       # React 19 + Vite + Three.js / R3F storefront
└── backend/        # Node.js + Express 5 + PostgreSQL (Drizzle ORM) API
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
docker compose up -d    # Starts local PostgreSQL 15 container
npm start               # Runs Express server on port 5000
```
