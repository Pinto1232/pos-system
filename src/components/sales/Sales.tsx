'use client';

import React, { useState, useEffect } from 'react';
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
    AvatarGroup,
    Tooltip,
    LinearProgress,
    useTheme,
    useMediaQuery,
    Tabs,
    Tab,
    Paper,
    CircularProgress
} from '@mui/material';
import { SalesProps, TeamMember } from './types';
import StarIcon from '@mui/icons-material/Star';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [inStoreProgress, setInStoreProgress] = useState(0);
    const [onlineProgress, setOnlineProgress] = useState(0);
    const [mobileProgress, setMobileProgress] = useState(0);
    const [desktopProgress, setDesktopProgress] = useState(0);

    useEffect(() => {
        const duration = 1500; // Slightly faster animation
        const steps = 60; // Fewer steps for smoother animation
        const stepDuration = duration / steps;

        const inStoreTarget = 54;
        const onlineTarget = 46;
        const mobileTarget = 78;
        const desktopTarget = 65;

        let currentStep = 0;

        const easeOutQuad = (t: number) => t * (2 - t); // Easing function for smoother animation

        const timer = setInterval(() => {
            currentStep++;
            const progress = easeOutQuad(currentStep / steps);

            setInStoreProgress(Math.min(Math.round(inStoreTarget * progress), inStoreTarget));
            setOnlineProgress(Math.min(Math.round(onlineTarget * progress), onlineTarget));
            setMobileProgress(Math.min(Math.round(mobileTarget * progress), mobileTarget));
            setDesktopProgress(Math.min(Math.round(desktopTarget * progress), desktopTarget));

            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, []); // Run once on mount

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

    const handleMetricClick = (metric: string) => {
        setSelectedMetric(selectedMetric === metric ? null : metric);
    };

    const getMetricDetails = (metric: string) => {
        switch (metric) {
            case 'revenue':
                return {
                    title: 'Revenue Details',
                    content: `Current: ${formatCurrency(data.totalRevenue)}\nPrevious: ${formatCurrency(data.previousRevenue)}\nGrowth: ${formatPercentage(data.growthPercentage)}`
                };
            case 'deals':
                return {
                    title: 'Deals Overview',
                    content: `Total Deals: ${data.deals.count}\nWin Rate: ${formatPercentage(data.deals.winRate)}\nGrowth: ${formatPercentage(data.deals.growth)}`
                };
            case 'winRate':
                return {
                    title: 'Win Rate Analysis',
                    content: `Current: ${formatPercentage(data.deals.winRate)}\nGrowth: ${formatPercentage(data.deals.winRateGrowth)}\nTarget: 75%`
                };
            default:
                return null;
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const chartData = [
        { date: 'OCT 20', campaign1: 5000, campaign2: 3500 },
        { date: 'OCT 21', campaign1: 7500, campaign2: 4000 },
        { date: 'OCT 22', campaign1: 7000, campaign2: 5000 },
        { date: 'OCT 23', campaign1: 6500, campaign2: 4500 },
        { date: 'OCT 24', campaign1: 11325, campaign2: 2000 },
        { date: 'OCT 25', campaign1: 8000, campaign2: 3500 },
        { date: 'OCT 26', campaign1: 3000, campaign2: 5000 },
        { date: 'OCT 27', campaign1: 4000, campaign2: 1500 },
    ];

    const getProgressStyles = (type: string) => {
        switch (type) {
            case 'inStore':
                return {
                    color: '#00C853',
                    background: 'rgba(0, 200, 83, 0.12)'
                };
            case 'online':
                return {
                    color: '#2196F3',
                    background: 'rgba(33, 150, 243, 0.12)'
                };
            case 'mobile':
                return {
                    color: '#FF4081',
                    background: 'rgba(255, 64, 129, 0.12)'
                };
            case 'desktop':
                return {
                    color: '#9C27B0',
                    background: 'rgba(156, 39, 176, 0.12)'
                };
            default:
                return {
                    color: '#00C853',
                    background: 'rgba(0, 200, 83, 0.12)'
                };
        }
    };

    return (
        <Box
            className={className}
            sx={{
                p: { xs: 3, sm: 4, md: 5 },
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                }
            }}
        >
            {/* Header Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: '#1a1a1a',
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                            background: 'linear-gradient(45deg, #1a1a1a, #333)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        New Sales report
                    </Typography>
                    <AvatarGroup
                        max={4}
                        sx={{
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                fontSize: '0.9rem',
                                border: '2px solid #fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                }
                            }
                        }}
                    >
                        {data.teamPerformance.map((member: TeamMember) => (
                            <Tooltip key={member.name} title={`${member.name}: ${formatCurrency(member.revenue)}`}>
                                <Avatar
                                    sx={{
                                        bgcolor: '#1976d2',
                                        '&:hover': {
                                            bgcolor: '#1565c0',
                                        }
                                    }}
                                >
                                    {member.name.charAt(0)}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Tooltip title="Refresh data">
                        <IconButton
                            size="small"
                            sx={{
                                color: '#666666',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: '#1976d2',
                                    transform: 'scale(1.1)',
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                }
                            }}
                        >
                            <ShuffleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Download report">
                        <IconButton
                            size="small"
                            sx={{
                                color: '#666666',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: '#1976d2',
                                    transform: 'scale(1.1)',
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                }
                            }}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Share report">
                        <IconButton
                            size="small"
                            sx={{
                                color: '#666666',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: '#1976d2',
                                    transform: 'scale(1.1)',
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                }
                            }}
                        >
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: '#173a79',
                        padding: '6px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 2px 8px rgba(23, 58, 121, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(23, 58, 121, 0.2)',
                        }
                    }}>
                        <Typography sx={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 500 }}>
                            Timeframe
                        </Typography>
                        <Switch
                            size="small"
                            checked={true}
                            onChange={() => onTimeframeChange?.(timeframe)}
                            sx={{
                                '& .MuiSwitch-thumb': {
                                    backgroundColor: '#ffffff',
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                },
                            }}
                        />
                        <Typography sx={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: 500 }}>
                            {timeframe}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

            {/* Revenue Section */}
            <Box mb={5}>
                <Stack direction="row" spacing={4}>
                    <Box flex={1}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#666666',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                Revenue
                            </Typography>
                            <Tooltip title="Click for detailed revenue information">
                                <InfoIcon sx={{ fontSize: '1rem', color: '#666666' }} />
                            </Tooltip>
                        </Stack>
                        <Stack direction="row" alignItems="baseline" spacing={1}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    color: '#1a1a1a',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    background: 'linear-gradient(45deg, #1a1a1a, #333)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
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
                                    height: 28,
                                    borderRadius: '8px',
                                    '& .MuiChip-label': { px: 1.5 },
                                    '& .MuiChip-icon': { fontSize: '1rem' },
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    }
                                }}
                            />
                            <Typography variant="body2" sx={{ color: '#666666' }}>
                                {formatCurrency(data.growthValue)}
                            </Typography>
                        </Stack>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#666666',
                                mt: 2,
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <span>vs prev.</span>
                            <span style={{ fontWeight: 600 }}>{formatCurrency(data.previousRevenue)}</span>
                            <span>{timeframe}</span>
                        </Typography>

                        {/* Distribution Stats */}
                        <Stack direction="row" spacing={3} justifyContent="space-between">
                            {/* In Store Progress */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 80,
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    size={80}
                                    thickness={3}
                                    sx={{
                                        position: 'absolute',
                                        color: getProgressStyles('inStore').background,
                                    }}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={inStoreProgress}
                                    size={80}
                                    thickness={3}
                                    sx={{
                                        position: 'absolute',
                                        color: getProgressStyles('inStore').color,
                                        transform: 'rotate(-90deg)',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontSize: '1.25rem',
                                            fontWeight: 700,
                                            color: getProgressStyles('inStore').color,
                                            mb: 0.5,
                                        }}
                                    >
                                        {inStoreProgress}%
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: '#1a1a1a',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        In Store
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: '#666666',
                                            mt: 0.25,
                                        }}
                                    >
                                        1,020
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Online Progress */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 80,
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    size={80}
                                    thickness={3}
                                    sx={{
                                        position: 'absolute',
                                        color: getProgressStyles('online').background,
                                    }}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={onlineProgress}
                                    size={80}
                                    thickness={3}
                                    sx={{
                                        position: 'absolute',
                                        color: getProgressStyles('online').color,
                                        transform: 'rotate(-90deg)',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontSize: '1.25rem',
                                            fontWeight: 700,
                                            color: getProgressStyles('online').color,
                                            mb: 0.5,
                                        }}
                                    >
                                        {onlineProgress}%
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: '#1a1a1a',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        Online
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: '#666666',
                                            mt: 0.25,
                                        }}
                                    >
                                        869
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Mobile Progress */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 80,
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    size={80}
                                    thickness={3}
                                    sx={{
                                        position: 'absolute',
                                        color: getProgressStyles('mobile').background,
                                    }}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={mobileProgress}
                                    size={80}
                                    thickness={3}
                                    sx={{
                                        position: 'absolute',
                                        color: getProgressStyles('mobile').color,
                                        transform: 'rotate(-90deg)',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontSize: '1.25rem',
                                            fontWeight: 700,
                                            color: getProgressStyles('mobile').color,
                                            mb: 0.5,
                                        }}
                                    >
                                        {mobileProgress}%
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: '#1a1a1a',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        Mobile
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: '#666666',
                                            mt: 0.25,
                                        }}
                                    >
                                        1,458
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Desktop Progress */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 80,
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    size={80}
                                    thickness={3}
                                    sx={{
                                        position: 'absolute',
                                        color: getProgressStyles('desktop').background,
                                    }}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={desktopProgress}
                                    size={80}
                                    thickness={3}
                                    sx={{
                                        position: 'absolute',
                                        color: getProgressStyles('desktop').color,
                                        transform: 'rotate(-90deg)',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontSize: '1.25rem',
                                            fontWeight: 700,
                                            color: getProgressStyles('desktop').color,
                                            mb: 0.5,
                                        }}
                                    >
                                        {desktopProgress}%
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: '#1a1a1a',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        Desktop
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.7rem',
                                            color: '#666666',
                                            mt: 0.25,
                                        }}
                                    >
                                        952
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>

                    <Box flex={1.5} sx={{ height: 260 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
                                border: '1px solid rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <Stack spacing={1}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: '#666666',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        mb: 0
                                    }}
                                >
                                    DEAL CAMPAIGNS
                                </Typography>
                                <Tabs
                                    value={selectedTab}
                                    onChange={handleTabChange}
                                    sx={{
                                        minHeight: '28px',
                                        '& .MuiTabs-indicator': {
                                            display: 'none'
                                        },
                                        '& .MuiTab-root': {
                                            minHeight: '28px',
                                            textTransform: 'uppercase',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: '#666666',
                                            opacity: 0.7,
                                            padding: '4px 10px',
                                            '&.Mui-selected': {
                                                color: '#666666',
                                                opacity: 1
                                            }
                                        }
                                    }}
                                >
                                    <Tab label="CLICKS" />
                                    <Tab label="REDEMPTION" />
                                    <Tab label="SALES" />
                                    <Tab label="GOALS MET" />
                                </Tabs>
                                <Box sx={{ height: 170, mt: 0.5 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={chartData}
                                            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#e0e0e0"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: '#999999',
                                                    fontSize: 11,
                                                    dy: 5
                                                }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: '#999999',
                                                    fontSize: 11
                                                }}
                                                domain={[0, 15000]}
                                                ticks={[0, 5000, 10000, 15000]}
                                            />
                                            <RechartsTooltip
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <Box
                                                                sx={{
                                                                    backgroundColor: '#4a4a4a',
                                                                    p: 1,
                                                                    borderRadius: '4px',
                                                                    border: 'none',
                                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        color: '#fff',
                                                                        fontSize: '0.7rem',
                                                                        mb: 0.25
                                                                    }}
                                                                >
                                                                    {label}, 2:27 PM
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        color: '#fff',
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: 600
                                                                    }}
                                                                >
                                                                    {payload[0].value} CLICKS
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="campaign1"
                                                stroke="#36D7DC"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    r: 3,
                                                    fill: '#36D7DC',
                                                    stroke: '#fff',
                                                    strokeWidth: 2
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="campaign2"
                                                stroke="#FF6B6B"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    r: 3,
                                                    fill: '#FF6B6B',
                                                    stroke: '#fff',
                                                    strokeWidth: 2
                                                }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        justifyContent: 'center',
                                        mt: 0
                                    }}
                                >
                                    <Stack direction="row" spacing={0.75} alignItems="center">
                                        <Box
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                backgroundColor: '#36D7DC'
                                            }}
                                        />
                                        <Typography sx={{ fontSize: '0.7rem', color: '#666666' }}>
                                            CAMPAIGN 1
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0.75} alignItems="center">
                                        <Box
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                backgroundColor: '#FF6B6B'
                                            }}
                                        />
                                        <Typography sx={{ fontSize: '0.7rem', color: '#666666' }}>
                                            CAMPAIGN 2
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Box>
                </Stack>
            </Box>

            {/* Metrics Cards */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                mb={5}
                sx={{
                    '& > *': {
                        flex: 1,
                        minWidth: { xs: '100%', sm: '200px' }
                    }
                }}
            >
                <Card
                    sx={{
                        bgcolor: 'rgba(25, 118, 210, 0.15)',
                        boxShadow: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.25)',
                        }
                    }}
                >
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Typography variant="overline" sx={{ color: '#666666', letterSpacing: '1px' }}>
                                Top sales
                            </Typography>
                            <Tooltip title="Number of top-performing sales">
                                <InfoIcon sx={{ fontSize: '1rem', color: '#666666' }} />
                            </Tooltip>
                        </Stack>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: '#1a1a1a',
                                mt: 1,
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                            }}
                        >
                            {data.topSales}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min((data.topSales / 100) * 100, 100)}
                            sx={{
                                mt: 2,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#1976d2',
                                }
                            }}
                        />
                    </CardContent>
                </Card>

                <Card
                    sx={{
                        bgcolor: '#1a1a1a',
                        color: 'white',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        }
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                    <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>
                                        Best deal
                                    </Typography>
                                    <Tooltip title="Highest value deal">
                                        <InfoIcon sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }} />
                                    </Tooltip>
                                </Stack>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        color: 'white',
                                        mb: 1,
                                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                                    }}
                                >
                                    {formatCurrency(data.bestDeal.value)}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2" sx={{ color: 'white' }}>
                                        {data.bestDeal.company}
                                    </Typography>
                                    <ChevronRightIcon sx={{ fontSize: '1rem', color: 'white' }} />
                                </Stack>
                            </Box>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        color: '#ffd700',
                                    }
                                }}
                            >
                                <StarIcon />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>

                <Card
                    onClick={() => handleMetricClick('deals')}
                    sx={{
                        bgcolor: 'rgba(76, 175, 80, 0.15)',
                        boxShadow: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.25)',
                        }
                    }}
                >
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Typography variant="overline" sx={{ color: '#666666', letterSpacing: '1px' }}>
                                Deals
                            </Typography>
                            <Tooltip title="Click for deals overview">
                                <InfoIcon sx={{ fontSize: '1rem', color: '#666666' }} />
                            </Tooltip>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="baseline">
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    mt: 1,
                                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                                }}
                            >
                                {data.deals.count}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: data.deals.growth > 0 ? 'success.main' : 'error.main',
                                    fontWeight: 600
                                }}
                            >
                                {data.deals.growth > 0 ? '↑' : '↓'} {Math.abs(data.deals.growth)}
                            </Typography>
                        </Stack>
                        {selectedMetric === 'deals' && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                    {getMetricDetails('deals')?.content}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Card sx={{
                    bgcolor: 'rgba(156, 39, 176, 0.15)',
                    boxShadow: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(156, 39, 176, 0.25)',
                    }
                }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Typography variant="overline" sx={{ color: '#666666', letterSpacing: '1px' }}>
                                Value
                            </Typography>
                            <Tooltip title="Total deal value">
                                <InfoIcon sx={{ fontSize: '1rem', color: '#666666' }} />
                            </Tooltip>
                        </Stack>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: '#1a1a1a',
                                mt: 1,
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                            }}
                        >
                            {data.deals.value}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUpIcon sx={{ color: 'success.main' }} />
                            <Typography variant="body2" sx={{ color: '#666666' }}>
                                Monthly trend
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card
                    onClick={() => handleMetricClick('winRate')}
                    sx={{
                        bgcolor: 'rgba(255, 152, 0, 0.15)',
                        boxShadow: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(255, 152, 0, 0.25)',
                        }
                    }}
                >
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Typography variant="overline" sx={{ color: '#666666', letterSpacing: '1px' }}>
                                Win rate
                            </Typography>
                            <Tooltip title="Click for win rate analysis">
                                <InfoIcon sx={{ fontSize: '1rem', color: '#666666' }} />
                            </Tooltip>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="baseline">
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    mt: 1,
                                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                                }}
                            >
                                {formatPercentage(data.deals.winRate)}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: data.deals.winRateGrowth > 0 ? 'success.main' : 'error.main',
                                    fontWeight: 600
                                }}
                            >
                                {data.deals.winRateGrowth > 0 ? '↑' : '↓'} {formatPercentage(data.deals.winRateGrowth)}
                            </Typography>
                        </Stack>
                        {selectedMetric === 'winRate' && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                    {getMetricDetails('winRate')?.content}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Stack>

            {/* Team Members */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{
                    '& > *': {
                        flex: 1,
                        minWidth: { xs: '100%', sm: '200px' }
                    }
                }}
            >
                {data.teamPerformance.map((member: TeamMember) => (
                    <Box
                        key={member.name}
                        sx={{
                            p: 3,
                            borderRadius: '16px',
                            bgcolor: '#f8f9fa',
                            border: '1px solid rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                bgcolor: '#ffffff',
                            }
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: '#1976d2',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                }}
                            >
                                {member.name.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '1rem' }}>
                                    {member.name}
                                </Typography>
                                <Typography sx={{ color: '#666666', fontSize: '0.875rem' }}>
                                    {formatCurrency(member.revenue)}
                                </Typography>
                            </Box>
                        </Stack>
                        <Typography
                            sx={{
                                color: '#666666',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <span>Performance:</span>
                            <span style={{
                                color: member.percentage >= 0 ? '#2e7d32' : '#d32f2f',
                                fontWeight: 600
                            }}>
                                {formatPercentage(member.percentage)}
                            </span>
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(Math.abs(member.percentage), 100)}
                            sx={{
                                mt: 2,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: member.percentage >= 0 ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: member.percentage >= 0 ? '#2e7d32' : '#d32f2f',
                                }
                            }}
                        />
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default Sales; 