const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

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

app.get("/", (req, res) => {
  res.send("Hello World! First Server Ever!!!!");
  res.json({
    name: "ToDo api",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// GET :id task
app.get("/tasks/:id", (req, res) => {
  let task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Not Found" });
  }
  res.json(task);
});

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

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
