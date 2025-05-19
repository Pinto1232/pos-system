'use client';

import React from 'react';
import { Box, Stack, Typography, Tabs, Tab, Paper } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

interface DealCampaignsChartProps {
  selectedTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  chartData: Array<{
    date: string;
    campaign1: number;
    campaign2: number;
  }>;
}

const DealCampaignsChart: React.FC<DealCampaignsChartProps> = ({
  selectedTab,
  handleTabChange,
  chartData,
}) => {
  return (
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
            },
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
        <Box sx={{ height: 170, mt: 0.5 }}>
          <ResponsiveContainer width="100%" height="100%">
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
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#fff',
                            fontSize: '0.7rem',
                            mb: 0.25,
                          }}
                        >
                          {label}, 2:27 PM
                        </Typography>
                        <Typography
                          sx={{
                            color: '#fff',
                            fontSize: '0.8rem',
                            fontWeight: 600,
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
                stroke="#4f46e5"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#4f46e5',
                  stroke: '#fff',
                  strokeWidth: 2,
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
          <Stack direction="row" spacing={0.75} alignItems="center">
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
          <Stack direction="row" spacing={0.75} alignItems="center">
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
  );
};

export default DealCampaignsChart;
