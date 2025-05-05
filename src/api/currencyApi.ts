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
    console.error('Error fetching user location:', error);
    return { country: 'ZA', currency: 'ZAR' }; 
  }
};

export const fetchAvailableCurrencies = async (): Promise<Currency[]> => {
  try {
    // Add a timeout to the request to prevent long waiting times
    const { data } = await apiClient.get<Currency[]>('/api/currency/available', {
      timeout: 5000 // 5 seconds timeout
    });
    return data;
  } catch (error: unknown) {
    console.error('Error fetching available currencies:', error);

    // Log more detailed error information
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error data:', error.response.data);
        console.error('Response error status:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      }
    }

    // Provide more comprehensive fallback currencies
    const fallbackCurrencies: Currency[] = [
      { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
      { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }
    ];

    console.log('Using fallback currencies due to API error');
    return fallbackCurrencies;
  }
};
