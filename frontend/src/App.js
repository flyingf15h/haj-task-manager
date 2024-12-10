import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import TaskDetails from './components/TaskDetails.js'; 
import TaskList from './components/TaskList.js';
import TaskInput from './components/TaskInput.js';
import SaveTask from './components/SaveTask.js';
import NewUser from './components/NewUser.js';
import DisplayDate from './components/DisplayDate.js';
import TaskManager from "./components/TaskManager.js";

function App() {
  const [taskName, setTaskName] = useState("");
  const [selectedTask, setSelectedTask] = useState(null); 

  const addTask = (task) => {
    console.log("Task Name Added:", task);
    setSelectedTask(task); 
    setTaskName(task); 
  };

  return (
    <Router>
      <div className="container">
        <div className="sidebar">
          <div className="text">Reminder to drink water</div>
        </div>
        <NewUser />

        <div className="main-content">
          <div id="display-date">
            <DisplayDate />
          </div>
          <hr />

          <TaskManager />

          <Routes>
            { /* <Route path="/tasks/:taskName" element={<TaskDetails taskName={taskName} />} /> */}
            <Route path="/tasks/:id" element={<TaskDetails taskName={taskName}/>} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/" element={<TaskList />} />
            <Route path="/input" element={<TaskInput />} />
            <Route path="/save-task" element={<SaveTask />} />
            <Route path="/new-user" element={<NewUser />} />
            <Route path="/display-date" element={<DisplayDate />} />
          </Routes>

          {/* <TaskList /> */}
          <TaskList onClose={() => setSelectedTask(null)} />

        </div>
      </div>
    </Router>
  );
}

export default App;
