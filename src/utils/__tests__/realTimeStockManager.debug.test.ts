import { RealTimeStockManager } from '../realTimeStockManager';

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

// Mock product data
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

const mockProducts = [mockProduct];

describe('RealTimeStockManager Debug', () => {
  let stockManager: RealTimeStockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup localStorage mock
    localStorageMock.getItem.mockImplementation((key: string) => {
      console.log('localStorage.getItem called with key:', key);
      if (key === 'products') {
        console.log('Returning products:', JSON.stringify(mockProducts));
        return JSON.stringify(mockProducts);
      }
      if (key === 'stockManager') {
        console.log('Returning null for stockManager');
        return null;
      }
      console.log('Returning null for unknown key:', key);
      return null;
    });

    // Reset singleton
    // @ts-expect-error Accessing private instance property for testing purposes
    RealTimeStockManager.instance = undefined;
    stockManager = RealTimeStockManager.getInstance();
  });

  it('should debug the stock reservation process', async () => {
    console.log('Starting debug test...');

    // Check if product is found
    const result = await stockManager.reserveStock(1, 10, 'user123', 'cart');

    console.log('Result:', result);
    console.log(
      'localStorage.getItem calls:',
      localStorageMock.getItem.mock.calls
    );
    console.log(
      'localStorage.setItem calls:',
      localStorageMock.setItem.mock.calls
    );

    // Let's also check what's in the stock manager
    const stockInfo = stockManager.getStockInfo(1);
    console.log('Stock info:', stockInfo);

    const reservations = stockManager.getProductReservations(1);
    console.log('Reservations:', reservations);

    const transactions = stockManager.getProductTransactions(1);
    console.log('Transactions:', transactions);
  });
});
