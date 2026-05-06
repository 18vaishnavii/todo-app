import { useState, useEffect } from "react";
import { FaTrash, FaCheck, FaUndo, FaEdit, FaMoon, FaSun } from "react-icons/fa";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Ask for notification permission once
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Check tasks daily for reminders
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    tasks.forEach((task) => {
      if (task.dueDate === today && !task.completed) {
        notifyTask(task);
      }
    });
  }, [tasks]);

  const notifyTask = (task) => {
    if (Notification.permission === "granted") {
      new Notification("Task Reminder", {
        body: `${task.text} is due today!`,
      });
    }
  };

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, completed: false, priority, dueDate }]);
    setInput("");
    setPriority("Medium");
    setDueDate("");
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTask = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (index) => {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText) {
      setTasks(
        tasks.map((task, i) =>
          i === index ? { ...task, text: newText } : task
        )
      );
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed" && !task.completed) return false;
    if (filter === "pending" && task.completed) return false;
    if (search && !task.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <h1 className="title">My Tasks</h1>
      <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
        <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed</button>
        <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <input
        className="search-bar"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="task-list">
        {filteredTasks.map((task, i) => (
          <li key={i} className={task.completed ? "completed" : ""}>
            <div>
              <span>{task.text}</span>
              {task.dueDate && <small className="due">Due: {task.dueDate}</small>}
              <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
            </div>
            <div className="actions">
              <button onClick={() => toggleTask(i)}>
                {task.completed ? <FaUndo /> : <FaCheck />}
              </button>
              <button onClick={() => editTask(i)}>
                <FaEdit />
              </button>
              <button onClick={() => deleteTask(i)}>
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
