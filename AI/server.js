/**
 * =============================================================
 *  TO-DO LIST API  —  Learning Project
 * =============================================================
 *  Stack        : Node.js + Express
 *  Storage      : In-memory array (data is lost when the server
 *                 restarts — there is NO database here on purpose,
 *                 since this is a learning project).
 *  Data format  : JSON (both request bodies and responses)
 *  Auth         : None (this is meant to run on localhost only)
 *
 *  Each task looks like this:
 *  {
 *    "id":    1,        // Integer, auto-incremented by the server
 *    "title": "Buy milk", // String, given by the user
 *    "state": false      // Boolean -> false = "Not Done", true = "Done"
 *  }
 * =============================================================
 */

const express = require("express");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;

// This built-in middleware lets Express automatically parse
// incoming JSON request bodies into a normal JS object (req.body).
app.use(express.json());

// -------------------------------------------------------------
//  "DATABASE" (in-memory)
// -------------------------------------------------------------
// Since this is a learning project, we just keep everything in
// a plain JavaScript array that lives in the server's memory.
let tasks = [
  { id: 1, title: "Learn Express basics", state: true },
  { id: 2, title: "Build a REST API", state: false },
  { id: 3, title: "Write API documentation", state: false },
];

// This counter is used to generate a new, unique ID every time
// a task is created. It only ever goes up, even if tasks are
// deleted later, so IDs are never re-used/duplicated.
// It starts at 4 here because ids 1-3 are already taken by the
// pre-inserted sample tasks above.
let nextId = 4;

// -------------------------------------------------------------
//  SMALL HELPER FUNCTIONS
// -------------------------------------------------------------

/**
 * Finds the index of a task inside the `tasks` array by its ID.
 * Returns -1 if no task with that ID exists.
 */
function findTaskIndexById(id) {
  return tasks.findIndex((task) => task.id === id);
}

/**
 * Checks whether a value is a "real" non-empty string.
 * We use this to validate the `title` field.
 */
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Express middleware: makes sure the `:id` in the URL is a
 * valid positive integer (e.g. /tasks/abc should be rejected
 * with a clear error instead of crashing or behaving oddly).
 * If valid, the parsed integer is stored on req.taskId for the
 * next handler to use.
 */
function validateIdParam(req, res, next) {
  const rawId = req.params.id;

  // Number() would accept things like "1.5" or " 3 ", so we
  // specifically check against a strict "digits only" pattern.
  if (!/^\d+$/.test(rawId)) {
    return res.status(400).json({
      error: "Bad Request",
      message: `The id "${rawId}" is invalid. It must be a positive integer.`,
    });
  }

  req.taskId = parseInt(rawId, 10);
  next();
}

// =============================================================
//  ROUTES
// =============================================================

/**
 * 0) GET /
 *    A friendly welcome route for when someone visits the server's
 *    base URL (http://localhost:3000) with no path/parameters at all.
 *    Without this, that request would just fall through to the
 *    404 "Not Found" handler, which isn't a great first impression.
 */
app.get("/", (req, res) => {
  res.send("Hello World! 👋 Welcome to the To-Do List API.");
  res.status(200).json({
    name: "AI Created To-Do API",
    version: "1.0",
    message: "Hello World! 👋 Welcome to the To-Do List API.",
    docs: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      "GET /tasks": "Get all tasks (optional ?state=done|notdone filter)",
      "GET /tasks/:id": "Get a single task by its id",
      "POST /tasks": "Create a new task (body: { title })",
      "PUT /tasks/:id": "Update a task's title and/or state",
      "DELETE /tasks/:id": "Delete a task by its id",
    },
  });
});

/**
 * 1) GET /tasks
 *    Returns all tasks.
 *    Optional query filter: ?state=done  or  ?state=notdone
 *    Example: GET /tasks?state=done
 */
app.get("/tasks", (req, res) => {
  const { state } = req.query;

  // If no filter was given, just return everything.
  if (state === undefined) {
    return res.status(200).json(tasks);
  }

  const normalizedState = String(state).toLowerCase();

  if (normalizedState === "done") {
    const doneTasks = tasks.filter((task) => task.state === true);
    return res.status(200).json(doneTasks);
  }

  if (normalizedState === "notdone") {
    const notDoneTasks = tasks.filter((task) => task.state === false);
    return res.status(200).json(notDoneTasks);
  }

  // If the state filter is anything other than "done"/"notdone",
  // it's a bad request, since we don't know how to filter by it.
  return res.status(400).json({
    error: "Bad Request",
    message: 'The "state" query parameter must be either "done" or "notdone".',
  });
});

/**
 * 2) GET /tasks/:id
 *    Returns a single task by its ID.
 */
app.get("/tasks/:id", validateIdParam, (req, res) => {
  const index = findTaskIndexById(req.taskId);

  if (index === -1) {
    return res.status(404).json({
      error: "Not Found",
      message: `No task found with id ${req.taskId}.`,
    });
  }

  res.status(200).json(tasks[index]);
});

/**
 * 3) POST /tasks
 *    Creates a new task.
 *    Body required:  { "title": "Some text" }
 *    The new task's id is generated automatically, and its
 *    state always starts as false ("Not Done").
 */
app.post("/tasks", (req, res) => {
  // req.body might be undefined/empty if no JSON was sent at all,
  // or if the Content-Type header wasn't set to application/json.
  const body = req.body || {};
  const { title } = body;

  if (!isNonEmptyString(title)) {
    return res.status(400).json({
      error: "Bad Request",
      message: 'A non-empty "title" (string) field is required in the request body.',
    });
  }

  const newTask = {
    id: nextId,
    title: title.trim(),
    state: false,
  };

  nextId += 1;
  tasks.push(newTask);

  // 201 Created is the correct status code for a successful POST
  // that results in a new resource being created.
  res.status(201).json(newTask);
});

/**
 * 4) PUT /tasks/:id
 *    Edits an existing task's title and/or state.
 *    Body can include either or both:
 *      { "title": "New title" }
 *      { "state": true }
 *    At least one of the two fields must be provided.
 */
app.put("/tasks/:id", validateIdParam, (req, res) => {
  const index = findTaskIndexById(req.taskId);

  if (index === -1) {
    return res.status(404).json({
      error: "Not Found",
      message: `No task found with id ${req.taskId}.`,
    });
  }

  const body = req.body || {};
  const { title, state } = body;

  const titleProvided = title !== undefined;
  const stateProvided = state !== undefined;

  // The user must send at least one of the two editable fields.
  if (!titleProvided && !stateProvided) {
    return res.status(400).json({
      error: "Bad Request",
      message: 'Provide at least one field to update: "title" (string) and/or "state" (boolean).',
    });
  }

  // Validate "title" only if it was actually sent.
  if (titleProvided && !isNonEmptyString(title)) {
    return res.status(400).json({
      error: "Bad Request",
      message: 'The "title" field must be a non-empty string.',
    });
  }

  // Validate "state" only if it was actually sent.
  if (stateProvided && typeof state !== "boolean") {
    return res.status(400).json({
      error: "Bad Request",
      message: 'The "state" field must be a boolean (true or false).',
    });
  }

  // All good — apply the updates.
  if (titleProvided) {
    tasks[index].title = title.trim();
  }
  if (stateProvided) {
    tasks[index].state = state;
  }

  res.status(200).json(tasks[index]);
});

/**
 * 5) DELETE /tasks/:id
 *    Deletes a task by its ID.
 */
app.delete("/tasks/:id", validateIdParam, (req, res) => {
  const index = findTaskIndexById(req.taskId);

  if (index === -1) {
    return res.status(404).json({
      error: "Not Found",
      message: `No task found with id ${req.taskId}.`,
    });
  }

  const [deletedTask] = tasks.splice(index, 1);

  res.status(200).json({
    message: "Task deleted successfully.",
    task: deletedTask,
  });
});

// =============================================================
//  SWAGGER UI  (interactive API documentation)
//  Available at: http://localhost:3000/api-docs
// =============================================================
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "AI Created To-Do API",
    version: "1.0",
    description:
      "A simple in-memory To-Do List API built with Express, for learning purposes.",
  },
  servers: [{ url: `http://localhost:${PORT}` }],
  paths: {
    "/tasks": {
      get: {
        summary: "Get all tasks (optionally filtered by state)",
        parameters: [
          {
            name: "state",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["done", "notdone"] },
            description: 'Filter tasks: "done" or "notdone".',
          },
        ],
        responses: {
          200: { description: "A list of tasks." },
          400: { description: "Invalid state filter." },
        },
      },
      post: {
        summary: "Create a new task (state starts as false)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: { title: { type: "string", example: "Buy milk" } },
              },
            },
          },
        },
        responses: {
          201: { description: "Task created." },
          400: { description: "Missing or invalid title." },
        },
      },
    },
    "/tasks/{id}": {
      get: {
        summary: "Get a single task by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "The requested task." },
          400: { description: "Invalid id." },
          404: { description: "Task not found." },
        },
      },
      put: {
        summary: "Update a task's title and/or state",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Buy almond milk" },
                  state: { type: "boolean", example: true },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Task updated." },
          400: { description: "Invalid id or body." },
          404: { description: "Task not found." },
        },
      },
      delete: {
        summary: "Delete a task by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Task deleted." },
          400: { description: "Invalid id." },
          404: { description: "Task not found." },
        },
      },
    },
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// -------------------------------------------------------------
//  Catch-all for unknown routes (helps beginners see a clear
//  error instead of an unhelpful default HTML 404 page).
//  IMPORTANT: this must be registered AFTER every real route
//  (including Swagger UI above), otherwise it would intercept
//  those requests before they ever reach the real handler.
// -------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} does not exist.`,
  });
});

// -------------------------------------------------------------
//  Generic error handler (catches unexpected errors, e.g. if the
//  request body is not valid JSON at all). This must be the
//  LAST app.use() call — Express recognizes it as an error
//  handler because it takes 4 arguments (err, req, res, next).
// -------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is not valid JSON.",
    });
  }

  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong on the server.",
  });
});

// -------------------------------------------------------------
//  START THE SERVER
// -------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ To-Do API is running at http://localhost:${PORT}`);
  console.log(`📚 Swagger UI docs at   http://localhost:${PORT}/api-docs`);
});
