const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task API",
      version: "1.0.0",
      description: "A simple ToDo API built with Express.js",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./index.js"], // Change this if your file isn't named index.js
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let tasks = [
  {
    id: 1,
    title: "Task 1",
    done: false,
  },
  {
    id: 2,
    title: "Task 2",
    done: true,
  },
  {
    id: 3,
    title: "Task 3",
    done: false,
  },
];
let lastId = 3;

/**
 * @swagger
 * /:
 *   get:
 *     summary: API information
 *     description: Returns basic information about the API.
 *     responses:
 *       200:
 *         description: API information returned successfully.
 */

app.get("/", (req, res) => {
  res.send("Hello World! First Server Ever!!!!");
  res.json({
    name: "ToDo api",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Returns a list of all tasks.
 *     responses:
 *       200:
 *         description: List of tasks returned successfully.
 */

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Returns a single task.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task found.
 *       404:
 *         description: Task not found.
 */
// GET :id task
app.get("/tasks/:id", (req, res) => {
  let task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Not Found" });
  }
  res.json(task);
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Adds a new task to the task list.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn Swagger
 *     responses:
 *       201:
 *         description: Task created successfully.
 *       400:
 *         description: Invalid input.
 */

// Create New Task
app.post("/tasks", (req, res) => {
  if (!req.body.title)
    return res.status(400).json({ error: "Please Enter the Task Title!!" });
  let addedTask = {
    id: ++lastId,
    title: req.body.title,
    done: false,
  };
  tasks.push(addedTask);
  res.status(201).json(req.body);
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Updates the title, done status, or both.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finish homework
 *               done:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: Task not found.
 */

// Update Task By ID
app.put("/tasks/:id", (req, res) => {
  let taskIndex = -1;

  const taskId = parseInt(req.params.id);
  taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (req.body.done !== undefined && typeof req.body.done !== "boolean") {
    return res.status(400).json({
      error: "done must be a boolean",
    });
  }

  if (req.body.title === undefined && req.body.done === undefined) {
    return res
      .status(400)
      .json({ error: "Please Enter The updated Task Title and Done!!" });
  } else if (req.body.title !== undefined && req.body.done === undefined) {
    tasks[taskIndex].title = req.body.title;
    res.status(200).json({ message: "Title Updated" });
  } else if (req.body.title === undefined && req.body.done !== undefined) {
    tasks[taskIndex].done = req.body.done;
    res.status(200).json({ message: "Task Done" });
  } else if (req.body.title !== undefined && req.body.done !== undefined) {
    tasks[taskIndex].title = req.body.title;
    tasks[taskIndex].done = req.body.done;
    res.status(200).json({ message: "Task Done & Title Updated" });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted successfully.
 *       404:
 *         description: Task not found.
 */

// Delete Task By ID
app.delete("/tasks/:id", (req, res) => {
  let taskIndex = -1;

  const taskId = parseInt(req.params.id);
  taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Checks whether the API is running.
 *     responses:
 *       200:
 *         description: API is healthy.
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
