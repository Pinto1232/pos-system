# Product Categories System

## Overview

The Product Categories system provides a comprehensive way to organize and
manage product categories with hierarchical support (main categories and
subcategories).

## Components

### 1. ProductCategories.tsx

The main UI component that displays categories in a grid/list view with:

- Search and filtering capabilities
- Add/Edit/Delete operations
- Status toggle (active/inactive)
- Hierarchical category support
- Responsive design

### 2. ProductCategoriesContainer.tsx

Container component that manages state and business logic:

- Data persistence (localStorage)
- CRUD operations
- Loading states
- Notification handling

### 3. CategoryFilter.tsx

Reusable filter component that can be used in other components:

- Select dropdown or chip variants
- Integration with product filtering
- Active category filtering

### 4. useProductCategories.ts

Custom hook for accessing categories across components:

- Categories state management
- Helper functions for filtering
- Storage synchronization

## Integration with Other Components

### Product List (ProductTable)

The Product List component has been enhanced to work with the category system:

```typescript
// ProductTableContainer.tsx
const { categories } = useProductCategories()

// Filter products by category
if (categoryFilter !== 'All') {
  filtered = filtered.filter(
    (product) =>
      product.category === categoryFilter || product.color === categoryFilter
  )
}
```

**Usage:**

1. Navigate to **Products List** to see products filtered by categories
2. The category filter now uses real categories instead of colors
3. Backward compatibility maintained with color-based filtering

### Add/Edit Product

The Add/Edit Product component can be enhanced to include category selection:

```typescript
// In ProductEditModal.tsx or similar
import { CategoryFilter } from '@/components/productCategories';

// In the form
<CategoryFilter
  categories={categories}
  selectedCategory={formData.category}
  onCategoryChange={(category) => setFormData({...formData, category})}
  label="Product Category"
/>
```

## Data Structure

### ProductCategory Interface

```typescript
interface ProductCategory {
  id: number
  name: string
  description: string
  color: string
  icon?: string
  parentId?: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  productCount: number
  subcategories?: ProductCategory[]
}
```

### Enhanced Product Interface

```typescript
interface Product {
  // ... existing fields
  category?: string // Main category name
  categoryId?: number // Category ID for relationship
  subcategory?: string // Subcategory name
  subcategoryId?: number // Subcategory ID for relationship
}
```

## Relationships

### 1. Category → Products

- Each category tracks `productCount`
- Products reference categories via `categoryId` and `category` name
- Subcategories are supported through `parentId` relationships

### 2. Product List Integration

- **Before**: Used `product.color` for filtering
- **After**: Uses `product.category` with fallback to `product.color`
- Categories are loaded from localStorage and displayed in filters

### 3. Add/Edit Product Integration

- Category selection dropdown in product forms
- Automatic category assignment when creating products
- Subcategory support for detailed organization

## Usage Examples

### 1. Navigate to Product Categories

```
Dashboard → Products & Inventory → Product Categories
```

### 2. Create a New Category

1. Click "Add Category" button
2. Fill in category details (name, description, color, icon)
3. Optionally select a parent category for subcategories
4. Save the category

### 3. Filter Products by Category

1. Go to Products List
2. Use the category filter dropdown
3. See filtered results based on selected category

### 4. Edit Product with Categories

1. Go to Add/Edit Product
2. Select category from dropdown (when enhanced)
3. Product will be associated with the selected category

## Features

### ✅ Current Features

- Complete category management (CRUD)
- Hierarchical categories (parent/child)
- Search and filtering
- Status management (active/inactive)
- Product count tracking
- Responsive design
- Integration with Product List filtering

### 🚧 Planned Enhancements

- Category selection in Add/Edit Product forms
- Category-based product templates
- Bulk category assignment
- Category analytics and insights
- Import/Export categories
- Category-based pricing rules

## Technical Implementation

### Storage

- Uses localStorage for persistence
- Cross-tab synchronization
- Fallback data initialization

### State Management

- Container pattern for separation of concerns
- Custom hooks for reusable logic
- React hooks for local state

### Styling

- Material-UI components
- Responsive design
- Theme integration
- Gradient headers and modern UI

### Performance

- Lazy loading for components
- Memoized calculations
- Efficient filtering algorithms

## Getting Started

1. **View Categories**: Navigate to Product Categories in the sidebar
2. **Create Categories**: Use the "Add Category" button to create new categories
3. **Organize Products**: Categories will appear in Product List filters
4. **Future**: Product forms will include category selection

The system is designed to be extensible and integrates seamlessly with existing
product management functionality.
