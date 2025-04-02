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
        growth: -5,
        winRate: 44,
        winRateGrowth: 1.2
    },
    teamPerformance: [
        {
            name: 'Armin A.',
            revenue: 209633,
            percentage: 39.63
        },
        {
            name: 'Mikasa A.',
            revenue: 156841,
            percentage: 29.65
        },
        {
            name: 'Eren Y.',
            revenue: 117115,
            percentage: 22.14
        },
        {
            name: 'Anonymous',
            revenue: 45386,
            percentage: 8.58
        }
    ],
    platformRevenue: [
        {
            platform: 'Dribbble',
            revenue: 209633,
            percentage: 39.63
        },
        {
            platform: 'Behance',
            revenue: 156841,
            percentage: 29.65
        },
        {
            platform: 'LinkedIn',
            revenue: 117115,
            percentage: 22.14
        },
        {
            platform: 'Other',
            revenue: 45386,
            percentage: 8.58
        }
    ],
    platformPerformance: {
        dribbble: {
            monthlyRevenue: 209633,
            monthlyLeads: 156,
            winLoss: '156/44',
            winPercentage: 78,
            winLossRatio: '3.5:1'
        }
    },
    monthlyData: {
        'Sep': { revenue: 176325.61, cost: 88162.81 },
        'Oct': { revenue: 176325.61, cost: 88162.81 },
        'Nov': { revenue: 176325.61, cost: 88162.81 }
    }
};

const SalesContainer: React.FC<SalesContainerProps> = ({
    className,
    imageUrl,
    title,
    description,
    timeframe = 'Sep 1 - Nov 30, 2023',
    onTimeframeChange
}) => {
    return (
        <Sales
            data={mockData}
            timeframe={timeframe}
            onTimeframeChange={onTimeframeChange}
            className={className}
        />
    );
};

export default SalesContainer; 