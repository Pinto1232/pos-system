import axios from 'axios';

const OPEN_EXCHANGE_APP_ID = 'c88ce4a807aa43c3b578f19b66eef7be';

interface FallbackCurrencies {
  [key: string]: string;
}

export const fetchCurrencyAndRate = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5107';
    const fullUrl = `${apiUrl}/api/currency/location`;

    console.log('Attempting to fetch currency with URL:', JSON.stringify(fullUrl, null, 2));

    const ipInfo = await axios.get(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const userCurrency = ipInfo.data.currency || 'USD';

    if (userCurrency === 'USD') {
      return { currency: 'USD', rate: 1 };
    }

    const exchangeRes = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_APP_ID}`);

    const rate = exchangeRes.data.rates[userCurrency] || 1;
    return { currency: userCurrency, rate };
  } catch (error) {
    console.error('Error fetching currency info:', JSON.stringify(error, null, 2));

    if (axios.isAxiosError(error)) {
      console.error('Detailed Currency Fetch Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.request,
      });
    } else {
      console.error('Non-Axios error:', JSON.stringify(error, null, 2));
    }

    const fallbackCurrencies: FallbackCurrencies = {
      'en-US': 'USD',
      'en-GB': 'GBP',
      'fr-FR': 'EUR',
      'de-DE': 'EUR',
      'ja-JP': 'JPY',
      'zh-CN': 'CNY',
      'ru-RU': 'RUB',
      'pt-BR': 'BRL',
      'es-ES': 'EUR',
      'en-ZA': 'ZAR',
    };

    const browserLanguage = navigator.language;
    const fallbackCurrency = fallbackCurrencies[browserLanguage] || 'USD';

    return {
      currency: fallbackCurrency,
      rate: 1,
    };
  }
};

export const setUserCurrency = (currency: string) => {
  localStorage.setItem('preferredCurrency', currency);
};

export const getUserCurrency = () => {
  return localStorage.getItem('preferredCurrency') || 'USD';
};
