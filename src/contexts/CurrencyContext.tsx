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
  KZ: 'Kz',

  EU: '€',
  GB: '£',
  US: '$',
  JP: '¥',
  CN: '¥',
  KR: '₩',
  IN: '₹',
  BR: 'R$',
  CA: 'C$',
  AU: 'A$',
  ZA: 'R',
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
        const savedCustomization = localStorage.getItem('userCustomization');
        let supportedCurrencies: string[] = ['USD', 'EUR', 'GBP', 'ZAR'];
        let defaultCurrency: string | null = null;

        if (savedCustomization) {
          try {
            const customization = JSON.parse(savedCustomization);
            if (customization.regionalSettings) {
              if (
                Array.isArray(
                  customization.regionalSettings.supportedCurrencies
                ) &&
                customization.regionalSettings.supportedCurrencies.length > 0
              ) {
                supportedCurrencies =
                  customization.regionalSettings.supportedCurrencies;
                console.log(
                  'Loaded supported currencies from localStorage:',
                  supportedCurrencies
                );
              }

              if (customization.regionalSettings.defaultCurrency) {
                defaultCurrency =
                  customization.regionalSettings.defaultCurrency;
                console.log(
                  'Loaded default currency from regionalSettings:',
                  defaultCurrency
                );
              }
            }
          } catch (e) {
            console.error(
              'Error parsing userCustomization from localStorage:',
              e
            );
          }
        }

        const savedCurrency =
          localStorage.getItem('preferredCurrency') || defaultCurrency;

        if (savedCurrency) {
          if (supportedCurrencies.includes(savedCurrency)) {
            setCurrency(savedCurrency);
            console.log(
              `Using saved currency from localStorage: ${savedCurrency}`
            );

            if (savedCurrency !== 'USD') {
              fetchExchangeRate(savedCurrency);
            }
          } else {
            const fallbackCurrency = supportedCurrencies[0] || 'USD';
            setCurrency(fallbackCurrency);
            localStorage.setItem('preferredCurrency', fallbackCurrency);
            console.log(
              `Saved currency ${savedCurrency} not in supported list, using ${fallbackCurrency}`
            );

            if (fallbackCurrency !== 'USD') {
              fetchExchangeRate(fallbackCurrency);
            }
          }
        } else {
          const locationInfo = await fetchUserLocation();
          if (locationInfo && locationInfo.currency) {
            if (supportedCurrencies.includes(locationInfo.currency)) {
              setCurrency(locationInfo.currency);
              localStorage.setItem('preferredCurrency', locationInfo.currency);
              console.log(
                `Using detected currency from location: ${locationInfo.currency}`
              );

              if (locationInfo.currency !== 'USD') {
                fetchExchangeRate(locationInfo.currency);
              }
            } else {
              const fallbackCurrency = supportedCurrencies[0] || 'USD';
              setCurrency(fallbackCurrency);
              localStorage.setItem('preferredCurrency', fallbackCurrency);
              console.log(
                `Detected currency ${locationInfo.currency} not in supported list, using ${fallbackCurrency}`
              );

              if (fallbackCurrency !== 'USD') {
                fetchExchangeRate(fallbackCurrency);
              }
            }
          } else {
            const fallbackCurrency = supportedCurrencies[0] || 'USD';
            setCurrency(fallbackCurrency);
            localStorage.setItem('preferredCurrency', fallbackCurrency);
            console.log(
              `No currency detected, using default: ${fallbackCurrency}`
            );

            if (fallbackCurrency !== 'USD') {
              fetchExchangeRate(fallbackCurrency);
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
  }, [fetchExchangeRate]);

  const handleSetCurrency = useCallback(
    (newCurrency: string) => {
      if (newCurrency === currency) {
        return;
      }

      console.log(
        `Changing system currency from ${currency} to ${newCurrency}`
      );

      setCurrency(newCurrency);

      localStorage.setItem('preferredCurrency', newCurrency);

      try {
        const savedCustomization = localStorage.getItem('userCustomization');
        if (savedCustomization) {
          const customization = JSON.parse(savedCustomization);
          if (!customization.regionalSettings) {
            customization.regionalSettings = {
              defaultCurrency: newCurrency,
              supportedCurrencies: ['USD', 'EUR', 'GBP', 'ZAR', newCurrency],
            };
          } else {
            customization.regionalSettings.defaultCurrency = newCurrency;

            if (!customization.regionalSettings.supportedCurrencies) {
              customization.regionalSettings.supportedCurrencies = [
                'USD',
                'EUR',
                'GBP',
                'ZAR',
                newCurrency,
              ];
            } else if (
              !customization.regionalSettings.supportedCurrencies.includes(
                newCurrency
              )
            ) {
              customization.regionalSettings.supportedCurrencies.push(
                newCurrency
              );
            }
          }

          localStorage.setItem(
            'userCustomization',
            JSON.stringify(customization)
          );
          console.log(
            `Updated userCustomization with new currency: ${newCurrency}`
          );

          const regionalSettings = customization.regionalSettings;
          localStorage.setItem(
            'regionalSettings',
            JSON.stringify(regionalSettings)
          );
        } else {
          const newCustomization = {
            regionalSettings: {
              defaultCurrency: newCurrency,
              supportedCurrencies: ['USD', 'EUR', 'GBP', 'ZAR', newCurrency],
              dateFormat: 'DD/MM/YYYY',
              timeFormat: '24h',
              timezone: 'Africa/Johannesburg',
              numberFormat: '#,###.##',
              language: 'en-ZA',
              autoDetectLocation: true,
              enableMultiCurrency: true,
            },
          };
          localStorage.setItem(
            'userCustomization',
            JSON.stringify(newCustomization)
          );
          localStorage.setItem(
            'regionalSettings',
            JSON.stringify(newCustomization.regionalSettings)
          );
          console.log(
            `Created new userCustomization with currency: ${newCurrency}`
          );
        }
      } catch (error) {
        console.error(
          'Error updating userCustomization with new currency:',
          error
        );
      }

      if (newCurrency !== 'USD') {
        fetchExchangeRate(newCurrency);
      } else {
        setRate(1);
      }

      const event = new CustomEvent('currencyChanged', {
        detail: {
          currency: newCurrency,
          previousCurrency: currency,
        },
      });
      window.dispatchEvent(event);

      console.log(`System currency updated to ${newCurrency}`);
    },
    [currency, fetchExchangeRate]
  );

  const formatPrice = useCallback(
    (price: number): string => {
      let locale = 'en-US';

      switch (currency) {
        case 'ZAR':
        case 'ZA':
          locale = 'en-ZA';
          break;
        case 'EUR':
        case 'EU':
          locale = 'de-DE';
          break;
        case 'GBP':
        case 'GB':
          locale = 'en-GB';
          break;
        case 'JPY':
        case 'JP':
          locale = 'ja-JP';
          break;
        case 'CNY':
        case 'CN':
          locale = 'zh-CN';
          break;
        case 'KRW':
        case 'KR':
          locale = 'ko-KR';
          break;
        case 'INR':
        case 'IN':
          locale = 'hi-IN';
          break;
        case 'BRL':
        case 'BR':
          locale = 'pt-BR';
          break;
        case 'CAD':
        case 'CA':
          locale = 'en-CA';
          break;
        case 'AUD':
        case 'AU':
          locale = 'en-AU';
          break;
        case 'Kz':
          locale = 'pt-AO';
          break;
        case 'KZ':
          locale = 'kk-KZ';
          break;
        default:
          locale = 'en-US';
      }

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

  const currencySymbol = useMemo(() => {
    if (currencySymbols[currency]) {
      return currencySymbols[currency];
    }

    if (currency === 'Kz') {
      return 'Kz';
    }

    if (currency.length === 2) {
      return currency;
    }

    return currency;
  }, [currency]);

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
