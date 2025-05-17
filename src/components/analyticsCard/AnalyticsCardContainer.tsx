import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import AnalyticsCard from './AnalyticsCard';

const AnalyticsCardContainer = () => {
  const cardsData = [
    {
      circleText: '01',
      title: 'Customer Insights',
      subTitle: 'Sales Overview & Analytics',
      dataPoints: ['New vs. Returning Customers', 'Average Order Value (AOV)', 'Top Customers'],
      percentage: '-22%',
    },
    {
      circleText: '02',
      title: 'Product & Category Performance',
      subTitle: 'Sales Overview & Analytics',
      dataPoints: ['Top-Selling Products', 'Best-Performing Categories', 'Low-Stock or Out-of-Stock Alerts'],
      percentage: '22%',
    },
    {
      circleText: '03',
      title: 'Time-Based Analytics',
      subTitle: 'Sales Overview & Analytics',
      dataPoints: ['Hourly / Daily / Weekly Sales Trend', 'Peak Sales Hours', 'Week-over-Week / Month-over-Month Comparison'],
      percentage: '22%',
    },
    {
      circleText: '04',
      title: 'Profitability & Costs',
      subTitle: 'Sales Overview & Analytics',
      dataPoints: ['Gross Margin', 'Profit or Net Income', 'Profit or Net Income'],
      percentage: '12%',
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 'bold',
          color: '#000',
          px: { xs: 1, sm: 1, md: 0 },
        }}
      >
        Sales Overview & Analytics
      </Typography>
      <Grid container spacing={2}>
        {cardsData.map((card, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={index}
            sx={{
              display: 'flex',
              width: '100%',
            }}
          >
            <AnalyticsCard circleText={card.circleText} title={card.title} dataPoints={card.dataPoints} percentage={card.percentage} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AnalyticsCardContainer;
