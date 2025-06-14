import React from 'react';
import { TableRow, TableCell, Box, Typography } from '@mui/material';
import {
  noProductsStyles,
  noProductsTextStyles,
  noProductsSubtextStyles,
} from '../styles';

const NoProductsFound: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
        <Box sx={noProductsStyles}>
          <Typography variant="h6" sx={noProductsTextStyles}>
            No products found
          </Typography>
          <Typography variant="body2" sx={noProductsSubtextStyles}>
            Try adjusting your filters
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default NoProductsFound;
