import axios from 'axios';
import { apiClient } from './axiosClient';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface LocationInfo {
  country: string;
  currency: string;
}

export const fetchUserLocation = async (): Promise<LocationInfo> => {
  try {
    const { data } = await apiClient.get<LocationInfo>('/api/currency/location');
    return data;
  } catch (error) {
    console.error('Error fetching user location:', JSON.stringify(error, null, 2));
    return { country: 'ZA', currency: 'ZAR' };
  }
};

export const fetchAvailableCurrencies = async (): Promise<Currency[]> => {
  try {
    const { data } = await apiClient.get<Currency[]>('/api/currency/available', {
      timeout: 5000,
    });
    return data;
  } catch (error: unknown) {
    console.error('Error fetching available currencies:', JSON.stringify(error, null, 2));

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Response error data:', JSON.stringify(error.response.data, null, 2));
        console.error('Response error status:', JSON.stringify(error.response.status, null, 2));
      } else if (error.request) {
        console.error('No response received:', JSON.stringify(error.request, null, 2));
      }
    }

    const fallbackCurrencies: Currency[] = [
      {
        code: 'ZAR',
        name: 'South African Rand',
        symbol: 'R',
      },
      {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
      },
      {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
      },
      {
        code: 'AUD',
        name: 'Australian Dollar',
        symbol: 'A$',
      },
      {
        code: 'CAD',
        name: 'Canadian Dollar',
        symbol: 'C$',
      },
      {
        code: 'JPY',
        name: 'Japanese Yen',
        symbol: '¥',
      },
      {
        code: 'CNY',
        name: 'Chinese Yuan',
        symbol: '¥',
      },
      {
        code: 'INR',
        name: 'Indian Rupee',
        symbol: '₹',
      },
      {
        code: 'BRL',
        name: 'Brazilian Real',
        symbol: 'R$',
      },
    ];

    console.log('Using fallback currencies due to API error');
    return fallbackCurrencies;
  }
};
