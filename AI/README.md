# 📝 To-Do List API (Learning Project)

A simple **REST API** for managing a to-do list, built with **Node.js** and **Express**.
This is a beginner-friendly **learning project** — everything lives in a single
file (`server.js`) so it's easy to read from top to bottom.

> ⚠️ **Note:** There is no database. All tasks are stored **in memory** (a plain
> JavaScript array), which means **all data is lost every time the server restarts**.
> There is also no authentication/login — this project is meant to be run on
> `localhost` for learning purposes only, not deployed publicly as-is.

---

## 📦 Tech Stack

| Layer         | Technology              |
| ------------- | ----------------------- |
| Runtime       | Node.js                 |
| Framework     | Express                 |
| Data format   | JSON                    |
| Storage       | In-memory array (no DB) |
| API docs / UI | Swagger UI              |

---

## 📁 Project Structure

```
todo-api/
├── server.js        # The entire application (routes, validation, Swagger setup)
├── package.json      # Project metadata & dependencies
└── README.md         # You are here
```

Everything — the server setup, the routes, the validation logic, and the
Swagger documentation — is written in **one file**, `server.js`, with comments
explaining each part.

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) installed (v16 or newer recommended)

### 2. Install dependencies

```bash
npm install
```

### 3. Run the server

```bash
npm start
```

You should see:

```
✅ To-Do API is running at http://localhost:3000
📚 Swagger UI docs at   http://localhost:3000/api-docs
```

### 4. Try it out

Open your browser at **http://localhost:3000/api-docs** to explore and test
every endpoint interactively via Swagger UI — no need for Postman or curl.

---

## 📌 Task Model

Every task has exactly three fields:

| Field   | Type    | Description                               |
| ------- | ------- | ----------------------------------------- |
| `id`    | Integer | Auto-generated, unique, auto-incrementing |
| `title` | String  | The text of the task                      |
| `state` | Boolean | `false` = Not Done, `true` = Done         |

Example task:

```json
{
  "id": 1,
  "title": "Buy milk",
  "state": false
}
```

---

## 🔌 API Endpoints

### Get all tasks

```
GET /tasks
```

Returns an array of all tasks.

**Optional filter** — get only "Done" or "Not Done" tasks:

```
GET /tasks?state=done
GET /tasks?state=notdone
```

---

### Get a single task

```
GET /tasks/:id
```

Returns the task with the matching `id`.

| Status | Meaning                               |
| ------ | ------------------------------------- |
| 200    | Task found and returned               |
| 400    | `:id` is not a valid positive integer |
| 404    | No task exists with that `id`         |

---

### Create a new task

```
POST /tasks
Content-Type: application/json

{
  "title": "Buy milk"
}
```

- `title` is required and must be a non-empty string.
- The new task's `state` always starts as `false`.
- The `id` is generated automatically by the server.

| Status | Meaning                                    |
| ------ | ------------------------------------------ |
| 201    | Task created successfully                  |
| 400    | `title` is missing, empty, or not a string |

---

### Update a task (title and/or state)

```
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Buy almond milk",
  "state": true
}
```

- You can send `title` only, `state` only, or both — but at least **one** of
  them must be present.
- `title`, if sent, must be a non-empty string.
- `state`, if sent, must be a boolean (`true`/`false`).

| Status | Meaning                                        |
| ------ | ---------------------------------------------- |
| 200    | Task updated successfully                      |
| 400    | Invalid `:id`, empty body, or wrong field type |
| 404    | No task exists with that `id`                  |

---

### Delete a task

```
DELETE /tasks/:id
```

| Status | Meaning                               |
| ------ | ------------------------------------- |
| 200    | Task deleted successfully             |
| 400    | `:id` is not a valid positive integer |
| 404    | No task exists with that `id`         |

---

## ❗ Error Response Format

Every error follows the same simple shape, so it's predictable and easy to
handle on the client side:

```json
{
  "error": "Bad Request",
  "message": "A non-empty \"title\" (string) field is required in the request body."
}
```

---

## 🧪 Quick Manual Test (curl)

```bash
# Create a task
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\": \"Learn Express\"}"

# Get all tasks
curl http://localhost:3000/tasks

# Mark task 1 as done
curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"state\": true}"

# Mark task 1 as not done
curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"state\": false}"

# Get only done tasks
curl "http://localhost:3000/tasks?state=done"

# Get only not done tasks
curl "http://localhost:3000/tasks?state=notdone"

# Delete task 1
curl -X DELETE http://localhost:3000/tasks/1
```

---

## 📚 Why no database / no auth?

This project exists purely to practice:

- Building a REST API with Express
- Structuring routes for GET / POST / PUT / DELETE
- Validating request data and returning correct HTTP status codes
- Documenting an API with Swagger UI

Adding a real database or authentication would add extra complexity that
isn't the point of this exercise — but it would be a great "next step" to
try after this project!

---

## 📄 License

MIT — feel free to use this project for learning and practice.
