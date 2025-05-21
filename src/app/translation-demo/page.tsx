'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import TranslationExample from '@/components/examples/TranslationExample';
import { TranslatedText } from '@/i18n';

export default function TranslationDemoPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          <TranslatedText i18nKey="app.name" />
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Translation System Demo
        </Typography>

        <TranslationExample />
      </Box>
    </Container>
  );
}
