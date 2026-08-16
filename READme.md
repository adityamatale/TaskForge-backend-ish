# 🗂️ TaskForge — Project Summary

> **Goal:** Build a real-world full-stack application while learning JavaScript, Node.js, Express, PostgreSQL, testing, CI/CD, and cloud deployment **side by side**.
>
> The project is intentionally built step-by-step instead of starting with an advanced architecture.

---

## 🌐 Live Demo

**TaskForge:**  https://task-forge.up.railway.app/

---

## 🛠️ Stack

```text
Frontend
   ↓
Backend — Node.js + Express
   ↓
PostgreSQL
```

Additional tools:

* **Zod** → request validation
* **JWT** → authentication
* **dotenv** → environment variables
* **Vitest** → testing
* **Supertest** → API testing
* **Pino** → structured logging
* **Git/GitHub** → version control
* **GitHub Actions** → CI/CD
* **Google Cloud Platform** → deployment

Using **ESM**:

```js
import ...
export ...
```

instead of CommonJS:

```js
require(...)
module.exports
```

---

# 📁 Project Structure

```text
TaskForge/
│
├── src/
│   ├── app.js
│   ├── server.js
│   ├── db.js
│   │
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── validation/
│   ├── migrations/
│   └── tests/
│
├── .github/
│   └── workflows/
│
├── .env
├── .env.test
├── .gitignore
├── package.json
├── package-lock.json
└── vitest.config.js
```

Frontend and backend are maintained in the **same repository** and will be deployed separately.

---

# ⚙️ Application Setup

### `app.js`

Responsible for configuring Express:

```text
Express
 ↓
Middleware
 ↓
Routes
 ↓
Error handler
```

It does **not** call `app.listen()`.

### `server.js`

Responsible for starting the HTTP server:

```text
server.js
   ↓
app.listen()
   ↓
HTTP server
```

This allows tests to import `app.js` without starting a real server.

---

# 🗄️ Database

PostgreSQL is used as the application's relational database.

### Development

```text
task_manager
```

### Testing

```text
task_manager_test
```

Tests use a separate database so test data does not affect development data.

### Database layer

```text
Application
    ↓
pg Pool
    ↓
PostgreSQL
```

---

# 🔐 Authentication

Authentication is implemented using **JWT**.

```text
Register
   ↓
User stored in PostgreSQL
   ↓
Login
   ↓
JWT issued
   ↓
Protected request
   ↓
JWT verification
   ↓
User-specific resource
```

Tasks belong to authenticated users, so task operations are restricted to the requesting user's data.

---

# 🌐 API

### Authentication

| Method | Endpoint         | Purpose               |
| ------ | ---------------- | --------------------- |
| POST   | `/auth/register` | Register user         |
| POST   | `/auth/login`    | Login and receive JWT |

### Tasks

| Method | Endpoint     | Purpose          |
| ------ | ------------ | ---------------- |
| GET    | `/tasks`     | Get user's tasks |
| POST   | `/tasks`     | Create task      |
| GET    | `/tasks/:id` | Get one task     |
| PATCH  | `/tasks/:id` | Update task      |
| DELETE | `/tasks/:id` | Delete task      |

Protected task endpoints require:

```text
Authorization: Bearer <JWT>
```

---

# 🔄 Request Flow

Normal request:

```text
Client
  ↓
Express
  ↓
Authentication
  ↓
Validation
  ↓
Route
  ↓
PostgreSQL
  ↓
JSON response
```

Errors:

```text
Route
  ↓
next(error)
  ↓
Central errorHandler
  ↓
HTTP error response
```

### Validation

Zod validates:

```text
Request body
Request parameters
```

Invalid requests return:

```text
400 Bad Request
```

---

# 🗃️ Database Migrations

Database changes are handled through migration scripts instead of manually creating tables.

```text
npm run migrate
       ↓
Migration scripts
       ↓
PostgreSQL
```

Test migrations can be run separately:

```text
npm run migrate:test
```

This keeps development and test database schemas consistent.

---

# 🌍 Environment Configuration

Development:

```text
.env
 ↓
Development database
```

Testing:

```text
.env.test
 ↓
Test database
```

Sensitive environment files are excluded from Git.

Production environment variables will be configured through the deployment platform rather than committed to the repository.

---

# 🧪 Testing

Testing stack:

```text
Vitest
   ↓
Supertest
   ↓
Express app
   ↓
Test PostgreSQL DB
```

Tests cover:

```text
Authentication
   ↓
Registration
Login
Validation

Tasks
   ↓
GET
POST
GET /:id
PATCH
DELETE
404 cases
Validation cases
```

The test database is cleaned before the test suite runs.

---

# 📊 Logging

The backend uses structured logging with **Pino**.

Logs include useful application information such as:

```text
Request information
Task creation
Task deletion
Errors
Response information
```

This provides more useful production logs than relying on `console.log()`.

---

# 🔄 CI — GitHub Actions

GitHub Actions automatically runs the backend test workflow on:

```text
Push
   ↓
Pull Request
```

Current CI flow:

```text
GitHub
   ↓
GitHub Actions
   ↓
Install dependencies
   ↓
Start PostgreSQL
   ↓
Run test migrations
   ↓
Run tests
   ↓
GCP authentication
```

The workflow uses a separate PostgreSQL test database.

---

# ☁️ GCP Deployment

Google Cloud Platform is being used for backend deployment.

Current setup:

```text
GitHub Actions
       ↓
Workload Identity Federation
       ↓
GCP Service Account
       ↓
Artifact Registry
       ↓
Cloud Run
```

GitHub Actions authenticates with GCP using **OIDC + Workload Identity Federation**, so no long-lived GCP service-account key is stored in GitHub.

The backend will be deployed to **Cloud Run**.

---

# 🔨 How We Built It

The project has evolved incrementally:

```text
1. Node.js + ESM
        ↓
2. Express server
        ↓
3. PostgreSQL connection
        ↓
4. Tasks CRUD API
        ↓
5. Error handling
        ↓
6. Zod validation
        ↓
7. Database migrations
        ↓
8. Environment/config handling
        ↓
9. app.js / server.js separation
        ↓
10. Vitest + Supertest
        ↓
11. Separate test database
        ↓
12. Authentication
        ↓
13. User-specific tasks
        ↓
14. Structured logging
        ↓
15. GitHub Actions CI
        ↓
16. GCP authentication
        ↓
17. Cloud deployment setup
```

The important part is that **each technology is being learned while implementing it**, rather than copying a pre-built production template.

---

# 🌿 Git Workflow

Development happens on feature branches:

```text
main
  ↑
feature branch
```

Changes are developed and tested on the feature branch before being merged into `main`.

Environment files containing secrets are never committed.

---

# 🚀 Current Status

```text
Backend API              ✅
PostgreSQL               ✅
Migrations               ✅
Validation               ✅
Authentication           ✅
Error handling           ✅
Structured logging       ✅
Automated tests          ✅
GitHub Actions CI        ✅
GCP authentication       ✅
Cloud Run deployment     🔄
Frontend deployment      🔜
```

The next step is completing the **GCP backend deployment**, followed by the separate **frontend deployment**.
