export type PricePackages = {
  data: Array<{
    id: number;
    title?: string;
    description?: string;
    icon?: string;
    extraDescription?: string;
    price?: number;
    testPeriodDays?: number;
    type?: string;
    packageType?: string;
    currency?: string;
    multiCurrencyPrices?: string;
  }>;
  pageSize: number;
  pageNumber: number;
  totalItems: number;
};
