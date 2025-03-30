import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    IconButton,
    LinearProgress,
    Tooltip
} from '@mui/material';
import {
    FilterList as FilterListIcon,
    BarChart as BarChartIcon
} from '@mui/icons-material';
import { Platform } from '@/components/sales/types';

interface PlatformRevenueChartProps {
    platformRevenue: Platform[];
    onFilterChange: (filterType: string, value: string) => void;
}

const PlatformRevenueChart: React.FC<PlatformRevenueChartProps> = ({ platformRevenue, onFilterChange }) => (
    <Card
        elevation={2}
        sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                transform: 'translateY(-4px)'
            }
        }}
    >
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '6px',
                background: 'linear-gradient(90deg, #1976d2 0%, #dc004e 100%)'
            }}
        />
        <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center">
                    <BarChartIcon sx={{ color: '#1976d2', mr: 1.5 }} />
                    <Typography variant="h6" fontWeight="600" color="#333">
                        Platform Revenue
                    </Typography>
                </Box>
                <Tooltip title="Filter platforms">
                    <IconButton
                        size="small"
                        onClick={() => onFilterChange('platform', 'all')}
                        sx={{
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.2)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FilterListIcon fontSize="small" sx={{ color: '#1976d2' }} />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box sx={{ mt: 2 }}>
                {platformRevenue.map((platform, index) => {
                    const gradientColors = [
                        'linear-gradient(90deg, #e91e63 0%, #f48fb1 100%)',
                        'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                        'linear-gradient(90deg, #9c27b0 0%, #ce93d8 100%)',
                        'linear-gradient(90deg, #4caf50 0%, #81c784 100%)'
                    ];
                    const solidColors = [
                        '#e91e63', '#1976d2', '#9c27b0', '#4caf50'
                    ];

                    return (
                        <Box
                            key={platform.platform}
                            mb={3}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'rgba(0, 0, 0, 0.02)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                                    transform: 'translateX(4px)'
                                }
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={1.5}>
                                <Avatar
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: solidColors[index % solidColors.length],
                                        color: 'white',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        mr: 2
                                    }}
                                >
                                    {platform.platform.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="600">
                                        {platform.platform}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {platform.percentage}% of total revenue
                                    </Typography>
                                </Box>
                                <Typography
                                    ml="auto"
                                    variant="h6"
                                    fontWeight="bold"
                                    sx={{
                                        background: gradientColors[index % gradientColors.length],
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    ${platform.revenue.toLocaleString('en-US')}
                                </Typography>
                            </Box>
                            <Box sx={{ position: 'relative', mt: 1, mb: 0.5 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={platform.percentage}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'rgba(0, 0, 0, 0.05)',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            background: gradientColors[index % gradientColors.length],
                                            transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: `${Math.max(0, 100 - platform.percentage - 5)}%`,
                                        top: -20,
                                        bgcolor: solidColors[index % solidColors.length],
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        py: 0.5,
                                        px: 1,
                                        borderRadius: 1,
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        opacity: 0.9
                                    }}
                                >
                                    {platform.percentage}%
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid rgba(0, 0, 0, 0.05)'
                }}
            >
                <Chip
                    label="View detailed report"
                    size="small"
                    onClick={() => onFilterChange('platform', 'detailed')}
                    sx={{
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        color: '#1976d2',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        height: 24,
                        '&:hover': {
                            bgcolor: 'rgba(25, 118, 210, 0.2)'
                        }
                    }}
                />
            </Box>
        </CardContent>
    </Card>
);

export default PlatformRevenueChart;