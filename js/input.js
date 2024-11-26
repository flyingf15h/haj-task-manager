document.querySelectorAll('.time-input').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.value.length > 2) {
        input.value = input.value.slice(0, 2); 
      }
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const taskNameInput = document.getElementById("user-input"); 
    const descriptionBox = document.getElementById("details"); 
    const deleteButton = document.getElementById("delete"); 
    const taskTitleInput = document.getElementById("task-title-input"); 
  
    // Listens for enter after typing task name
    taskNameInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && taskNameInput.value.trim() !== "") {
        descriptionBox.classList.remove("task-popup-hidden"); 
        taskTitleInput.value = taskNameInput.value;
        taskNameInput.disabled = true;
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
    