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
