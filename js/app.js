let tasks = [];

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
    try {
      const response = await fetch("http://localhost:5000/tasks");
      const fetchedTasks = await response.json();
      tasks = fetchedTasks;
      tasks.forEach((task, index) => renderTask(task, index));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  // Render a single task
  function renderTask(task, index) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.setAttribute("task-index", index);
    const categoryClass = task.category === "work" ? "work" : "personal";

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

  // Save a new task
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Failed to save task.");

      const savedTask = await response.json();
      tasks.push(savedTask);
      renderTask(savedTask, tasks.length - 1);
      detailsBox.classList.add("task-popup-hidden"); 
      taskNameInput.value = "";
      categoryInput.value = "work";
      hoursInput.value = "";
      minutesInput.value = "";
      descriptionInput.value = "";
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task.");
    }
  });

  // Listen for clicks on task items
  document.addEventListener("click", (e) => {
    const taskItem = e.target.closest(".task-item"); 
    if (taskItem) {
      const taskIndex = taskItem.getAttribute("task-index"); 
      const task = tasks[taskIndex]; 

      if (task) {
        taskNameInput.value = task.name;
        categoryInput.value = task.category;
        descriptionInput.value = task.description;

        const hours = Math.floor(task.time);
        const minutes = Math.round((task.time - hours) * 60);
        hoursInput.value = hours;
        minutesInput.value = minutes;

        detailsBox.classList.remove("task-popup-hidden");
      }
    }
  });

  await fetchTasks();
});
