function TaskForm({
    title,
    description,
    setTitle,
    setDescription,
    onCreate,
}) {
    return (
        <section className="create-task">
            <h2>Create Task</h2>

            <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button onClick={onCreate}>
                Add Task
            </button>
        </section>
    );
}

export default TaskForm;