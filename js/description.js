// Elements
const taskModal = document.getElementById("task-modal");
const saveTaskButton = document.getElementById("save-task");
const deleteButton = document.getElementById("delete");

// Function to open the modal
function openTaskPopup() {
  taskModal.classList.remove("hidden");
}

// Function to close the modal
function closeTaskPopup() {
  taskModal.classList.add("hidden");
}

// Example usage: open popup on some trigger
document.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    openTaskPopup();
  }
});

// Add functionality to buttons
saveTaskButton.addEventListener("click", () => {
  alert("Task saved!");
  closeTaskPopup();
});

deleteButton.addEventListener("click", () => {
  alert("Task deleted!");
  closeTaskPopup();
});