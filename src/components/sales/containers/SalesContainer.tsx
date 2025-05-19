'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SalesContainerProps, SalesData } from '../types';
import SalesPresentation from '../SalesPresentation';
import { Box, Skeleton } from '@mui/material';

// Declare the custom property on the Window interface
declare global {
  interface Window {
    __debug_handleTimeframeChange?: (timeframe: string) => void;
  }
}

const SalesContainer: React.FC<SalesContainerProps> = ({
  className,
  timeframe: initialTimeframe = 'Sep 1 - Nov 30, 2023',
  onTimeframeChange,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<SalesData | null>(null);

  const [timeframe, setTimeframe] = useState(initialTimeframe);

  const [inStoreProgress, setInStoreProgress] = useState(0);
  const [onlineProgress, setOnlineProgress] = useState(0);
  const [mobileProgress, setMobileProgress] = useState(0);
  const [desktopProgress, setDesktopProgress] = useState(0);

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState(0);

  const defaultData = useMemo<SalesData>(
    () => ({
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
          monthlyRevenue: 25000,
          monthlyLeads: 120,
          winLoss: '35/85',
          winPercentage: 41.2,
          winLossRatio: '0.41',
        },
      },
      monthlyData: {
        sep: { revenue: 150000, cost: 75000 },
        oct: { revenue: 175000, cost: 85000 },
        nov: { revenue: 203976, cost: 95000 },
      },
    }),
    []
  );

  const chartData = useMemo(
    () => [
      { date: 'OCT 20', campaign1: 5000, campaign2: 3500 },
      { date: 'OCT 21', campaign1: 7500, campaign2: 4000 },
      { date: 'OCT 22', campaign1: 7000, campaign2: 5000 },
      { date: 'OCT 23', campaign1: 6500, campaign2: 4500 },
      { date: 'OCT 24', campaign1: 11325, campaign2: 2000 },
      { date: 'OCT 25', campaign1: 8000, campaign2: 3500 },
      { date: 'OCT 26', campaign1: 3000, campaign2: 5000 },
      { date: 'OCT 27', campaign1: 4000, campaign2: 1500 },
    ],
    []
  );

  const handleTimeframeChange = useCallback(
    (newTimeframe: string) => {
      setTimeframe(newTimeframe);
      if (onTimeframeChange) {
        onTimeframeChange(newTimeframe);
      }
    },
    [onTimeframeChange]
  );

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.__debug_handleTimeframeChange = handleTimeframeChange;
    }
    return () => {
      if (process.env.NODE_ENV === 'development') {
        delete window.__debug_handleTimeframeChange;
      }
    };
  }, [handleTimeframeChange]);

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData(defaultData);
      setIsLoading(false);
    };

    loadData();
  }, [defaultData]);

  useEffect(() => {
    if (isLoading) return;

    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    const inStoreTarget = 54;
    const onlineTarget = 46;
    const mobileTarget = 78;
    const desktopTarget = 65;

    let currentStep = 0;
    let animationFrameId: number;

    const easeOutQuad = (t: number) => t * (2 - t);

    const updateProgress = () => {
      currentStep++;
      const progress = easeOutQuad(currentStep / steps);

      const inStore = Math.min(
        Math.round(inStoreTarget * progress),
        inStoreTarget
      );
      const online = Math.min(
        Math.round(onlineTarget * progress),
        onlineTarget
      );
      const mobile = Math.min(
        Math.round(mobileTarget * progress),
        mobileTarget
      );
      const desktop = Math.min(
        Math.round(desktopTarget * progress),
        desktopTarget
      );

      setInStoreProgress(inStore);
      setOnlineProgress(online);
      setMobileProgress(mobile);
      setDesktopProgress(desktop);

      if (currentStep < steps) {
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(updateProgress);
        }, stepDuration);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isLoading]);

  const formatCurrency = useCallback(
    (amount: number, currencyCode: string = 'ZAR') => {
      const locale = 'en-ZA';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 0,
      }).format(amount);
    },
    []
  );

  const formatPercentage = useCallback((value: number) => {
    return `${Math.abs(value).toFixed(1)}%`;
  }, []);

  const handleMetricClick = useCallback((metric: string) => {
    setSelectedMetric((prevMetric) => (prevMetric === metric ? null : metric));
  }, []);

  const getMetricDetails = useCallback(
    (metric: string) => {
      switch (metric) {
        case 'revenue':
          return {
            title: 'Revenue Details',
            content: `Current: ${formatCurrency(defaultData.totalRevenue, 'ZAR')}\nPrevious: ${formatCurrency(
              defaultData.previousRevenue,
              'ZAR'
            )}\nGrowth: ${formatPercentage(defaultData.growthPercentage)}`,
          };
        case 'deals':
          return {
            title: 'Deals Overview',
            content: `Total Deals: ${defaultData.deals.count}\nWin Rate: ${formatPercentage(
              defaultData.deals.winRate
            )}\nGrowth: ${formatPercentage(defaultData.deals.growth)}`,
          };
        case 'winRate':
          return {
            title: 'Win Rate Analysis',
            content: `Current: ${formatPercentage(defaultData.deals.winRate)}\nGrowth: ${formatPercentage(defaultData.deals.winRateGrowth)}\nTarget: 75%`,
          };
        default:
          return null;
      }
    },
    [defaultData, formatCurrency, formatPercentage]
  );

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setSelectedTab(newValue);
    },
    []
  );

  const getProgressStyles = useCallback((type: string) => {
    switch (type) {
      case 'inStore':
        return {
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.12)',
        };
      case 'online':
        return {
          color: '#3b82f6',
          background: 'rgba(59, 130, 246, 0.12)',
        };
      case 'mobile':
        return {
          color: '#f43f5e',
          background: 'rgba(244, 63, 94, 0.12)',
        };
      case 'desktop':
        return {
          color: '#8b5cf6',
          background: 'rgba(139, 92, 246, 0.12)',
        };
      default:
        return {
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.12)',
        };
    }
  }, []);

  const loadingSkeleton = useMemo(
    () => (
      <Box
        sx={{
          width: '100%',
          p: { xs: 3, sm: 4, md: 5 },
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Skeleton
          variant="text"
          sx={{ fontSize: '2rem', width: '40%', mb: 2 }}
        />
        <Skeleton
          variant="text"
          sx={{ fontSize: '3rem', width: '60%', mb: 3 }}
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="circular" width={80} height={80} />
        </Box>
        <Skeleton variant="rectangular" height={200} />
      </Box>
    ),
    []
  );

  const renderedComponent = useMemo(() => {
    if (isLoading) {
      return loadingSkeleton;
    }

    return (
      <SalesPresentation
        data={data || defaultData}
        timeframe={timeframe}
        className={className}
        selectedMetric={selectedMetric}
        selectedTab={selectedTab}
        inStoreProgress={inStoreProgress}
        onlineProgress={onlineProgress}
        mobileProgress={mobileProgress}
        desktopProgress={desktopProgress}
        chartData={chartData}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
        handleMetricClick={handleMetricClick}
        getMetricDetails={getMetricDetails}
        handleTabChange={handleTabChange}
        getProgressStyles={getProgressStyles}
      />
    );
  }, [
    isLoading,
    loadingSkeleton,
    data,
    defaultData,
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
  ]);

  return renderedComponent;
};

export default SalesContainer;
