import React, { useEffect, useState } from "react";
import "../styles/task-details.css";
import SaveTask from "./SaveTask.js"; 

function TaskDetails({ task, setTask, taskId, hideTaskDetails }) {
  const handleTaskChange = (field, value) => {
    setTask((prevTask) => ({
      ...prevTask,
      [field]: value,
    }));
  };

  useEffect(() => {
    // Fetch task details
    if(taskId) {
      console.log("Fetching details for task ID:", id);
    }
    else {
      console.warn("Task ID is undefined, may be new task.");
      return;
    }

    fetch(`/tasks/${taskId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch task details.");
        return res.json();
      })
      .then((data) => {
        setTask(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        setTask(null);
      });
  }, [taskId, setTask]);

  return task ? (
    <div className="task-details" id="details">
      <div className="task-content">
        <label htmlFor="task-title-input" className="task-label">Task Name:</label>
        <input
          type="text"
          id="task-title-input"
          className="task-title-input"
          value={task.name || ""}
          onChange={(e) => handleTaskChange("name", e.target.value)}
        />
        <br />

        <label htmlFor="task-category" className="task-label">Task Category:</label>
        <select
          id="task-category"
          className="category-dropdown"
          value={task.category || "work"}
          onChange={(e) => handleTaskChange("category", e.target.value)}
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>

        <div className="estimated-time">
          <label htmlFor="estimated-time-hours" className="task-label">Estimated Time:</label>
          <div className="time-input-container">
            <input
              id="estimated-time-hours"
              type="number"
              className="time-input"
              name="hours"
              value={Math.floor((task.time || 0) / 60)}
              onChange={(e) =>
                handleTaskChange("time", (parseInt(e.target.value) * 60) + (task.time % 60))
              }
              min="0"
              max="24"
              placeholder="0"
            />
            <span className="time-unit">hrs</span>
            <input
              id="estimated-time-minutes"
              type="number"
              className="time-input"
              name="minutes"
              value={(task.time || 0) % 60}
              onChange={(e) =>
                handleTaskChange("time", Math.floor(task.time / 60) * 60 + parseInt(e.target.value))
              }
              min="0"
              max="59"
              placeholder="0"
            />
            <span className="time-unit">mins</span>
          </div>
        </div>

        <br />
        <label htmlFor="task-description" className="task-label">Description:</label>
        <textarea
          id="task-description"
          rows="4"
          value={task.description || ""}
          onChange={(e) => handleTaskChange("description", e.target.value)}
          placeholder="Description"
        />

        {/* SaveTask Component */}
        <SaveTask onClick={hideTaskDetails} task={task} />
      </div>
    </div>
  ) : (
    <p>Task not found.</p>
  );
}

export default TaskDetails;
