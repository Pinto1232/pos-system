import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';
import {
  titleStyles,
  filtersWrapperStyles,
  filtersContainerStyles,
  filtersBoxStyles,
  searchFieldStyles,
  selectStyles,
  inputLabelStyles,
  actionsBoxStyles,
  resetButtonStyles,
  exportButtonStyles,
} from '../styles';

const commonMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
    },
  },
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'left' as const,
  },

  container: document.body,

  disablePortal: true,
};

interface TableHeaderProps {
  searchQuery: string;
  categoryFilter: string;
  ratingFilter: string;
  statusFilter: string;
  priceFilter: string;
  salesFilter: string;
  categories: string[];
  ratings: string[];
  statuses: string[];
  prices: string[];
  salesCategories: string[];
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (event: SelectChangeEvent) => void;
  onRatingChange: (event: SelectChangeEvent) => void;
  onStatusChange: (event: SelectChangeEvent) => void;
  onPriceChange: (event: SelectChangeEvent) => void;
  onSalesChange: (event: SelectChangeEvent) => void;
  onResetFilters: () => void;
  onExportPDF: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  searchQuery,
  categoryFilter,
  ratingFilter,
  statusFilter,
  priceFilter,
  salesFilter,
  categories,
  ratings,
  statuses,
  prices,
  salesCategories,
  onSearchChange,
  onCategoryChange,
  onRatingChange,
  onStatusChange,
  onPriceChange,
  onSalesChange,
  onResetFilters,
  onExportPDF,
}) => {
  return (
    <>
      <Typography variant="h5" sx={titleStyles}>
        Product List
      </Typography>
      <Box sx={filtersWrapperStyles}>
        <Box sx={filtersContainerStyles}>
          <Box sx={filtersBoxStyles}>
            <TextField
              placeholder="Search Product"
              size="small"
              value={searchQuery}
              onChange={onSearchChange}
              sx={{
                ...searchFieldStyles,
                flexGrow: { xs: 1, sm: 1, md: 0 },
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { xs: '100%', sm: '100%', md: 300 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: '100%', sm: 150, md: 180 },
                position: 'relative',
                flexGrow: { xs: 1, sm: 0 },
              }}
            >
              <InputLabel sx={inputLabelStyles}>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={onCategoryChange}
                label="Category"
                sx={selectStyles}
                MenuProps={commonMenuProps}
                variant="outlined"
                fullWidth
              >
                {categories.map((category) => (
                  <MenuItem key={`category-${category}`} value={category}>
                    {String(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: '100%', sm: 150, md: 180 },
                position: 'relative',
                flexGrow: { xs: 1, sm: 0 },
              }}
            >
              <InputLabel sx={inputLabelStyles}>Rating</InputLabel>
              <Select
                value={ratingFilter}
                onChange={onRatingChange}
                label="Rating"
                sx={selectStyles}
                MenuProps={commonMenuProps}
                variant="outlined"
                fullWidth
              >
                {ratings.map((rating) => (
                  <MenuItem key={`rating-${rating}`} value={rating}>
                    {rating === 'All' ? 'All' : `${rating} Stars`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: '100%', sm: 150, md: 180 },
                position: 'relative',
                flexGrow: { xs: 1, sm: 0 },
              }}
            >
              <InputLabel sx={inputLabelStyles}>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={onStatusChange}
                label="Status"
                sx={selectStyles}
                MenuProps={commonMenuProps}
                variant="outlined"
                fullWidth
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: '100%', sm: 150, md: 180 },
                position: 'relative',
                flexGrow: { xs: 1, sm: 0 },
              }}
            >
              <InputLabel sx={inputLabelStyles}>Price Range</InputLabel>
              <Select
                value={priceFilter}
                onChange={onPriceChange}
                label="Price Range"
                sx={selectStyles}
                MenuProps={commonMenuProps}
                variant="outlined"
                fullWidth
              >
                {prices.map((price) => (
                  <MenuItem key={price} value={price}>
                    {price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: '100%', sm: 150, md: 180 },
                position: 'relative',
                flexGrow: { xs: 1, sm: 0 },
              }}
            >
              <InputLabel sx={inputLabelStyles}>Sales Performance</InputLabel>
              <Select
                value={salesFilter}
                onChange={onSalesChange}
                label="Sales Performance"
                sx={selectStyles}
                MenuProps={commonMenuProps}
                variant="outlined"
                fullWidth
              >
                {salesCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={actionsBoxStyles}>
            <IconButton
              onClick={onResetFilters}
              sx={resetButtonStyles}
              aria-label="Reset filters"
            >
              <FiRefreshCw size={18} />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<FiDownload size={16} />}
              onClick={onExportPDF}
              sx={exportButtonStyles}
              aria-label="Export to PDF"
            >
              <Box
                component="span"
                sx={{ display: { xs: 'none', sm: 'inline' } }}
              >
                Export PDF
              </Box>
              <Box
                component="span"
                sx={{ display: { xs: 'inline', sm: 'none' } }}
              >
                Export
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TableHeader;
