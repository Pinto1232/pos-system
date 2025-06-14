'use client';

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Box,
  Typography,
} from '@mui/material';
import { Category as CategoryIcon } from '@mui/icons-material';
import { ProductCategory } from './types';

interface CategoryFilterProps {
  categories: ProductCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  label?: string;
  size?: 'small' | 'medium';
  showAll?: boolean;
  variant?: 'select' | 'chips';
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  label = 'Category',
  size = 'medium',
  showAll = true,
  variant = 'select',
}) => {
  const activeCategories = categories.filter(
    (cat) => cat.isActive && !cat.parentId
  );

  if (variant === 'chips') {
    return (
      <Box>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <CategoryIcon fontSize="small" />
          {label}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
          {showAll && (
            <Chip
              label="All Categories"
              onClick={() => onCategoryChange('All')}
              color={selectedCategory === 'All' ? 'primary' : 'default'}
              variant={selectedCategory === 'All' ? 'filled' : 'outlined'}
              size={size}
            />
          )}
          {activeCategories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => onCategoryChange(category.name)}
              color={selectedCategory === category.name ? 'primary' : 'default'}
              variant={
                selectedCategory === category.name ? 'filled' : 'outlined'
              }
              size={size}
              avatar={
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: category.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                  }}
                >
                  {category.icon || '📦'}
                </Box>
              }
            />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <FormControl fullWidth size={size}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        label={label}
        startAdornment={<CategoryIcon sx={{ mr: 1 }} />}
      >
        {showAll && (
          <MenuItem value="All">
            <Stack direction="row" alignItems="center" spacing={1}>
              <CategoryIcon />
              <Typography>All Categories</Typography>
            </Stack>
          </MenuItem>
        )}
        {activeCategories.map((category) => (
          <MenuItem key={category.id} value={category.name}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: category.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                }}
              >
                {category.icon || '📦'}
              </Box>
              <Box>
                <Typography>{category.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {category.productCount} products
                </Typography>
              </Box>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategoryFilter;
