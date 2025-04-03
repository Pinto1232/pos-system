'use client';

import React, { useState } from 'react';
import Sales from './Sales';
import { SalesContainerProps } from './types';

const mockData = {
    revenue: 528976.82,
    previousRevenue: 501641.73,
    percentageChange: 7.9,
    changeAmount: 27335.09,
    topSales: {
        count: 72,
        name: 'Mikasa'
    },
    bestDeal: {
        amount: 42300,
        company: 'Rolf Inc.',
        starred: true
    },
    deals: {
        count: 256,
        change: -5
    },
    value: {
        amount: 528,
        unit: 'k'
    },
    winRate: {
        percentage: 44,
        change: 1.2
    },
    teamMembers: [
        {
            name: 'Armin A.',
            amount: 209633,
            percentage: 39.63,
            avatar: '/path/to/armin.jpg'
        },
        {
            name: 'Mikasa A.',
            amount: 156841,
            percentage: 29.65,
            avatar: '/path/to/mikasa.jpg'
        },
        {
            name: 'Eren Y.',
            amount: 117115,
            percentage: 22.14,
            avatar: '/path/to/eren.jpg'
        },
        {
            name: 'Anonymous',
            amount: 45386,
            percentage: 8.58
        }
    ],
    timeframe: {
        start: 'Sep 1',
        end: 'Nov 30, 2023'
    }
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
            data={{
                totalRevenue: mockData.revenue,
                previousRevenue: mockData.previousRevenue,
                growthPercentage: mockData.percentageChange,
                growthValue: mockData.changeAmount,
                timeframe: {
                    current: timeframe,
                    previous: 'Jun 1 - Aug 31, 2023'
                },
                topSales: mockData.topSales.count,
                bestDeal: {
                    value: mockData.bestDeal.amount,
                    company: mockData.bestDeal.company
                },
                deals: {
                    count: mockData.deals.count,
                    value: `${mockData.value.amount}${mockData.value.unit}`,
                    growth: mockData.deals.change,
                    winRate: mockData.winRate.percentage,
                    winRateGrowth: mockData.winRate.change
                },
                teamPerformance: mockData.teamMembers.map(member => ({
                    name: member.name,
                    revenue: member.amount,
                    percentage: member.percentage,
                    leads: 0,
                    meetings: 0,
                    winRate: 0,
                    winPercentage: 0,
                    lost: 0,
                    deals: 0
                })),
                platformRevenue: [],
                platformPerformance: {
                    dribbble: {
                        monthlyRevenue: 0,
                        monthlyLeads: 0,
                        winLoss: '',
                        winPercentage: 0,
                        winLossRatio: ''
                    }
                },
                monthlyData: {
                    sep: { revenue: 0, cost: 0 },
                    oct: { revenue: 0, cost: 0 },
                    nov: { revenue: 0, cost: 0 }
                }
            }}
            timeframe={timeframe}
            onTimeframeChange={handleTimeframeChange}
            className={className}
        />
    );
};

export default SalesContainer; 