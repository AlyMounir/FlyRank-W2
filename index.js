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
  }
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
  let task = tasks.find((t) => (t.id === parseInt(req.params.id)));
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
    done: false
  };
  tasks.push(addedTask);
  res.status(201).json(req.body);
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
