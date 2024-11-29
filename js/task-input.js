document.querySelectorAll('.time-input').forEach((input) => {
  input.addEventListener('input', () => {
    if (input.value.length >= 2 && input.value.length < 20) {
      input.value = input.value.slice(0, 2); 
    }
    else {
      alert("Task name must be at least 2 characters and at most 20!");
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const taskNameInput = document.getElementById("user-input"); 
  const descriptionBox = document.getElementById("details"); 
  const deleteButton = document.getElementById("delete"); 
  const taskTitleInput = document.getElementById("task-title-input"); 
  const taskDetailsBox = document.querySelector(".task-details");
  const taskCategoryDropdown = document.getElementById("task-category");


  // Listens for enter after typing task name
  taskNameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && taskNameInput.value.trim() !== "") {
      descriptionBox.classList.remove("task-popup-hidden"); 
      taskTitleInput.value = taskNameInput.value;
      taskNameInput.disabled = true;
    }
  });

  // Border of details box
  taskCategoryDropdown.addEventListener("change", function () {
    if (taskCategoryDropdown.value === "work") {
      taskDetailsBox.style.borderColor = "#ee5f76";
    } else if (taskCategoryDropdown.value === "personal") {
      taskDetailsBox.style.borderColor = "#9560d4"; 
    } else {
      taskDetailsBox.style.borderColor = "#7c7c74"; 
    }
  });

  // Hide for delete
  deleteButton.addEventListener("click", function () {
    descriptionBox.classList.add("task-popup-hidden"); 

    document.querySelectorAll("#details input, #details textarea").forEach((field) => {
      field.value = "";
    });

    taskNameInput.disabled = false; 
    taskNameInput.value = ""; 
});
});
  
// Save task listener
document.getElementById("save-task").addEventListener("click", async () => {
  const name = document.getElementById("task-title-input").value;
  const category = document.getElementById("task-category").value;
  const hours = parseInt(document.getElementById("estimated-time-hours").value || "0", 10);
  const minutes = parseInt(document.getElementById("estimated-time-minutes").value || "0", 10);
  const time = hours + minutes / 60;
  const description = document.getElementById("task-description").value;
  let taskIndex;
  // find a way for it to detect the taskItem
  
  if (taskItem) { taskIndex = taskItem.getAttribute("task-index"); }
  else { taskindex = "" } 

  if(taskIndex != "") {
    // update the information of the pre-existing task if it
  }
  else {
    const newTask = { name, category, time, description };

    const response = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const savedTask = await response.json();
      renderTask(savedTask); 
    }
  }
});

