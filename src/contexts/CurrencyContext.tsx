'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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

export const CurrencyProvider: React.FC<
  CurrencyProviderProps
> = ({ children }) => {
  const [currency, setCurrency] =
    useState<string>('USD');
  const [rate, setRate] = useState<number>(1);

  // Fetch user's currency based on geolocation
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
  }, []);

  // Fetch exchange rate for the given currency
  const fetchExchangeRate = async (
    currencyCode: string
  ) => {
    try {
      // Use Open Exchange Rates API (you'll need an app ID)
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
        setRate(
          response.data.rates[currencyCode]
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
    }
  };

  // Handle currency change
  const handleSetCurrency = (
    newCurrency: string
  ) => {
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
  };

  // Format price with the current currency
  const formatPrice = (price: number): string => {
    // Use appropriate locale based on currency
    const locale =
      currency === 'ZAR' ? 'en-ZA' : 'en-US';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Convert price to the current currency
  const convertPrice = (
    price: number
  ): number => {
    return price * rate;
  };

  // Get the currency symbol
  const currencySymbol =
    currency === 'ZAR'
      ? 'R'
      : currencySymbols[currency] || '$';

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        rate,
        setCurrency: handleSetCurrency,
        formatPrice,
        convertPrice,
        currencySymbol,
      }}
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
