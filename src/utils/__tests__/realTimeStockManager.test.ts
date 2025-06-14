import { RealTimeStockManager, SaleEvent } from '../realTimeStockManager';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock product data structure matching the actual Product interface
const mockProduct = {
  id: 1,
  productName: 'Test Product',
  stock: 100,
  price: 10.99,
  barcode: 'TEST123',
  sku: 'TEST-SKU-001',
  color: 'red',
  status: true,
  rating: 4.5,
  createdAt: '2023-01-01T00:00:00.000Z',
  sales: 0,
  discount: 0,
  statusProduct: 'active',
  salesCount: 0,
  returnCount: 0,
  lastSoldDate: null,
  totalRevenue: 0,
};

// Mock products storage
const mockProducts = [mockProduct];

describe('RealTimeStockManager', () => {
  let stockManager: RealTimeStockManager;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    // Mock localStorage to return mock products
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'products') {
        return JSON.stringify(mockProducts);
      }
      return null;
    });

    // Get fresh instance of stock manager
    // @ts-expect-error - Reset singleton for testing
    RealTimeStockManager.instance = undefined;
    stockManager = RealTimeStockManager.getInstance();
  });

  afterEach(() => {
    // Clean up timers
    jest.clearAllTimers();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = RealTimeStockManager.getInstance();
      const instance2 = RealTimeStockManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Stock Reservation', () => {
    it('should successfully reserve stock when available', async () => {
      const result = await stockManager.reserveStock(1, 10, 'user123', 'cart');

      expect(result.success).toBe(true);
      expect(result.reservationId).toBeDefined();
      expect(result.error).toBeUndefined();

      const stockInfo = stockManager.getStockInfo(1);
      expect(stockInfo?.lockedQuantity).toBe(10);
      expect(stockInfo?.availableQuantity).toBe(90);
    });

    it('should fail to reserve stock when insufficient', async () => {
      const result = await stockManager.reserveStock(1, 150, 'user123', 'cart');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient stock');
      expect(result.reservationId).toBeUndefined();
    });

    it('should fail to reserve stock for non-existent product', async () => {
      const result = await stockManager.reserveStock(
        999,
        10,
        'user123',
        'cart'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Product not found');
    });

    it('should handle multiple reservations correctly', async () => {
      await stockManager.reserveStock(1, 20, 'user1', 'cart');
      await stockManager.reserveStock(1, 15, 'user2', 'cart');

      const stockInfo = stockManager.getStockInfo(1);
      expect(stockInfo?.lockedQuantity).toBe(35);
      expect(stockInfo?.availableQuantity).toBe(65);

      const reservations = stockManager.getProductReservations(1);
      expect(reservations).toHaveLength(2);
    });
  });

  describe('Stock Release', () => {
    it('should successfully release a reservation', async () => {
      const reserveResult = await stockManager.reserveStock(
        1,
        25,
        'user123',
        'cart'
      );
      expect(reserveResult.success).toBe(true);

      const releaseResult = await stockManager.releaseReservation(
        reserveResult.reservationId!
      );
      expect(releaseResult.success).toBe(true);

      const stockInfo = stockManager.getStockInfo(1);
      expect(stockInfo?.lockedQuantity).toBe(0);
      expect(stockInfo?.availableQuantity).toBe(100);
    });

    it('should fail to release non-existent reservation', async () => {
      const result = await stockManager.releaseReservation('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Reservation not found or already processed');
    });

    it('should fail to release already processed reservation', async () => {
      const reserveResult = await stockManager.reserveStock(
        1,
        10,
        'user123',
        'cart'
      );
      await stockManager.releaseReservation(reserveResult.reservationId!);

      const secondReleaseResult = await stockManager.releaseReservation(
        reserveResult.reservationId!
      );
      expect(secondReleaseResult.success).toBe(false);
      expect(secondReleaseResult.error).toBe(
        'Reservation not found or already processed'
      );
    });
  });

  describe('Sale Processing', () => {
    it('should successfully process a sale', async () => {
      const saleEvent: SaleEvent = {
        productId: 1,
        quantity: 15,
        orderId: 'ORDER-001',
        timestamp: new Date(),
        customerId: 'CUST-001',
        unitPrice: 10.99,
        totalAmount: 164.85,
      };

      const result = await stockManager.processSale(saleEvent);

      expect(result.success).toBe(true);
      expect(result.newStock).toBe(85);

      const stockInfo = stockManager.getStockInfo(1);
      expect(stockInfo?.totalStock).toBe(85);
    });

    it('should fail to process sale with insufficient stock', async () => {
      const saleEvent: SaleEvent = {
        productId: 1,
        quantity: 150,
        orderId: 'ORDER-002',
        timestamp: new Date(),
        customerId: 'CUST-001',
        unitPrice: 10.99,
        totalAmount: 1648.5,
      };

      const result = await stockManager.processSale(saleEvent);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient total stock');
    });

    it('should process sale even with reserved stock if total stock is sufficient', async () => {
      // Reserve some stock first
      await stockManager.reserveStock(1, 30, 'user123', 'cart');

      const saleEvent: SaleEvent = {
        productId: 1,
        quantity: 20,
        orderId: 'ORDER-003',
        timestamp: new Date(),
        customerId: 'CUST-001',
        unitPrice: 10.99,
        totalAmount: 219.8,
      };

      const result = await stockManager.processSale(saleEvent);

      expect(result.success).toBe(true);
      expect(result.newStock).toBe(80);

      const stockInfo = stockManager.getStockInfo(1);
      expect(stockInfo?.totalStock).toBe(80);
      expect(stockInfo?.availableQuantity).toBe(50); // 80 - 30 reserved
    });
  });

  describe('Return Processing', () => {
    it('should successfully process a return', async () => {
      // First process a sale
      const saleEvent: SaleEvent = {
        productId: 1,
        quantity: 20,
        orderId: 'ORDER-004',
        timestamp: new Date(),
        customerId: 'CUST-001',
        unitPrice: 10.99,
        totalAmount: 219.8,
      };
      await stockManager.processSale(saleEvent);

      // Then process a return
      const result = await stockManager.processReturn(
        1,
        5,
        'ORDER-004',
        'Defective item'
      );

      expect(result.success).toBe(true);
      expect(result.newStock).toBe(85);

      const stockInfo = stockManager.getStockInfo(1);
      expect(stockInfo?.totalStock).toBe(85);
    });

    it('should fail to process return for non-existent product', async () => {
      const result = await stockManager.processReturn(
        999,
        5,
        'ORDER-004',
        'Defective item'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Product not found');
    });
  });

  describe('Event System', () => {
    it('should emit stockReserved event when stock is reserved', async () => {
      const eventCallback = jest.fn();
      stockManager.on('stockReserved', eventCallback);

      await stockManager.reserveStock(1, 10, 'user123', 'cart');

      expect(eventCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 1,
          quantity: 10,
          reservationId: expect.any(String),
          availableStock: 90,
        })
      );
    });

    it('should emit stockReleased event when reservation is released', async () => {
      const eventCallback = jest.fn();
      stockManager.on('stockReleased', eventCallback);

      const reserveResult = await stockManager.reserveStock(
        1,
        10,
        'user123',
        'cart'
      );
      await stockManager.releaseReservation(reserveResult.reservationId!);

      expect(eventCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 1,
          quantity: 10,
          reservationId: reserveResult.reservationId,
          availableStock: 100,
        })
      );
    });

    it('should emit stockUpdated event when sale is processed', async () => {
      const eventCallback = jest.fn();
      stockManager.on('stockUpdated', eventCallback);

      const saleEvent: SaleEvent = {
        productId: 1,
        quantity: 15,
        orderId: 'ORDER-005',
        timestamp: new Date(),
        customerId: 'CUST-001',
        unitPrice: 10.99,
        totalAmount: 164.85,
      };

      await stockManager.processSale(saleEvent);

      expect(eventCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 1,
          newStock: 85,
          availableStock: 85,
          saleEvent,
        })
      );
    });

    it('should remove event listeners correctly', async () => {
      const eventCallback = jest.fn();
      stockManager.on('stockReserved', eventCallback);
      stockManager.off('stockReserved', eventCallback);

      await stockManager.reserveStock(1, 10, 'user123', 'cart');

      expect(eventCallback).not.toHaveBeenCalled();
    });
  });

  describe('Transaction History', () => {
    it('should record transactions for reservations', async () => {
      await stockManager.reserveStock(1, 10, 'user123', 'cart');

      const transactions = stockManager.getProductTransactions(1);
      expect(transactions).toHaveLength(1);
      expect(transactions[0].type).toBe('reservation');
      expect(transactions[0].quantity).toBe(-10);
    });

    it('should record transactions for releases', async () => {
      const reserveResult = await stockManager.reserveStock(
        1,
        10,
        'user123',
        'cart'
      );
      await stockManager.releaseReservation(reserveResult.reservationId!);

      const transactions = stockManager.getProductTransactions(1);
      expect(transactions).toHaveLength(2);
      expect(transactions[0].type).toBe('release'); // Most recent first
      expect(transactions[1].type).toBe('reservation');
    });

    it('should record transactions for sales', async () => {
      const saleEvent: SaleEvent = {
        productId: 1,
        quantity: 15,
        orderId: 'ORDER-006',
        timestamp: new Date(),
        customerId: 'CUST-001',
        unitPrice: 10.99,
        totalAmount: 164.85,
      };

      await stockManager.processSale(saleEvent);

      const transactions = stockManager.getProductTransactions(1);
      expect(transactions).toHaveLength(1);
      expect(transactions[0].type).toBe('sale');
      expect(transactions[0].quantity).toBe(-15);
      expect(transactions[0].reference).toBe('ORDER-006');
    });

    it('should record transactions for returns', async () => {
      await stockManager.processReturn(
        1,
        5,
        'ORDER-007',
        'Customer changed mind'
      );

      const transactions = stockManager.getProductTransactions(1);
      expect(transactions).toHaveLength(1);
      expect(transactions[0].type).toBe('return');
      expect(transactions[0].quantity).toBe(5);
      expect(transactions[0].reference).toBe('ORDER-007');
    });
  });

  describe('Stock Information', () => {
    it('should return correct stock info', async () => {
      await stockManager.reserveStock(1, 20, 'user123', 'cart');

      const stockInfo = stockManager.getStockInfo(1);
      expect(stockInfo).toEqual({
        productId: 1,
        lockedQuantity: 20,
        availableQuantity: 80,
        totalStock: 100,
        reservations: expect.arrayContaining([
          expect.objectContaining({
            productId: 1,
            quantity: 20,
            reservedBy: 'user123',
            reservationType: 'cart',
            status: 'active',
          }),
        ]),
      });
    });

    it('should return null for non-existent product stock info', () => {
      const stockInfo = stockManager.getStockInfo(999);
      expect(stockInfo).toBeNull();
    });

    it('should return active reservations for a product', async () => {
      await stockManager.reserveStock(1, 10, 'user1', 'cart');
      await stockManager.reserveStock(1, 15, 'user2', 'order');

      const reservations = stockManager.getProductReservations(1);
      expect(reservations).toHaveLength(2);
      expect(reservations.every((r) => r.status === 'active')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully in reservation', async () => {
      // Mock an error in the reservation process
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Test with invalid data that might cause an error
      const result = await stockManager.reserveStock(-1, 10, '', 'cart');

      // The function should handle the error and return a failure result
      expect(result.success).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should handle event listener errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const errorCallback = jest.fn(() => {
        throw new Error('Event handler error');
      });

      stockManager.on('stockReserved', errorCallback);
      await stockManager.reserveStock(1, 10, 'user123', 'cart');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in event listener for stockReserved:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Storage Integration', () => {
    it('should save data to localStorage after operations', async () => {
      await stockManager.reserveStock(1, 10, 'user123', 'cart');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'stockManager',
        expect.any(String)
      );
    });

    it('should handle storage loading correctly', () => {
      const mockData = {
        stockLocks: [
          [
            1,
            {
              productId: 1,
              lockedQuantity: 10,
              availableQuantity: 90,
              totalStock: 100,
              reservations: [],
            },
          ],
        ],
        transactions: [
          {
            id: 'test-id',
            productId: 1,
            type: 'sale',
            quantity: -5,
            previousStock: 100,
            newStock: 95,
            timestamp: '2023-01-01T00:00:00.000Z',
            reference: 'ORDER-001',
          },
        ],
        reservations: [],
      };

      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'stockManager') {
          return JSON.stringify(mockData);
        }
        if (key === 'products') {
          return JSON.stringify(mockProducts);
        }
        return null;
      });

      // @ts-expect-error - Reset singleton for testing
      RealTimeStockManager.instance = undefined;
      const newStockManager = RealTimeStockManager.getInstance();

      const stockInfo = newStockManager.getStockInfo(1);
      expect(stockInfo?.lockedQuantity).toBe(10);

      const transactions = newStockManager.getProductTransactions(1);
      expect(transactions).toHaveLength(1);
      expect(transactions[0].timestamp).toBeInstanceOf(Date);
    });
  });
});
