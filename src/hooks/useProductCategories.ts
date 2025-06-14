import { useState, useEffect } from 'react';
import { ProductCategory } from '@/components/productCategories/types';

export const useProductCategories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = () => {
      try {
        const stored = localStorage.getItem('productCategories');
        if (stored) {
          setCategories(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'productCategories' && e.newValue) {
        try {
          setCategories(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing categories from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getActiveCategories = () => categories.filter((cat) => cat.isActive);

  const getMainCategories = () => categories.filter((cat) => !cat.parentId);

  const getSubcategories = (parentId: number) =>
    categories.filter((cat) => cat.parentId === parentId);

  const getCategoryById = (id: number) =>
    categories.find((cat) => cat.id === id);

  const getCategoryByName = (name: string) =>
    categories.find((cat) => cat.name === name);

  return {
    categories,
    loading,
    getActiveCategories,
    getMainCategories,
    getSubcategories,
    getCategoryById,
    getCategoryByName,
  };
};
