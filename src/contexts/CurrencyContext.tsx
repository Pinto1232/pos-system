'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import axios from 'axios';
import { fetchUserLocation } from '@/api/currencyApi';

export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  KRW: '₩',
  INR: '₹',
  BRL: 'R$',
  CAD: 'C$',
  AUD: 'A$',
  ZAR: 'R',
  Kz: 'Kz',
};

interface CurrencyContextType {
  currency: string;
  rate: number;
  setCurrency: (currency: string) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  rate: 1,
  setCurrency: () => {},
  formatPrice: () => '',
  convertPrice: (price) => price,
  currencySymbol: '$',
});

// Provider component
interface CurrencyProviderProps {
  children: ReactNode;
}

// Cache for exchange rates to prevent redundant API calls
const exchangeRateCache: Record<string, number> = {};

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<string>('USD');
  const [rate, setRate] = useState<number>(1);
  const fetchInProgress = useRef(false);
  const lastFetchTime = useRef<number>(0);

  const fetchExchangeRate = useCallback(async (currencyCode: string) => {
    if (fetchInProgress.current) {
      console.log('Exchange rate fetch already in progress, skipping');
      return;
    }

    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    if (
      now - lastFetchTime.current < thirtyMinutes &&
      exchangeRateCache[currencyCode]
    ) {
      console.log(
        `Using cached exchange rate for ${currencyCode}: ${exchangeRateCache[currencyCode]}`
      );
      setRate(exchangeRateCache[currencyCode]);
      return;
    }

    try {
      fetchInProgress.current = true;
      console.log(`Fetching exchange rate for ${currencyCode}`);

      const OPEN_EXCHANGE_APP_ID = 'c88ce4a807aa43c3b578f19b66eef7be';
      const response = await axios.get(
        `https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_APP_ID}`
      );

      if (
        response.data &&
        response.data.rates &&
        response.data.rates[currencyCode]
      ) {
        const newRate = response.data.rates[currencyCode];
        setRate(newRate);

        exchangeRateCache[currencyCode] = newRate;
        lastFetchTime.current = now;

        console.log(`Exchange rate for ${currencyCode} set to ${newRate}`);
      } else {
        console.warn(
          `Exchange rate for ${currencyCode} not found, using default rate of 1`
        );
        setRate(1);
      }
    } catch (error) {
      console.error(
        'Error fetching exchange rate:',
        JSON.stringify(error, null, 2)
      );
      setRate(1);
    } finally {
      fetchInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const savedCurrency = localStorage.getItem('preferredCurrency');

        if (savedCurrency) {
          setCurrency(savedCurrency);

          if (savedCurrency !== 'USD') {
            fetchExchangeRate(savedCurrency);
          }
        } else {
          const locationInfo = await fetchUserLocation();
          if (locationInfo && locationInfo.currency) {
            setCurrency(locationInfo.currency);
            localStorage.setItem('preferredCurrency', locationInfo.currency);

            if (locationInfo.currency !== 'USD') {
              fetchExchangeRate(locationInfo.currency);
            }
          }
        }
      } catch (error) {
        console.error(
          'Error fetching currency information:',
          JSON.stringify(error, null, 2)
        );

        setCurrency('USD');
        setRate(1);
      }
    };

    fetchCurrency();
  }, []);

  const handleSetCurrency = useCallback(
    (newCurrency: string) => {
      if (newCurrency === currency) {
        return;
      }

      setCurrency(newCurrency);
      localStorage.setItem('preferredCurrency', newCurrency);

      if (newCurrency !== 'USD') {
        fetchExchangeRate(newCurrency);
      } else {
        setRate(1);
      }
    },
    [currency, fetchExchangeRate]
  );

  const formatPrice = useCallback(
    (price: number): string => {
      const locale = currency === 'ZAR' ? 'en-ZA' : 'en-US';
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    },
    [currency]
  );

  const convertPrice = useCallback(
    (price: number): number => {
      return price * rate;
    },
    [rate]
  );

  const currencySymbol = useMemo(
    () => (currency === 'ZAR' ? 'R' : currencySymbols[currency] || '$'),
    [currency]
  );

  const contextValue = useMemo(
    () => ({
      currency,
      rate,
      setCurrency: handleSetCurrency,
      formatPrice,
      convertPrice,
      currencySymbol,
    }),
    [
      currency,
      rate,
      handleSetCurrency,
      formatPrice,
      convertPrice,
      currencySymbol,
    ]
  );

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
