import { SalesData } from '../types';

export const initialSalesData: SalesData = {
  totalRevenue: 528976.82,
  previousRevenue: 501641.73,
  growthPercentage: 7.9,
  growthValue: 27335.09,
  timeframe: {
    current: 'Sep 1 - Nov 30, 2023',
    previous: 'Jun 1 - Aug 31, 2023'
  },
  topSales: 72,
  bestDeal: {
    value: 42300,
    company: 'Rolf Inc.'
  },
  deals: {
    count: 256,
    value: '528k',
    growth: 7.9,
    winRate: 44,
    winRateGrowth: 1.2
  },
  teamPerformance: [
    { name: 'Armin A.', revenue: 209633, percentage: 39.63, leads: 41, meetings: 118, winRate: 0.84, winPercentage: 31, lost: 12, deals: 29 },
    { name: 'Mikasa A.', revenue: 156841, percentage: 29.65, leads: 54, meetings: 103, winRate: 0.89, winPercentage: 39, lost: 21, deals: 33 },
    { name: 'Eren Y.', revenue: 117115, percentage: 22.14, leads: 22, meetings: 84, winRate: 0.79, winPercentage: 32, lost: 7, deals: 15 },
    { name: 'Unknown', revenue: 45386, percentage: 8.58 }
  ],
  platformRevenue: [
    { platform: 'Dribbble', revenue: 227459, percentage: 43 },
    { platform: 'Instagram', revenue: 142823, percentage: 27 },
    { platform: 'Behance', revenue: 89935, percentage: 11 },
    { platform: 'Google', revenue: 37028, percentage: 7 }
  ],
  platformPerformance: {
    dribbble: {
      monthlyRevenue: 18552,
      monthlyLeads: 373,
      winLoss: '97/276',
      winPercentage: 16,
      winLossRatio: '51/318'
    }
  },
  monthlyData: {
    sep: { revenue: 6901, cost: 4500 },
    oct: { revenue: 9288, cost: 6000 },
    nov: { revenue: 11085, cost: 7200 }
  }
};
