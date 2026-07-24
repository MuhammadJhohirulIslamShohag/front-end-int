import React from "react";

interface TodoList {
  id: number;
  text: string;
}

const initialTasks: TodoList[] = [
  { id: 1, text: "Buy groceries" },
  { id: 2, text: "Wash the dishes" },
  { id: 3, text: "Read a book" },
];

const TodoLists: React.FC = () => {
  const [tasks, setTasks] = React.useState<TodoList[]>(initialTasks);
  const [newTaskText, setNewTaskText] = React.useState<string>("");

  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;

    const newTask: TodoList = {
      id: Date.now(),
      text: newTaskText.trim(),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setNewTaskText("");
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="Add your task"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newTaskText.trim() !== "") handleAddTask();
          }}
        />
        <div>
          <button onClick={handleAddTask}>Submit</button>
        </div>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.text}</span>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoLists;
