'use client';

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { TranslatedText, useTranslationContext } from '@/i18n';

const AboutSection: React.FC = () => {
  const { t } = useTranslationContext();

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        <TranslatedText
          i18nKey="about.title"
          defaultValue="About Our POS System"
        />
      </Typography>

      <Typography
        variant="h6"
        component="p"
        align="center"
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        <TranslatedText
          i18nKey="about.intro"
          defaultValue="Discover why businesses choose our point-of-sale solution"
        />
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                <TranslatedText
                  i18nKey="about.mission.title"
                  defaultValue="Our Mission"
                />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <TranslatedText
                  i18nKey="about.mission.description"
                  defaultValue="To empower businesses with fast, reliable, and intuitive point-of-sale solutions that streamline operations and enhance customer experiences."
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                <TranslatedText
                  i18nKey="about.vision.title"
                  defaultValue="Our Vision"
                />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <TranslatedText
                  i18nKey="about.vision.description"
                  defaultValue="To be the leading provider of innovative POS technology that adapts to the evolving needs of modern businesses worldwide."
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                <TranslatedText
                  i18nKey="about.values.title"
                  defaultValue="Our Values"
                />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <TranslatedText
                  i18nKey="about.values.description"
                  defaultValue="Innovation, reliability, and customer success drive everything we do. We believe in creating technology that works seamlessly for your business."
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          mt: 4,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="h5" component="h3" gutterBottom align="center">
          <TranslatedText
            i18nKey="about.cta.title"
            defaultValue="Ready to Transform Your Business?"
          />
        </Typography>
        <Typography variant="body1" align="center">
          <TranslatedText
            i18nKey="about.cta.description"
            defaultValue="Join thousands of businesses that trust our POS system to manage their operations efficiently and grow their revenue."
          />
        </Typography>
      </Paper>

      {}
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.100' }}>
        <Typography variant="h6" gutterBottom>
          Translation Debug Info
        </Typography>
        <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
          {JSON.stringify(
            {
              'about.title': t('about.title', { defaultValue: 'NOT_FOUND' }),
              'about.intro': t('about.intro', { defaultValue: 'NOT_FOUND' }),
              'about.mission.title': t('about.mission.title', {
                defaultValue: 'NOT_FOUND',
              }),
              'about.mission.description': t('about.mission.description', {
                defaultValue: 'NOT_FOUND',
              }),
              'about.vision.title': t('about.vision.title', {
                defaultValue: 'NOT_FOUND',
              }),
              'about.vision.description': t('about.vision.description', {
                defaultValue: 'NOT_FOUND',
              }),
              'about.values.title': t('about.values.title', {
                defaultValue: 'NOT_FOUND',
              }),
              'about.values.description': t('about.values.description', {
                defaultValue: 'NOT_FOUND',
              }),
              'about.cta.title': t('about.cta.title', {
                defaultValue: 'NOT_FOUND',
              }),
              'about.cta.description': t('about.cta.description', {
                defaultValue: 'NOT_FOUND',
              }),
            },
            null,
            2
          )}
        </Typography>
      </Paper>
    </Box>
  );
};

export default AboutSection;
