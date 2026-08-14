function TaskItem({ task, onToggle, onDelete, onEdit }) {
    return (
        <div className={`task ${task.completed ? "completed" : ""}`}>
            <div className="task-content">
                <div>
                    <h3>{task.title}</h3>

                    <p>
                        {task.description || "No description"}
                    </p>
                </div>

                <span className={`status ${task.completed ? "done" : "pending"}`}>
                    {task.completed ? "Completed" : "Pending"}
                </span>
            </div>

            <div className="task-actions">
                <button onClick={() => onToggle(task)}>
                    {task.completed ? "Mark Pending" : "Complete"}
                </button>

                <button onClick={() => onEdit(task)}>
                    Edit
                </button>

                <button
                    className="delete-button"
                    onClick={() => onDelete(task.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskItem;