"use client"; // If you're using Next.js app router

import React, { useCallback } from "react";
import SearchBar from "./SearchBar";

const SearchBarContainer: React.FC = () => {
  // Example search handler
  const handleSearch = useCallback((query: string) => {
    console.log("Searching for:", query);
    // You could trigger a data fetch, navigate, etc.
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 600 }}>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
};

export default SearchBarContainer;
