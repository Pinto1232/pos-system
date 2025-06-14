export interface ProductExpiry {
  expiryId: number;
  variantId: number;
  productId: number;
  batchNumber: string;
  expiryDate: string;
  isDeleted: boolean;
  deletedAt?: string;
  isExpired: boolean;

  product?: {
    productId: number;
    name: string;
    brand: string;
    sku: string;
  };
  productVariant?: {
    variantId: number;
    variantName: string;
    sku: string;
  };
}

export interface ProductExpiryFormData {
  variantId: number;
  productId: number;
  batchNumber: string;
  expiryDate: string;
}

export interface ExpiryFilters {
  searchTerm: string;
  expiryStatus: 'all' | 'expired' | 'expiring-soon' | 'fresh';
  sortBy: 'expiryDate' | 'batchNumber' | 'productName';
  sortOrder: 'asc' | 'desc';
}

export interface ProductExpiryTrackingProps {
  showTitle?: boolean;
  compact?: boolean;
  maxItems?: number;
}
