import { Product as ProductEditProduct } from '../productEdit/types';
import { SelectChangeEvent } from '@mui/material/Select';

export interface ExtendedProduct extends ProductEditProduct {
  statusProduct?: string;
}

export type Product = ExtendedProduct;

export interface ProductTableProps {
  products: Product[];
  selectedProduct: Product | null;
  isViewModalOpen: boolean;
  page: number;
  rowsPerPage: number;
  searchQuery: string;
  categoryFilter: string;
  ratingFilter: string;
  statusFilter: string;
  priceFilter: string;
  salesFilter: string;
  onView: (product: Product) => void;
  onCloseModal: () => void;
  onPriceChange: (event: SelectChangeEvent) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (event: SelectChangeEvent) => void;
  onRatingChange: (event: SelectChangeEvent) => void;
  onStatusChange: (event: SelectChangeEvent) => void;
  onSalesChange: (event: SelectChangeEvent) => void;
  onStatusToggle: (product: Product) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetFilters: () => void;
  onExportPDF: () => void;
  onDeleteProduct?: (product: Product) => Promise<void>;
  onAddToCart?: (product: Product, quantity: number) => void;
  showStockWarnings?: boolean;
}
