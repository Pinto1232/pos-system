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
}
