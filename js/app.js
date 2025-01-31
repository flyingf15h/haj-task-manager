import { makeHappy } from './blahaj.js';
window.tasks = [];
let tasks = window.tasks;

document.addEventListener("DOMContentLoaded", async () => {
  const taskList = document.getElementById("task-list");
  
// Blahaj section 
  const heartContainer = document.createElement("div");
  heartContainer.id = "heart-bar-container";
  const heartIcon = document.createElement("div");
  heartIcon.id = "heart-icon";
  heartIcon.textContent = "❤"; 
  const heartBar = document.createElement("div");
  heartBar.id = "heart-bar";
  const heartFill = document.createElement("div");
  heartFill.id = "heart-fill";

  heartBar.appendChild(heartFill);
  heartContainer.appendChild(heartIcon);
  heartContainer.appendChild(heartBar);
  document.querySelector(".sidebar").appendChild(heartContainer);

  let heartProgress = parseInt(localStorage.getItem("heartProgress")) || 0;
  heartFill.style.width = `${heartProgress}%`;

  function updateHeartBar(increaseAmount) {
    console.log(`Updating heart bar by ${increaseAmount}`); 
    heartProgress = Math.min(100, parseInt(heartProgress) + increaseAmount);
    heartFill.style.width = `${heartProgress}%`;
    localStorage.setItem("heartProgress", heartProgress);

    if (heartProgress >= 100) {
      makeHappy(); 
      setTimeout(() => {
        heartProgress = 0;
        heartFill.style.width = "0%";
        localStorage.setItem("heartProgress", 0);
      }, 2000);
    }
  }

// Task manager section
  // Fetch and render all tasks
  async function fetchTasks() {
  try {
    const response = await fetch("http://localhost:5000/tasks");
    const fetchedTasks = await response.json();
    tasks = fetchedTasks;
    let totalHeartProgress = 0;

    tasks.forEach((task) => {
      renderTask(task);
      const taskItem = document.querySelector(`[data-task-id="${task._id}"]`);
      
      if (task.completed) {
        taskItem.classList.add("completed");
        let increaseAmount = 25 + (task.time ? 5 * task.time : 0);
        totalHeartProgress += increaseAmount;
        taskItem.querySelector(".task-checkbox").checked = true;
      }
    });

    heartFill.style.width = `${Math.min(100, totalHeartProgress)}%`;
    localStorage.setItem("heartProgress", Math.min(100, totalHeartProgress));
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:5000/tasks");
      const fetchedTasks = await response.json();
      tasks = fetchedTasks;
      let totalHeartProgress = 0;
      tasks.forEach((task) => {
        renderTask(task);
        const taskItem = document.querySelector(`[data-task-id="${task._id}"]`);
        if (task.completed) {
          taskItem.classList.add("completed");
          let increaseAmount = 25 + (task.time ? 5 * task.time : 0);
          totalHeartProgress += increaseAmount;
          taskItem.querySelector(".task-checkbox").checked = true;
        }
      });
      heartFill.style.width = `${Math.min(100, totalHeartProgress)}%`;
      localStorage.setItem("heartProgress", Math.min(100, totalHeartProgress));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }
  
  // Render a single task
  function renderTask(task) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.setAttribute("data-task-id", task._id); 
  
    const categoryClass = task.category === "work" ? "work" : "personal";
  
    taskItem.innerHTML = `
      <input type="checkbox" class="task-checkbox ${categoryClass}" data-task-id="${task._id}" />
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

    const checkbox = taskItem.querySelector(".task-checkbox");
    checkbox.addEventListener("click", async (e) => {
      e.stopPropagation();
      taskItem.classList.toggle("completed");
    
      const taskId = taskItem.getAttribute("data-task-id");
      const task = tasks.find(t => t._id === taskId);
    
      if (task) {
        task.completed = taskItem.classList.contains("completed");
    
        try {
          await fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: task.completed }),
          });
    
          let changeAmount = task.completed ? 25 : -25;
          if (task.time) {
            changeAmount += task.completed ? 5 * task.time : -5 * task.time;
          }
    
          updateHeartBar(changeAmount);
        } catch (error) {
          console.error("Error updating task completion:", error);
        }
      }
    });
    

    taskItem.addEventListener("click", () => {
        document.getElementById("title-input").setAttribute("data-task-id", task._id);
        document.getElementById("title-input").value = task.name;
        document.getElementById("category").value = task.category;
        document.getElementById("description").value = task.description;
        document.getElementById("details").classList.remove("task-popup-hidden");
        
        if (task.time) {
            const hours = Math.floor(task.time);
            const minutes = Math.round((task.time - hours) * 60);
            document.getElementById("hours").value = hours;
            document.getElementById("mins").value = minutes;
        }
    });
  }  

  document.addEventListener("click", (e) => {
    const detailsBox = document.getElementById("details");
    const taskItem = e.target.closest(".task-item");
  
    // Hide box 
    if (!taskItem && !detailsBox.contains(e.target)) {
      detailsBox.classList.add("task-popup-hidden");
      return;
    }
  
    // Show box
    if (taskItem) {
      const taskIndex = taskItem.getAttribute("task-index");
      const task = tasks[taskIndex];
      if (task) {
        document.getElementById("title-input").setAttribute("data-task-id", task._id);
        document.getElementById("title-input").value = task.name;
        document.getElementById("category").value = task.category;
        document.getElementById("description").value = task.description;
  
        const hours = Math.floor(task.time);
        const minutes = Math.round((task.time - hours) * 60);
        document.getElementById("hours").value = hours;
        document.getElementById("mins").value = minutes;
  
        detailsBox.classList.remove("task-popup-hidden");
      }
    }
  });  

  window.renderTask = renderTask;

  await fetchTasks();
});
