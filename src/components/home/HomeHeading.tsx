'use client';

import React from 'react';
import { Typography, Box } from '@mui/material';
import { TranslatedText } from '@/i18n';

const HomeHeading: React.FC = () => {
  return (
    <Box textAlign="center" mt={5}>
      <Typography
        sx={{
          color: '#000',
          marginBottom: '0.5rem',
          fontWeight: 600,
          fontSize: '2.5rem',
          letterSpacing: '-0.02em',
        }}
        variant="h4"
      >
        <TranslatedText
          i18nKey="home.chooseYourPlan"
          defaultValue="Choose Your Plan"
        />
      </Typography>
      <Typography
        sx={{
          color: '#4b5563',
          maxWidth: '600px',
          margin: '0 auto',
          marginBottom: '0.2rem',
          fontSize: '1.1rem',
          lineHeight: 1.6,
          fontWeight: 400,
        }}
      >
        <TranslatedText
          i18nKey="home.planDescription"
          defaultValue="Choose the perfect package that suits your business needs. Our flexible pricing options are designed to scale with your growth."
        />
      </Typography>
    </Box>
  );
};

export default HomeHeading;
