export interface Product {
  id: number;
  productName: string;
  barcode: string;
  sku: string;
  price: number;
  statusProduct: string;
  rating: number;
  createdAt: string;
  image: string;
  stock?: number;
  sales?: number;
  discount?: number;
}

export interface ProductEditProps {
  products: Product[];
  onAddItem: (product: Omit<Product, 'stock' | 'sales' | 'discount'>) => void;
  onUpdateItem: (product: Omit<Product, 'stock' | 'sales' | 'discount'>) => void;
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