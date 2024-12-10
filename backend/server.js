import express, { json } from "express";
import { connect, Schema, model } from "mongoose";
import cors from 'cors';
import path from 'path';

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");


const app = express();

app.use(json()); 
app.use(cors());

// Mongo connecting testing
(async () => {
  try {
    await connect("mongodb+srv://blohai:flyingblohai123@cluster0.tzcvd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); 
  }
})();

const validateUserId = (req, res, next) => {
  const userId = req.query.userId || req.body.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }
  console.log("Validating userId:", userId);
  req.userId = userId; 
  next();
};

app.use("/tasks", validateUserId);

// Mandatory is name and category
const taskSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, 
  time: { type: Number, default: 0 }, 
  description: { type: String, default: "" }, 
  userId: { type: String, required: true }, 
});

const Task = model("Task", taskSchema);

// API routes?

// Fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    console.log("Fetching all tasks route is triggered");
    const { userId } = req; 
    const tasks = await Task.find({userId}); 
    console.log("Tasks being sent: ", tasks); 
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Fetch one task
app.get("/tasks/:id", async (req, res) => {
  try {
    const { userId } = req; 
    console.log("Fetching one tasks route is triggered for ", req.userId);
    const { id } = req.params;

    console.log('Fetching Task ID: ${id} for user: ${userId}');
    const task = await Task.findOne({ _id: id, userId });
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task); 
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Add new task
app.post("/tasks", async (req, res) => {
  try {
    const { name, category, time, description, userId } = req.body;

    if (!name || name.length < 2 || name.length > 20) {
      return res.status(400).json({ error: "Task name must be at least 2 characters and at most 20." });
    }

    const task = new Task({ 
      name, 
      category: category || "Uncategorized", 
      time: time || 0, 
      description: description || "",
      userId
    });

    console.log("Request Body:", req.body); 
    console.log("Creating task for userId:", userId); 
    await task.save();
    
    res.status(201).json({task});
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: "Failed to create task." });
  }
});


// Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const { name, category, time, description } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { name, category, time, description },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: "Failed to update task" });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Failed to delete task" });
  }
});

const publicDir = path.resolve("public");
app.use(express.static(publicDir));

app.get("*", (req, res) => {
  console.log("Fallback route triggered for: ", req.url);
  res.sendFile(path.join(publicDir, "index.html"));
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));