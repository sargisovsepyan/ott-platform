# Lumio frontend

React and Vite frontend for the OTT platform.

## Prerequisites

- Node.js 20.19 or newer
- npm
- The existing backend configured and available locally

## Setup

```bash
npm install
```

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

The Vite development server proxies relative `/api` requests to
`http://localhost:3000`. The backend must be running separately for live data.

## Routes

- `/` — home and movie discovery
- `/movies` — searchable and paginated catalogue
- `/movies/:id` — movie details
- `/login` and `/register` — authentication
- `/admin/movies` — administrator movie management
- `/admin/movies/new` — create a movie
- `/admin/movies/:id/edit` — edit metadata and replace a poster

## Authentication

The backend returns a seven-day JWT after login. Lumio keeps the token and the
minimum returned user data in `sessionStorage`, so the session survives a page
refresh in the current browser tab but ends when that browser session closes.
The backend remains authoritative for all administrator operations.

## Backend-derived limitations

- Registration does not sign the user in automatically.
- There is no profile or token-refresh endpoint.
- There is no authoritative genre-list endpoint, so genre filtering uses text.
- Movie data does not include playback, trailers, cast, runtime, or backdrops.
- Poster uploads accept JPG, JPEG, PNG, and WebP. The backend defines no file
  size limit.
- Local integration relies on the Vite proxy because the backend does not
  configure browser CORS directly.

