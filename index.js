// require("dotenv").config();

const cors = require("cors");

// Mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todo-react-exercice");

// Middleware
const showReq = require("./middleware/showReq");

// Express
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());

// Create a collection from a given model:
// 1. Create a schema for the collection
const taskSchema = new mongoose.Schema({
  label: String,
  isDone: Boolean,
  isArchived: Boolean,
});
// 2. Create a model upon the schema, named "Task", and assigne it to a variable "Task"
const Task = mongoose.model("Task", taskSchema);

app.get("/", async (req, res) => {
  setTimeout(async () => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }, 100);
});

app.post("/", showReq, async (req, res) => {
  const { label } = req.body;

  try {
    const newTask = new Task({
      label: label,
      isDone: false,
      isArchived: false,
    });

    await newTask.save();

    console.log("New task created", newTask);

    res.status(200).json({ message: "All good." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/", showReq, async (req, res) => {
  const { label, isDone, isArchived, id } = req.body;

  try {
    const taskToUpdate = await Task.findById(id);

    console.log("taskToUpdate is", taskToUpdate);

    isDone !== undefined && (taskToUpdate.isDone = isDone);
    isArchived !== undefined && (taskToUpdate.isArchived = isArchived);

    console.log("Task updated", taskToUpdate);

    await taskToUpdate.save();

    res.status(200).json(taskToUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.delete("/:id", showReq, async (req, res) => {
  const { id } = req.params;
  try {
    const taskToDelete = await Task.findOneAndDelete({
      _id: id,
    });

    console.log("Task deleted", taskToUpdate);

    res.status(200).json({ message: `task deleted.` });
  } catch (error) {
    res.status(500).json({ meessage: error.message });
  }
});

app.get("*", showReq, (req, res) => {
  try {
    res.status(404);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.warn("🔶 Server «Vinted» started");
});
