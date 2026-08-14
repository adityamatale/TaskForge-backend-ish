# 🗂️ Task Manager API — Project Summary

> **Goal:** Build a real-world Node.js backend while learning JavaScript/Node/Express/PostgreSQL concepts **side by side**.
> We are intentionally building it step-by-step instead of jumping straight into advanced architecture.

---

## 🛠️ Stack

```text
Node.js
   ↓
Express
   ↓
pg (node-postgres)
   ↓
PostgreSQL 14
```

Additional tools:

* **Zod** → request validation
* **dotenv** → environment variables
* **Nodemon** → development auto-restart
* **Vitest** → testing framework
* **Supertest** → HTTP/API testing
* **Git/GitHub** → version control

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

# 📁 Current Structure

```text
task_manager/
│
├── src/
│   ├── app.js
│   ├── server.js
│   ├── db.js
│   │
│   ├── config/
│   │   └── config.js
│   │
│   ├── middleware/
│   │   └── errorHandler.js
│   │
│   ├── routes/
│   │   └── tasks.js
│   │
│   ├── validation/
│   │   └── taskSchema.js
│   │
│   ├── migrations/
│   │   └── 001_create_tasks.js
│   │
│   └── tests/
│       └── tasks.test.js
│
├── .env
├── .env.test
├── .gitignore
├── package.json
├── package-lock.json
└── vitest.config.js
```

---

# ⚙️ Application Setup

### `app.js`

Responsible for creating/configuring Express:

```text
Express
 ↓
JSON middleware
 ↓
Routes
 ↓
Error handler
```

It **does not** call `app.listen()`.

### `server.js`

Responsible only for starting the server:

```text
server.js
   ↓
app.listen()
   ↓
HTTP server
```

This separation allows tests to import `app.js` without starting a real server.

---

# 🗄️ Database

Local PostgreSQL 14.

### Development DB

```text
Database: task_manager
User:     matty
Host:     localhost
Port:     5432
```

### Test DB

```text
task_manager_test
```

Tests use the test database so they don't pollute development data.

### `db.js`

Creates a PostgreSQL connection pool using the configured `DATABASE_URL`.

```text
Application
    ↓
pg Pool
    ↓
PostgreSQL
```

---

# 📋 Tasks Table

```text
tasks
├── id
├── title
├── description
├── completed
└── created_at
```

---

# 🌐 API Endpoints

| Method | Endpoint     | Purpose       |
| ------ | ------------ | ------------- |
| GET    | `/tasks`     | Get all tasks |
| POST   | `/tasks`     | Create a task |
| GET    | `/tasks/:id` | Get one task  |
| PATCH  | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

---

# 🔄 Request Flow

For a normal request:

```text
Client
  ↓
Express
  ↓
Route
  ↓
Zod validation
  ↓
PostgreSQL
  ↓
JSON response
```

If something goes wrong:

```text
Route
  ↓
catch(error)
  ↓
next(error)
  ↓
Central errorHandler
```

### Errors

```text
ZodError
   ↓
400 Bad Request

Other / unexpected error
   ↓
500 Internal Server Error
```

> `async/await` handles asynchronous operations.
> `next(error)` passes an error to Express's centralized error middleware.

---

# ✅ Validation

Using Zod:

```text
createTaskSchema
updateTaskSchema
taskIdSchema
```

Applied to:

```text
POST   /tasks       → body
PATCH  /tasks/:id   → body
GET    /tasks/:id   → params
DELETE /tasks/:id   → params
```

For IDs we use:

```js
z.coerce.number().int().positive()
```

because URL parameters arrive as strings.

---

# 🗃️ Database Migrations

Instead of manually creating tables through `psql`, the project can create them through code.

```text
npm run migrate
       ↓
001_create_tasks.js
       ↓
PostgreSQL
       ↓
tasks table
```

We also started a migration tracking system:

```text
001_create_tasks  ✅
002_add_priority  ❌
003_add_due_date  ❌
```

so migrations can eventually be executed only once/in order.

> Migrations don't use the Express error handler because they run directly through Node, not through an HTTP request.

---

# 🔐 Environment / Config

Development:

```text
.env
 ↓
Development DB
```

Testing:

```text
.env.test
 ↓
Test DB
```

`config.js` decides which environment file to load based on:

```js
process.env.NODE_ENV
```

`vitest.config.js` sets:

```text
NODE_ENV = test
```

when Vitest runs.

---

# 🧪 Testing

### Testing stack

```text
Vitest
   ↓
Supertest
   ↓
Express app
   ↓
Test PostgreSQL DB
```

### Vitest

Provides:

```js
describe()
it()
expect()
```

* `describe()` → groups tests
* `it()` → defines one test
* `expect()` → checks the result

### Supertest

Simulates API requests:

```js
request(app).get("/tasks")
```

without manually running Postman/curl.

### Current tests

```text
GET     /tasks              ✅
POST    /tasks              ✅
POST    /tasks              invalid input
GET     /tasks/:id          ✅
GET     /tasks/:id          not found
PATCH   /tasks/:id          ✅
PATCH   /tasks/:id          invalid input
DELETE  /tasks/:id          ✅
DELETE  /tasks/:id          not found
```

### Scripts

```json
{
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "migrate": "node src/migrations/001_create_tasks.js",
  "test": "vitest --run"
}
```

`--run` means:

```text
Run tests → show results → exit
```

instead of staying in watch mode.

---

# 🔨 How We Built It — Step by Step

The project has been built in this order:

```text
1. Node.js + ESM setup
        ↓
2. Express server
        ↓
3. PostgreSQL connection
        ↓
4. Tasks CRUD API
        ↓
5. Centralized error handling
        ↓
6. Zod request validation
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
12. Test database migrations
        ↓
13. Test cleanup/isolation
        ↓
14. Logging
        ↓
15. Authentication
        ↓
16. Better API/project architecture
```

The important part is that **we're learning each concept while actually implementing it in the project**, rather than just copying a production template.

---

# 🌿 Git Workflow

Current development happens on feature branches:

```text
main
  ↑
feat/task-api
```

Changes are committed to the feature branch and then merged into `main`.

Environment files such as:

```text
.env
.env.test
```

are **not committed**.

---

# 🎯 Immediate Next Steps

According to our current plan:

### 1. Finish test database setup

Make sure:

```text
npm test
   ↓
.env.test
   ↓
task_manager_test
   ↓
migrations automatically applied
   ↓
tests run
```

### 2. Test cleanup / isolation

Make sure tests don't leave unwanted data behind.

```text
Before test
    ↓
clean test DB/state
    ↓
run tests
    ↓
cleanup
```

### 3. Logging

Introduce proper application logging instead of relying only on:

```js
console.log()
console.error()
```

We'll decide **what should be logged, where, and at what level**.

### 4. Authentication

After the core API/testing foundation is solid, add authentication and protected routes.

### 5. Production-style API architecture

Then improve things like:

```text
Controllers
Services
Routes
Validation
Error handling
Database layer
Logging
Authentication
```

without over-engineering the project too early.
