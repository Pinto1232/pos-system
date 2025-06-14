'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';
import ProductCategories from './ProductCategories';
import { ProductCategory, ProductCategoryFormData } from './types';

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
    const initializeCategories = () => {
      const demoCategories: ProductCategory[] = [
        {
          id: 1,
          name: 'Electronics',
          description: 'Electronic devices and gadgets',
          color: '#2196F3',
          icon: '📱',
          parentId: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          productCount: 25,
          subcategories: [
            {
              id: 11,
              name: 'Smartphones',
              description: 'Mobile phones and accessories',
              color: '#2196F3',
              icon: '📱',
              parentId: 1,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              productCount: 15,
            },
            {
              id: 12,
              name: 'Laptops',
              description: 'Portable computers',
              color: '#2196F3',
              icon: '💻',
              parentId: 1,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              productCount: 10,
            },
          ],
        },
        {
          id: 2,
          name: 'Clothing',
          description: 'Fashion and apparel items',
          color: '#4CAF50',
          icon: '👕',
          parentId: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          productCount: 40,
          subcategories: [
            {
              id: 21,
              name: "Men's Wear",
              description: 'Clothing for men',
              color: '#4CAF50',
              icon: '👔',
              parentId: 2,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              productCount: 20,
            },
            {
              id: 22,
              name: "Women's Wear",
              description: 'Clothing for women',
              color: '#4CAF50',
              icon: '👗',
              parentId: 2,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              productCount: 20,
            },
          ],
        },
        {
          id: 3,
          name: 'Home & Garden',
          description: 'Home improvement and garden supplies',
          color: '#FF9800',
          icon: '🏡',
          parentId: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          productCount: 18,
        },
        {
          id: 4,
          name: 'Sports & Fitness',
          description: 'Sports equipment and fitness gear',
          color: '#9C27B0',
          icon: '⚽',
          parentId: null,
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          productCount: 12,
        },
        {
          id: 5,
          name: 'Books & Media',
          description: 'Books, movies, and digital media',
          color: '#F44336',
          icon: '📚',
          parentId: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          productCount: 30,
        },
      ];

      localStorage.setItem('productCategories', JSON.stringify(demoCategories));
      setCategories(demoCategories);
    };

    const stored = localStorage.getItem('productCategories');
    if (stored) {
      try {
        setCategories(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing stored categories:', error);
        initializeCategories();
      }
    } else {
      initializeCategories();
    }
  }, []);

  const saveCategories = useCallback((updatedCategories: ProductCategory[]) => {
    setCategories(updatedCategories);
    localStorage.setItem(
      'productCategories',
      JSON.stringify(updatedCategories)
    );
  }, []);

  const handleAddCategory = useCallback(
    async (categoryData: ProductCategoryFormData) => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newCategory: ProductCategory = {
          id: Date.now(),
          ...categoryData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          productCount: 0,
        };

        const updatedCategories = [...categories, newCategory];

        if (categoryData.parentId) {
          const updatedCategoriesWithSub = updatedCategories.map((cat) => {
            if (cat.id === categoryData.parentId) {
              return {
                ...cat,
                subcategories: [...(cat.subcategories || []), newCategory],
              };
            }
            return cat;
          });
          saveCategories(updatedCategoriesWithSub);
        } else {
          saveCategories(updatedCategories);
        }

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
    [categories, saveCategories, showSnackbar]
  );

  const handleUpdateCategory = useCallback(
    async (id: number, categoryData: ProductCategoryFormData) => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedCategories = categories.map((cat) => {
          if (cat.id === id) {
            return {
              ...cat,
              ...categoryData,
              updatedAt: new Date().toISOString(),
            };
          }

          if (cat.subcategories) {
            return {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === id
                  ? {
                      ...sub,
                      ...categoryData,
                      updatedAt: new Date().toISOString(),
                    }
                  : sub
              ),
            };
          }
          return cat;
        });

        saveCategories(updatedCategories);
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
    [categories, saveCategories, showSnackbar]
  );

  const handleDeleteCategory = useCallback(
    async (id: number) => {
      const categoryToDelete = categories.find((cat) => cat.id === id);
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
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedCategories = categories.filter((cat) => {
          if (cat.id === id) return false;
          if (cat.parentId === id) return false;

          if (cat.subcategories) {
            cat.subcategories = cat.subcategories.filter(
              (sub) => sub.id !== id
            );
          }

          return true;
        });

        saveCategories(updatedCategories);
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
    [categories, saveCategories, showSnackbar]
  );

  const handleToggleStatus = useCallback(
    async (id: number) => {
      const category = categories.find((cat) => cat.id === id);
      if (!category) return;

      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const updatedCategories = categories.map((cat) => {
          if (cat.id === id) {
            return {
              ...cat,
              isActive: !cat.isActive,
              updatedAt: new Date().toISOString(),
            };
          }

          if (cat.subcategories) {
            return {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === id
                  ? {
                      ...sub,
                      isActive: !sub.isActive,
                      updatedAt: new Date().toISOString(),
                    }
                  : sub
              ),
            };
          }
          return cat;
        });

        saveCategories(updatedCategories);
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
    [categories, saveCategories, showSnackbar]
  );

  return (
    <>
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
