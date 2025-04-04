import React, { useState } from 'react';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import FullOverviewCard from './FullOverviewCard';
import { FullOverviewCardProps } from './fullOverviewCard.types';

const FullOverviewContainer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleViewModeToggle = () => {
    setViewMode(prevMode => (prevMode === 'grid' ? 'list' : 'grid'));
  };

  const cardsData: FullOverviewCardProps[] = [
    {
      variant: 'notification',
      title: 'New Order Received',
      subTitle: 'Order #12345 has been placed successfully',
      details: [
        'Customer: John Doe',
        'Amount: R500.00',
        'Items: 3',
        'Payment Method: Credit Card',
        'Delivery Address: 123 Main St, City',
        'Estimated Delivery: 2-3 business days',
      ],
      notificationType: 'success',
      notificationTime: '2 mins ago',
      tags: ['New', 'Priority'],
      status: 'active',
    },
    {
      variant: 'notification',
      title: 'Low Stock Alert',
      subTitle: 'Product inventory is running low',
      details: [
        'Product: Premium Widget',
        'Current Stock: 5 units',
        'Minimum Required: 20 units',
        'Last Restock: 7 days ago',
        'Sales Rate: 10 units/day',
        'Time to Depletion: 12 hours',
      ],
      notificationType: 'warning',
      notificationTime: '5 mins ago',
      tags: ['Urgent', 'Inventory'],
      status: 'pending',
    },
    {
      variant: 'notification',
      title: 'Payment Failed',
      subTitle: 'Transaction #67890 could not be processed',
      details: [
        'Order ID: #67890',
        'Amount: R750.00',
        'Customer: Jane Smith',
        'Error Code: 402',
        'Reason: Insufficient Funds',
        'Retry Attempts: 2/3',
      ],
      notificationType: 'error',
      notificationTime: '10 mins ago',
      tags: ['Payment', 'Failed'],
      status: 'inactive',
    },
    {
      variant: 'notification',
      title: 'System Update',
      subTitle: 'New features available in your dashboard',
      details: [
        'Version: 2.1.0',
        'Release Date: Today',
        'New Features: 5',
        'Bug Fixes: 12',
        'Performance Improvements: 3',
        'Security Updates: 2',
      ],
      notificationType: 'info',
      notificationTime: '15 mins ago',
      tags: ['Update', 'System'],
      status: 'active',
    },
    {
      variant: 'bankCard',
      title: 'Your Card',
      ctaText: 'Add Card',
      bankName: 'Afrik Bank',
      bankType: 'Debit',
      cardNumber: '4242 4242 4242 4242',
      cardHolder: 'Pinto Manuel',
      cardExpire: '03/25',
      totalBalance: 'R240.00',
      cost: 'R239.00',
      receipts: 'R239.00',
      BankCardRowDetail: 'R1.00',
    },
    {
      variant: 'analytics',
      title: 'Sales Analytics',
      subTitle: 'Last 30 days performance',
      trend: {
        value: 12.5,
        direction: 'up',
      },
      chartData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [1200, 1900, 1500, 2200, 1800, 2500, 2100],
      },
      details: [
        'Total Sales: R15,200',
        'Average Order: R850',
        'Conversion Rate: 3.2%',
        'Top Product: Smartphone X',
        'Best Day: Saturday',
        'Growth: +12.5%',
      ],
      tags: ['Performance', 'Trending'],
      status: 'active',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            Overview Dashboard
          </Typography>
          <IconButton onClick={handleViewModeToggle}>
            {viewMode === 'grid' ? <ViewListIcon /> : <ViewModuleIcon />}
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          <Grid
            container
            spacing={1.5}
            sx={{
              ...(viewMode === 'list' && {
                flexDirection: 'column',
                '& .MuiGrid-item': {
                  maxWidth: '100%',
                  flexBasis: '100%',
                },
              }),
            }}
          >
            {cardsData.map((item, idx) => (
              <Grid
                item
                xs={12}
                sm={viewMode === 'grid' ? 6 : 12}
                md={viewMode === 'grid' ? 4 : 12}
                key={idx}
              >
                <FullOverviewCard {...item} viewMode={viewMode} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default FullOverviewContainer;
