import React from 'react';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';
import {
  getServerTranslations,
  translateServer,
  translateDynamicContentServer,
} from '@/utils/serverTranslation';

const exampleData = {
  title: 'dashboard.title',
  description: 'This is a description that does not need translation',
  items: ['common.save', 'common.cancel', 'common.delete'],
  status: 'common.success',
};

export default async function ServerTranslationPage() {
  const translations = await getServerTranslations('common');

  const welcomeText = await translateServer('dashboard.welcome');
  const summaryText = await translateServer('dashboard.summary');

  const translatedData = await translateDynamicContentServer(exampleData, [
    'title',
    'items',
    'status',
  ]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {translations.app?.name || 'Pisval Tech POS'}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Server-Side Translation Demo
        </Typography>

        <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Server-Side Translations
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography>Welcome Text: {welcomeText}</Typography>
            <Typography>Summary Text: {summaryText}</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Dynamic Data Translation (Server-Side)
            </Typography>
            <Typography variant="h6">{translatedData.title}</Typography>
            <Typography>{translatedData.description}</Typography>
            <Box sx={{ my: 2 }}>
              {translatedData.items.map((item, index) => (
                <Typography key={index} component="span" sx={{ mr: 2 }}>
                  {item}
                </Typography>
              ))}
            </Box>
            <Typography>Status: {translatedData.status}</Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
