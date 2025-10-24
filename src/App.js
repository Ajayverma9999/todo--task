import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

function App() {
  const [lists, setLists] = useState([
    { id: "list-1", title: "Work", tasks: ["Meeting", "Send report"] },
    { id: "list-2", title: "Personal", tasks: ["Buy milk", "Go jogging"] },
  ]);

  // handle drag and drop
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceListIndex = lists.findIndex(l => l.id === source.droppableId);
    const destListIndex = lists.findIndex(l => l.id === destination.droppableId);

    const sourceTasks = Array.from(lists[sourceListIndex].tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      const newLists = [...lists];
      newLists[sourceListIndex].tasks = sourceTasks;
      setLists(newLists);
    } else {
      const destTasks = Array.from(lists[destListIndex].tasks);
      destTasks.splice(destination.index, 0, movedTask);
      const newLists = [...lists];
      newLists[sourceListIndex].tasks = sourceTasks;
      newLists[destListIndex].tasks = destTasks;
      setLists(newLists);
    }
  };

  const addTask = (listId, text) => {
    if (!text) return;
    const newLists = lists.map(list =>
      list.id === listId ? { ...list, tasks: [...list.tasks, text] } : list
    );
    setLists(newLists);
  };

  const addList = () => {
    const title = prompt("Enter new list name:");
    if (!title) return;
    setLists([...lists, { id: list-${Date.now()}, title, tasks: [] }]);
  };

  return (
    <div className="app">
      <h1>📝 Multi-List Todo App</h1>
      <button onClick={addList}>+ Add New List</button>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="lists-container">
          {lists.map(list => (
            <Droppable key={list.id} droppableId={list.id}>
              {(provided) => (
                <div className="list" ref={provided.innerRef} {...provided.droppableProps}>
                  <h3>{list.title}</h3>
                  {list.tasks.map((task, index) => (
                    <Draggable key={task + index} draggableId={task + index} index={index}>
                      {(provided) => (
                        <div
                          className="task"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {task}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <AddTaskForm onAdd={(text) => addTask(list.id, text)} />
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

function AddTaskForm({ onAdd }) {
  const [text, setText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(text);
    setText("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default App;