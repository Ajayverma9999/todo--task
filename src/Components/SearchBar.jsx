import React from "react";
import { IoSearch } from "react-icons/io5";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar">
      <IoSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search tasks or lists..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;

