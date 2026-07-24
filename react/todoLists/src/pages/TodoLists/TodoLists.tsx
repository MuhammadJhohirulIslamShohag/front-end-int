import React from "react";
import type { TodoList } from "../../types/todo-lists.type";
import { initialTasks } from "../../data/todo-lists";
import "./TodoLists.css";

/**
 * TodoLists Component
 * Handles adding, rendering, and deleting todo items with inline state management.
 */
const TodoLists: React.FC = () => {
  // State to hold the array of todo items
  const [tasks, setTasks] = React.useState<TodoList[]>(initialTasks);

  // State for controlling the input field text
  const [newTaskText, setNewTaskText] = React.useState<string>("");

  /**
   * Validates input text and prepends a new task to the top of the list
   */
  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;

    const newTask: TodoList = {
      id: Date.now(),
      text: newTaskText.trim(),
    };

    // Prepend new task so latest items show at the top
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setNewTaskText("");
  };

  /**
   * Prompts user for confirmation before removing a task by ID
   */
  const handleDeleteTask = (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">Todo List</h1>

      {/* Task Creation Form */}
      <div className="todo-input-wrapper">
        <input
          type="text"
          className="todo-input"
          placeholder="Add your task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => {
            // Trigger task creation on Enter key press
            if (e.key === "Enter" && newTaskText.trim() !== "") handleAddTask();
          }}
        />
        <button className="btn btn-primary" onClick={handleAddTask}>
          Submit
        </button>
      </div>

      {/* Task List / Empty State */}
      <ul className="todo-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="todo-item">
              <span className="todo-text">{task.text}</span>
              <button
                className="btn btn-delete"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className="todo-empty">No tasks available.</li>
        )}
      </ul>
    </div>
  );
};

export default TodoLists;
