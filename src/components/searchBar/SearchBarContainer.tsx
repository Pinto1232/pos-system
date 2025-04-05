'use client'; // If you're using Next.js app router

import React, { useCallback } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import SearchBar from './SearchBar';

const SearchBarContainer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: isMobile ? 280 : 600,
        mx: isMobile ? 'auto' : 0,
        px: { xs: 1, sm: 2 },
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'flex-start',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <SearchBar onSearch={handleSearch} />
      </Box>
    </Box>
  );
};

export default SearchBarContainer;
