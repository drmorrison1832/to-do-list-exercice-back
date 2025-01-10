require("dotenv").config();

// Mongoose
const mongoose = require("mongoose");
process.env.MONGODB_URI
  ? mongoose.connect(process.env.MONGODB_URI)
  : mongoose.connect("mongodb://localhost:27017/todo-react-exercice");

// Middleware
const showReq = require("./middleware/showReq");

// Express
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Schema + model
const taskSchema = new mongoose.Schema({
  label: String,
  isDone: Boolean,
  isArchived: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/", async (req, res) => {
  console.log("Retrieving tasks...");

  try {
    const tasks = await Task.find();
    console.log("Tasks retrieved:\n", tasks);
    res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/", async (req, res) => {
  console.log("Creating new task...");

  const { label } = req.body;

  const newTask = new Task({
    label: label || "untitled task",
    isDone: false,
    isArchived: false,
  });

  try {
    await newTask.save();
    console.log("new task created:", newTask);

    res.status(200).json({ message: "All good." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/", async (req, res) => {
  console.log("Updating task", req.body.id);

  const { label, isDone, isArchived, id } = req.body;

  try {
    const taskToUpdate = await Task.findById(id);

    isDone !== undefined && (taskToUpdate.isDone = isDone);
    isArchived !== undefined && (taskToUpdate.isArchived = isArchived);

    await taskToUpdate.save();

    res.status(200).json(taskToUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.delete("/:id", showReq, async (req, res) => {
  console.log("Task Deleting task...", req.params.id);

  const { id } = req.params;

  try {
    const taskToDelete = await Task.findOneAndDelete({
      _id: id,
    });

    res.status(200).json({ message: `Task deleted.` });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ meessage: error.message });
  }
});

app.get("*", showReq, (req, res) => {
  console.log("Default route.");

  try {
    res.status(404);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.warn("🔶 Server started");
});
