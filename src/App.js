import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import TodoList from "../src/Components/TodoList";
import SearchBar from "../src/Components/SearchBar";
import { FaClipboardList } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem("todoLists");
    return saved ? JSON.parse(saved) : [];
  });

  const [newList, setNewList] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  
  useEffect(() => {
    localStorage.setItem("todoLists", JSON.stringify(lists));
  }, [lists]);

 
  const addList = () => {
    if (!newList.trim()) return;
    const newTodoList = {
      id: Date.now().toString(),
      title: newList.trim(),
      tasks: [],
    };
    setLists([...lists, newTodoList]);
    setNewList("");
  };

  
  const deleteList = (id) => {
    setLists(lists.filter((list) => list.id !== id));
  };

  const renameList = (id, newTitle) => {
    setLists(
      lists.map((list) =>
        list.id === id ? { ...list, title: newTitle.trim() || list.title } : list
      )
    );
  };

 
  const updateList = (updatedList) => {
    setLists(lists.map((list) => (list.id === updatedList.id ? updatedList : list)));
  };

  
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const list = lists.find((l) => l.id === source.droppableId);
      const reorderedTasks = Array.from(list.tasks);
      const [moved] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, moved);
      updateList({ ...list, tasks: reorderedTasks });
    } else {
      const sourceList = lists.find((l) => l.id === source.droppableId);
      const destList = lists.find((l) => l.id === destination.droppableId);

      const sourceTasks = Array.from(sourceList.tasks);
      const [moved] = sourceTasks.splice(source.index, 1);

      const destTasks = Array.from(destList.tasks);
      destTasks.splice(destination.index, 0, moved);

      updateList({ ...sourceList, tasks: sourceTasks });
      updateList({ ...destList, tasks: destTasks });
    }
  };

  const filteredLists = lists
    .map((list) => ({
      ...list,
      tasks: list.tasks.filter((task) =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(
      (list) =>
        list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.tasks.length > 0
    );

  return (
    <div className="App">
      
      <h1 className="app-title">
        <FaClipboardList className="title-icon" /> To-Do Lists
      </h1>

     
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

     
      <div className="add-list">
        <input
          value={newList}
          onChange={(e) => setNewList(e.target.value)}
          placeholder="New list name"
          onKeyDown={(e) => e.key === "Enter" && addList()}
        />
        <button onClick={addList}>Add List</button>
      </div>

      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="lists-container">
          {filteredLists.length > 0 ? (
            filteredLists.map((list) => (
              <TodoList
                key={list.id}
                list={list}
                deleteList={deleteList}
                renameList={renameList}
                updateList={updateList}
              />
            ))
          ) : (
            <p className="no-lists-text">No lists found. Create a new one!</p>
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
