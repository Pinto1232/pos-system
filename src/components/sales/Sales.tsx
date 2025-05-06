'use client';

import React, {
  useState,
  useEffect,
} from 'react';
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
  Tabs,
  Tab,
  Paper,
  CircularProgress,
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const Sales: React.FC<SalesProps> = ({
  data = {
    totalRevenue: 0,
    previousRevenue: 0,
    growthPercentage: 0,
    growthValue: 0,
    timeframe: {
      current: '',
      previous: '',
    },
    topSales: 0,
    bestDeal: {
      value: 0,
      company: '',
    },
    deals: {
      count: 0,
      value: '',
      growth: 0,
      winRate: 0,
      winRateGrowth: 0,
    },
    teamPerformance: [],
    platformRevenue: [],
    platformPerformance: {
      dribbble: {
        monthlyRevenue: 0,
        monthlyLeads: 0,
        winLoss: '',
        winPercentage: 0,
        winLossRatio: '',
      },
    },
    monthlyData: {
      sep: { revenue: 0, cost: 0 },
      oct: { revenue: 0, cost: 0 },
      nov: { revenue: 0, cost: 0 },
    },
  },
  timeframe = '',
  onTimeframeChange,
  className,
}) => {
  const [selectedMetric, setSelectedMetric] =
    useState<string | null>(null);
  const [selectedTab, setSelectedTab] =
    useState(0);
  const [inStoreProgress, setInStoreProgress] =
    useState(0);
  const [onlineProgress, setOnlineProgress] =
    useState(0);
  const [mobileProgress, setMobileProgress] =
    useState(0);
  const [desktopProgress, setDesktopProgress] =
    useState(0);

  useEffect(() => {
    const duration = 1500; // Slightly faster animation
    const steps = 60; // Fewer steps for smoother animation
    const stepDuration = duration / steps;

    const inStoreTarget = 54;
    const onlineTarget = 46;
    const mobileTarget = 78;
    const desktopTarget = 65;

    let currentStep = 0;

    const easeOutQuad = (t: number) =>
      t * (2 - t); // Easing function for smoother animation

    const timer = setInterval(() => {
      currentStep++;
      const progress = easeOutQuad(
        currentStep / steps
      );

      setInStoreProgress(
        Math.min(
          Math.round(inStoreTarget * progress),
          inStoreTarget
        )
      );
      setOnlineProgress(
        Math.min(
          Math.round(onlineTarget * progress),
          onlineTarget
        )
      );
      setMobileProgress(
        Math.min(
          Math.round(mobileTarget * progress),
          mobileTarget
        )
      );
      setDesktopProgress(
        Math.min(
          Math.round(desktopTarget * progress),
          desktopTarget
        )
      );

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
    setSelectedMetric(
      selectedMetric === metric ? null : metric
    );
  };

  const getMetricDetails = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return {
          title: 'Revenue Details',
          content: `Current: ${formatCurrency(
            data.totalRevenue
          )}\nPrevious: ${formatCurrency(
            data.previousRevenue
          )}\nGrowth: ${formatPercentage(data.growthPercentage)}`,
        };
      case 'deals':
        return {
          title: 'Deals Overview',
          content: `Total Deals: ${data.deals.count
            }\nWin Rate: ${formatPercentage(
              data.deals.winRate
            )}\nGrowth: ${formatPercentage(data.deals.growth)}`,
        };
      case 'winRate':
        return {
          title: 'Win Rate Analysis',
          content: `Current: ${formatPercentage(
            data.deals.winRate
          )}\nGrowth: ${formatPercentage(
            data.deals.winRateGrowth
          )}\nTarget: 75%`,
        };
      default:
        return null;
    }
  };

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedTab(newValue);
  };

  const chartData = [
    {
      date: 'OCT 20',
      campaign1: 5000,
      campaign2: 3500,
    },
    {
      date: 'OCT 21',
      campaign1: 7500,
      campaign2: 4000,
    },
    {
      date: 'OCT 22',
      campaign1: 7000,
      campaign2: 5000,
    },
    {
      date: 'OCT 23',
      campaign1: 6500,
      campaign2: 4500,
    },
    {
      date: 'OCT 24',
      campaign1: 11325,
      campaign2: 2000,
    },
    {
      date: 'OCT 25',
      campaign1: 8000,
      campaign2: 3500,
    },
    {
      date: 'OCT 26',
      campaign1: 3000,
      campaign2: 5000,
    },
    {
      date: 'OCT 27',
      campaign1: 4000,
      campaign2: 1500,
    },
  ];

  const getProgressStyles = (type: string) => {
    switch (type) {
      case 'inStore':
        return {
          color: '#10b981', // Emerald-500
          background: 'rgba(16, 185, 129, 0.12)',
        };
      case 'online':
        return {
          color: '#3b82f6', // Blue-500
          background: 'rgba(59, 130, 246, 0.12)',
        };
      case 'mobile':
        return {
          color: '#f43f5e', // Rose-500
          background: 'rgba(244, 63, 94, 0.12)',
        };
      case 'desktop':
        return {
          color: '#8b5cf6', // Violet-500
          background: 'rgba(139, 92, 246, 0.12)',
        };
      default:
        return {
          color: '#10b981', // Emerald-500
          background: 'rgba(16, 185, 129, 0.12)',
        };
    }
  };

  return (
    <Box
      className={className}
      sx={{
        p: { xs: 3, sm: 4, md: 5 },
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(230, 235, 245, 0.9)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.06)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, #4338ca, #6366f1)',
          opacity: 0.8,
        },
      }}
    >
      {/* Header Section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{
          xs: 'flex-start',
          sm: 'center',
        }}
        spacing={{ xs: 2, sm: 0 }}
        mb={5}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: { xs: '100%', sm: 'auto' },
            justifyContent: {
              xs: 'space-between',
              sm: 'flex-start',
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#1a1a1a',
              fontSize: {
                xs: '1.25rem',
                sm: '1.5rem',
                md: '1.75rem',
              },
              background: 'linear-gradient(135deg, #4338ca, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.02em',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '40%',
                height: '2px',
                background: 'linear-gradient(90deg, #4338ca, transparent)',
                borderRadius: '2px',
              }
            }}
          >
            New Sales Report
          </Typography>
          <AvatarGroup
            max={4}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              '& .MuiAvatar-root': {
                width: { xs: 28, sm: 32, md: 36 },
                height: { xs: 28, sm: 32, md: 36 },
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.85rem',
                  md: '0.9rem',
                },
                border: '2px solid #fff',
                boxShadow: '0 2px 10px rgba(99, 102, 241, 0.15)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.05)',
                  boxShadow: '0 6px 15px rgba(99, 102, 241, 0.2)',
                  zIndex: 10,
                },
              },
            }}
          >
            {data.teamPerformance.map(
              (member: TeamMember) => (
                <Tooltip
                  key={member.name}
                  title={`${member.name}: ${formatCurrency(member.revenue)}`}
                >
                  <Avatar
                    sx={{
                      background: 'linear-gradient(135deg, #4338ca, #6366f1)',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #3730a3, #4f46e5)',
                      },
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                </Tooltip>
              )
            )}
          </AvatarGroup>
        </Box>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          width={{ xs: '100%', sm: 'auto' }}
          justifyContent={{
            xs: 'space-between',
            sm: 'flex-end',
          }}
        >
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh data">
              <IconButton
                size="small"
                sx={{
                  color: '#64748b',
                  backgroundColor: 'rgba(241, 245, 249, 0.8)',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    color: '#4f46e5',
                    transform: 'translateY(-2px)',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                  },
                }}
              >
                <ShuffleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download report">
              <IconButton
                size="small"
                sx={{
                  color: '#64748b',
                  backgroundColor: 'rgba(241, 245, 249, 0.8)',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    color: '#4f46e5',
                    transform: 'translateY(-2px)',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                  },
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share report">
              <IconButton
                size="small"
                sx={{
                  color: '#64748b',
                  backgroundColor: 'rgba(241, 245, 249, 0.8)',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    color: '#4f46e5',
                    transform: 'translateY(-2px)',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                  },
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              background: 'linear-gradient(135deg, #4338ca, #6366f1)',
              padding: {
                xs: '6px 10px',
                sm: '8px 16px',
              },
              borderRadius: '12px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)',
              },
            }}
          >
            <Typography
              sx={{
                color: '#ffffff',
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem',
                },
                fontWeight: 500,
                display: {
                  xs: 'none',
                  sm: 'block',
                },
              }}
            >
              Timeframe
            </Typography>
            <Switch
              size="small"
              checked={true}
              onChange={() =>
                onTimeframeChange?.(timeframe)
              }
              sx={{
                '& .MuiSwitch-thumb': {
                  backgroundColor: '#ffffff',
                },
                '& .MuiSwitch-track': {
                  backgroundColor:
                    'rgba(255, 255, 255, 0.3)',
                },
              }}
            />
            <Typography
              sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem',
                },
                color: '#ffffff',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: {
                  xs: '100px',
                  sm: '150px',
                  md: '200px',
                },
              }}
            >
              {timeframe}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {/* Mobile Avatar Group */}
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          mb: 3,
        }}
      >
        <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              width: 36,
              height: 36,
              fontSize: '0.9rem',
              border: '2px solid #fff',
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.15)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'translateY(-3px) scale(1.05)',
                boxShadow: '0 6px 15px rgba(99, 102, 241, 0.2)',
                zIndex: 10,
              },
            },
          }}
        >
          {data.teamPerformance.map(
            (member: TeamMember) => (
              <Tooltip
                key={member.name}
                title={`${member.name}: ${formatCurrency(member.revenue)}`}
              >
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #4338ca, #6366f1)',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3730a3, #4f46e5)',
                    },
                  }}
                >
                  {member.name.charAt(0)}
                </Avatar>
              </Tooltip>
            )
          )}
        </AvatarGroup>
      </Box>

      {/* Revenue Section */}
      <Box mb={5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={4}
        >
          <Box flex={1}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              mb={2}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#64748b',
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem',
                  },
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-4px',
                    left: '0',
                    width: '30%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #4338ca, transparent)',
                    borderRadius: '2px',
                  }
                }}
              >
                Revenue
              </Typography>
              <Tooltip title="Click for detailed revenue information">
                <InfoIcon
                  sx={{
                    fontSize: '1rem',
                    color: '#64748b',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#4f46e5',
                      transform: 'scale(1.1)',
                    }
                  }}
                />
              </Tooltip>
            </Stack>
            <Stack
              direction="row"
              alignItems="baseline"
              spacing={1}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#1a1a1a',
                  fontSize: {
                    xs: '1.5rem',
                    sm: '2rem',
                    md: '2.5rem',
                  },
                  background: 'linear-gradient(135deg, #4338ca, #6366f1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {formatCurrency(
                  data.totalRevenue
                )}
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: '#666666' }}
              >
                .
                {(
                  (data.totalRevenue % 1) *
                  100
                ).toFixed(0)}
              </Typography>
              <Chip
                label={`${data.growthPercentage > 0
                  ? '+'
                  : ''
                  }${formatPercentage(data.growthPercentage)}`}
                icon={
                  data.growthPercentage > 0 ? (
                    <ArrowUpwardIcon />
                  ) : (
                    <ArrowDownwardIcon />
                  )
                }
                color={
                  data.growthPercentage > 0
                    ? 'success'
                    : 'error'
                }
                size="small"
                sx={{
                  height: 30,
                  borderRadius: '10px',
                  fontWeight: 600,
                  '& .MuiChip-label': {
                    px: 1.5,
                    fontSize: '0.85rem',
                  },
                  '& .MuiChip-icon': {
                    fontSize: '1rem',
                  },
                  boxShadow: data.growthPercentage > 0
                    ? '0 4px 12px rgba(76, 175, 80, 0.2)'
                    : '0 4px 12px rgba(244, 67, 54, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: data.growthPercentage > 0
                      ? '0 6px 16px rgba(76, 175, 80, 0.25)'
                      : '0 6px 16px rgba(244, 67, 54, 0.25)',
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{ color: '#666666' }}
              >
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
                gap: 1,
              }}
            >
              <span>vs prev.</span>
              <span style={{ fontWeight: 600 }}>
                {formatCurrency(
                  data.previousRevenue
                )}
              </span>
              <span>{timeframe}</span>
            </Typography>

            {/* Distribution Stats */}
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={3}
              justifyContent="space-between"
              sx={{ mt: { xs: 2, sm: 0 } }}
            >
              {/* In Store Progress */}
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: '100%', sm: 90 },
                  height: { xs: 70, sm: 90 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: { xs: 2, sm: 0 },
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={90}
                  thickness={4}
                  sx={{
                    position: 'absolute',
                    color: getProgressStyles('inStore').background,
                    opacity: 0.7,
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={inStoreProgress}
                  size={90}
                  thickness={4}
                  sx={{
                    position: 'absolute',
                    color: getProgressStyles('inStore').color,
                    transform: 'rotate(-90deg)',
                    boxShadow: `0 0 10px ${getProgressStyles('inStore').color}40`,
                    borderRadius: '50%',
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
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: getProgressStyles('inStore').color,
                      mb: 0.5,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {inStoreProgress}%
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: '#1e293b',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                    }}
                  >
                    In Store
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      mt: 0.25,
                      fontWeight: 500,
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
                  width: { xs: '100%', sm: 80 },
                  height: { xs: 60, sm: 80 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: { xs: 2, sm: 0 },
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={80}
                  thickness={3}
                  sx={{
                    position: 'absolute',
                    color:
                      getProgressStyles('online')
                        .background,
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={onlineProgress}
                  size={80}
                  thickness={3}
                  sx={{
                    position: 'absolute',
                    color:
                      getProgressStyles('online')
                        .color,
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
                      color:
                        getProgressStyles(
                          'online'
                        ).color,
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
                  width: { xs: '100%', sm: 80 },
                  height: { xs: 60, sm: 80 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: { xs: 2, sm: 0 },
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={80}
                  thickness={3}
                  sx={{
                    position: 'absolute',
                    color:
                      getProgressStyles('mobile')
                        .background,
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={mobileProgress}
                  size={80}
                  thickness={3}
                  sx={{
                    position: 'absolute',
                    color:
                      getProgressStyles('mobile')
                        .color,
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
                      color:
                        getProgressStyles(
                          'mobile'
                        ).color,
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
                  width: { xs: '100%', sm: 80 },
                  height: { xs: 60, sm: 80 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: { xs: 2, sm: 0 },
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={80}
                  thickness={3}
                  sx={{
                    position: 'absolute',
                    color:
                      getProgressStyles('desktop')
                        .background,
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={desktopProgress}
                  size={80}
                  thickness={3}
                  sx={{
                    position: 'absolute',
                    color:
                      getProgressStyles('desktop')
                        .color,
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
                      color:
                        getProgressStyles(
                          'desktop'
                        ).color,
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

          <Box
            flex={1.5}
            sx={{ height: { xs: 200, sm: 260 } }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: 'rgba(248, 250, 252, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
                  borderColor: 'rgba(203, 213, 225, 1)',
                },
              }}
            >
              <Stack spacing={1}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    mb: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: '0',
                      width: '30%',
                      height: '2px',
                      background: 'linear-gradient(90deg, #4338ca, transparent)',
                      borderRadius: '2px',
                    }
                  }}
                >
                  Deal Campaigns
                </Typography>
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  sx={{
                    minHeight: '32px',
                    mt: 1.5,
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#4f46e5',
                      height: 3,
                      borderRadius: '3px',
                    },
                    '& .MuiTab-root': {
                      minHeight: '32px',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#64748b',
                      opacity: 0.7,
                      padding: '4px 12px',
                      transition: 'all 0.3s ease',
                      '&.Mui-selected': {
                        color: '#4f46e5',
                        opacity: 1,
                      },
                      '&:hover': {
                        color: '#4f46e5',
                        opacity: 0.9,
                      },
                    },
                  }}
                >
                  <Tab label="CLICKS" />
                  <Tab label="REDEMPTION" />
                  <Tab label="SALES" />
                  <Tab label="GOALS MET" />
                </Tabs>
                <Box
                  sx={{ height: 170, mt: 0.5 }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 10,
                        bottom: 10,
                      }}
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
                          dy: 5,
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: '#999999',
                          fontSize: 11,
                        }}
                        domain={[0, 15000]}
                        ticks={[
                          0, 5000, 10000, 15000,
                        ]}
                      />
                      <RechartsTooltip
                        content={({
                          active,
                          payload,
                          label,
                        }) => {
                          if (
                            active &&
                            payload &&
                            payload.length
                          ) {
                            return (
                              <Box
                                sx={{
                                  backgroundColor:
                                    '#4a4a4a',
                                  p: 1,
                                  borderRadius:
                                    '4px',
                                  border: 'none',
                                  boxShadow:
                                    '0 2px 8px rgba(0,0,0,0.15)',
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: '#fff',
                                    fontSize:
                                      '0.7rem',
                                    mb: 0.25,
                                  }}
                                >
                                  {label}, 2:27 PM
                                </Typography>
                                <Typography
                                  sx={{
                                    color: '#fff',
                                    fontSize:
                                      '0.8rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  {
                                    payload[0]
                                      .value
                                  }{' '}
                                  CLICKS
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
                        stroke="#4f46e5"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: '#4f46e5',
                          stroke: '#fff',
                          strokeWidth: 2,
                          // boxShadow not supported in SVG
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="campaign2"
                        stroke="#f43f5e"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: '#f43f5e',
                          stroke: '#fff',
                          strokeWidth: 2,
                          // boxShadow not supported in SVG
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
                    mt: 0,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#4f46e5',
                        boxShadow: '0 0 6px rgba(79, 70, 229, 0.5)',
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        fontWeight: 600,
                      }}
                    >
                      CAMPAIGN 1
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#f43f5e',
                        boxShadow: '0 0 6px rgba(244, 63, 94, 0.5)',
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        fontWeight: 600,
                      }}
                    >
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
        spacing={3}
        mt={10}
        mb={5}
        sx={{
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -24,
            left: 0,
            width: '60px',
            height: '4px',
            background: 'linear-gradient(90deg, #4338ca, #6366f1)',
            borderRadius: '4px',
          },
          '& > *': {
            flex: 1,
            minWidth: { xs: '100%', sm: '200px' },
          },
        }}
      >
        <Card
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #93c5fd)',
            },
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography
                variant="overline"
                sx={{
                  color: '#3b82f6',
                  letterSpacing: '1.5px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Top Sales
              </Typography>
              <Tooltip title="Number of top-performing sales">
                <InfoIcon
                  sx={{
                    fontSize: '1.1rem',
                    color: '#3b82f6',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    }
                  }}
                />
              </Tooltip>
            </Stack>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mt: 1,
                mb: 2,
                fontSize: {
                  xs: '2rem',
                  sm: '2.25rem',
                  md: '2.5rem',
                },
                letterSpacing: '-0.02em',
              }}
            >
              {data.topSales}
            </Typography>
            <Box sx={{ position: 'relative', mt: 3, mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(
                  (data.topSales / 100) * 100,
                  100
                )}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#3b82f6',
                    borderRadius: 4,
                    backgroundImage: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: -20,
                  color: '#64748b',
                  fontWeight: 600,
                }}
              >
                {Math.min((data.topSales / 100) * 100, 100)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            color: 'white',
            borderRadius: '16px',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
            },
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  mb={2}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      letterSpacing: '1.5px',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Best Deal
                  </Typography>
                  <Tooltip title="Highest value deal">
                    <InfoIcon
                      sx={{
                        fontSize: '1.1rem',
                        color: 'rgba(255,255,255,0.9)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.2)',
                        }
                      }}
                    />
                  </Tooltip>
                </Stack>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: 'white',
                    mb: 2,
                    fontSize: {
                      xs: '2rem',
                      sm: '2.25rem',
                      md: '2.5rem',
                    },
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatCurrency(
                    data.bestDeal.value
                  )}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.15)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontWeight: 500,
                    }}
                  >
                    {data.bestDeal.company}
                  </Typography>
                  <ChevronRightIcon
                    sx={{
                      fontSize: '1.1rem',
                      color: 'white',
                    }}
                  />
                </Stack>
              </Box>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  width: 40,
                  height: 40,
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    transform: 'scale(1.15) rotate(10deg)',
                    color: '#ffd700',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                  },
                }}
              >
                <StarIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        <Card
          onClick={() =>
            handleMetricClick('deals')
          }
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #10b981, #34d399)',
            },
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography
                variant="overline"
                sx={{
                  color: '#10b981',
                  letterSpacing: '1.5px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Deals
              </Typography>
              <Tooltip title="Click for deals overview">
                <InfoIcon
                  sx={{
                    fontSize: '1.1rem',
                    color: '#10b981',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    }
                  }}
                />
              </Tooltip>
            </Stack>
            <Box sx={{ position: 'relative' }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="baseline"
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mt: 1,
                    mb: 2,
                    fontSize: {
                      xs: '2rem',
                      sm: '2.25rem',
                      md: '2.5rem',
                    },
                    letterSpacing: '-0.02em',
                  }}
                >
                  {data.deals.count}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: data.deals.growth > 0
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(244, 63, 94, 0.1)',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      backgroundColor: data.deals.growth > 0
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(244, 63, 94, 0.15)',
                    }
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: data.deals.growth > 0
                        ? '#10b981'
                        : '#f43f5e',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {data.deals.growth > 0
                      ? <ArrowUpwardIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                      : <ArrowDownwardIcon sx={{ fontSize: '1rem', mr: 0.5 }} />}
                    {Math.abs(data.deals.growth)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            {selectedMetric === 'deals' && (
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  bgcolor: 'rgba(16, 185, 129, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.08)',
                    bgcolor: 'rgba(16, 185, 129, 0.07)',
                  }
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-line',
                    color: '#334155',
                    fontWeight: 500,
                    lineHeight: 1.6,
                  }}
                >
                  {
                    getMetricDetails('deals')
                      ?.content
                  }
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 10px 30px rgba(139, 92, 246, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
            },
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography
                variant="overline"
                sx={{
                  color: '#8b5cf6',
                  letterSpacing: '1.5px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Value
              </Typography>
              <Tooltip title="Total deal value">
                <InfoIcon
                  sx={{
                    fontSize: '1.1rem',
                    color: '#8b5cf6',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    }
                  }}
                />
              </Tooltip>
            </Stack>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mt: 1,
                mb: 2,
                fontSize: {
                  xs: '2rem',
                  sm: '2.25rem',
                  md: '2.5rem',
                },
                letterSpacing: '-0.02em',
              }}
            >
              {data.deals.value}
            </Typography>
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                borderRadius: '12px',
                padding: '10px 16px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(139, 92, 246, 0.12)',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUpIcon
                  sx={{
                    color: '#8b5cf6',
                    fontSize: '1.25rem',
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: '#4c1d95',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                Monthly trend is positive
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          onClick={() =>
            handleMetricClick('winRate')
          }
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
            },
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(245, 158, 11, 0.15)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography
                variant="overline"
                sx={{
                  color: '#f59e0b',
                  letterSpacing: '1.5px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Win Rate
              </Typography>
              <Tooltip title="Click for win rate analysis">
                <InfoIcon
                  sx={{
                    fontSize: '1.1rem',
                    color: '#f59e0b',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    }
                  }}
                />
              </Tooltip>
            </Stack>
            <Box sx={{ position: 'relative' }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="baseline"
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mt: 1,
                    mb: 2,
                    fontSize: {
                      xs: '2rem',
                      sm: '2.25rem',
                      md: '2.5rem',
                    },
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatPercentage(
                    data.deals.winRate
                  )}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: data.deals.winRateGrowth > 0
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(244, 63, 94, 0.1)',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      backgroundColor: data.deals.winRateGrowth > 0
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(244, 63, 94, 0.15)',
                    }
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: data.deals.winRateGrowth > 0
                        ? '#10b981'
                        : '#f43f5e',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {data.deals.winRateGrowth > 0
                      ? <ArrowUpwardIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                      : <ArrowDownwardIcon sx={{ fontSize: '1rem', mr: 0.5 }} />}
                    {formatPercentage(
                      Math.abs(data.deals.winRateGrowth)
                    )}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Progress indicator */}
            <Box sx={{ position: 'relative', mt: 3, mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(data.deals.winRate, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#f59e0b',
                    borderRadius: 4,
                    backgroundImage: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: -20,
                  color: '#64748b',
                  fontWeight: 600,
                }}
              >
                Target: 75%
              </Typography>
            </Box>

            {selectedMetric === 'winRate' && (
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  bgcolor: 'rgba(245, 158, 11, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(245, 158, 11, 0.1)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(245, 158, 11, 0.08)',
                    bgcolor: 'rgba(245, 158, 11, 0.07)',
                  }
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-line',
                    color: '#334155',
                    fontWeight: 500,
                    lineHeight: 1.6,
                  }}
                >
                  {
                    getMetricDetails('winRate')
                      ?.content
                  }
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Team Members */}
      <Box sx={{ mt: 6, mb: 3 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          pb: 1,
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
        }}>
          <Typography
            variant="h6"
            sx={{
              color: '#334155',
              fontSize: '0.9rem',
              fontWeight: 600,
              position: 'relative',
              paddingLeft: '12px',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
                width: '4px',
                height: '16px',
                background: '#4f46e5',
                borderRadius: '2px',
              },
            }}
          >
            Team Performance
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {data.teamPerformance.length} Members
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{
            '& > *': {
              flex: 1,
              minWidth: { xs: '100%', sm: '200px' },
            },
          }}
        >
          {data.teamPerformance.map(
            (member: TeamMember) => (
              <Box
                key={member.name}
                sx={{
                  p: 0,
                  borderRadius: '12px',
                  bgcolor: '#ffffff',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  border: '1px solid rgba(226, 232, 240, 0.7)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.05)',
                    borderColor: 'rgba(203, 213, 225, 1)',
                    '& .member-avatar': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                {/* Header with gradient background */}
                <Box
                  sx={{
                    position: 'relative',
                    height: '60px',
                    background: member.percentage >= 0
                      ? 'linear-gradient(to right, rgba(79, 70, 229, 0.08) 0%, rgba(79, 70, 229, 0.03) 100%)'
                      : 'linear-gradient(to right, rgba(100, 116, 139, 0.08) 0%, rgba(100, 116, 139, 0.03) 100%)',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
                    mb: 4,
                  }}
                />

                {/* Avatar overlapping the header */}
                <Avatar
                  className="member-avatar"
                  sx={{
                    position: 'absolute',
                    top: '30px',
                    left: '24px',
                    width: '48px',
                    height: '48px',
                    bgcolor: member.percentage >= 0 ? '#4f46e5' : '#64748b',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.3s ease',
                    zIndex: 2,
                  }}
                >
                  {member.name.charAt(0)}
                </Avatar>

                {/* Content container */}
                <Box sx={{ px: 3, pb: 3 }}>
                  {/* Name and title */}
                  <Box sx={{ ml: 7, mb: 3 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        fontSize: '1rem',
                        mb: 0.25,
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#64748b',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                      }}
                    >
                      Sales Representative
                    </Typography>
                  </Box>

                  {/* Stats grid */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 2.5,
                      mb: 3,
                    }}
                  >
                    {/* Revenue stat */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        bgcolor: 'rgba(241, 245, 249, 0.5)',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#64748b',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          mb: 0.5,
                        }}
                      >
                        Revenue
                      </Typography>
                      <Typography
                        sx={{
                          color: '#0f172a',
                          fontSize: '1rem',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {formatCurrency(member.revenue)}
                      </Typography>
                    </Box>

                    {/* Contribution stat */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        bgcolor: 'rgba(241, 245, 249, 0.5)',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#64748b',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          mb: 0.5,
                        }}
                      >
                        Contribution
                      </Typography>
                      <Typography
                        sx={{
                          color: '#0f172a',
                          fontSize: '1rem',
                          fontWeight: 700,
                        }}
                      >
                        {formatPercentage((member.revenue / data.totalRevenue) * 100)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Performance section */}
                  <Box sx={{ mb: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#334155',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}
                      >
                        Performance
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '16px',
                          bgcolor: member.percentage >= 0
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(244, 63, 94, 0.1)',
                        }}
                      >
                        {member.percentage >= 0 ? (
                          <ArrowUpwardIcon
                            sx={{
                              fontSize: '0.85rem',
                              color: '#10b981',
                            }}
                          />
                        ) : (
                          <ArrowDownwardIcon
                            sx={{
                              fontSize: '0.85rem',
                              color: '#f43f5e',
                            }}
                          />
                        )}
                        <Typography
                          sx={{
                            color: member.percentage >= 0 ? '#10b981' : '#f43f5e',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}
                        >
                          {formatPercentage(Math.abs(member.percentage))}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Progress bar with target marker */}
                    <Box sx={{ position: 'relative', mt: 2, mb: 1 }}>
                      {/* Target marker */}
                      <Box
                        sx={{
                          position: 'absolute',
                          left: '30%',
                          top: -2,
                          bottom: -2,
                          width: 2,
                          bgcolor: 'rgba(100, 116, 139, 0.3)',
                          zIndex: 1,
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: -3,
                            left: -3,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'rgba(100, 116, 139, 0.3)',
                          },
                        }}
                      />

                      {/* Progress bar */}
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(Math.abs(member.percentage), 100)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(226, 232, 240, 0.5)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: member.percentage >= 0 ? '#10b981' : '#f43f5e',
                            borderRadius: 4,
                          },
                          position: 'relative',
                          zIndex: 2,
                        }}
                      />

                      {/* Target and current labels */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#94a3b8',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                          }}
                        >
                          Current: {formatPercentage(Math.abs(member.percentage))}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#94a3b8',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                          }}
                        >
                          Target: 30%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default Sales;
