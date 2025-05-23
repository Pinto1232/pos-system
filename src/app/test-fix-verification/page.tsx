'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';

interface AddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  isActive: boolean;
}

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

const TestFixVerificationPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (result: TestResult) => {
    setTestResults((prev) => [...prev, result]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      addTestResult({
        test: 'Custom Features API',
        status: 'pending',
        message: 'Testing /api/pricing-packages/custom/features endpoint...',
      });

      const response = await fetch('/api/pricing-packages/custom/features');
      const data = await response.json();

      if (data.addOns && data.addOns.length > 0) {
        addTestResult({
          test: 'Custom Features API',
          status: 'success',
          message: `✅ SUCCESS: API returned ${data.addOns.length} add-ons`,
          details: data.addOns.map((addon: AddOn) => ({
            id: addon.id,
            name: addon.name,
          })),
        });
      } else {
        addTestResult({
          test: 'Custom Features API',
          status: 'error',
          message: '❌ FAILED: API returned no add-ons',
          details: data,
        });
      }
    } catch (error) {
      addTestResult({
        test: 'Custom Features API',
        status: 'error',
        message: '❌ FAILED: Error fetching add-ons data',
        details: error,
      });
    }

    try {
      addTestResult({
        test: 'Regular Add-Ons API',
        status: 'pending',
        message: 'Testing /api/add-ons endpoint...',
      });

      const response = await fetch('/api/add-ons');
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        addTestResult({
          test: 'Regular Add-Ons API',
          status: 'success',
          message: `✅ SUCCESS: API returned ${data.data.length} add-ons`,
          details: data.data
            .slice(0, 3)
            .map((addon: AddOn) => ({ id: addon.id, name: addon.name })),
        });
      } else {
        addTestResult({
          test: 'Regular Add-Ons API',
          status: 'error',
          message: '❌ FAILED: API returned no add-ons',
          details: data,
        });
      }
    } catch (error) {
      addTestResult({
        test: 'Regular Add-Ons API',
        status: 'error',
        message: '❌ FAILED: Error fetching add-ons data',
        details: error,
      });
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h3" gutterBottom>
        🔧 Add-Ons Display Fix Verification
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Issue Summary
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Problem:</strong> Add-ons were not displaying in the Custom
            Pro package's Package Details step, showing "No add-ons available at
            the moment" instead of the actual add-ons data.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Root Cause:</strong> Race condition where the
            PackageDetailsStep component rendered before add-ons data was loaded
            from the backend API.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Fix Applied:</strong> Modified the loading condition in
            CustomPackageLayoutContainer to wait for add-ons data before
            rendering the component for customizable packages.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Technical Changes Made
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2">
                Modified <code>CustomPackageLayoutContainer.tsx</code> loading
                condition to check if add-ons are loaded
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Added condition:{' '}
                <code>
                  (selectedPackage.isCustomizable && addOns.length === 0)
                </code>
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Ensured component waits for add-ons data before rendering
                Package Details step
              </Typography>
            </li>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            API Tests
          </Typography>

          <Button
            variant="contained"
            onClick={runTests}
            disabled={isRunning}
            sx={{ mb: 2 }}
          >
            {isRunning ? <CircularProgress size={20} /> : 'Run Tests'}
          </Button>

          {testResults.map((result, index) => (
            <Alert
              key={index}
              severity={
                result.status === 'success'
                  ? 'success'
                  : result.status === 'error'
                    ? 'error'
                    : 'info'
              }
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle2">{result.test}</Typography>
              <Typography variant="body2">{result.message}</Typography>
              {result.details && (
                <Box
                  component="pre"
                  sx={{ fontSize: '0.75rem', mt: 1, overflow: 'auto' }}
                >
                  {JSON.stringify(result.details, null, 2)}
                </Box>
              )}
            </Alert>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Manual Testing Steps
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2" paragraph>
                Navigate to the packages page:{' '}
                <Button variant="outlined" size="small" href="/packages">
                  Go to Packages
                </Button>
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                Select the "Custom Pro" package
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                Verify that a loading spinner appears briefly while add-ons data
                is being fetched
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                Once loaded, check that the Package Details table shows add-ons
                with checkboxes for Business, Startup, and Personal plans
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                Verify that 7 add-ons are displayed: Premium Support, Advanced
                Inventory, Loyalty Plus, Business Intelligence, Multi-Location,
                Kitchen Display, E-Commerce Connect
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                Confirm that the "No add-ons available at the moment" message is
                no longer displayed
              </Typography>
            </li>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestFixVerificationPage;
