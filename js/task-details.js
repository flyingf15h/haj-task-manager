function TaskDetails({ match }) {
    const { id } = match.params; // Get task ID from route
    const [task, setTask] = useState(null);
  
    useEffect(() => {
      // Fetch task details from server or state
      fetch(`/api/tasks/${id}`)
        .then((res) => res.json())
        .then((data) => setTask(data));
    }, [id]);
  
    const handleSave = () => {
      // Save task changes
      console.log("Save task", task);
    };
  
    const handleDelete = () => {
      // Delete the task
      console.log("Delete task", id);
    };
  
    return task ? (
      <div style={{ fontFamily: "'Roboto Mono', monospace" }}>
        <h1>Edit Task</h1>
        <input
          type="text"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    ) : (
      <p>Loading...</p>
    );
  }