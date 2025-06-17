export interface ProductCategory {
  categoryId: number;
  name: string;
  description: string;
  parentCategoryId?: number | null;
  parentCategoryName?: string;
  slug: string;
  code?: string;
  imageUrl?: string;
  icon?: string;
  color?: string;
  isVisible: boolean;
  isActive: boolean;
  level: number;
  displayOrder: number;
  productCount: number;
  childCategoryCount: number;
  fullPath: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: ProductCategory[];
}

export interface ProductCategoryFormData {
  name: string;
  description: string;
  parentCategoryId?: number | null;
  imageUrl?: string;
  icon?: string;
  color?: string;
  isVisible: boolean;
  isActive: boolean;
  displayOrder: number;
  storeId?: number;
}

export interface CategoryTreeNode {
  categoryId: number;
  name: string;
  description: string;
  slug: string;
  code?: string;
  imageUrl?: string;
  icon?: string;
  color?: string;
  isVisible: boolean;
  isActive: boolean;
  level: number;
  displayOrder: number;
  productCount: number;
  fullPath: string;
  children: CategoryTreeNode[];
}

export interface CategoryHierarchy {
  categoryId: number;
  name: string;
  parentCategoryId?: number | null;
  level: number;
  fullPath: string;
  hasChildren: boolean;
  isExpanded: boolean;
}

export interface CategoryMoveData {
  categoryId: number;
  newParentCategoryId?: number | null;
  newDisplayOrder: number;
}

export interface CategoryBulkUpdate {
  categoryIds: number[];
  isVisible?: boolean;
  isActive?: boolean;
  color?: string;
  newParentCategoryId?: number | null;
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
