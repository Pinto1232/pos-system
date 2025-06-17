import axios, { AxiosError } from 'axios';
import {
  ProductCategory,
  ProductCategoryFormData,
} from '@/components/productCategories/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5107';

const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

const backendApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

backendApi.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

backendApi.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error)) {
      console.error('Categories API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });

      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
      }

      if (!error.response) {
        throw new Error(
          `Unable to connect to backend at ${API_BASE_URL}. Please ensure the backend server is running.`
        );
      }
    } else {
      console.error('Unknown error:', error);
    }

    return Promise.reject(error);
  }
);

interface CategoryListDto {
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
}

interface CategoryDetailDto extends CategoryListDto {
  parentCategoryIds: number[];
  childCategories: CategorySummaryDto[];
}

interface CategorySummaryDto {
  categoryId: number;
  name: string;
  parentCategoryId?: number | null;
  parentCategoryName?: string;
  slug: string;
  code?: string;
  icon?: string;
  color?: string;
  isVisible: boolean;
  isActive: boolean;
  level: number;
  productCount: number;
}

interface CategoryCreateDto {
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

interface CategoryUpdateDto extends CategoryCreateDto {
  categoryId: number;
}

const transformToProductCategory = (
  dto: CategoryListDto | CategoryDetailDto
): ProductCategory => {
  const base: ProductCategory = {
    categoryId: dto.categoryId,
    name: dto.name,
    description: dto.description,
    parentCategoryId: dto.parentCategoryId,
    parentCategoryName: dto.parentCategoryName,
    slug: dto.slug,
    code: dto.code,
    imageUrl: dto.imageUrl,
    icon: dto.icon,
    color: dto.color,
    isVisible: dto.isVisible,
    isActive: dto.isActive,
    level: dto.level,
    displayOrder: dto.displayOrder,
    productCount: dto.productCount,
    childCategoryCount: dto.childCategoryCount,
    fullPath: dto.fullPath,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };

  if ('childCategories' in dto && dto.childCategories) {
    base.subcategories = dto.childCategories.map((child) => ({
      categoryId: child.categoryId,
      name: child.name,
      description: '', // Not provided in summary
      parentCategoryId: child.parentCategoryId,
      parentCategoryName: child.parentCategoryName,
      slug: child.slug,
      code: child.code,
      imageUrl: '',
      icon: child.icon,
      color: child.color,
      isVisible: child.isVisible,
      isActive: child.isActive,
      level: child.level,
      displayOrder: 0, // Not provided in summary
      productCount: child.productCount,
      childCategoryCount: 0, // Not provided in summary
      fullPath: '', // Not provided in summary
      createdAt: '', // Not provided in summary
      updatedAt: '', // Not provided in summary
    }));
  }

  return base;
};

// Transform frontend form data to backend DTO
const transformToCreateDto = (
  formData: ProductCategoryFormData
): CategoryCreateDto => ({
  name: formData.name,
  description: formData.description,
  parentCategoryId: formData.parentCategoryId,
  imageUrl: formData.imageUrl,
  icon: formData.icon,
  color: formData.color,
  isVisible: formData.isVisible,
  isActive: formData.isActive,
  displayOrder: formData.displayOrder,
  storeId: formData.storeId,
});

const transformToUpdateDto = (
  id: number,
  formData: ProductCategoryFormData
): CategoryUpdateDto => ({
  categoryId: id,
  ...transformToCreateDto(formData),
});

// Categories Service
export const categoriesService = {
  // Get all categories
  async getCategories(params?: {
    storeId?: number;
    isActive?: boolean;
    isVisible?: boolean;
    parentCategoryId?: number;
    includeInactive?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<ProductCategory[]> {
    try {
      console.log('Fetching categories from backend:', API_BASE_URL);
      const queryParams = new URLSearchParams();

      if (params?.storeId)
        queryParams.append('storeId', params.storeId.toString());
      if (params?.isActive !== undefined)
        queryParams.append('isActive', params.isActive.toString());
      if (params?.isVisible !== undefined)
        queryParams.append('isVisible', params.isVisible.toString());
      if (params?.parentCategoryId)
        queryParams.append(
          'parentCategoryId',
          params.parentCategoryId.toString()
        );
      if (params?.includeInactive !== undefined)
        queryParams.append(
          'includeInactive',
          params.includeInactive.toString()
        );
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());

      const url = `/api/categories${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('Making request to:', `${API_BASE_URL}${url}`);

      const response = await backendApi.get<CategoryListDto[]>(url);
      console.log('Categories response received:', response.data);

      const categories = response.data.map(transformToProductCategory);
      const hierarchicalCategories = buildCategoryHierarchy(categories);
      console.log('Processed categories:', hierarchicalCategories);

      return hierarchicalCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (isAxiosError(error) && error.response?.data) {
        console.error('Backend error details:', error.response.data);
      }
      throw new Error('Failed to fetch categories');
    }
  },

  async getCategoryById(id: number): Promise<ProductCategory> {
    try {
      const response = await backendApi.get<CategoryDetailDto>(
        `/api/categories/${id}`
      );
      return transformToProductCategory(response.data);
    } catch (error) {
      console.error('Error fetching category:', error);
      if (isAxiosError(error) && error.response?.data) {
        console.error('Backend error details:', error.response.data);
      }
      throw new Error('Failed to fetch category');
    }
  },

  async createCategory(
    categoryData: ProductCategoryFormData
  ): Promise<ProductCategory> {
    try {
      console.log('Creating category with data:', categoryData);
      const createDto = transformToCreateDto(categoryData);
      console.log('Transformed DTO for backend:', createDto);

      const response = await backendApi.post<CategoryDetailDto>(
        '/api/categories',
        createDto
      );
      console.log('Category created successfully:', response.data);

      return transformToProductCategory(response.data);
    } catch (error) {
      console.error('Error creating category:', error);
      if (isAxiosError(error) && error.response?.data) {
        console.error('Backend error details:', error.response.data);
      }
      throw new Error('Failed to create category');
    }
  },

  async updateCategory(
    id: number,
    categoryData: ProductCategoryFormData
  ): Promise<ProductCategory> {
    try {
      const updateDto = transformToUpdateDto(id, categoryData);
      await backendApi.put(`/api/categories/${id}`, updateDto);

      const response = await backendApi.get<CategoryDetailDto>(
        `/api/categories/${id}`
      );
      return transformToProductCategory(response.data);
    } catch (error) {
      console.error('Error updating category:', error);
      if (isAxiosError(error) && error.response?.data) {
        console.error('Backend error details:', error.response.data);
      }
      throw new Error('Failed to update category');
    }
  },

  async deleteCategory(id: number): Promise<void> {
    try {
      await backendApi.delete(`/api/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      if (isAxiosError(error) && error.response?.data) {
        console.error('Backend error details:', error.response.data);
      }
      throw new Error('Failed to delete category');
    }
  },

  async toggleCategoryStatus(id: number): Promise<ProductCategory> {
    try {
      const category = await this.getCategoryById(id);

      const updateData: ProductCategoryFormData = {
        name: category.name,
        description: category.description,
        parentCategoryId: category.parentCategoryId,
        imageUrl: category.imageUrl,
        icon: category.icon,
        color: category.color,
        isVisible: category.isVisible,
        isActive: !category.isActive,
        displayOrder: category.displayOrder,
        storeId: undefined,
      };

      return await this.updateCategory(id, updateData);
    } catch (error) {
      console.error('Error toggling category status:', error);
      if (isAxiosError(error) && error.response?.data) {
        console.error('Backend error details:', error.response.data);
      }
      throw new Error('Failed to toggle category status');
    }
  },
};

function buildCategoryHierarchy(
  categories: ProductCategory[]
): ProductCategory[] {
  const categoryMap = new Map<number, ProductCategory>();
  const rootCategories: ProductCategory[] = [];

  categories.forEach((category) => {
    categoryMap.set(category.categoryId, { ...category, subcategories: [] });
  });

  categories.forEach((category) => {
    const cat = categoryMap.get(category.categoryId);
    if (!cat) return;

    if (category.parentCategoryId) {
      const parent = categoryMap.get(category.parentCategoryId);
      if (parent) {
        if (!parent.subcategories) parent.subcategories = [];
        parent.subcategories.push(cat);
      }
    } else {
      rootCategories.push(cat);
    }
  });

  return rootCategories;
}

export default categoriesService;
