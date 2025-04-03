import { SelectChangeEvent } from "@mui/material/Select";

export interface Product {
    name: string;
    idCode: string;
    price: number;
    status: boolean;
    rating: number;
    color?: string;
    image: string;
    createdAt: string;
    sku: string;
}

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
    onPriceChange: (event: SelectChangeEvent) => void;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCategoryChange: (event: SelectChangeEvent) => void;
    onRatingChange: (event: SelectChangeEvent) => void;
    onStatusChange: (event: SelectChangeEvent) => void;
    onStatusToggle: (product: Product) => void;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onResetFilters: () => void;
    onExportPDF: () => void;
} 