'use client';

import React, { useState } from 'react';
import { SalesContainerProps } from './types';
import Sales from './Sales';

const mockData = {
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
        }
    ],
    platformRevenue: [],
    platformPerformance: {
        dribbble: {
            monthlyRevenue: 0,
            monthlyLeads: 0,
            winLoss: '0/0',
            winPercentage: 0,
            winLossRatio: '0:0'
        }
    },
    monthlyData: {}
};

const SalesContainer: React.FC<SalesContainerProps> = ({
    className,
    imageUrl,
    title,
    description
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