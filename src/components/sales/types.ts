export interface SalesMetrics {
  revenue: number;
  previousRevenue: number;
  percentageChange: number;
  changeAmount: number;
  topSales: number;
  bestDeal: {
    amount: number;
    company: string;
  };
  deals: number;
  value: number;
  winRate: number;
  salesByTeam: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}

export interface SalesProps {
  metrics: SalesMetrics;
  timeframe: string;
  onTimeframeChange?: (timeframe: string) => void;
  className?: string;
}

export interface SalesContainerProps {
    imageUrl?: string;
    title?: string;
    description?: string;
} 