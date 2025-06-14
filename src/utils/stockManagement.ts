export interface StockLevel {
  level: 'out_of_stock' | 'low_stock' | 'normal' | 'high_stock';
  message: string;
  color: 'error' | 'warning' | 'success' | 'info';
  severity: 'critical' | 'warning' | 'normal';
}

export interface DeletionCheck {
  canDelete: boolean;
  reason?: string;
  restrictions: string[];
}

export interface StockThresholds {
  outOfStock: number;
  lowStock: number;
  normalStock: number;
  highStock: number;
}

const DEFAULT_THRESHOLDS: StockThresholds = {
  outOfStock: 0,
  lowStock: 10,
  normalStock: 50,
  highStock: 100,
};

export function getStockLevel(
  currentStock: number = 0,
  thresholds: StockThresholds = DEFAULT_THRESHOLDS
): StockLevel {
  if (currentStock <= thresholds.outOfStock) {
    return {
      level: 'out_of_stock',
      message: 'Out of Stock',
      color: 'error',
      severity: 'critical',
    };
  }

  if (currentStock <= thresholds.lowStock) {
    return {
      level: 'low_stock',
      message: `Low Stock (${currentStock} remaining)`,
      color: 'warning',
      severity: 'warning',
    };
  }

  if (currentStock <= thresholds.normalStock) {
    return {
      level: 'normal',
      message: `In Stock (${currentStock} available)`,
      color: 'success',
      severity: 'normal',
    };
  }

  return {
    level: 'high_stock',
    message: `Well Stocked (${currentStock} available)`,
    color: 'info',
    severity: 'normal',
  };
}

export function canDeleteProduct(
  productId: number,
  hasActiveTransactions: boolean = false,
  hasInventoryMovements: boolean = false,
  currentStock: number = 0,
  recentSales: number = 0
): DeletionCheck {
  const restrictions: string[] = [];

  if (hasActiveTransactions) {
    restrictions.push('Product is linked to ongoing transactions');
  }

  if (hasInventoryMovements) {
    restrictions.push('Product has recent inventory movements');
  }

  if (currentStock > 0) {
    restrictions.push(`Product has ${currentStock} units in stock`);
  }

  if (recentSales > 0) {
    restrictions.push(`Product had ${recentSales} sales in the last 30 days`);
  }

  const canDelete = restrictions.length === 0;

  return {
    canDelete,
    reason: canDelete
      ? undefined
      : 'Cannot delete product due to business restrictions',
    restrictions,
  };
}

export async function checkActiveTransactions(
  productId: number
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return Math.random() > 0.8;
}

export async function checkInventoryMovements(
  productId: number
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return Math.random() > 0.7;
}

export async function getRecentSales(productId: number): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return Math.floor(Math.random() * 20);
}

export async function validateProductDeletion(
  productId: number,
  currentStock: number = 0
): Promise<DeletionCheck> {
  try {
    const [hasActiveTransactions, hasInventoryMovements, recentSales] =
      await Promise.all([
        checkActiveTransactions(productId),
        checkInventoryMovements(productId),
        getRecentSales(productId),
      ]);

    return canDeleteProduct(
      productId,
      hasActiveTransactions,
      hasInventoryMovements,
      currentStock,
      recentSales
    );
  } catch (error) {
    console.error('Error validating product deletion:', error);
    return {
      canDelete: false,
      reason: 'Unable to validate deletion due to system error',
      restrictions: ['System validation failed'],
    };
  }
}

export function getStockStatusBatch(
  products: Array<{ id: number; stock?: number }>,
  thresholds: StockThresholds = DEFAULT_THRESHOLDS
): Map<number, StockLevel> {
  const stockMap = new Map<number, StockLevel>();

  products.forEach((product) => {
    const stockLevel = getStockLevel(product.stock || 0, thresholds);
    stockMap.set(product.id, stockLevel);
  });

  return stockMap;
}

export function filterByStockLevel<T extends { id: number; stock?: number }>(
  products: T[],
  level: StockLevel['level'],
  thresholds: StockThresholds = DEFAULT_THRESHOLDS
): T[] {
  return products.filter((product) => {
    const stockLevel = getStockLevel(product.stock || 0, thresholds);
    return stockLevel.level === level;
  });
}

export function getProductsNeedingAttention<
  T extends { id: number; stock?: number },
>(
  products: T[],
  thresholds: StockThresholds = DEFAULT_THRESHOLDS
): Array<T & { stockLevel: StockLevel }> {
  return products
    .map((product) => ({
      ...product,
      stockLevel: getStockLevel(product.stock || 0, thresholds),
    }))
    .filter(
      (product) =>
        product.stockLevel.level === 'out_of_stock' ||
        product.stockLevel.level === 'low_stock'
    )
    .sort((a, b) => {
      if (
        a.stockLevel.level === 'out_of_stock' &&
        b.stockLevel.level !== 'out_of_stock'
      )
        return -1;
      if (
        b.stockLevel.level === 'out_of_stock' &&
        a.stockLevel.level !== 'out_of_stock'
      )
        return 1;

      return (a.stock || 0) - (b.stock || 0);
    });
}
