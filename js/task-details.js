document.addEventListener('DOMContentLoaded', () => {    
    async function loadTaskDetails(taskId) {
        try {
            const response = await fetch(`http://localhost:5000/tasks/${taskId}`);
            const task = await response.json();
            
            document.getElementById('title-input').value = task.title;
            document.getElementById('category').value = task.category;
            document.getElementById('description').value = task.description;
            
            if (task.time) {
                const hours = Math.floor(task.time);
                const minutes = Math.round((task.time - hours) * 60);
                document.getElementById('hours').value = hours;
                document.getElementById('mins').value = minutes;
            }
        } catch (error) {
            console.error('Error loading task details:', error);
        }
    }
    
    // Export if needed
    window.loadTaskDetails = loadTaskDetails;
});
  