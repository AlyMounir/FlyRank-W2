# 📝 To-Do List API (Learning Project)

A simple **REST API** for managing a to-do list, built with **Node.js** and **Express**.
This is a beginner-friendly **learning project** — everything lives in a single
file (`server.js`) so it's easy to read from top to bottom.

> ⚠️ **Note:** There is no database. All tasks are stored **in memory** (a plain
> JavaScript array), which means **all data is lost every time the server restarts**.
> There is also no authentication/login — this project is meant to be run on
> `localhost` for learning purposes only, not deployed publicly as-is.

---

## AI Prompt
So I am creating a project that handles my To-Do list 
It saves the task by its title (String) and State (Bool) with an identifier (Int, auto-incrementing) 
It should be running on Node.js + Express as a Runtime with JavaScript as a language 
It is a learning project, not a real project, so it won't include a database; it's gonna be In-Memory arrays, with app. type JSON  
The functions I want to have in the file or the server are: 
1. GET all Tasks 
2. Get by ID 
3. POST  
    a. new task just by ID; its state set to False 
4. PUT  
    a. edit the title  
    b. edit the state 
5. Delete 
add 3 pre-inserted tasks
handle the empty parameters on the localhost by sending a hello world message
add a version name by 1.0 by the name "AI Created To-Do API" and a valid Endpoints
Make sure that all the data that the user will enter satisfies the data type needed and that the data that enters is actually the needed data and nothing is missing, and if so, handle the error gracefully.  
Make sure that the response code of the server is correct  
Handle the Bad Requests and write the correct error message  
Since there is no login, this is a localhost thing, so no Authentication and Authorization  
Make it a single-file project 
Add UI: Swagger UI 
Add some comments around the code that describe it
Write a ReadMe file so when I post it on GitHub it ia accessable It
Add some filters so I could only GET the (Not Done) or (Done) tasks
Make it for Beginner-level
and write a Full README File telling everything



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

## Swagger UI
![Swagger UI AI](../screenshots/swagger-ui-AI.png)


## 📄 License

MIT — feel free to use this project for learning and practice.
