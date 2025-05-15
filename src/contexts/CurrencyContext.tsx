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

// Define currency symbols mapping
export const currencySymbols: Record<
  string,
  string
> = {
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

// Define the context type
interface CurrencyContextType {
  currency: string;
  rate: number;
  setCurrency: (currency: string) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
  currencySymbol: string;
}

// Create the context with default values
const CurrencyContext =
  createContext<CurrencyContextType>({
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
const exchangeRateCache: Record<string, number> =
  {};

export const CurrencyProvider: React.FC<
  CurrencyProviderProps
> = ({ children }) => {
  const [currency, setCurrency] =
    useState<string>('USD');
  const [rate, setRate] = useState<number>(1);
  const fetchInProgress = useRef(false);
  const lastFetchTime = useRef<number>(0);

  // Fetch exchange rate for the given currency with debouncing and caching
  const fetchExchangeRate = useCallback(
    async (currencyCode: string) => {
      // If we already have a fetch in progress, don't start another one
      if (fetchInProgress.current) {
        console.log(
          'Exchange rate fetch already in progress, skipping'
        );
        return;
      }

      // Check if we've fetched this rate recently (within the last 30 minutes)
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;
      if (
        now - lastFetchTime.current <
          thirtyMinutes &&
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
        console.log(
          `Fetching exchange rate for ${currencyCode}`
        );

        // Use Open Exchange Rates API
        const OPEN_EXCHANGE_APP_ID =
          'c88ce4a807aa43c3b578f19b66eef7be';
        const response = await axios.get(
          `https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_APP_ID}`
        );

        if (
          response.data &&
          response.data.rates &&
          response.data.rates[currencyCode]
        ) {
          const newRate =
            response.data.rates[currencyCode];
          setRate(newRate);

          // Cache the result
          exchangeRateCache[currencyCode] =
            newRate;
          lastFetchTime.current = now;

          console.log(
            `Exchange rate for ${currencyCode} set to ${newRate}`
          );
        } else {
          console.warn(
            `Exchange rate for ${currencyCode} not found, using default rate of 1`
          );
          setRate(1);
        }
      } catch (error) {
        console.error(
          'Error fetching exchange rate:',
          error
        );
        setRate(1);
      } finally {
        fetchInProgress.current = false;
      }
    },
    []
  );

  // Fetch user's currency based on geolocation - only run once on mount
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        // Check if there's a saved currency preference
        const savedCurrency =
          localStorage.getItem(
            'preferredCurrency'
          );

        if (savedCurrency) {
          setCurrency(savedCurrency);
          // If we have a saved currency, also fetch the exchange rate
          if (savedCurrency !== 'USD') {
            fetchExchangeRate(savedCurrency);
          }
        } else {
          // Fetch user's location to determine currency
          const locationInfo =
            await fetchUserLocation();
          if (
            locationInfo &&
            locationInfo.currency
          ) {
            setCurrency(locationInfo.currency);
            localStorage.setItem(
              'preferredCurrency',
              locationInfo.currency
            );

            // If not USD, fetch exchange rate
            if (locationInfo.currency !== 'USD') {
              fetchExchangeRate(
                locationInfo.currency
              );
            }
          }
        }
      } catch (error) {
        console.error(
          'Error fetching currency information:',
          error
        );
        // Fallback to USD
        setCurrency('USD');
        setRate(1);
      }
    };

    fetchCurrency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Handle currency change
  const handleSetCurrency = useCallback(
    (newCurrency: string) => {
      if (newCurrency === currency) {
        return; // No change, don't update state
      }

      setCurrency(newCurrency);
      localStorage.setItem(
        'preferredCurrency',
        newCurrency
      );

      // Update exchange rate if needed
      if (newCurrency !== 'USD') {
        fetchExchangeRate(newCurrency);
      } else {
        setRate(1); // USD is the base currency
      }
    },
    [currency, fetchExchangeRate]
  );

  // Format price with the current currency - memoized to prevent unnecessary recalculations
  const formatPrice = useCallback(
    (price: number): string => {
      // Use appropriate locale based on currency
      const locale =
        currency === 'ZAR' ? 'en-ZA' : 'en-US';
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    },
    [currency]
  );

  // Convert price to the current currency - memoized
  const convertPrice = useCallback(
    (price: number): number => {
      return price * rate;
    },
    [rate]
  );

  // Get the currency symbol - memoized
  const currencySymbol = useMemo(
    () =>
      currency === 'ZAR'
        ? 'R'
        : currencySymbols[currency] || '$',
    [currency]
  );

  // Memoize the context value to prevent unnecessary re-renders
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
    <CurrencyContext.Provider
      value={contextValue}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use the currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error(
      'useCurrency must be used within a CurrencyProvider'
    );
  }
  return context;
};
