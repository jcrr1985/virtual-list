import React from "react";

const SearchBar = ({ searchTerm, onSearchTermChange }) => {
  return (
    <input className="search-bar"
      type="text"
      placeholder="Buscar NFTs"
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value.toLowerCase())}
    />
  );
};

export default SearchBar;