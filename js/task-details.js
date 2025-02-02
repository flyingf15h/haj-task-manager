import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {    
    async function loadTaskDetails(taskId) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`);
            const task = await response.json();
            
            document.getElementById('title-input').value = task.name;
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
  