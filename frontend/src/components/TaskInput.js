import React, { useState } from "react";

function TaskInput({ onAddTask }) {
  const [taskName, setTaskName] = useState("");
  
  function handleTaskNameChange(event) {
    setTaskName(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      if(taskName.length <= 20 && taskName.length >= 2) {
        onAddTask(taskName); 
        setTaskName("");
      }
      else {
        alert("Task name must be at least 2 and at most 20 characters!");
        return;
      }
    }
  }

  return (
    <input
      type="text"
      id="user-input"
      value={taskName}
      onChange={handleTaskNameChange}
      onKeyDown={handleKeyDown} 
      placeholder="New task name"
      aria-label="User input"
    />
  );
}

export default TaskInput;
