document.addEventListener("DOMContentLoaded", async () => {
  const tasksContainer = document.querySelector(".main-content");
  const detailsBox = document.getElementById("details"); // Details box element
  const taskNameInput = document.getElementById("task-title-input");
  const categoryInput = document.getElementById("task-category");
  const hoursInput = document.getElementById("estimated-time-hours");
  const minutesInput = document.getElementById("estimated-time-minutes");
  const descriptionInput = document.getElementById("task-description");
  const saveTaskButton = document.getElementById("save-task");

  // Fetch and render all tasks
  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:5000/tasks");
      const tasks = await response.json();
      tasks.forEach((task) => renderTask(task));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  function renderTask(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task-item");

    // Task structure
    taskElement.innerHTML = `
      <span class="task-name">${task.name}</span>
      <span class="task-category">${task.category || "No category"}</span>
      <span class="task-time">${task.time ? `${task.time.toFixed(1)} hrs` : "0.0 hrs"}</span>
      <button data-id="${task._id}" class="edit-task">Edit</button>
      <button data-id="${task._id}" class="delete-task">Delete</button>
    `;

    // Append task to container
    tasksContainer.appendChild(taskElement);
  }

  // Task saving
  saveTaskButton.addEventListener("click", async () => {
    const name = taskNameInput.value.trim();
    const category = categoryInput.value.trim() || "Uncategorized";
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const description = descriptionInput.value.trim() || "";
  
    if (!name || name.length < 2) {
      alert("Task name must be at least 2 characters long.");
      return;
    }
  
    const time = hours + minutes / 60;
    const task = { name, category, time, description };
  
    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error(errorData.error || "Failed to save task.");
      }
  
      const savedTask = await response.json();
      console.log("Saved Task:", savedTask);
  
      renderTask(savedTask);
      detailsBox.classList.add("task-popup-hidden");
      taskNameInput.value = "";
      categoryInput.value = "work";
      hoursInput.value = "";
      minutesInput.value = "";
      descriptionInput.value = "";
    } catch (error) {
      console.error("Error saving task:", error);
      alert(error.message || "Failed to save task. Please try again.");
    }
  });
  

  // Fetch and display existing tasks on load
  await fetchTasks();
});
