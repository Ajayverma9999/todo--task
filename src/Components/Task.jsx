import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MdDelete } from "react-icons/md";

const Task = ({ task, index, toggleComplete, deleteTask }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className={`task ${task.completed ? "completed" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <span
            className="task-text"
            onClick={() => toggleComplete(task.id)}
            title="Click to mark complete"
          >
            {task.text}
          </span>

          <button
            className="delete-btn"
            onClick={() => deleteTask(task.id)}
            title="Delete Task"
          >
            <MdDelete />
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
