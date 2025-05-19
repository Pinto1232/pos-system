'use client';

import React, { memo } from 'react';
import { Box } from '@mui/material';
import { SalesData } from './types';
import SalesHeader from './components/header/SalesHeader';
import RevenueSection from './components/metrics/RevenueSection';
import MetricsCardSection from './components/cards/MetricsCardSection';
import TeamPerformance from './components/team/TeamPerformance';

interface SalesPresentationProps {
  data: SalesData;
  timeframe: string;
  className?: string;
  selectedMetric: string | null;
  selectedTab: number;
  inStoreProgress: number;
  onlineProgress: number;
  mobileProgress: number;
  desktopProgress: number;
  chartData: Array<{
    date: string;
    campaign1: number;
    campaign2: number;
  }>;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatPercentage: (value: number) => string;
  handleMetricClick: (metric: string) => void;
  getMetricDetails: (
    metric: string
  ) => { title: string; content: string } | null;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  getProgressStyles: (type: string) => {
    color: string;
    background: string;
  };
}

const SalesPresentation: React.FC<SalesPresentationProps> = ({
  data,
  timeframe,
  className,
  selectedMetric,
  selectedTab,
  inStoreProgress,
  onlineProgress,
  mobileProgress,
  desktopProgress,
  chartData,
  formatCurrency,
  formatPercentage,
  handleMetricClick,
  getMetricDetails,
  handleTabChange,
  getProgressStyles,
}) => {
  return (
    <Box
      className={className}
      sx={{
        p: { xs: 3, sm: 4, md: 5 },
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(230, 235, 245, 0.9)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.06)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, #4338ca, #6366f1)',
          opacity: 0.8,
        },
      }}
    >
      {}
      <SalesHeader />

      {}
      <RevenueSection
        data={data}
        timeframe={timeframe}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
        inStoreProgress={inStoreProgress}
        onlineProgress={onlineProgress}
        mobileProgress={mobileProgress}
        desktopProgress={desktopProgress}
        getProgressStyles={getProgressStyles}
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        chartData={chartData}
      />

      {}
      <MetricsCardSection
        data={data}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
        selectedMetric={selectedMetric}
        handleMetricClick={handleMetricClick}
        getMetricDetails={getMetricDetails}
      />

      {}
      <TeamPerformance
        teamMembers={data.teamPerformance}
        totalRevenue={data.totalRevenue}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
      />
    </Box>
  );
};

export default memo(SalesPresentation);
