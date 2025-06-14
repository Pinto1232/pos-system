'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Tooltip,
  useTheme,
  useMediaQuery,
  Grow,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Category as CategoryIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { ProductCategory, ProductCategoryFormData } from './types';

interface ProductCategoriesProps {
  categories: ProductCategory[];
  onAddCategory: (category: ProductCategoryFormData) => void;
  onUpdateCategory: (id: number, category: ProductCategoryFormData) => void;
  onDeleteCategory: (id: number) => void;
  onToggleStatus: (id: number) => void;
  loading?: boolean;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onToggleStatus,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);

  const [formData, setFormData] = useState<ProductCategoryFormData>({
    name: '',
    description: '',
    color: '#2196F3',
    icon: '',
    parentId: null,
    isActive: true,
  });

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter((cat) => !cat.parentId); // Only show main categories

    if (searchQuery) {
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((cat) =>
        statusFilter === 'active' ? cat.isActive : !cat.isActive
      );
    }

    return filtered;
  }, [categories, searchQuery, statusFilter]);

  const categoryStats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((cat) => cat.isActive).length;
    const inactive = total - active;
    const totalProducts = categories.reduce(
      (sum, cat) => sum + cat.productCount,
      0
    );

    return { total, active, inactive, totalProducts };
  }, [categories]);

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingCategory) {
      onUpdateCategory(editingCategory.id, formData);
    } else {
      onAddCategory(formData);
    }

    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#2196F3',
      icon: '',
      parentId: null,
      isActive: true,
    });
  };

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon || '',
      parentId: category.parentId,
      isActive: category.isActive,
    });
    setOpen(true);
    setMenuAnchor(null);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    category: ProductCategory
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCategory(null);
  };

  const handleDelete = () => {
    if (selectedCategory) {
      onDeleteCategory(selectedCategory.id);
    }
    handleMenuClose();
  };

  const handleToggleStatus = () => {
    if (selectedCategory) {
      onToggleStatus(selectedCategory.id);
    }
    handleMenuClose();
  };

  const categoryColors = [
    '#2196F3',
    '#4CAF50',
    '#FF9800',
    '#9C27B0',
    '#F44336',
    '#00BCD4',
    '#FFEB3B',
    '#795548',
    '#607D8B',
    '#E91E63',
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
        }}
      >
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems={isMobile ? 'flex-start' : 'center'}
          spacing={2}
        >
          <Box>
            <Typography variant={isSmallScreen ? 'h5' : 'h4'} gutterBottom>
              🏷️ Product Categories
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Organize your products with custom categories and subcategories
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            disabled={loading}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            Add Category
          </Button>
        </Stack>
      </Paper>

      {}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Stack alignItems="center" spacing={1}>
              <CategoryIcon color="primary" />
              <Typography variant="h6" color="primary">
                {categoryStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Categories
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Stack alignItems="center" spacing={1}>
              <VisibilityIcon color="success" />
              <Typography variant="h6" color="success.main">
                {categoryStats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Stack alignItems="center" spacing={1}>
              <VisibilityOffIcon color="error" />
              <Typography variant="h6" color="error.main">
                {categoryStats.inactive}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inactive
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Stack alignItems="center" spacing={1}>
              <TrendingUpIcon color="info" />
              <Typography variant="h6" color="info.main">
                {categoryStats.totalProducts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Products
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as 'all' | 'active' | 'inactive'
                  )
                }
                label="Filter by Status"
                startAdornment={<FilterIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Tooltip title="Grid View">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <CategoryIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="List View">
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <TimelineIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {}
      {filteredCategories.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No categories found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'Create your first product category to get started'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Category
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredCategories.map((category, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={viewMode === 'grid' ? 4 : 12}
              key={category.id}
            >
              <Grow in timeout={300 + index * 100}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: `2px solid ${category.isActive ? 'transparent' : theme.palette.error.light}`,
                    opacity: category.isActive ? 1 : 0.7,
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              bgcolor: category.color,
                              width: 48,
                              height: 48,
                            }}
                          >
                            {category.icon ? category.icon : <CategoryIcon />}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" noWrap>
                              {category.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {category.productCount} products
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip
                            label={category.isActive ? 'Active' : 'Inactive'}
                            color={category.isActive ? 'success' : 'error'}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, category)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Stack>
                      </Stack>

                      {category.description && (
                        <Typography variant="body2" color="text.secondary">
                          {category.description}
                        </Typography>
                      )}

                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Subcategories:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {category.subcategories.slice(0, 3).map((sub) => (
                                <Chip
                                  key={sub.id}
                                  label={sub.name}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    color: category.color,
                                    borderColor: category.color,
                                  }}
                                />
                              ))}
                              {category.subcategories.length > 3 && (
                                <Chip
                                  label={`+${category.subcategories.length - 3} more`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </Box>
                        )}

                      <Divider />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="caption" color="text.secondary">
                          Created:{' '}
                          {new Date(category.createdAt).toLocaleDateString()}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit Category">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(category)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={
                              category.isActive ? 'Deactivate' : 'Activate'
                            }
                          >
                            <IconButton
                              size="small"
                              onClick={() => onToggleStatus(category.id)}
                              color={category.isActive ? 'error' : 'success'}
                            >
                              {category.isActive ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}

      {}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 180 },
        }}
      >
        <MenuItem onClick={() => handleEdit(selectedCategory!)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Category
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedCategory?.isActive ? (
            <VisibilityOffIcon sx={{ mr: 1 }} />
          ) : (
            <VisibilityIcon sx={{ mr: 1 }} />
          )}
          {selectedCategory?.isActive ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Category
        </MenuItem>
      </Menu>

      {}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CategoryIcon color="primary" />
            <Typography variant="h6">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Color</InputLabel>
                  <Select
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    label="Color"
                  >
                    {categoryColors.map((color) => (
                      <MenuItem key={color} value={color}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: color,
                              borderRadius: '50%',
                            }}
                          />
                          <Typography>{color}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Icon (emoji)"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  fullWidth
                  placeholder="📱"
                />
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Parent Category</InputLabel>
              <Select
                value={formData.parentId || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                label="Parent Category"
              >
                <MenuItem value="">None (Main Category)</MenuItem>
                {categories
                  .filter(
                    (cat) => !cat.parentId && cat.id !== editingCategory?.id
                  )
                  .map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name.trim() || loading}
            startIcon={editingCategory ? <EditIcon /> : <AddIcon />}
          >
            {editingCategory ? 'Update' : 'Create'} Category
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductCategories;
