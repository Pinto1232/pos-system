'use client';

import React, { useState } from 'react';
import Sales from './Sales';
import { SalesContainerProps } from './types';

interface SalesContainerProps {
    imageUrl?: string;
    title?: string;
    description?: string;
}

const mockData = {
    revenue: 528976.82,
    previousRevenue: 501641.73,
    percentageChange: 7.9,
    changeAmount: 27335.09,
    topSales: 72,
    bestDeal: {
        amount: 42300,
        company: 'Rolf Inc.',
    },
    deals: 256,
    value: 528,
    winRate: 44,
    salesByTeam: [
        {
            name: 'Armin A.',
            amount: 209633,
            percentage: 39.63,
        },
        {
            name: 'Mikasa A.',
            amount: 156841,
            percentage: 29.65,
        },
        {
            name: 'Eren Y.',
            amount: 117115,
            percentage: 22.14,
        },
        {
            name: 'Anonymous',
            amount: 45386,
            percentage: 8.58,
        },
    ],
};

const SalesContainer: React.FC<Partial<SalesContainerProps>> = () => {
    const [timeframe, setTimeframe] = useState('Sep 1 - Nov 30, 2023');

    const handleTimeframeChange = (newTimeframe: string) => {
        setTimeframe(newTimeframe);
    };

    return (
        <Sales
            metrics={mockData}
            timeframe={timeframe}
            onTimeframeChange={handleTimeframeChange}
        />
    );
};

export default SalesContainer; 