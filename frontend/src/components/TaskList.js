import React, { useEffect, useState } from "react";
import '../styles/task-list.css';  

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found in localStorage.");
        return;
      }
      console.log("userId retrieved from localStorage:", userId);

      try {
        const response = await fetch(`http://localhost:5000/tasks?userId=${userId}`, {
          headers: { 
            'Accept': 'application/json' 
          }
        });

        if (!response.ok) throw new Error("Failed to fetch tasks.");

        const tasks = await response.json();
        setTasks(tasks);
      } catch (error) {
        console.error("error fetching tasks: ", error);
      }
    }
    fetchTasks();
  }, []);

  return (
    <div id="task-list" className="task-list">
       {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} className="task-item">
            <h3>{task.name}</h3>
            <p>{task.description || "No description available."}</p>
            <span>Category: {task.category}</span>
          </div>
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default TaskList;
