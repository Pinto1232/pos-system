import axios from 'axios';

const OPEN_EXCHANGE_APP_ID =
  'c88ce4a807aa43c3b578f19b66eef7be';

export const fetchCurrencyAndRate = async () => {
  try {
    const ipInfo = await axios.get(
      process.env.NEXT_PUBLIC_CURRENCY_API_URL ||
        '/api/currency/location'
    );
    const userCurrency =
      ipInfo.data.currency || 'USD';

    if (userCurrency === 'USD') {
      return { currency: 'USD', rate: 1 };
    }

    const exchangeRes = await axios.get(
      `https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_APP_ID}`
    );

    const rate =
      exchangeRes.data.rates[userCurrency] || 1;
    return { currency: userCurrency, rate };
  } catch (error) {
    console.error(
      'Error fetching currency info:',
      error
    );
    return { currency: 'USD', rate: 1 }; 
  }
};
