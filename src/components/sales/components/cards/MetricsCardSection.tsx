'use client';

import React from 'react';
import { Stack } from '@mui/material';
import { SalesData } from '../../types';
import TopSalesCard from './TopSalesCard';
import BestDealCard from './BestDealCard';
import DealsCard from './DealsCard';
import ValueCard from './ValueCard';
import WinRateCard from './WinRateCard';

interface MetricsCardSectionProps {
  data: SalesData;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatPercentage: (value: number) => string;
  selectedMetric: string | null;
  handleMetricClick: (metric: string) => void;
  getMetricDetails: (
    metric: string
  ) => { title: string; content: string } | null;
}

const MetricsCardSection: React.FC<MetricsCardSectionProps> = ({
  data,
  formatCurrency,
  formatPercentage,
  selectedMetric,
  handleMetricClick,
  getMetricDetails,
}) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={3}
      mt={10}
      mb={5}
      sx={{
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -24,
          left: 0,
          width: '60px',
          height: '4px',
          background: 'linear-gradient(90deg, #4338ca, #6366f1)',
          borderRadius: '4px',
        },
        '& > *': {
          flex: 1,
          minWidth: { xs: '100%', sm: '200px' },
        },
      }}
    >
      {}
      <TopSalesCard topSales={data.topSales} />

      {}
      <BestDealCard bestDeal={data.bestDeal} formatCurrency={formatCurrency} />

      {}
      <DealsCard
        deals={data.deals}
        formatPercentage={formatPercentage}
        selectedMetric={selectedMetric}
        handleMetricClick={handleMetricClick}
        getMetricDetails={getMetricDetails}
      />

      {}
      <ValueCard value={data.deals.value} />

      {}
      <WinRateCard
        winRate={data.deals.winRate}
        winRateGrowth={data.deals.winRateGrowth}
        formatPercentage={formatPercentage}
        selectedMetric={selectedMetric}
        handleMetricClick={handleMetricClick}
        getMetricDetails={getMetricDetails}
      />
    </Stack>
  );
};

export default MetricsCardSection;
