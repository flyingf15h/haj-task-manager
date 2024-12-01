let userId = localStorage.getItem("userId");

if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("userId", userId);
  console.log("Generated new guest userId:", userId);
} else {
  console.log("Existing guest userId:", userId);
}

document.addEventListener("DOMContentLoaded", async () => {
  const detailsBox = document.getElementById("details"); 
  const taskNameInput = document.getElementById("task-title-input");
  const categoryInput = document.getElementById("task-category");
  const hoursInput = document.getElementById("estimated-time-hours");
  const minutesInput = document.getElementById("estimated-time-minutes");
  const descriptionInput = document.getElementById("task-description");
  const saveTaskButton = document.getElementById("save-task");
  const taskList = document.getElementById("task-list");

  // Fetch and render all tasks
  async function fetchTasks() {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(`http://localhost:5000/tasks?userId=${userId}`);
      const tasks = await response.json();
      tasks.forEach((task) => renderTask(task));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  // Render a single task
  function renderTask(task) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.setAttribute("data-id", task._id); 
    const categoryClass = task.category === "work" ? "work" : "personal";
    console.log("Rendering task:", task); 

    taskItem.innerHTML = `
      <input type="checkbox" class="task-checkbox ${categoryClass}" />
      <span class="task-name">${task.name}</span>
      <span class="task-category"> 
        <span class="category-bg ${categoryClass}"> 
          ${task.category || "No category"} 
        </span> 
      </span>
      <span class="task-time">
        ${task.time ? `${task.time.toFixed(1)} hrs` : "0.0 hrs"} 
      </span>
    `;
    taskList.appendChild(taskItem);
  }

  // Save a task
  saveTaskButton.addEventListener("click", async () => {
    const name = taskNameInput.value.trim();
    const category = categoryInput.value.trim() || "Uncategorized";
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const description = descriptionInput.value.trim() || "";
    const taskId = detailsBox.getAttribute("data-id"); 
    console.log("Fetching task details for ID:", taskId);
    const userId = localStorage.getItem("userId"); 
    console.log("Sending task with userId:", userId); 
    task.userId = userId; 

    if (!name || name.length < 2) {
      alert("Task name must be at least 2 characters long.");
      return;
    }

    const time = hours + minutes / 60;
    const task = { name, category, time, description, userId };
    if (taskId) {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
  
      if (!response.ok) throw new Error("Failed to update task.");
      
      const updatedTask = await response.json();
      
      if (updatedTask) {
        updatedTask.outerHTML = `
          <div class="task-item" data-id="${updatedTask._id}">
            <input type="checkbox" class="task-checkbox ${updatedTask.category === "work" ? "work" : "personal"}" />
            <span class="task-name">${updatedTask.name}</span>
            <span class="task-category">
              <span class="category-bg ${updatedTask.category === "work" ? "work" : "personal"}">
                ${updatedTask.category || "No category"}
              </span>
            </span>
            <span class="task-time">${updatedTask.time ? `${updatedTask.time.toFixed(1)} hrs` : "0.0 hrs"}</span>
          </div>
        `;
      }
    }
    else {
      try {
        const response = await fetch("http://localhost:5000/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        });
        const savedTask = await response.json();
        renderTask(savedTask);
        if (!response.ok) throw new Error("Failed to save task.");        
      } catch (error) {
        console.error("Error saving task:", error);
        alert("Failed to save task.");
      }
    }
    detailsBox.classList.add("task-popup-hidden"); 
    taskNameInput.value = "";
    categoryInput.value = "work";
    hoursInput.value = "";
    minutesInput.value = "";
    descriptionInput.value = "";
  });

  // Listen for clicks on task items
  document.addEventListener("click", async(e) => {
    const taskItem = e.target.closest(".task-item"); 
    if (taskItem) {
      const taskId = taskItem.getAttribute("data-id"); 
      const userId = localStorage.getItem("userId"); 
      try {
        // Fetch task details from the backend
        const response = await fetch(`http://localhost:5000/tasks/${taskId}?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch task details.");
  
        const task = await response.json();
  
        // Populate the details box
        detailsBox.setAttribute("data-id", taskId);
        taskNameInput.value = task.name;
        categoryInput.value = task.category;
        descriptionInput.value = task.description;
  
        const hours = Math.floor(task.time);
        const minutes = Math.round((task.time - hours) * 60);
        hoursInput.value = hours;
        minutesInput.value = minutes;
  
        detailsBox.classList.remove("task-popup-hidden");
      } catch (error) {
        console.error("Error fetching task details:", error);
        alert("Could not fetch task details. Please try again.");
      }
    }
  });

  await fetchTasks();
});
