'use client';

import React, { useState, useEffect } from 'react';
import Sales from './Sales';
import {
  SalesContainerProps,
  SalesData,
} from './types';
import { Box, Skeleton } from '@mui/material';

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
    },
    {
      name: 'Mikasa A.',
      revenue: 156841,
      percentage: 29.65,
    },
    {
      name: 'Eren Y.',
      revenue: 117115,
      percentage: 22.14,
    },
  ],
  platformRevenue: [
    {
      platform: 'Dribbble',
      revenue: 250000,
      percentage: 47.3,
    },
    {
      platform: 'LinkedIn',
      revenue: 150000,
      percentage: 28.4,
    },
  ],
  platformPerformance: {
    dribbble: {
      monthlyRevenue: 250000,
      monthlyLeads: 120,
      winLoss: '72/48',
      winPercentage: 60,
      winLossRatio: '3:2',
    },
  },
  monthlyData: {
    'Sep 2023': { revenue: 180000, cost: 45000 },
    'Oct 2023': { revenue: 190000, cost: 48000 },
    'Nov 2023': {
      revenue: 158976.82,
      cost: 39744.21,
    },
  },
};

const SalesContainer: React.FC<
  SalesContainerProps
> = ({ className }) => {
  const [timeframe, setTimeframe] = useState(
    'Sep 1 - Nov 30, 2023'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<SalesData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleTimeframeChange = (
    newTimeframe: string
  ) => {
    setTimeframe(newTimeframe);
  };

  if (isLoading) {
    return (
      <Box sx={{
        width: '100%',
        p: { xs: 3, sm: 4, md: 5 },
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
      }}>
        <Skeleton variant="text" sx={{ fontSize: '2rem', width: '40%', mb: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '3rem', width: '60%', mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="circular" width={80} height={80} />
        </Box>
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }

  return (
    <Sales
      data={data || mockData}
      timeframe={timeframe}
      onTimeframeChange={handleTimeframeChange}
      className={className}
    />
  );
};

export default SalesContainer;
