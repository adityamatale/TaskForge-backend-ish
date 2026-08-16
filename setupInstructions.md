# TaskForge — Local Setup

## Requirements

* Node.js
* PostgreSQL
* Git

## Install

Clone the repository and install dependencies:

```bash
git clone https://github.com/adityamatale/TaskForge-backend-ish.git
cd TaskForge-backend-ish
npm ci
```

## Environment

Create `.env` for development:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/task_manager
JWT_SECRET=<your-development-secret>
```

Create `.env.test` for testing:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/task_manager_test
JWT_SECRET=test-secret
```

Do not commit either file.

## Database

Create the development database, then run:

```bash
npm run migrate
```

For the test database:

```bash
npm run migrate:test
```

## Run

Development:

```bash
npm run dev
```

Production-style local run:

```bash
npm start
```

## Tests

Run tests once:

```bash
npm run test:run
```

Run Vitest interactively:

```bash
npm test
```

Tests use the separate test database and clean it before the test suite.

## Available Scripts

| Command                | Purpose                    |
| ---------------------- | -------------------------- |
| `npm run dev`          | Development server         |
| `npm start`            | Start server               |
| `npm run migrate`      | Run development migrations |
| `npm run migrate:test` | Run test migrations        |
| `npm test`             | Vitest                     |
| `npm run test:run`     | Run tests once             |

## API

Main endpoints:

```text
POST   /auth/register
POST   /auth/login

GET    /tasks
POST   /tasks
GET    /tasks/:id
PATCH  /tasks/:id
DELETE  /tasks/:id
```

Task endpoints require JWT authentication.
