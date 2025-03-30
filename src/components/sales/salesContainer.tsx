'use client';

import React, { useState, useEffect } from 'react';
import { SalesData } from '@/components/sales/types';
import { initialSalesData } from '@/components/sales/data/initialSalesData';
import SalesDashboardPresentation from './salesPresentation';

const SalesContainer: React.FC = () => {
    const [salesData, setSalesData] = useState<SalesData>(initialSalesData);
    const [loading, setLoading] = useState<boolean>(false);
    const [timeframeFilter, setTimeframeFilter] = useState<string>('Sep 1 - Nov 30, 2023');
    const formatCurrency = (value: number): string => {
        return `$${value.toLocaleString('en-US')}`;
    };

    const calculateMetrics = (data: SalesData): SalesData => {
        return {
            ...data,
            averageRevenue: data.totalRevenue / 3,
            totalDeals: data.teamPerformance.reduce((sum, member) => sum + (member.deals || 0), 0),
            topPerformer: data.teamPerformance.reduce((best, current) =>
                (current.revenue > best.revenue) ? current : best, data.teamPerformance[0])
        };
    };
    const handleTimeframeChange = (newTimeframe: string): void => {
        setTimeframeFilter(newTimeframe);
        setLoading(true);

        setTimeout(() => {
            setSalesData(prev => ({
                ...prev,
                timeframe: {
                    ...prev.timeframe,
                    current: newTimeframe
                }
            }));
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const enhancedData = calculateMetrics(initialSalesData);
            setSalesData(enhancedData);
            setLoading(false);
        }, 500);
    }, []);

    const handleFilterChange = (filterType: string, value: string): void => {
        console.log(`Filter changed: ${filterType} = ${value}`);
    };

    const handleViewDetails = (memberId: string): void => {
        console.log(`View details for member ID: ${memberId}`);
    };
    return (
        <SalesDashboardPresentation
            salesData={salesData}
            loading={loading}
            timeframeFilter={timeframeFilter}
            formatCurrency={formatCurrency}
            onTimeframeChange={handleTimeframeChange}
            onFilterChange={handleFilterChange}
            onViewDetails={handleViewDetails}
        />
    );
};

export default SalesContainer;