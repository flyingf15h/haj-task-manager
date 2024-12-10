import React, { useState } from "react";
import TaskInput from "./TaskInput.js";
import TaskDetails from "./TaskDetails.js";

function TaskManager() {
    const [tasks, setTasks] = useState([]); 
    const [currentTask, setCurrentTask] = useState(null); // Task details
    const [currentTaskId, setCurrentTaskId] = useState(null); // Task ID for editing
  
    const handleAddTask = async (taskName) => {
        const newTask = {
            name: taskName,
            category: "Uncategorized",
            time: 0,
            description: "",
            userId: localStorage.getItem("userId"), 
        };
      
        const response = await fetch("http://localhost:5000/tasks", { // or /tasks directly
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });
  
        if (!response.ok) {
            alert("Error creating task");
            return;
        }
        
        const savedTask = await response.json(); 
        setTasks((prevTasks) => [...prevTasks, savedTask]);
        setCurrentTask(savedTask);
        setCurrentTaskId(null);

        console.log("current task is: ", currentTask);
    };
  
    const handleEditTask = (taskId) => {
      setCurrentTask(null); 
      setCurrentTaskId(taskId); 
    };
  
    const hideTaskDetails = () => {
      setCurrentTask(null);
      setCurrentTaskId(null);
    };

  return (
    <div>
      <TaskInput onAddTask={handleAddTask} />
      {(currentTask || currentTaskId) && (
        <TaskDetails
          task={currentTask}
          setTask={setCurrentTask}
          taskId={currentTaskId}
          hideTaskDetails={hideTaskDetails}
        />
      )}

    </div>
  );
}

export default TaskManager;
