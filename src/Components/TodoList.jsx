import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";
import { MdDelete, MdEdit } from "react-icons/md";

const TodoList = ({ list, deleteList, renameList, updateList }) => {
  const [taskText, setTaskText] = useState("");
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);


  const addTask = () => {
    if (!taskText.trim()) return;
    const newTask = { id: Date.now().toString(), text: taskText, completed: false };
    updateList({ ...list, tasks: [...list.tasks, newTask] });
    setTaskText("");
  };

  const toggleComplete = (id) => {
    const updatedTasks = list.tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    updateList({ ...list, tasks: updatedTasks });
  };


  const deleteTask = (id) => {
    const updatedTasks = list.tasks.filter((t) => t.id !== id);
    updateList({ ...list, tasks: updatedTasks });
  };

  
  const handleRename = () => {
    if (newTitle.trim() !== "") renameList(list.id, newTitle);
    setEditing(false);
  };

  return (
    <div className="todo-list">
      
      <div className="list-header">
        {editing ? (
          <input
            className="rename-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleRename}
            autoFocus
          />
        ) : (
          <h3 onDoubleClick={() => setEditing(true)}>{list.title}</h3>
        )}

        <div className="list-actions">
          {!editing && (
            <button
              className="edit-btn"
              onClick={() => setEditing(true)}
              title="Rename List"
            >
              <MdEdit />
            </button>
          )}
          <button
            className="delete-btn"
            onClick={() => deleteList(list.id)}
            title="Delete List"
          >
            <MdDelete />
          </button>
        </div>
      </div>

      
      <div className="add-task">
        <input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add new task"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      
      <Droppable droppableId={list.id}>
        {(provided) => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {list.tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoList;
