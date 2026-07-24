import React from "react";
import type { TodoList } from "../../types/todo-lists.type";
import { initialTasks } from "../../data/todo-lists";

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
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              <span>{task.text}</span>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </ul>
    </div>
  );
};

export default TodoLists;
