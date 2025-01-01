require("dotenv").config();

const cors = require("cors");

// Mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

// Middleware
const showReq = require("./middleware/showReq");

// Express
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());

const Task = mongoose.model("Task", {
  label: String,
  isDone: Boolean,
  isArchived: Boolean,
});

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

    console.log("New task", newTask);

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

    console.log("Updated task", taskToUpdate);

    await taskToUpdate.save();

    res.status(200).json(taskToUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/delete", showReq, async (req, res) => {
  const { id } = req.body;
  try {
    const taskToDelete = await Task.findOneAndDelete({
      _id: id,
    });

    res.status(200).json({ message: `task deleted.` });
  } catch (error) {
    res.status(500).json({ meessage: error.message });
  }
});

app.get("*", showReq, (req, res) => {
  try {
    res
      .status(404)
      .sendFile(
        "/Users/fmorri/Developpeur/Le-Reacteur/Backend/vinted/images/peugeot_404.jpg"
      );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.warn("🔶 Server «Vinted» started");
});
