'use client';

import React, { useState } from 'react';
import Sales from './Sales';
import { SalesContainerProps, SalesData } from './types';

const mockData: SalesData = {
  totalRevenue: 528976.82,
  previousRevenue: 501641.73,
  growthPercentage: 7.9,
  growthValue: 27335.09,
  timeframe: {
    current: 'Sep 1 - Nov 30, 2023',
    previous: 'Jun 1 - Aug 31, 2023',
  },
  topSales: 72,
  bestDeal: {
    value: 42300,
    company: 'Rolf Inc.',
  },
  deals: {
    count: 256,
    value: '528k',
    growth: -5,
    winRate: 44,
    winRateGrowth: 1.2,
  },
  teamPerformance: [
    {
      name: 'Armin A.',
      revenue: 209633,
      percentage: 39.63,
      leads: 150,
      meetings: 80,
      deals: 45,
    },
    {
      name: 'Mikasa A.',
      revenue: 156841,
      percentage: 29.65,
      leads: 120,
      meetings: 65,
      deals: 38,
    },
    {
      name: 'Eren Y.',
      revenue: 117115,
      percentage: 22.14,
      leads: 90,
      meetings: 50,
      deals: 30,
    },
    {
      name: 'Anonymous',
      revenue: 45386,
      percentage: 8.58,
      leads: 40,
      meetings: 25,
      deals: 15,
    },
  ],
  platformRevenue: [],
  platformPerformance: {
    dribbble: {
      monthlyRevenue: 0,
      monthlyLeads: 0,
      winLoss: '0/0',
      winPercentage: 0,
      winLossRatio: '0:0',
    },
  },
  monthlyData: {
    sep: { revenue: 175000, cost: 120000 },
    oct: { revenue: 185000, cost: 125000 },
    nov: { revenue: 168976, cost: 118000 },
  },
};

const SalesContainer: React.FC<SalesContainerProps> = ({
  className,
}) => {
  const [timeframe, setTimeframe] = useState('Sep 1 - Nov 30, 2023');

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  return (
    <Sales
      data={mockData}
      timeframe={timeframe}
      onTimeframeChange={handleTimeframeChange}
      className={className}
    />
  );
};

export default SalesContainer;
