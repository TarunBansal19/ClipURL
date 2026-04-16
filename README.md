# ClipURL

A URL shortener with authentication, custom aliases, expiry handling, Redis caching, and analytics dashboards.

## Features

- User registration/login with JWT-based auth
- Short URL creation with optional alias and expiration date
- Redis-first redirect resolution for fast lookups
- Click tracking with country and device metadata
- Dashboard with total link/click summary and link management
- Analytics page with 7-day trend, top countries, and device breakdown charts
- Dark mode persisted in `localStorage`
- Rate limiting for anonymous shorten requests (20/hour per IP)

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Recharts, QRCode React, React Hot Toast |
| Backend | Node.js, Express, Mongoose, ioredis, JWT, bcrypt, nanoid, express-rate-limit, ua-parser-js |
| Database | MongoDB Atlas (free tier recommended) |
| Cache | Redis |
| Testing | Jest, Supertest, mongodb-memory-server |

## Architecture Overview

`React (client)` -> `Express API (server)` -> `MongoDB Atlas + Redis`

- React handles UI, auth state, and API interactions
- Express exposes auth, link CRUD, stats, and redirect endpoints
- MongoDB stores users, links, and click events
- Redis caches `code -> originalUrl` to reduce database reads on redirects

## Project Structure

```bash
clipurl/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── api/
│   │   └── main.jsx
│   ├── index.html
│   └── tailwind.config.js
├── server/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── db/
│   │   ├── app.js
│   │   └── index.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
└── README.md
```

## Setup

1. Clone the repo and enter the directory.
2. Install dependencies:
   - `cd server && npm install`
   - `cd ../client && npm install`
3. Configure environment variables:
   - Copy `server/.env.example` -> `server/.env`
   - Set `MONGODB_URI` to your MongoDB Atlas free-tier connection string
   - Ensure `JWT_SECRET`, `REDIS_URL`, and `BASE_URL` are set
4. Start both apps:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm run dev`

## Environment Variables (Server)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/urlshortener
MONGODB_URI_TEST=mongodb://127.0.0.1:27017/urlshortener_test
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register with `{ email, password }`, returns JWT |
| POST | `/api/auth/login` | No | Login with `{ email, password }`, returns JWT |
| POST | `/api/shorten` | Optional | Create short link from `{ url, alias?, expiresAt? }` |
| GET | `/api/links` | Yes | Get logged-in user's links |
| DELETE | `/api/links/:code` | Yes | Delete owned link and invalidate Redis cache |
| PATCH | `/api/links/:code` | Yes | Update alias/expiry of owned link |
| GET | `/api/links/:code/stats` | Yes | Get total clicks, daily trend, top countries, devices |
| GET | `/:code` | No | Redirect to original URL (Redis first, Mongo fallback) |
| GET | `/api/health` | No | Health check |


Tests cover:

1. `POST /api/auth/register` (success + duplicate email)
2. `POST /api/auth/login` (success + wrong password)
3. `POST /api/shorten` (success + short code returned)
4. `GET /:code` (302 redirect to original URL)
5. `GET /api/links/:code/stats` (response shape validation)

## Key Decisions

- **MongoDB for click logs:** click analytics are event-like and flexible; MongoDB handles evolving metadata (country/device) without rigid migrations.
- **Redis caching trade-off:** using Redis reduces redirect latency and database load, at the cost of cache invalidation complexity on delete/update.
- **`nanoid` collision handling:** links use 6-char IDs; collisions are checked before insert and regenerated when necessary.
- **JWT stateless auth:** avoids server-side session storage and scales simply across distributed deployments.
