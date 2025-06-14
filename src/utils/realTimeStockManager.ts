import { Product } from '@/components/productEdit/types';

export interface StockReservation {
  id: string;
  productId: number;
  quantity: number;
  reservedBy: string;
  reservationType: 'cart' | 'order' | 'manual';
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'expired' | 'released' | 'fulfilled';
}

export interface StockTransaction {
  id: string;
  productId: number;
  type:
    | 'sale'
    | 'return'
    | 'restock'
    | 'adjustment'
    | 'reservation'
    | 'release';
  quantity: number;
  previousStock: number;
  newStock: number;
  timestamp: Date;
  reference?: string;
  userId?: string;
  notes?: string;
}

export interface StockLock {
  productId: number;
  lockedQuantity: number;
  availableQuantity: number;
  totalStock: number;
  reservations: StockReservation[];
}

export interface SaleEvent {
  productId: number;
  quantity: number;
  orderId: string;
  timestamp: Date;
  customerId?: string;
  unitPrice: number;
  totalAmount: number;
}

export interface StockUpdateEventData {
  productId: number;
  newStock: number;
  availableStock: number;
  saleEvent?: SaleEvent;
  type?: 'return';
}

export interface StockReservedEventData {
  productId: number;
  quantity: number;
  reservationId: string;
  availableStock: number;
}

export interface StockReleasedEventData {
  productId: number;
  quantity: number;
  reservationId: string;
  availableStock: number;
}

export interface ReservationExpiredEventData {
  reservationId: string;
  productId: number;
  quantity: number;
}

export type EventData =
  | StockUpdateEventData
  | StockReservedEventData
  | StockReleasedEventData
  | ReservationExpiredEventData;

export class RealTimeStockManager {
  private static instance: RealTimeStockManager;
  private stockLocks: Map<number, StockLock> = new Map();
  private stockTransactions: StockTransaction[] = [];
  private reservations: Map<string, StockReservation> = new Map();
  private eventListeners: Map<string, Set<(data: EventData) => void>> =
    new Map();
  private syncTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeCleanupTimer();
    this.loadFromStorage();
  }

  public static getInstance(): RealTimeStockManager {
    if (!RealTimeStockManager.instance) {
      RealTimeStockManager.instance = new RealTimeStockManager();
    }
    return RealTimeStockManager.instance;
  }

  public on(event: string, callback: (data: EventData) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  public off(event: string, callback: (data: EventData) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: EventData): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  public reserveStock(
    productId: number,
    quantity: number,
    reservedBy: string,
    type: 'cart' | 'order' | 'manual' = 'cart',
    expirationMinutes: number = 30
  ): Promise<{ success: boolean; reservationId?: string; error?: string }> {
    return new Promise((resolve) => {
      try {
        const currentProduct = this.getCurrentProduct(productId);
        if (!currentProduct) {
          resolve({ success: false, error: 'Product not found' });
          return;
        }

        const stockLock = this.getOrCreateStockLock(
          productId,
          currentProduct.stock || 0
        );

        if (stockLock.availableQuantity < quantity) {
          resolve({
            success: false,
            error: `Insufficient stock. Available: ${stockLock.availableQuantity}, Requested: ${quantity}`,
          });
          return;
        }

        const reservationId = this.generateId();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

        const reservation: StockReservation = {
          id: reservationId,
          productId,
          quantity,
          reservedBy,
          reservationType: type,
          createdAt: new Date(),
          expiresAt,
          status: 'active',
        };

        this.reservations.set(reservationId, reservation);
        stockLock.reservations.push(reservation);
        stockLock.lockedQuantity += quantity;
        stockLock.availableQuantity -= quantity;

        this.recordTransaction({
          id: this.generateId(),
          productId,
          type: 'reservation',
          quantity: -quantity,
          previousStock: stockLock.availableQuantity + quantity,
          newStock: stockLock.availableQuantity,
          timestamp: new Date(),
          reference: reservationId,
          notes: `Stock reserved for ${type} by ${reservedBy}`,
        });

        this.saveToStorage();
        this.emit('stockReserved', {
          productId,
          quantity,
          reservationId,
          availableStock: stockLock.availableQuantity,
        });

        resolve({ success: true, reservationId });
      } catch (error) {
        console.error('Error reserving stock:', error);
        resolve({ success: false, error: 'Failed to reserve stock' });
      }
    });
  }

  public releaseReservation(
    reservationId: string
  ): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      try {
        const reservation = this.reservations.get(reservationId);
        if (!reservation || reservation.status !== 'active') {
          resolve({
            success: false,
            error: 'Reservation not found or already processed',
          });
          return;
        }

        const stockLock = this.stockLocks.get(reservation.productId);
        if (!stockLock) {
          resolve({ success: false, error: 'Stock lock not found' });
          return;
        }

        reservation.status = 'released';

        const reservationIndex = stockLock.reservations.findIndex(
          (r) => r.id === reservationId
        );
        if (reservationIndex !== -1) {
          stockLock.reservations.splice(reservationIndex, 1);
          stockLock.lockedQuantity -= reservation.quantity;
          stockLock.availableQuantity += reservation.quantity;
        }

        this.recordTransaction({
          id: this.generateId(),
          productId: reservation.productId,
          type: 'release',
          quantity: reservation.quantity,
          previousStock: stockLock.availableQuantity - reservation.quantity,
          newStock: stockLock.availableQuantity,
          timestamp: new Date(),
          reference: reservationId,
          notes: `Released reservation for ${reservation.reservationType}`,
        });

        this.saveToStorage();
        this.emit('stockReleased', {
          productId: reservation.productId,
          quantity: reservation.quantity,
          reservationId,
          availableStock: stockLock.availableQuantity,
        });

        resolve({ success: true });
      } catch (error) {
        console.error('Error releasing reservation:', error);
        resolve({ success: false, error: 'Failed to release reservation' });
      }
    });
  }

  public processSale(
    saleEvent: SaleEvent
  ): Promise<{ success: boolean; error?: string; newStock?: number }> {
    return new Promise((resolve) => {
      try {
        const currentProduct = this.getCurrentProduct(saleEvent.productId);
        if (!currentProduct) {
          resolve({ success: false, error: 'Product not found' });
          return;
        }

        const stockLock = this.getOrCreateStockLock(
          saleEvent.productId,
          currentProduct.stock || 0
        );

        if (stockLock.totalStock < saleEvent.quantity) {
          resolve({
            success: false,
            error: `Insufficient total stock. Available: ${stockLock.totalStock}, Required: ${saleEvent.quantity}`,
          });
          return;
        }

        const previousTotalStock = stockLock.totalStock;
        stockLock.totalStock -= saleEvent.quantity;
        stockLock.availableQuantity = Math.max(
          0,
          stockLock.totalStock - stockLock.lockedQuantity
        );

        this.updateProductStock(saleEvent.productId, stockLock.totalStock);

        this.updateProductSalesData(saleEvent);

        this.recordTransaction({
          id: this.generateId(),
          productId: saleEvent.productId,
          type: 'sale',
          quantity: -saleEvent.quantity,
          previousStock: previousTotalStock,
          newStock: stockLock.totalStock,
          timestamp: saleEvent.timestamp,
          reference: saleEvent.orderId,
          notes: `Sale processed - Order ${saleEvent.orderId}`,
        });

        this.saveToStorage();
        this.emit('stockUpdated', {
          productId: saleEvent.productId,
          newStock: stockLock.totalStock,
          availableStock: stockLock.availableQuantity,
          saleEvent,
        });

        resolve({ success: true, newStock: stockLock.totalStock });
      } catch (error) {
        console.error('Error processing sale:', error);
        resolve({ success: false, error: 'Failed to process sale' });
      }
    });
  }

  public processReturn(
    productId: number,
    quantity: number,
    orderId: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string; newStock?: number }> {
    return new Promise((resolve) => {
      try {
        const currentProduct = this.getCurrentProduct(productId);
        if (!currentProduct) {
          resolve({ success: false, error: 'Product not found' });
          return;
        }

        const stockLock = this.getOrCreateStockLock(
          productId,
          currentProduct.stock || 0
        );

        const previousTotalStock = stockLock.totalStock;
        stockLock.totalStock += quantity;
        stockLock.availableQuantity =
          stockLock.totalStock - stockLock.lockedQuantity;

        this.updateProductStock(productId, stockLock.totalStock);

        this.updateProductReturnData(productId, quantity);

        this.recordTransaction({
          id: this.generateId(),
          productId,
          type: 'return',
          quantity: quantity,
          previousStock: previousTotalStock,
          newStock: stockLock.totalStock,
          timestamp: new Date(),
          reference: orderId,
          notes: reason
            ? `Return processed - ${reason}`
            : `Return processed - Order ${orderId}`,
        });

        this.saveToStorage();
        this.emit('stockUpdated', {
          productId,
          newStock: stockLock.totalStock,
          availableStock: stockLock.availableQuantity,
          type: 'return',
        });

        resolve({ success: true, newStock: stockLock.totalStock });
      } catch (error) {
        console.error('Error processing return:', error);
        resolve({ success: false, error: 'Failed to process return' });
      }
    });
  }

  public getStockInfo(productId: number): StockLock | null {
    return this.stockLocks.get(productId) || null;
  }

  public getProductReservations(productId: number): StockReservation[] {
    return Array.from(this.reservations.values()).filter(
      (r) => r.productId === productId && r.status === 'active'
    );
  }

  public getProductTransactions(
    productId: number,
    limit: number = 50
  ): StockTransaction[] {
    return this.stockTransactions
      .filter((t) => t.productId === productId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private cleanupExpiredReservations(): void {
    const now = new Date();
    const expiredReservations = Array.from(this.reservations.values()).filter(
      (r) => r.status === 'active' && r.expiresAt < now
    );

    expiredReservations.forEach((reservation) => {
      reservation.status = 'expired';
      const stockLock = this.stockLocks.get(reservation.productId);
      if (stockLock) {
        const index = stockLock.reservations.findIndex(
          (r) => r.id === reservation.id
        );
        if (index !== -1) {
          stockLock.reservations.splice(index, 1);
          stockLock.lockedQuantity -= reservation.quantity;
          stockLock.availableQuantity += reservation.quantity;
        }
      }

      this.emit('reservationExpired', {
        reservationId: reservation.id,
        productId: reservation.productId,
        quantity: reservation.quantity,
      });
    });

    if (expiredReservations.length > 0) {
      this.saveToStorage();
    }
  }

  private initializeCleanupTimer(): void {
    this.syncTimer = setInterval(() => {
      this.cleanupExpiredReservations();
    }, 60000);
  }

  private getOrCreateStockLock(
    productId: number,
    totalStock: number
  ): StockLock {
    if (!this.stockLocks.has(productId)) {
      const activeReservations = this.getProductReservations(productId);
      const lockedQuantity = activeReservations.reduce(
        (sum, r) => sum + r.quantity,
        0
      );

      this.stockLocks.set(productId, {
        productId,
        totalStock,
        lockedQuantity,
        availableQuantity: totalStock - lockedQuantity,
        reservations: activeReservations,
      });
    }
    return this.stockLocks.get(productId)!;
  }

  private getCurrentProduct(productId: number): Product | null {
    try {
      const stored = localStorage.getItem('products');
      if (stored) {
        const products: Product[] = JSON.parse(stored);
        return products.find((p) => p.id === productId) || null;
      }
    } catch (error) {
      console.error('Error getting current product:', error);
    }
    return null;
  }

  private updateProductStock(productId: number, newStock: number): void {
    try {
      const stored = localStorage.getItem('products');
      if (stored) {
        const products: Product[] = JSON.parse(stored);
        const productIndex = products.findIndex((p) => p.id === productId);
        if (productIndex !== -1) {
          products[productIndex].stock = newStock;
          localStorage.setItem('products', JSON.stringify(products));
        }
      }
    } catch (error) {
      console.error('Error updating product stock:', error);
    }
  }

  private updateProductSalesData(saleEvent: SaleEvent): void {
    try {
      const stored = localStorage.getItem('products');
      if (stored) {
        const products: Product[] = JSON.parse(stored);
        const productIndex = products.findIndex(
          (p) => p.id === saleEvent.productId
        );
        if (productIndex !== -1) {
          const product = products[productIndex];
          product.salesCount = (product.salesCount || 0) + saleEvent.quantity;
          product.lastSoldDate = saleEvent.timestamp.toISOString();
          product.totalRevenue =
            (product.totalRevenue || 0) + saleEvent.totalAmount;
          localStorage.setItem('products', JSON.stringify(products));
        }
      }
    } catch (error) {
      console.error('Error updating product sales data:', error);
    }
  }

  private updateProductReturnData(productId: number, quantity: number): void {
    try {
      const stored = localStorage.getItem('products');
      if (stored) {
        const products: Product[] = JSON.parse(stored);
        const productIndex = products.findIndex((p) => p.id === productId);
        if (productIndex !== -1) {
          const product = products[productIndex];
          product.returnCount = (product.returnCount || 0) + quantity;
          localStorage.setItem('products', JSON.stringify(products));
        }
      }
    } catch (error) {
      console.error('Error updating product return data:', error);
    }
  }

  private recordTransaction(transaction: StockTransaction): void {
    this.stockTransactions.push(transaction);

    if (this.stockTransactions.length > 1000) {
      this.stockTransactions = this.stockTransactions.slice(-1000);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveToStorage(): void {
    try {
      const data = {
        reservations: Array.from(this.reservations.entries()),
        stockLocks: Array.from(this.stockLocks.entries()),
        transactions: this.stockTransactions.slice(-500),
      };
      localStorage.setItem('stockManager', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving stock manager data:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('stockManager');
      if (stored) {
        const data = JSON.parse(stored);

        if (data.reservations) {
          this.reservations = new Map(
            data.reservations.map(
              ([id, reservation]: [string, StockReservation]) => [
                id,
                {
                  ...reservation,
                  createdAt: new Date(reservation.createdAt),
                  expiresAt: new Date(reservation.expiresAt),
                },
              ]
            )
          );
        }

        if (data.stockLocks) {
          this.stockLocks = new Map(data.stockLocks);
        }

        if (data.transactions) {
          this.stockTransactions = data.transactions.map(
            (
              t: Omit<StockTransaction, 'timestamp'> & { timestamp: string }
            ) => ({
              ...t,
              timestamp: new Date(t.timestamp),
            })
          );
        }
      }
    } catch (error) {
      console.error('Error loading stock manager data:', error);
    }
  }

  public getAllStockLocks(): Map<number, StockLock> {
    return new Map(this.stockLocks);
  }

  public clearAllData(): void {
    this.stockLocks.clear();
    this.reservations.clear();
    this.stockTransactions = [];
    localStorage.removeItem('stockManager');
  }

  public destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    this.eventListeners.clear();
  }
}

export const stockManager = RealTimeStockManager.getInstance();
