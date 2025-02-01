const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
console.log("MONGO_URI:", process.env.MONGO_URI); 

const app = express();

app.use(express.json()); 
app.use(cors());
const mongoURI = process.env.MONGO_URI;
// Mongo connecting testing
(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing");
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error: ", error.message);
    process.exit(1);
  }
})();

// Mandatory is name and category
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, 
  time: { type: Number, default: 0 }, 
  description: { type: String, default: "" }, 
});

const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add new task
app.post("/tasks", async (req, res) => {
  try {
    const { name, category, time, description } = req.body;

    if (!name || name.length < 2) {
      return res.status(400).json({ error: "Task name is required and must be at least 2 characters." });
    }

    const newTask = new Task({ 
      name, 
      category: category || "Uncategorized", 
      time: time || 0, 
      description: description || "" 
    });

    await newTask.save();

    res.status(201).json({
      name: newTask.name,
      category: newTask.category,
      time: newTask.time,
      description: newTask.description,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: "Failed to create task." });
  }
});


// Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, time, description } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { name, category, time, description },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: "Failed to update task" });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Failed to delete task" });
  }
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

