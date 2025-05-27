'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslationContext } from '@/i18n';
import { useTranslation } from 'react-i18next';

interface TranslationDebugInfo {
  key: string;
  value: string;
  isFound: boolean;
  namespace: string;
}

const TranslationDebugger: React.FC = () => {
  const { t, currentLanguage } = useTranslationContext();
  const { i18n } = useTranslation();
  const [testKey, setTestKey] = useState('hero.changeForMore');
  const [testResult, setTestResult] = useState<TranslationDebugInfo | null>(
    null
  );
  const [allTranslations, setAllTranslations] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    
    const resourceBundle = i18n.getResourceBundle(
      currentLanguage.code,
      'common'
    );
    setAllTranslations(resourceBundle || {});
  }, [currentLanguage.code, i18n]);

  const testTranslation = () => {
    const result = t(testKey, { defaultValue: '__NOT_FOUND__' });
    const isFound = result !== '__NOT_FOUND__' && result !== testKey;

    setTestResult({
      key: testKey,
      value: result,
      isFound,
      namespace: 'common',
    });
  };

  const renderNestedObject = (obj: any, prefix = ''): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        elements.push(
          <Accordion key={fullKey} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" fontWeight="bold">
                {fullKey} (Object)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ pl: 2 }}>{renderNestedObject(value, fullKey)}</Box>
            </AccordionDetails>
          </Accordion>
        );
      } else {
        elements.push(
          <Box
            key={fullKey}
            sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}
          >
            <Typography variant="body2" fontWeight="bold" color="primary">
              {fullKey}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 0.5, fontFamily: 'monospace' }}
            >
              "{String(value)}"
            </Typography>
          </Box>
        );
      }
    });

    return elements;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        🔧 Translation Debugger
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Current Language: <strong>{currentLanguage.code}</strong> (
        {currentLanguage.name})
        <br />
        i18n Language: <strong>{i18n.language}</strong>
        <br />
        Has Resource Bundle:{' '}
        <strong>
          {i18n.hasResourceBundle(currentLanguage.code, 'common')
            ? 'Yes'
            : 'No'}
        </strong>
      </Alert>

      {}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Translation Key Tester</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Translation Key"
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                placeholder="e.g., hero.changeForMore"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="contained" onClick={testTranslation} fullWidth>
                Test Translation
              </Button>
            </Grid>
          </Grid>

          {testResult && (
            <Box sx={{ mt: 2 }}>
              <Alert severity={testResult.isFound ? 'success' : 'error'}>
                <Typography variant="body2">
                  <strong>Key:</strong> {testResult.key}
                </Typography>
                <Typography variant="body2">
                  <strong>Result:</strong> "{testResult.value}"
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong>{' '}
                  {testResult.isFound ? '✅ Found' : '❌ Not Found'}
                </Typography>
              </Alert>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            All Loaded Translations
            <Chip
              label={Object.keys(allTranslations).length}
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {Object.keys(allTranslations).length > 0 ? (
              renderNestedObject(allTranslations)
            ) : (
              <Alert severity="warning">
                No translations loaded for language: {currentLanguage.code}
              </Alert>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Quick Tests</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {[
              'hero.changeForMore',
              'hero.subheading',
              'about.title',
              'about.intro',
              'navigation.dashboard',
              'common.loading',
            ].map((key) => {
              const result = t(key, { defaultValue: '__NOT_FOUND__' });
              const isFound = result !== '__NOT_FOUND__' && result !== key;

              return (
                <Grid item xs={12} sm={6} key={key}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'grey.300',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {key}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={isFound ? 'success.main' : 'error.main'}
                      sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                    >
                      {isFound ? '✅' : '❌'} "{result}"
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default TranslationDebugger;
