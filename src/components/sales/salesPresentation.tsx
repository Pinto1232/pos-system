'use client';

import React from 'react';
import {
    Box,
    Grid
} from '@mui/material';
import { SalesData } from '@/components/sales/types';

import LoadingState from './LoadingState';
import DashboardHeader from './DashboardHeader';
import RevenueCard from './RevenueCard';
import KeyMetricsGrid from './KeyMetricsGrid';
import TeamPerformanceSummary from './TeamPerformanceSummary';
import TeamPerformanceTable from './TeamPerformanceTable';
import PlatformRevenueChart from './PlatformRevenueChart';
import SalesDynamicChart from './SalesDynamicChart';
interface SalesDashboardPresentationProps {
    salesData: SalesData;
    loading: boolean;
    timeframeFilter: string;
    formatCurrency: (value: number) => string;
    onTimeframeChange: (newTimeframe: string) => void;
    onFilterChange: (filterType: string, value: string) => void;
    onViewDetails: (memberId: string) => void;
}
const SalesPresentation: React.FC<SalesDashboardPresentationProps> = ({
    salesData,
    loading,
    formatCurrency,
    onTimeframeChange,
    onFilterChange,
    onViewDetails
}) => {
    return (
        <LoadingState loading={loading}>
            <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 }, mt: 4 }}>
                <DashboardHeader title="New report" />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <RevenueCard
                            totalRevenue={salesData.totalRevenue}
                            previousRevenue={salesData.previousRevenue}
                            growthPercentage={salesData.growthPercentage}
                            growthValue={salesData.growthValue}
                            timeframe={salesData.timeframe}
                            onTimeframeChange={onTimeframeChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <KeyMetricsGrid salesData={salesData} />
                    </Grid>

                    <Grid item xs={12}>
                        <TeamPerformanceSummary
                            teamPerformance={salesData.teamPerformance}
                            formatCurrency={formatCurrency}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TeamPerformanceTable
                            teamPerformance={salesData.teamPerformance}
                            formatCurrency={formatCurrency}
                            onViewDetails={onViewDetails}
                        />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <PlatformRevenueChart
                            platformRevenue={salesData.platformRevenue}
                            onFilterChange={onFilterChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <SalesDynamicChart />
                    </Grid>
                </Grid>
            </Box>
        </LoadingState>
    );
};

export default SalesPresentation;