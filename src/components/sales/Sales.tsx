'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    Chip,
    IconButton,
    Switch,
    Avatar,
    AvatarGroup
} from '@mui/material';
import { SalesProps, TeamMember } from './types';
import StarIcon from '@mui/icons-material/Star';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';

const Sales: React.FC<SalesProps> = ({
    data = {
        totalRevenue: 0,
        previousRevenue: 0,
        growthPercentage: 0,
        growthValue: 0,
        timeframe: {
            current: '',
            previous: ''
        },
        topSales: 0,
        bestDeal: {
            value: 0,
            company: ''
        },
        deals: {
            count: 0,
            value: '',
            growth: 0,
            winRate: 0,
            winRateGrowth: 0
        },
        teamPerformance: [],
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
    },
    timeframe = '',
    onTimeframeChange,
    className,
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${Math.abs(value).toFixed(1)}%`;
    };

    return (
        <Box
            className={className}
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                backgroundColor: '#ffffff',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.08)',
            }}
        >
            {/* Header Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                        New report
                    </Typography>
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.9rem' } }}>
                        {data.teamPerformance.map((member: TeamMember) => (
                            <Avatar key={member.name} sx={{ bgcolor: '#1976d2' }}>
                                {member.name.charAt(0)}
                            </Avatar>
                        ))}
                    </AvatarGroup>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton size="small" sx={{ color: '#666666' }}>
                        <ShuffleIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#666666' }}>
                        <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#666666' }}>
                        <ShareIcon />
                    </IconButton>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: '#173a79',
                        padding: '4px 12px',
                        borderRadius: 2,
                        border: '1px solid rgba(0,0,0,0.08)'
                    }}>
                        <Typography sx={{ color: '#ffffff', fontSize: '0.875rem' }}>Timeframe</Typography>
                        <Switch
                            size="small"
                            checked={true}
                            onChange={() => onTimeframeChange?.(timeframe)}
                        />
                        <Typography sx={{ fontSize: '0.875rem', color: '#ffffff' }}>{timeframe}</Typography>
                    </Box>
                </Stack>
            </Stack>

            {/* Revenue Section */}
            <Box mb={4}>
                <Typography variant="h6" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    Revenue
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                        {formatCurrency(data.totalRevenue)}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#666666' }}>
                        .{(data.totalRevenue % 1 * 100).toFixed(0)}
                    </Typography>
                    <Chip
                        label={`${data.growthPercentage > 0 ? '+' : ''}${formatPercentage(data.growthPercentage)}`}
                        icon={data.growthPercentage > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        color={data.growthPercentage > 0 ? 'success' : 'error'}
                        size="small"
                        sx={{
                            height: 24,
                            borderRadius: 1,
                            '& .MuiChip-label': { px: 1 },
                            '& .MuiChip-icon': { fontSize: '1rem' }
                        }}
                    />
                    <Typography variant="body2" sx={{ color: '#666666' }}>
                        {formatCurrency(data.growthValue)}
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#666666', mt: 1 }}>
                    vs prev. {formatCurrency(data.previousRevenue)} {timeframe}
                </Typography>
            </Box>

            {/* Metrics Cards */}
            <Stack direction="row" spacing={2} mb={4}>
                <Card sx={{ flex: 1, bgcolor: '#f8f9fa', boxShadow: 'none', borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="overline" sx={{ color: '#666666' }}>Top sales</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            {data.topSales}
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ flex: 1, bgcolor: '#1a1a1a', color: 'white', borderRadius: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Best deal
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                                    {formatCurrency(data.bestDeal.value)}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2" sx={{ color: 'white' }}>
                                        {data.bestDeal.company}
                                    </Typography>
                                    <ChevronRightIcon sx={{ fontSize: '1rem', color: 'white' }} />
                                </Stack>
                            </Box>
                            <IconButton size="small" sx={{ color: 'white' }}>
                                <StarIcon />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ flex: 1, bgcolor: '#f8f9fa', boxShadow: 'none', borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="overline" sx={{ color: '#666666' }}>Deals</Typography>
                        <Stack direction="row" spacing={1} alignItems="baseline">
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                {data.deals.count}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: data.deals.growth > 0 ? 'success.main' : 'error.main' }}
                            >
                                {data.deals.growth > 0 ? '↑' : '↓'} {Math.abs(data.deals.growth)}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>

                <Card sx={{ flex: 1, bgcolor: '#f8f9fa', boxShadow: 'none', borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="overline" sx={{ color: '#666666' }}>Value</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            {data.deals.value}
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ flex: 1, bgcolor: '#f8f9fa', boxShadow: 'none', borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="overline" sx={{ color: '#666666' }}>Win rate</Typography>
                        <Stack direction="row" spacing={1} alignItems="baseline">
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                {formatPercentage(data.deals.winRate)}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: data.deals.winRateGrowth > 0 ? 'success.main' : 'error.main' }}
                            >
                                {data.deals.winRateGrowth > 0 ? '↑' : '↓'} {formatPercentage(data.deals.winRateGrowth)}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>

            {/* Team Members */}
            <Stack direction="row" spacing={2}>
                {data.teamPerformance.map((member: TeamMember) => (
                    <Box
                        key={member.name}
                        sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 3,
                            bgcolor: '#f8f9fa',
                            border: '1px solid rgba(0,0,0,0.08)'
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: '#1976d2', fontSize: '0.75rem' }}>
                                {member.name.charAt(0)}
                            </Avatar>
                            <Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>{member.name}</Typography>
                            <Typography sx={{ color: '#666666', fontSize: '0.875rem' }}>
                                {formatCurrency(member.revenue)}
                            </Typography>
                        </Stack>
                        <Typography sx={{ color: '#666666', fontSize: '0.875rem' }}>
                            {formatPercentage(member.percentage)}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default Sales; 