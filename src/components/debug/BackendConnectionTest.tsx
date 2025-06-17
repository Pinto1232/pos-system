'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  testBackendConnection,
  testCategoryCreation,
} from '@/utils/testBackendConnection';

const BackendConnectionTest: React.FC = () => {
  const [connectionTest, setConnectionTest] = useState<{
    isConnected: boolean;
    message: string;
    details?: Record<string, unknown>;
  } | null>(null);

  const [creationTest, setCreationTest] = useState<{
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const runConnectionTest = async () => {
    setLoading(true);
    setConnectionTest(null);
    setCreationTest(null);

    try {
      const result = await testBackendConnection();
      setConnectionTest(result);
    } catch (error) {
      setConnectionTest({
        isConnected: false,
        message: 'Test failed with exception',
        details: error as Record<string, unknown>,
      });
    } finally {
      setLoading(false);
    }
  };

  const runCreationTest = async () => {
    setLoading(true);
    setCreationTest(null);

    try {
      const result = await testCategoryCreation();
      setCreationTest(result);
    } catch (error) {
      setCreationTest({
        success: false,
        message: 'Creation test failed with exception',
        details: error as Record<string, unknown>,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runConnectionTest();
  }, []);

  return (
    <Card sx={{ m: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Backend Connection Test
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={runConnectionTest}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? <CircularProgress size={20} /> : 'Test Connection'}
          </Button>

          <Button
            variant="outlined"
            onClick={runCreationTest}
            disabled={loading || !connectionTest?.isConnected}
          >
            Test Category Creation
          </Button>
        </Box>

        {connectionTest && (
          <Alert
            severity={connectionTest.isConnected ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {connectionTest.message}
          </Alert>
        )}

        {creationTest && (
          <Alert
            severity={creationTest.success ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {creationTest.message}
          </Alert>
        )}

        {(connectionTest?.details || creationTest?.details) && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Debug Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {connectionTest?.details && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    Connection Details:
                  </Typography>
                  <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                    {JSON.stringify(connectionTest.details, null, 2)}
                  </pre>
                </Box>
              )}

              {creationTest?.details && (
                <Box>
                  <Typography variant="subtitle2">
                    Creation Test Details:
                  </Typography>
                  <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                    {JSON.stringify(creationTest.details, null, 2)}
                  </pre>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Backend URL:{' '}
            {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5107'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BackendConnectionTest;
