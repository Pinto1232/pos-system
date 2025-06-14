export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  color: string;
  icon?: string;
  parentId?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  subcategories?: ProductCategory[];
}

export interface ProductCategoryFormData {
  name: string;
  description: string;
  color: string;
  icon?: string;
  parentId?: number | null;
  isActive: boolean;
}

export interface ProductCategoriesProps {
  categories: ProductCategory[];
  onAddCategory: (category: ProductCategoryFormData) => void;
  onUpdateCategory: (id: number, category: ProductCategoryFormData) => void;
  onDeleteCategory: (id: number) => void;
  onToggleStatus: (id: number) => void;
  loading?: boolean;
}

export interface CategoryFilterProps {
  categories: ProductCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}
