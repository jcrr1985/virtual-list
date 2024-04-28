import React from "react";

const SearchBar = ({ searchTerm, onSearchTermChange }) => {
  console.log("onSearchTermChange", onSearchTermChange);
  return (
    <input
      className="search-bar"
      type="text"
      placeholder="Buscar NFTs"
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e)}
    />
  );
};

export default SearchBar;
