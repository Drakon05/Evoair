# EvoAir Frontend

React + Vite storefront for EvoAir.

## Prerequisites

- Node.js 18+
- npm

## Local Development

From `/home/runner/work/evoair/evoair/frontend`:

```bash
npm install
npm run dev
```

Vite usually serves the app at `http://localhost:5173`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint checks |

## Project Layout

```text
frontend/
├── public/           # Static files served as-is
├── src/
│   ├── components/   # Reusable UI and visual components
│   ├── assets/       # Images, media, fonts, and 3D resources
│   ├── data/         # Product option data
│   └── utils/        # Frontend utility helpers
└── vite.config.js    # Vite configuration
```
