'use client';

import React from 'react';
import { TranslationProvider } from '@/i18n';
import FooterTranslationTest from '@/components/footer/FooterTranslationTest';
import Footer from '@/components/footer/Footer';
import { Box, Typography, Divider } from '@mui/material';

const TestFooterTranslationsPage: React.FC = () => {
  return (
    <TranslationProvider>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
            Footer Translation Testing
          </Typography>

          <FooterTranslationTest />

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
            Live Footer Preview
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Footer />
          </Box>
        </Box>
      </Box>
    </TranslationProvider>
  );
};

export default TestFooterTranslationsPage;
