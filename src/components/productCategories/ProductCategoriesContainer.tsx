'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';
import ProductCategories from './ProductCategories';
import { ProductCategory, ProductCategoryFormData } from './types';
import { categoriesService } from '@/api/categoriesService';
import BackendConnectionTest from '@/components/debug/BackendConnectionTest';

const ProductCategoriesContainer: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = useCallback(
    (
      message: string,
      severity: 'success' | 'error' | 'warning' | 'info' = 'success'
    ) => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await categoriesService.getCategories({
          includeInactive: true,
        });
        setCategories(fetchedCategories);
        showSnackbar('Categories loaded successfully from backend!', 'success');
      } catch (error) {
        console.error('Error fetching categories:', error);
        showSnackbar(
          'Failed to load categories from backend. Please ensure the backend is running.',
          'error'
        );
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [showSnackbar]);

  const refreshCategories = useCallback(async () => {
    try {
      const fetchedCategories = await categoriesService.getCategories({
        includeInactive: true,
      });
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error refreshing categories:', error);
      showSnackbar('Failed to refresh categories.', 'error');
    }
  }, [showSnackbar]);

  const handleAddCategory = useCallback(
    async (categoryData: ProductCategoryFormData) => {
      setLoading(true);
      try {
        await categoriesService.createCategory(categoryData);
        await refreshCategories();
        showSnackbar(
          `Category "${categoryData.name}" created successfully!`,
          'success'
        );
      } catch (error) {
        console.error('Error adding category:', error);
        showSnackbar('Failed to create category. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [refreshCategories, showSnackbar]
  );

  const handleUpdateCategory = useCallback(
    async (id: number, categoryData: ProductCategoryFormData) => {
      setLoading(true);
      try {
        await categoriesService.updateCategory(id, categoryData);
        await refreshCategories();
        showSnackbar(
          `Category "${categoryData.name}" updated successfully!`,
          'success'
        );
      } catch (error) {
        console.error('Error updating category:', error);
        showSnackbar('Failed to update category. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [refreshCategories, showSnackbar]
  );

  const handleDeleteCategory = useCallback(
    async (id: number) => {
      const categoryToDelete = categories.find((cat) => cat.categoryId === id);
      if (!categoryToDelete) return;

      if (categoryToDelete.productCount > 0) {
        showSnackbar(
          'Cannot delete category with products. Please move or delete products first.',
          'warning'
        );
        return;
      }

      setLoading(true);
      try {
        await categoriesService.deleteCategory(id);
        await refreshCategories();
        showSnackbar(
          `Category "${categoryToDelete.name}" deleted successfully!`,
          'success'
        );
      } catch (error) {
        console.error('Error deleting category:', error);
        showSnackbar('Failed to delete category. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [categories, refreshCategories, showSnackbar]
  );

  const handleToggleStatus = useCallback(
    async (id: number) => {
      const category = categories.find((cat) => cat.categoryId === id);
      if (!category) return;

      setLoading(true);
      try {
        await categoriesService.toggleCategoryStatus(id);
        await refreshCategories();
        showSnackbar(
          `Category "${category.name}" ${category.isActive ? 'deactivated' : 'activated'} successfully!`,
          'info'
        );
      } catch (error) {
        console.error('Error toggling category status:', error);
        showSnackbar(
          'Failed to update category status. Please try again.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    },
    [categories, refreshCategories, showSnackbar]
  );

  return (
    <>
      {}
      {process.env.NODE_ENV === 'development' && <BackendConnectionTest />}

      <ProductCategories
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onToggleStatus={handleToggleStatus}
        loading={loading}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCategoriesContainer;
