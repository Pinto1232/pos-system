import { Product as ProductEditProduct } from '../productEdit/types';
import { SelectChangeEvent } from '@mui/material/Select';

export type Product = ProductEditProduct;

export interface ProductTableProps {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  isViewModalOpen: boolean;
  page: number;
  rowsPerPage: number;
  searchQuery: string;
  categoryFilter: string;
  ratingFilter: string;
  statusFilter: string;
  priceFilter: string;
  onView: (product: Product) => void;
  onCloseModal: () => void;
  onPriceChange: (event: any) => void;
  onSearchChange: (event: any) => void;
  onCategoryChange: (event: any) => void;
  onRatingChange: (event: any) => void;
  onStatusChange: (event: any) => void;
  onStatusToggle: (product: Product) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetFilters: () => void;
  onExportPDF: () => void;
}
