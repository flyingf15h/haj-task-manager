const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(["/tasks", "/tasks/:id"], validateUserId);
app.use(express.json()); 
app.use(express.static("public"));
app.use(cors());

// Mongo connecting testing
(async () => {
  try {
    await mongoose.connect("mongodb+srv://blohai:flyingblohai123@cluster0.tzcvd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
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
  req.userId = userId; 
  next();
};

// Mandatory is name and category
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, 
  time: { type: Number, default: 0 }, 
  description: { type: String, default: "" }, 
  userId: { type: String, required: true }, 
});

const Task = mongoose.model("Task", taskSchema);

// Fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    const tasks = await Task.find({userId}); 
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Fetch one task
app.get("/tasks/:id", async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query string
    const { id } = req.params;

    console.log(`Fetchng... Task ID: ${id} for user: ${userId}`);
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
    const { userId } = req.query;
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
    const { userId } = req.query;
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

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

