'use client';

import React from 'react';
import { Box, Stack } from '@mui/material';
import { SalesData } from '../../types';
import RevenueMetric from './RevenueMetric';
import ProgressIndicators from './ProgressIndicators';
import DealCampaignsChart from './DealCampaignsChart';

interface RevenueSectionProps {
  data: SalesData;
  timeframe: string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatPercentage: (value: number) => string;
  inStoreProgress: number;
  onlineProgress: number;
  mobileProgress: number;
  desktopProgress: number;
  getProgressStyles: (type: string) => {
    color: string;
    background: string;
  };
  selectedTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  chartData: Array<{
    date: string;
    campaign1: number;
    campaign2: number;
  }>;
}

const RevenueSection: React.FC<RevenueSectionProps> = ({
  data,
  timeframe,
  formatCurrency,
  formatPercentage,
  inStoreProgress,
  onlineProgress,
  mobileProgress,
  desktopProgress,
  getProgressStyles,
  selectedTab,
  handleTabChange,
  chartData,
}) => {
  return (
    <Box mb={5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
        <Box flex={1}>
          {}
          <RevenueMetric
            totalRevenue={data.totalRevenue}
            previousRevenue={data.previousRevenue}
            growthPercentage={data.growthPercentage}
            growthValue={data.growthValue}
            timeframe={timeframe}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />

          {}
          <ProgressIndicators
            inStoreProgress={inStoreProgress}
            onlineProgress={onlineProgress}
            mobileProgress={mobileProgress}
            desktopProgress={desktopProgress}
            getProgressStyles={getProgressStyles}
          />
        </Box>

        {}
        <Box flex={1.5} sx={{ height: { xs: 200, sm: 260 } }}>
          <DealCampaignsChart
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
            chartData={chartData}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default RevenueSection;
