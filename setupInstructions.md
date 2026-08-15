# Task Manager API

A RESTful Task Manager API built with **Node.js, Express, PostgreSQL, JWT authentication, Zod, Vitest, and Supertest**.

## Tech Stack

* Node.js + Express
* PostgreSQL
* JWT authentication
* Zod validation
* Vitest + Supertest
* Pino logging

## Features

* User registration and login
* JWT-based authentication
* Create, read, update, and delete tasks
* User-specific tasks
* Request validation with Zod
* Centralized error handling
* Automated API tests
* Separate test database configuration

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/task_manager
JWT_SECRET=your_secret_key
```

For testing, create `.env.test`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/task_manager_test
JWT_SECRET=test_secret
```

> Keep `.env` and `.env.test` out of Git.

### 3. Set up PostgreSQL

Create the database and required tables according to the project's database schema.

### 4. Run the application

Development:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## Testing

Run the complete test suite:

```bash
npm test
```

Tests use a separate test database and automatically clean the database before the test run.

Current coverage includes:

* User registration
* User login
* Authentication failures
* Input validation
* Task creation
* Task retrieval
* Task updates
* Task deletion
* Not-found cases

## API Endpoints

### Authentication

| Method | Endpoint         | Auth |
| ------ | ---------------- | ---- |
| POST   | `/auth/register` | No   |
| POST   | `/auth/login`    | No   |

### Tasks

| Method | Endpoint     | Auth |
| ------ | ------------ | ---- |
| GET    | `/tasks`     | JWT  |
| POST   | `/tasks`     | JWT  |
| GET    | `/tasks/:id` | JWT  |
| PATCH  | `/tasks/:id` | JWT  |
| DELETE | `/tasks/:id` | JWT  |

For protected routes, send:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Project Structure

```text
src/
├── routes/
├── validation/
├── middleware/
├── utils/
├── tests/
├── app.js
├── db.js
└── server.js

.env
.env.test
vitest.config.js
package.json
```

## License

This project is for educational and development purposes.
