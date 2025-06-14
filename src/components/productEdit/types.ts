export interface Product {
  id: number;
  image?: string;
  productName: string;
  color: string;
  barcode: string;
  sku: string;
  price: number;
  status: boolean;
  rating: number;
  createdAt: string;
  stock?: number;
  sales?: number;
  discount?: number;
  statusProduct?: string;
  category?: string;
  categoryId?: number;
  subcategory?: string;
  subcategoryId?: number;

  salesCount?: number;
  returnCount?: number;
  lastSoldDate?: string | null;
  totalRevenue?: number;

  minStockThreshold?: number;
  maxStockThreshold?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  costPrice?: number;
  supplierInfo?: {
    name: string;
    contactEmail?: string;
    contactPhone?: string;
    leadTimeDays?: number;
  };
  stockLocation?: {
    warehouse?: string;
    aisle?: string;
    shelf?: string;
  };
  stockMetrics?: {
    avgDailySales?: number;
    salesVelocity?: number;
    lastRestockDate?: string;
    daysUntilOutOfStock?: number;
  };
}

export interface ProductEditProps {
  products: Product[];
  onAddItem: (
    product: Omit<Product, 'stock' | 'sales' | 'discount'>,
    resetForm: () => void
  ) => void;
  onUpdateItem: (
    product: Omit<Product, 'stock' | 'sales' | 'discount'>
  ) => void;
  onDeleteItem: (productId: number) => void;
  onNewSession: () => void;
  onCollectPayment: () => void;
  onAddDiscount: () => void;
  onCancelSession: () => void;
  subTotal: number;
  discount: number;
  total: number;
  itemNo: number;
  showStockWarnings?: boolean;
}
