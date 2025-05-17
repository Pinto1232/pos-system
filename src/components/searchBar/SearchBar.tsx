import React, { useState } from 'react';
import { SearchBarProps } from './searchBar.types';
import {
  StyledSearchBar,
  StyledInput,
  SearchIconButton,
} from './searchBar.styles';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  value = '',
}) => {
  const [searchValue, setSearchValue] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <StyledSearchBar>
      <StyledInput
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <SearchIconButton onClick={handleSearchClick}>
        <SearchIcon />
      </SearchIconButton>
    </StyledSearchBar>
  );
};

export default SearchBar;
