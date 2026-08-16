# TaskForge — Deployment

TaskForge uses GitHub Actions for CI and Railway for production deployment.

## Architecture

```
GitHub
  │
  ├── GitHub Actions
  │     ├── Install dependencies
  │     ├── PostgreSQL test DB
  │     ├── Run migrations
  │     └── Run tests
  │
  └── Railway
        ├── Frontend → Vite + React
        ├── Backend  → Node.js + Express
        └── PostgreSQL
```

## GitHub Actions

The workflow runs on every:

- `push`
- `pull_request`

It:

1. Sets up Node.js 24
2. Starts a PostgreSQL 14 test database
3. Installs dependencies
4. Runs test migrations
5. Runs the test suite

**Workflow:** `.github/workflows/tests.yml`

No GCP authentication or deployment is required.

## Railway

Railway is connected directly to the GitHub repository.

### Backend

| Setting | Value |
|---|---|
| Service | `taskforge-backend` |
| Root Directory | `/` |
| Start Command | `npm start` |

The backend runs:

```bash
node src/server.js
```

**Production environment variables:**

- `DATABASE_URL`
- `JWT_SECRET`

Migrations are run before deployment:

```bash
npm run migrate
```

**Backend URL:** https://taskforge-backend-ish-production.up.railway.app

### Frontend

| Setting | Value |
|---|---|
| Service | `taskforge-frontend` |
| Root Directory | `/client` |

**Build:**

```bash
npm run build
```

**Start:**

```bash
npm run preview -- --host 0.0.0.0 --port $PORT
```

**Production environment variable:**

```
VITE_API_URL=https://taskforge-backend-ish-production.up.railway.app
```

The frontend uses:

```js
const API_URL = import.meta.env.VITE_API_URL;
```

Vite preview is configured to allow the Railway hostname:

```js
preview: {
  allowedHosts: true,
}
```

## Database

Railway PostgreSQL is used for production.

```
Backend
   ↓
DATABASE_URL
   ↓
Railway PostgreSQL
```

Local and test databases remain separate from production.

## Deployment Flow

```
git push
   │
   ├──→ GitHub Actions → Tests
   │
   └──→ Railway → Build → Migrate → Deploy
```

Production secrets are configured through Railway and are not committed to Git.

## Current Status

| Component | Status |
|---|---|
| GitHub Actions CI | ✅ |
| Railway Backend | ✅ |
| Railway PostgreSQL | ✅ |
| Railway Frontend | ✅ |
| Frontend → Backend | ✅ |
| Production Auth | ✅ |
| End-to-End Testing | ✅ |