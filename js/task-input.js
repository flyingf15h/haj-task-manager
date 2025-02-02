import { API_URL } from './config.js';

document.querySelectorAll('.time-input').forEach((input) => {
  input.addEventListener('input', () => {
    if (input.value.length >= 0 && input.value.length <= 2) {
      input.value = input.value.slice(0, 2); 
    }
    else {
      alert("Don't work over 24 hours...");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const taskNameInput = document.getElementById("user-input"); 
  const descriptionBox = document.getElementById("details"); 
  const deleteButton = document.getElementById("delete"); 
  const saveButton = document.getElementById("save-task");
  const taskTitleInput = document.getElementById("title-input"); 
  const detailsBox = document.querySelector(".task-details");
  const taskCategoryDropdown = document.getElementById("category");

  taskNameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && taskNameInput.value.trim() !== "") {
      descriptionBox.classList.remove("task-popup-hidden"); 
      taskTitleInput.value = taskNameInput.value;
      taskNameInput.disabled = true;
      
      // Clear fields
      document.getElementById("category").value = "work"; 
      document.getElementById("hours").value = "";
      document.getElementById("mins").value = "";
      document.getElementById("description").value = "";
      taskTitleInput.removeAttribute("data-task-id");
    }
  });

  // Border of details 
  taskCategoryDropdown.addEventListener("change", function () {
    if (taskCategoryDropdown.value === "work") {
      detailsBox.style.borderColor = "#ee5f76";
    } else if (taskCategoryDropdown.value === "personal") {
      detailsBox.style.borderColor = "#9560d4"; 
    } else {
      detailsBox.style.borderColor = "#7c7c74"; 
    }
  });
  
  deleteButton?.addEventListener("click", async function () {
    const taskTitleInput = document.getElementById("title-input");
    const taskId = taskTitleInput?.getAttribute("data-task-id");
  
    if (!taskId) {
      console.log("No task selected for deletion.");
      return;
    }
  
    try {
      // Remove from UI first then delete from server
      const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
      if (taskElement) {
        taskElement.remove();
      }
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
          taskElement.remove();
          let tasks = window.tasks || [];
          tasks = tasks.filter(task => task._id !== taskId);
          window.tasks = tasks;
        }
      }
      resetTaskDetails();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  });
  
  saveButton?.addEventListener("click", async () => {
    const taskTitleInput = document.getElementById("title-input");
    const taskId = taskTitleInput?.getAttribute("data-task-id");
    const name = taskTitleInput?.value.trim();
    const category = document.getElementById("category")?.value;
    const hours = parseInt(document.getElementById("hours")?.value || "0", 10);
    const minutes = parseInt(document.getElementById("mins")?.value || "0", 10);
    const time = hours + minutes / 60;
    const description = document.getElementById("description")?.value.trim() || "";

    if (!name || name.length < 2) {
      alert("Task name must be at least 2 characters long.");
      return;
    }
  
    const taskData = { name, category, time, description };
  
    try {
      if (taskId && taskId !== "undefined") {
        // Update existing task
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
  
        if (response.ok) {
          const updatedTask = await response.json();
          const taskElement = document.querySelector(`[data-task-id="${updatedTask._id}"]`);
          if (taskElement) {
            const nameEl = taskElement.querySelector(".task-name");
            const categoryEl = taskElement.querySelector(".category-bg");
            const timeEl = taskElement.querySelector(".task-time");
            const checkbox = taskElement.querySelector(".task-checkbox");
  
            if (nameEl) nameEl.textContent = updatedTask.name;
            if (categoryEl) {
              categoryEl.textContent = updatedTask.category;
              categoryEl.className = `category-bg ${updatedTask.category}`;
            }
            if (timeEl) {
              timeEl.textContent = updatedTask.time ? `${updatedTask.time.toFixed(1)} hrs` : "0.0 hrs";
            }
            taskElement.remove();
            if (checkbox) {
              checkbox.className = `task-checkbox ${updatedTask.category}`;
            }
          }
          // Update tasks array
          const taskIndex = window.tasks.findIndex(t => t._id === taskId);
          if (taskIndex !== -1) {
            window.tasks[taskIndex] = updatedTask;
          }
          // Render updated task
          window.renderTask(updatedTask);
        }
      } else {
        // Create new task
        const response = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
  
        if (response.ok) {
          const savedTask = await response.json();
          window.tasks.push(savedTask);
          window.renderTask(savedTask);
        }
      }
      resetTaskDetails();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  });
  
  function resetTaskDetails() {
    const descriptionBox = document.getElementById("details");
    if (descriptionBox) {
      descriptionBox.classList.add("task-popup-hidden");
    }
  
    const fields = ["title-input", "category", "hours", 
                   "mins", "description"];
    fields.forEach(id => {
      const field = document.getElementById(id);
      if (field) field.value = "";
    });

    const titleInput = document.getElementById("title-input");
    if (titleInput) titleInput.removeAttribute("data-task-id");

    const userInput = document.getElementById("user-input");
    if (userInput) {
      userInput.disabled = false;
      userInput.value = "";
    }
  }
});
