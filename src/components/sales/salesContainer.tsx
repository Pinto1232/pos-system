import React from 'react';
import Sales from './Sales';
import { SalesContainerProps, SalesData } from './types';

const SalesContainer: React.FC<SalesContainerProps> = ({
  className,
  timeframe = 'This Month',
  onTimeframeChange,
}) => {
  const mockSalesData: SalesData = {
    totalRevenue: 150000,
    previousRevenue: 120000,
    growthPercentage: 25,
    growthValue: 30000,
    timeframe: {
      current: 'This Month',
      previous: 'Last Month',
    },
    topSales: 8,
    bestDeal: {
      value: 50000,
      company: 'Acme Corp',
    },
    deals: {
      count: 20,
      value: '$250k',
      growth: 10,
      winRate: 60,
      winRateGrowth: 5,
    },
    teamPerformance: [
      { name: 'Alice', revenue: 60000, percentage: 30 },
      { name: 'Bob', revenue: 45000, percentage: 20 },
      { name: 'Charlie', revenue: 45000, percentage: 15 },
    ],
    platformRevenue: [],
    platformPerformance: {
      dribbble: {
        monthlyRevenue: 0,
        monthlyLeads: 0,
        winLoss: '',
        winPercentage: 0,
        winLossRatio: '',
      },
    },
    monthlyData: {
      sep: { revenue: 0, cost: 0 },
      oct: { revenue: 0, cost: 0 },
      nov: { revenue: 0, cost: 0 },
    },
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    console.log('Timeframe changed to:', newTimeframe);
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }
  };

  return (
    <div className={className}>
      <Sales
        data={mockSalesData}
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
      />
    </div>
  );
};

export default SalesContainer;
