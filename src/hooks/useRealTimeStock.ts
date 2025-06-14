import { useState, useEffect, useCallback, useRef } from 'react';
import {
  stockManager,
  StockLock,
  StockReservation,
  SaleEvent,
  EventData,
} from '@/utils/realTimeStockManager';

interface StockUpdateEventData {
  productId: number;
  newStock: number;
  availableStock: number;
  saleEvent?: SaleEvent;
  type?: 'return';
}

interface StockReservedEventData {
  productId: number;
  quantity: number;
  reservationId: string;
  availableStock: number;
}

interface StockReleasedEventData {
  productId: number;
  quantity: number;
  reservationId: string;
  availableStock: number;
}

interface ReservationExpiredEventData {
  reservationId: string;
  productId: number;
  quantity: number;
}

export interface UseRealTimeStockResult {
  stockInfo: StockLock | null;
  reservations: StockReservation[];
  isLoading: boolean;
  error: string | null;

  reserveStock: (
    quantity: number,
    reservedBy: string,
    type?: 'cart' | 'order' | 'manual',
    expirationMinutes?: number
  ) => Promise<{ success: boolean; reservationId?: string; error?: string }>;
  releaseReservation: (
    reservationId: string
  ) => Promise<{ success: boolean; error?: string }>;
  processSale: (
    saleEvent: SaleEvent
  ) => Promise<{ success: boolean; error?: string; newStock?: number }>;
  processReturn: (
    quantity: number,
    orderId: string,
    reason?: string
  ) => Promise<{ success: boolean; error?: string; newStock?: number }>;
  refreshStockInfo: () => void;
}

export function useRealTimeStock(productId: number): UseRealTimeStockResult {
  const [stockInfo, setStockInfo] = useState<StockLock | null>(null);
  const [reservations, setReservations] = useState<StockReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refreshStockInfo = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const info = stockManager.getStockInfo(productId);
      const productReservations =
        stockManager.getProductReservations(productId);

      if (mountedRef.current) {
        setStockInfo(info);
        setReservations(productReservations);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load stock information'
        );
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [productId]);

  const reserveStock = useCallback(
    async (
      quantity: number,
      reservedBy: string,
      type: 'cart' | 'order' | 'manual' = 'cart',
      expirationMinutes: number = 30
    ) => {
      setError(null);
      try {
        const result = await stockManager.reserveStock(
          productId,
          quantity,
          reservedBy,
          type,
          expirationMinutes
        );
        if (result.success) {
          refreshStockInfo();
        } else {
          setError(result.error || 'Failed to reserve stock');
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to reserve stock';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [productId, refreshStockInfo]
  );

  const releaseReservation = useCallback(
    async (reservationId: string) => {
      setError(null);
      try {
        const result = await stockManager.releaseReservation(reservationId);
        if (result.success) {
          refreshStockInfo();
        } else {
          setError(result.error || 'Failed to release reservation');
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to release reservation';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [refreshStockInfo]
  );

  const processSale = useCallback(
    async (saleEvent: SaleEvent) => {
      setError(null);
      try {
        const result = await stockManager.processSale(saleEvent);
        if (result.success) {
          refreshStockInfo();
        } else {
          setError(result.error || 'Failed to process sale');
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to process sale';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [refreshStockInfo]
  );

  const processReturn = useCallback(
    async (quantity: number, orderId: string, reason?: string) => {
      setError(null);
      try {
        const result = await stockManager.processReturn(
          productId,
          quantity,
          orderId,
          reason
        );
        if (result.success) {
          refreshStockInfo();
        } else {
          setError(result.error || 'Failed to process return');
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to process return';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [productId, refreshStockInfo]
  );

  useEffect(() => {
    const handleStockUpdate = (data: EventData) => {
      const stockUpdateData = data as StockUpdateEventData;
      if (stockUpdateData.productId === productId && mountedRef.current) {
        refreshStockInfo();
      }
    };

    const handleStockReserved = (data: EventData) => {
      const stockReservedData = data as StockReservedEventData;
      if (stockReservedData.productId === productId && mountedRef.current) {
        refreshStockInfo();
      }
    };

    const handleStockReleased = (data: EventData) => {
      const stockReleasedData = data as StockReleasedEventData;
      if (stockReleasedData.productId === productId && mountedRef.current) {
        refreshStockInfo();
      }
    };

    const handleReservationExpired = (data: EventData) => {
      const reservationExpiredData = data as ReservationExpiredEventData;
      if (
        reservationExpiredData.productId === productId &&
        mountedRef.current
      ) {
        refreshStockInfo();
      }
    };

    stockManager.on('stockUpdated', handleStockUpdate);
    stockManager.on('stockReserved', handleStockReserved);
    stockManager.on('stockReleased', handleStockReleased);
    stockManager.on('reservationExpired', handleReservationExpired);

    refreshStockInfo();

    return () => {
      stockManager.off('stockUpdated', handleStockUpdate);
      stockManager.off('stockReserved', handleStockReserved);
      stockManager.off('stockReleased', handleStockReleased);
      stockManager.off('reservationExpired', handleReservationExpired);
    };
  }, [productId, refreshStockInfo]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    stockInfo,
    reservations,
    isLoading,
    error,
    reserveStock,
    releaseReservation,
    processSale,
    processReturn,
    refreshStockInfo,
  };
}

export function useRealTimeStockBatch(productIds: number[]) {
  const [stockData, setStockData] = useState<Map<number, StockLock>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refreshAllStockInfo = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const allStockLocks = stockManager.getAllStockLocks();
      const relevantStocks = new Map<number, StockLock>();

      productIds.forEach((id) => {
        const stockInfo = allStockLocks.get(id);
        if (stockInfo) {
          relevantStocks.set(id, stockInfo);
        }
      });

      if (mountedRef.current) {
        setStockData(relevantStocks);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load stock information'
        );
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [productIds]);

  useEffect(() => {
    const handleStockUpdate = (data: EventData) => {
      const stockUpdateData = data as StockUpdateEventData;
      if (
        productIds.includes(stockUpdateData.productId) &&
        mountedRef.current
      ) {
        refreshAllStockInfo();
      }
    };

    const handleStockReserved = (data: EventData) => {
      const stockReservedData = data as StockReservedEventData;
      if (
        productIds.includes(stockReservedData.productId) &&
        mountedRef.current
      ) {
        refreshAllStockInfo();
      }
    };

    const handleStockReleased = (data: EventData) => {
      const stockReleasedData = data as StockReleasedEventData;
      if (
        productIds.includes(stockReleasedData.productId) &&
        mountedRef.current
      ) {
        refreshAllStockInfo();
      }
    };

    stockManager.on('stockUpdated', handleStockUpdate);
    stockManager.on('stockReserved', handleStockReserved);
    stockManager.on('stockReleased', handleStockReleased);

    refreshAllStockInfo();

    return () => {
      stockManager.off('stockUpdated', handleStockUpdate);
      stockManager.off('stockReserved', handleStockReserved);
      stockManager.off('stockReleased', handleStockReleased);
    };
  }, [productIds, refreshAllStockInfo]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    stockData,
    isLoading,
    error,
    refreshAllStockInfo,
  };
}
