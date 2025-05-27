'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Paper, Button } from '@mui/material';
import { useTranslationContext } from '@/i18n';
import { useTranslation } from 'react-i18next';

const TranslationStatus: React.FC = () => {
  const { t, currentLanguage } = useTranslationContext();
  const { i18n } = useTranslation();
  const [debugInfo, setDebugInfo] = useState<any>({});

  const updateDebugInfo = () => {
    const info = {
      currentLanguage: currentLanguage.code,
      i18nLanguage: i18n.language,
      hasResourceBundle: i18n.hasResourceBundle(currentLanguage.code, 'common'),
      resourceBundle: i18n.getResourceBundle(currentLanguage.code, 'common'),
      heroTranslations: {
        changeForMore: t('hero.changeForMore', { defaultValue: 'NOT_FOUND' }),
        fastReliableAnd: t('hero.fastReliableAnd', {
          defaultValue: 'NOT_FOUND',
        }),
        smartPosSystem: t('hero.smartPosSystem', { defaultValue: 'NOT_FOUND' }),
        subheading: t('hero.subheading', { defaultValue: 'NOT_FOUND' }),
        ctaPrimary: t('hero.ctaPrimary', { defaultValue: 'NOT_FOUND' }),
        ctaSecondary: t('hero.ctaSecondary', { defaultValue: 'NOT_FOUND' }),
      },
      aboutTranslations: {
        title: t('about.title', { defaultValue: 'NOT_FOUND' }),
        intro: t('about.intro', { defaultValue: 'NOT_FOUND' }),
        mission: t('about.mission', { defaultValue: 'NOT_FOUND' }),
      },
    };
    setDebugInfo(info);
  };

  useEffect(() => {
    updateDebugInfo();
  }, [currentLanguage.code, t, i18n]);

  const isTranslationWorking = (value: string) =>
    value !== 'NOT_FOUND' && value !== '';

  const heroWorking = Object.values(debugInfo.heroTranslations || {}).some(
    (value: unknown) => typeof value === 'string' && isTranslationWorking(value)
  );
  const aboutWorking = Object.values(debugInfo.aboutTranslations || {}).some(
    (value: unknown) => typeof value === 'string' && isTranslationWorking(value)
  );

  return (
    <Paper
      sx={{
        p: 2,
        m: 2,
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 9999,
        maxWidth: 400,
      }}
    >
      <Typography variant="h6" gutterBottom>
        🔍 Translation Status
      </Typography>

      <Alert severity={heroWorking ? 'success' : 'error'} sx={{ mb: 2 }}>
        Hero Translations: {heroWorking ? '✅ Working' : '❌ Not Working'}
      </Alert>

      <Alert severity={aboutWorking ? 'success' : 'error'} sx={{ mb: 2 }}>
        About Translations: {aboutWorking ? '✅ Working' : '❌ Not Working'}
      </Alert>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Current Language:</strong> {currentLanguage.code} (
          {currentLanguage.name})
        </Typography>
        <Typography variant="body2">
          <strong>i18n Language:</strong> {debugInfo.i18nLanguage}
        </Typography>
        <Typography variant="body2">
          <strong>Has Resource Bundle:</strong>{' '}
          {debugInfo.hasResourceBundle ? 'Yes' : 'No'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight="bold">
          Hero Sample:
        </Typography>
        <Typography variant="body2" fontSize="0.8rem">
          changeForMore: "{debugInfo.heroTranslations?.changeForMore}"
        </Typography>
        <Typography variant="body2" fontSize="0.8rem">
          subheading: "
          {debugInfo.heroTranslations?.subheading?.substring(0, 50)}..."
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight="bold">
          About Sample:
        </Typography>
        <Typography variant="body2" fontSize="0.8rem">
          title: "{debugInfo.aboutTranslations?.title}"
        </Typography>
        <Typography variant="body2" fontSize="0.8rem">
          intro: "{debugInfo.aboutTranslations?.intro?.substring(0, 50)}..."
        </Typography>
      </Box>

      <Button size="small" onClick={updateDebugInfo} variant="outlined">
        Refresh
      </Button>
    </Paper>
  );
};

export default TranslationStatus;
