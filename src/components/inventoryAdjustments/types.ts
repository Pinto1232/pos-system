export interface InventoryAdjustment {
  adjustmentId: number;
  productId: number;
  variantId?: number;
  adjustmentType:
    | 'increase'
    | 'decrease'
    | 'set'
    | 'damage'
    | 'loss'
    | 'found'
    | 'correction';
  quantityBefore: number;
  quantityAfter: number;
  quantityAdjusted: number;
  reason: string;
  notes?: string;
  adjustmentDate: string;
  createdBy: number;
  batchNumber?: string;
  location?: string;
  cost?: number;
  isApproved: boolean;
  approvedBy?: number;
  approvedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;

  product?: {
    productId: number;
    name: string;
    brand: string;
    sku: string;
    currentStock: number;
  };
  productVariant?: {
    variantId: number;
    variantName: string;
    sku: string;
    currentStock: number;
  };
  createdByUser?: {
    userId: number;
    username: string;
    fullName: string;
  };
  approvedByUser?: {
    userId: number;
    username: string;
    fullName: string;
  };
}

export interface InventoryAdjustmentFormData {
  productId: number;
  variantId?: number;
  adjustmentType: InventoryAdjustment['adjustmentType'];
  quantity: number;
  adjustmentMethod: 'adjust' | 'set';
  reason: string;
  notes?: string;
  batchNumber?: string;
  location?: string;
  cost?: number;
}

export interface AdjustmentFilters {
  searchTerm: string;
  adjustmentType: 'all' | InventoryAdjustment['adjustmentType'];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  approvalStatus: 'all' | 'pending' | 'approved';
  sortBy: 'adjustmentDate' | 'productName' | 'quantityAdjusted';
  sortOrder: 'asc' | 'desc';
}

export interface InventoryAdjustmentsProps {
  showTitle?: boolean;
  compact?: boolean;
  maxItems?: number;
  showApprovalActions?: boolean;
}

export interface AdjustmentReason {
  id: string;
  label: string;
  type: InventoryAdjustment['adjustmentType'][];
}
