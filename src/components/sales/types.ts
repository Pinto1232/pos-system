export interface TeamMember {
  name: string;
  revenue: number;
  percentage: number;
  leads?: number;
  meetings?: number;
  winRate?: number;
  winPercentage?: number;
  lost?: number;
  deals?: number;
}

export interface Platform {
  platform: string;
  revenue: number;
  percentage: number;
}

export interface BestDeal {
  value: number;
  company: string;
}

export interface Deals {
  count: number;
  value: string;
  growth: number;
  winRate: number;
  winRateGrowth: number;
}

export interface TimeframeData {
  current: string;
  previous: string;
}

export interface MonthlyData {
  [key: string]: {
    revenue: number;
    cost: number;
  };
}

export interface PlatformPerformance {
  dribbble: {
    monthlyRevenue: number;
    monthlyLeads: number;
    winLoss: string;
    winPercentage: number;
    winLossRatio: string;
  };
  [key: string]: {
    monthlyRevenue: number;
    monthlyLeads: number;
    winLoss: string;
    winPercentage: number;
    winLossRatio: string;
  };
}

export interface SalesData {
  totalRevenue: number;
  previousRevenue: number;
  growthPercentage: number;
  growthValue: number;
  timeframe: TimeframeData;
  topSales: number;
  bestDeal: BestDeal;
  deals: Deals;
  teamPerformance: TeamMember[];
  platformRevenue: Platform[];
  platformPerformance: PlatformPerformance;
  monthlyData: MonthlyData;
  averageRevenue?: number;
  totalDeals?: number;
  topPerformer?: TeamMember;
}

export interface SalesProps {
  data: SalesData;
  timeframe: string;
  onTimeframeChange?: (timeframe: string) => void;
  className?: string;
}

export interface SalesContainerProps {
  className?: string;
  timeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}
