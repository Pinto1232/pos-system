export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
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

  return symbols[currency] || currency;
};

export const formatNumber = (
  price: number,
  currency: string = 'USD'
): string => {
  const locale = currency === 'ZAR' ? 'en-ZA' : 'en-US';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatCurrencyAmount = (
  price: number,
  currency: string,
  rate: number = 1
): string => {
  const convertedPrice = currency !== 'USD' ? price * rate : price;

  if (currency === 'Kz') {
    return `${Math.round(convertedPrice)}${currency}`;
  }

  return `${getCurrencySymbol(currency)} ${formatNumber(convertedPrice, currency)}`;
};

export const convertPrice = (
  price: number,
  currency: string,
  rate: number
): number => {
  if (currency !== 'USD') {
    return price * rate;
  }
  return price;
};

export const calculateTotalPrice = (
  basePrice: number,
  featurePrice: number,
  supportPrice: number,
  planDiscount: number
): number => {
  const subtotal = basePrice + featurePrice + supportPrice;
  const discount = subtotal * planDiscount;
  return subtotal - discount;
};

export const getItemPrice = <
  T extends { id: number; multiCurrencyPrices?: Record<string, number> },
>(
  item: T,
  selectedCurrency: string,
  featurePrices: Record<number, number>,
  fallbackPriceKey: keyof T
): number => {
  if (featurePrices[item.id] !== undefined) {
    return featurePrices[item.id];
  }

  if (item.multiCurrencyPrices && item.multiCurrencyPrices[selectedCurrency]) {
    return item.multiCurrencyPrices[selectedCurrency];
  }

  return item[fallbackPriceKey] as unknown as number;
};
