'use client'; // If you're using Next.js app router

import React, { useCallback } from 'react';
import SearchBar from './SearchBar';

const SearchBarContainer: React.FC = () => {
  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
};

export default SearchBarContainer;
