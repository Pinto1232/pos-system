'use client';

import React, { useEffect, useState } from 'react';
import { useTranslationContext, AVAILABLE_LANGUAGES } from '@/i18n';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';

interface TranslationTestResult {
  key: string;
  translation: string;
  isTranslated: boolean;
  hasInterpolation: boolean;
}

interface LanguageTestResult {
  language: string;
  code: string;
  results: TranslationTestResult[];
  totalKeys: number;
  translatedKeys: number;
  successRate: number;
}

const FooterTranslationTest: React.FC = () => {
  const { t, currentLanguage, changeLanguage } = useTranslationContext();
  const [testResults, setTestResults] = useState<LanguageTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const footerKeys = [
    'subscription.title',
    'subscription.subtitle',
    'subscription.placeholder',
    'subscription.button',
    'footer.company',
    'footer.home',
    'footer.services',
    'footer.about',
    'footer.contact',
    'footer.tel1',
    'footer.tel2',
    'footer.email1',
    'footer.email2',
    'footer.office',
    'footer.address1',
    'footer.address2',
    'footer.address3',
    'footer.followUs',
    'footer.privacy',
    'footer.copyright',
  ];

  const testTranslationForLanguage = async (
    languageCode: string
  ): Promise<LanguageTestResult> => {
    const language = AVAILABLE_LANGUAGES.find(
      (lang) => lang.code === languageCode
    );
    if (!language) {
      throw new Error(`Language ${languageCode} not found`);
    }

    changeLanguage(languageCode);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const results: TranslationTestResult[] = [];

    for (const key of footerKeys) {
      const defaultValue = `Missing: ${key}`;
      let translation: string;

      if (key === 'footer.copyright') {
        translation = t(key, {
          defaultValue,
          year: new Date().getFullYear(),
          ns: 'common',
        });
      } else {
        translation = t(key, { defaultValue, ns: 'common' });
      }

      const isTranslated = translation !== defaultValue && translation !== key;
      const hasInterpolation =
        key === 'footer.copyright' &&
        translation.includes(new Date().getFullYear().toString());

      results.push({
        key,
        translation,
        isTranslated,
        hasInterpolation,
      });
    }

    const translatedKeys = results.filter((r) => r.isTranslated).length;
    const successRate = Math.round((translatedKeys / footerKeys.length) * 100);

    return {
      language: language.name,
      code: languageCode,
      results,
      totalKeys: footerKeys.length,
      translatedKeys,
      successRate,
    };
  };

  const runAllTests = async () => {
    setIsLoading(true);
    const allResults: LanguageTestResult[] = [];

    for (const language of AVAILABLE_LANGUAGES) {
      try {
        const result = await testTranslationForLanguage(language.code);
        allResults.push(result);
      } catch (error) {
        console.error(`Error testing language ${language.code}:`, error);
      }
    }

    setTestResults(allResults);
    setIsLoading(false);
  };

  const testCurrentLanguage = async () => {
    setIsLoading(true);
    try {
      const result = await testTranslationForLanguage(currentLanguage.code);
      setTestResults([result]);
    } catch (error) {
      console.error(`Error testing current language:`, error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    testCurrentLanguage();
  }, []);

  const getStatusColor = (successRate: number) => {
    if (successRate === 100) return '#4caf50';
    if (successRate >= 80) return '#ff9800';
    return '#f44336';
  };

  const getStatusText = (successRate: number) => {
    if (successRate === 100) return 'Perfect ✅';
    if (successRate >= 80) return 'Good ⚠️';
    return 'Needs Work ❌';
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Footer Translation Test Dashboard
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Current Language:{' '}
        <strong>
          {currentLanguage.name} ({currentLanguage.code})
        </strong>
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={testCurrentLanguage}
          disabled={isLoading}
        >
          Test Current Language
        </Button>
        <Button variant="outlined" onClick={runAllTests} disabled={isLoading}>
          Test All Languages
        </Button>

        {AVAILABLE_LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant="text"
            onClick={() => changeLanguage(lang.code)}
            sx={{
              backgroundColor:
                currentLanguage.code === lang.code
                  ? 'primary.main'
                  : 'transparent',
              color:
                currentLanguage.code === lang.code ? 'white' : 'primary.main',
            }}
          >
            {lang.name}
          </Button>
        ))}
      </Box>

      {isLoading && (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
          Testing translations... ⏳
        </Typography>
      )}

      <Grid container spacing={3}>
        {testResults.map((result) => (
          <Grid item xs={12} md={6} key={result.code}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  {result.language} ({result.code})
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="h6"
                    sx={{ color: getStatusColor(result.successRate) }}
                  >
                    {result.successRate}%
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: getStatusColor(result.successRate) }}
                  >
                    {getStatusText(result.successRate)}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mb: 2 }}>
                {result.translatedKeys} of {result.totalKeys} keys translated
              </Typography>

              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {result.results.map((item) => (
                  <Box
                    key={item.key}
                    sx={{
                      mb: 1,
                      p: 1,
                      backgroundColor: item.isTranslated
                        ? '#e8f5e8'
                        : '#ffebee',
                      borderRadius: 1,
                      border: `1px solid ${item.isTranslated ? '#c8e6c9' : '#ffcdd2'}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {item.key}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {item.translation}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: item.isTranslated
                            ? 'success.main'
                            : 'error.main',
                          fontWeight: 'bold',
                        }}
                      >
                        {item.isTranslated ? '✅ Translated' : '❌ Missing'}
                      </Typography>
                      {item.key === 'footer.copyright' && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: item.hasInterpolation
                              ? 'success.main'
                              : 'warning.main',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.hasInterpolation
                            ? '🔄 Interpolation OK'
                            : '⚠️ No Interpolation'}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {testResults.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Paper sx={{ p: 2 }}>
            {testResults.map((result) => (
              <Box
                key={result.code}
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography>{result.language}:</Typography>
                <Typography sx={{ color: getStatusColor(result.successRate) }}>
                  {result.successRate}% ({result.translatedKeys}/
                  {result.totalKeys})
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default FooterTranslationTest;
