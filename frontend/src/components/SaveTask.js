import React, { useState } from "react";

function SaveTask({ tasks, setTasks, hideTaskDetails }) {
  const [task, setTask] = useState({
    id: null, 
    name: "",
    category: "Uncategorized",
    time: 0,
    description: "",
  });

  async function handleSave() {
    if (!task.name.trim()) {
      alert("Task name cannot be empty!");
      return;
    }

    try {
      const response = await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, userId: localStorage.getItem("userId") }),
      });

      if (!response.ok) throw new Error("Failed to save task.");
      
      console.log("Task saved successfully");
      alert("Task saved successfully!");
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task. Please try again later.");
    }
    onClose(); 
  }

  function handleDelete() {
    const existingTask = tasks.find((t) => t.id === task.id);

    if (existingTask) {
      setTasks(tasks.filter((t) => t.id !== task.id));
      alert("Task deleted successfully!");
    } else {
      setTask({
        id: null,
        name: "",
        category: "Uncategorized",
        time: 0,
        description: "",
      });
      hideTaskDetails();
      alert("New task details cleared!");
    }
    onClose(); 
  }

  return (
    <div>
      <button id="save-task" onClick={handleSave}>Save Task</button>
      <button id="delete" onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default SaveTask;