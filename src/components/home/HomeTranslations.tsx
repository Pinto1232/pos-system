'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const HomeTranslations: React.FC = () => {
  const { t, i18n, ready } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkTranslations = async () => {
      try {
        if (!i18n.hasResourceBundle(i18n.language, 'common')) {
          console.log(`Loading translations for ${i18n.language}...`);

          const response = await fetch(`/locales/${i18n.language}/common.json`);
          if (response.ok) {
            const translations = await response.json();

            i18n.addResourceBundle(
              i18n.language,
              'common',
              translations,
              true,
              true
            );
            console.log(
              `Translations loaded for ${i18n.language}:`,
              translations
            );
          }
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading translations:', error);
        setIsLoaded(true);
      }
    };

    checkTranslations();
  }, [i18n]);

  useEffect(() => {
    const handleLanguageChanged = () => {
      setIsLoaded(false);
    };

    window.addEventListener('languageChanged', handleLanguageChanged);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChanged);
    };
  }, []);

  if (!ready && !isLoaded) {
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
          Choose Your Plan
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
          Choose the perfect package that suits your business needs. Our
          flexible pricing options are designed to scale with your growth.
        </Typography>
      </Box>
    );
  }

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
        {t('home.chooseYourPlan', 'Choose Your Plan')}
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
        {t(
          'home.planDescription',
          'Choose the perfect package that suits your business needs. Our flexible pricing options are designed to scale with your growth.'
        )}
      </Typography>
    </Box>
  );
};

export default HomeTranslations;
