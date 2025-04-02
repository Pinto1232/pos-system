'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip, IconButton, Switch } from '@mui/material';
import { SalesProps } from './types';
import StarIcon from '@mui/icons-material/Star';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Sales: React.FC<SalesProps> = ({
    metrics,
    timeframe,
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
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', sm: '1.75rem' },
                        color: '#1976d2',
                    }}
                >
                    New report
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        backgroundColor: '#f8f9fa',
                        padding: '8px 16px',
                        borderRadius: 3,
                        border: '1px solid rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                    }}
                >
                    <Typography sx={{ color: '#666666', fontSize: '0.9rem', fontWeight: 500 }}>Timeframe</Typography>
                    <Switch
                        checked={true}
                        onChange={() => onTimeframeChange?.(timeframe)}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#1976d2',
                                '&:hover': { backgroundColor: 'rgba(25,118,210,0.08)' }
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#90caf9'
                            }
                        }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#333333' }}>{timeframe}</Typography>
                </Box>
            </Stack>

            <Typography
                variant="h6"
                sx={{
                    fontSize: '1rem',
                    color: '#666666',
                    fontWeight: 600,
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}
            >
                Revenue
            </Typography>
            <Stack direction="row" alignItems="flex-end" spacing={1} mb={2} flexWrap="wrap">
                <Typography
                    variant="h3"
                    component="span"
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: '2rem', sm: '2.5rem' },
                        color: '#1a1a1a',
                    }}
                >
                    {formatCurrency(metrics.revenue)}
                </Typography>
                <Typography variant="h5" component="span" sx={{ color: '#666666', mb: 0.5, fontSize: '1.5rem' }}>
                    .{(metrics.revenue % 1 * 100).toFixed(0)}
                </Typography>
                <Chip
                    label={`${metrics.percentageChange > 0 ? '+' : ''}${formatPercentage(metrics.percentageChange)}`}
                    color={metrics.percentageChange > 0 ? 'success' : 'error'}
                    size="small"
                    icon={metrics.percentageChange > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                    sx={{
                        ml: 1,
                        height: 28,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        backgroundColor: metrics.percentageChange > 0 ? 'rgba(76, 175, 80, 0.12)' : 'rgba(244, 67, 54, 0.12)',
                        color: metrics.percentageChange > 0 ? '#2e7d32' : '#d32f2f',
                        '& .MuiChip-icon': {
                            fontSize: '1rem',
                            color: 'inherit'
                        },
                        borderRadius: '8px',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            backgroundColor: metrics.percentageChange > 0 ? 'rgba(76, 175, 80, 0.18)' : 'rgba(244, 67, 54, 0.18)',
                        }
                    }}
                />
                <Typography variant="body2" sx={{ ml: 1, fontSize: '0.9rem', color: '#666666', fontWeight: 500 }}>
                    {formatCurrency(metrics.changeAmount)}
                </Typography>
            </Stack>

            <Typography
                variant="body2"
                sx={{
                    fontSize: '0.875rem',
                    color: '#666666',
                    mb: 4,
                    fontWeight: 500
                }}
            >
                vs prev. {formatCurrency(metrics.previousRevenue)} {timeframe}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Card sx={{
                    flex: 1,
                    backgroundColor: '#f8f9fa',
                    boxShadow: 'none',
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                    }
                }}>
                    <CardContent>
                        <Typography sx={{ color: '#666666', fontSize: '0.875rem', mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Top sales
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>{metrics.topSales}</Typography>
                    </CardContent>
                </Card>

                <Card sx={{
                    flex: 1,
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    }
                }}>
                    <CardContent sx={{ position: 'relative' }}>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: '#ffffff',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    color: '#ffffff',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    transform: 'rotate(45deg)'
                                }
                            }}
                            size="small"
                        >
                            <StarIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{
                            color: '#ffffff',
                            fontSize: '0.875rem',
                            mb: 1,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Best deal
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
                            {formatCurrency(metrics.bestDeal.amount)}
                        </Typography>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateX(4px)',
                                }
                            }}
                        >
                            <Typography variant="body2" sx={{ color: '#ffffff' }}>
                                {metrics.bestDeal.company}
                            </Typography>
                            <ChevronRightIcon fontSize="small" sx={{ color: '#ffffff' }} />
                        </Stack>
                    </CardContent>
                </Card>

                <Card sx={{
                    flex: 1,
                    backgroundColor: '#f8f9fa',
                    boxShadow: 'none',
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                    }
                }}>
                    <CardContent>
                        <Typography sx={{ color: '#666666', fontSize: '0.875rem', mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Deals
                        </Typography>
                        <Stack direction="row" alignItems="baseline" spacing={1}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>{metrics.deals}</Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#d32f2f',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                ↓ 5
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>

                <Card sx={{
                    flex: 1,
                    backgroundColor: '#f8f9fa',
                    boxShadow: 'none',
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                    }
                }}>
                    <CardContent>
                        <Typography sx={{ color: '#666666', fontSize: '0.875rem', mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Value
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>{metrics.value}k</Typography>
                    </CardContent>
                </Card>

                <Card sx={{
                    flex: 1,
                    backgroundColor: '#f8f9fa',
                    boxShadow: 'none',
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                    }
                }}>
                    <CardContent>
                        <Typography sx={{ color: '#666666', fontSize: '0.875rem', mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Win rate
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>{formatPercentage(metrics.winRate)}</Typography>
                    </CardContent>
                </Card>
            </Stack>

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                mt={4}
            >
                {metrics.salesByTeam.map((member, index) => (
                    <Box
                        key={member.name}
                        sx={{
                            flex: 1,
                            p: 2.5,
                            borderRadius: 3,
                            backgroundColor: '#f8f9fa',
                            border: '1px solid rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease-in-out',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                            }
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>{member.name}</Typography>
                            <Typography
                                sx={{
                                    color: '#666666',
                                    fontSize: '0.9rem',
                                    fontWeight: 500
                                }}
                            >
                                {formatCurrency(member.amount)}
                            </Typography>
                        </Stack>
                        <Typography
                            sx={{
                                color: '#666666',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}
                        >
                            {formatPercentage(member.percentage)}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default Sales; 