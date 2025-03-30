import React from 'react';
import { Grid, Box, Avatar, Typography, IconButton } from '@mui/material';
import {
    BarChart as BarChartIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Star as StarIcon,
    ArrowUpward as ArrowUpwardIcon
} from '@mui/icons-material';
import { SalesData } from '@/components/sales/types';
import MetricCard from './MetricCard';

interface KeyMetricsGridProps {
    salesData: SalesData;
}

const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({ salesData }) => (
    <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard
                title="Top sales"
                value={salesData.topSales}
                subtitle={
                    <Box display="flex" alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#2196f3' }}>M</Avatar>
                        <Typography variant="body2" ml={1}>
                            Mikasa
                        </Typography>
                        <IconButton size="small">
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Box>
                }
                bgColor="#f5f9ff"
                iconRight={<BarChartIcon fontSize="small" sx={{ color: '#1976d2' }} />}
            />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard
                title="Best deal"
                value={`$${salesData.bestDeal.value.toLocaleString('en-US')}`}
                subtitle={salesData.bestDeal.company}
                bgColor="#1a1a1a"
                color="white"
                iconRight={<StarIcon fontSize="small" sx={{ color: '#ffeb3b' }} />}
            />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard
                title="Deals"
                value={salesData.deals.count}
                subtitle="≈ 5"
                bgColor="#f5f5f5"
                iconRight={<ArrowUpwardIcon fontSize="small" sx={{ color: '#4caf50' }} />}
            />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard
                title="Value"
                value={salesData.deals.value}
                subtitle="↗"
                subtitleValue={{ value: `${salesData.deals.growth}%`, color: '#ffffff' }}
                bgColor="#dc004e"
                color="white"
                iconRight={<ArrowUpwardIcon fontSize="small" sx={{ color: '#ffffff' }} />}
            />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
            <MetricCard
                title="Win rate"
                value={`${salesData.deals.winRate}%`}
                subtitle="↗"
                subtitleValue={{ value: `${salesData.deals.winRateGrowth}%`, color: '#4caf50' }}
                bgColor="#f5f5f5"
                iconRight={<ArrowUpwardIcon fontSize="small" sx={{ color: '#4caf50' }} />}
            />
        </Grid>
    </Grid>
);

export default KeyMetricsGrid;