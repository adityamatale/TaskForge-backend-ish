import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import Register from "./components/Register";

import {
    login,
    register,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from "./services/api";

function App() {
    // const [user, setUser] = useState(null);
    const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem("user");
  
      return savedUser
          ? JSON.parse(savedUser)
          : null;
    });
    const [showRegister, setShowRegister] = useState(false);
    const [name, setName] = useState("");

    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Edit task
    const handleEditTask = (task) => {
        setEditingTask(task);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
    };

    // Save edit
    const handleSaveEdit = async () => {
        if (!editTitle.trim()) {
            alert("Task title is required");
            return;
        }
    
        try {
            const data = await updateTask(
                token,
                editingTask.id,
                {
                    title: editTitle,
                    description: editDescription,
                }
            );
    
            if (data.message && !data.id) {
                alert(data.message);
                return;
            }
    
            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === editingTask.id
                        ? {
                              ...task,
                              title: editTitle,
                              description: editDescription,
                          }
                        : task
                )
            );
    
            setEditingTask(null);
            setEditTitle("");
            setEditDescription("");
    
        } catch (error) {
            console.error("Failed to update task:", error);
            alert("Failed to update task");
        }
    };

    // Register
    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert("Please fill in all fields");
            return;
        }
    
        try {
            const response = await register(
                name,
                email,
                password
            );
    
            if (!response.ok) {
                alert(response.data.message || "Registration failed");
                return;
            }
    
            alert("Registration successful. Please login.");
    
            setName("");
            setEmail("");
            setPassword("");
            setShowRegister(false);
    
        } catch (error) {
            console.error(error);
            alert("Unable to connect to server");
        }
    };

    // Login
    const handleLogin = async () => {
        try {
            const data = await login(email, password);

            if (!data.token) {
                alert(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

        } catch (error) {
            console.error(error);
            alert("Unable to connect to server");
        }
    };

    // Fetch tasks
    const loadTasks = async (jwtToken) => {
        try {
            setLoading(true);
            setError("");

            const data = await getTasks(jwtToken);

            if (!Array.isArray(data)) {
                setError(data.message || "Failed to load tasks");
                return;
            }

            setTasks(data);

        } catch (error) {
            console.error(error);
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    // Create task
    const handleCreateTask = async () => {
        if (!title.trim()) {
            alert("Task title is required");
            return;
        }

        try {
            const data = await createTask(
                token,
                title,
                description
            );

            if (data.message && !data.id) {
                alert(data.message);
                return;
            }

            setTitle("");
            setDescription("");

            loadTasks(token);

        } catch (error) {
            console.error(error);
            alert("Failed to create task");
        }
    };

    // Toggle completed
    const handleToggleTask = async (task) => {
        try {
            const data = await updateTask(
                token,
                task.id,
                {
                    completed: !task.completed,
                }
            );
    
            if (data.message && !data.id) {
                alert(data.message);
                return;
            }
    
            setTasks((currentTasks) =>
                currentTasks.map((currentTask) =>
                    currentTask.id === task.id
                        ? { ...currentTask, completed: !currentTask.completed }
                        : currentTask
                )
            );
    
        } catch (error) {
            console.error("Failed to update task:", error);
            alert("Failed to update task");
        }
    };

    // Delete task
    const handleDeleteTask = async (taskId) => {
        try {
            const response = await deleteTask(token, taskId);
    
            if (!response.ok) {
                alert(response.data.message || "Failed to delete task");
                return;
            }
    
            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== taskId)
            );
    
        } catch (error) {
            console.error("Failed to delete task:", error);
            alert("Failed to delete task");
        }
    };

    // Logout
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
  
      setToken(null);
      setUser(null);
      setTasks([]);
    };

    // Load tasks when logged in
    useEffect(() => {
        if (token) {
            loadTasks(token);
        }
    }, [token]);

    if (!token) {
        if (showRegister) {
            return (
                <Register
                    name={name}
                    email={email}
                    password={password}
                    setName={setName}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    onRegister={handleRegister}
                    onBackToLogin={() => setShowRegister(false)}
                />
            );
        }
    
        return (
            <Login
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                onLogin={handleLogin}
                onRegisterClick={() => setShowRegister(true)}
            />
        );
    }

    return (
      <div className="app">
          <div className="dashboard">
  
          <header>
              <div>
                  <h1>Task Manager</h1>

                  {user && (
                      <p className="logged-in-as">
                          Logged in as <strong>{user.name}</strong>
                      </p>
                  )}
              </div>

              <button onClick={handleLogout}>
                  Logout
              </button>
          </header>
  
              <TaskForm
                  title={title}
                  description={description}
                  setTitle={setTitle}
                  setDescription={setDescription}
                  onCreate={handleCreateTask}
              />
  
              {/* Edit Task */}
              {editingTask && (
                  <div className="edit-task">
                      <h2>Edit Task</h2>
  
                      <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Task title"
                      />
  
                      <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description"
                      />
  
                      <div>
                          <button onClick={handleSaveEdit}>
                              Save Changes
                          </button>
  
                          <button onClick={() => setEditingTask(null)}>
                              Cancel
                          </button>
                      </div>
                  </div>
              )}
  
              {/* Tasks */}
              <section>
                  <h2>My Tasks</h2>
  
                  {loading ? (
                      <p>Loading tasks...</p>
                  ) : error ? (
                      <p>{error}</p>
                  ) : tasks.length === 0 ? (
                      <p>No tasks found.</p>
                  ) : (
                      tasks.map((task) => (
                          <TaskItem
                              key={task.id}
                              task={task}
                              onToggle={handleToggleTask}
                              onDelete={handleDeleteTask}
                              onEdit={handleEditTask}
                          />
                      ))
                  )}
              </section>
  
          </div>
      </div>
  );
}

export default App;