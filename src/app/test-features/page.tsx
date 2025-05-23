'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface Feature {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  isRequired: boolean;
  multiCurrencyPrices?: Record<string, number>;
}

interface AddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  currency?: string;
  multiCurrencyPrices?: Record<string, number>;
  category?: string;
  isActive?: boolean;
  features?: string[];
  dependencies?: string[];
  icon?: string;
}

interface UsagePricing {
  id: number;
  featureId: number;
  name: string;
  unit: string;
  minValue: number;
  maxValue: number;
  pricePerUnit: number;
  defaultValue: number;
  multiCurrencyPrices?: Record<string, number>;
}

interface FeaturesResponse {
  coreFeatures: Feature[];
  addOns: AddOn[];
  usageBasedPricing: UsagePricing[];
}

export default function TestFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        console.log('Fetching features...');
        const response = await fetch('/api/pricing-packages/custom/features');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: FeaturesResponse = await response.json();
        console.log('Fetched data:', data);
        console.log('Core features:', data.coreFeatures);

        setFeatures(data.coreFeatures || []);
      } catch (err) {
        console.error('Error fetching features:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Test Features Page
        </Typography>
        <Typography>Loading features...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Test Features Page
        </Typography>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Features Page
      </Typography>

      <Typography variant="h6" gutterBottom>
        Features Count: {features.length}
      </Typography>

      {features.length > 0 ? (
        <Box sx={{ display: 'grid', gap: 2, mt: 3 }}>
          {features.map((feature) => (
            <Card key={feature.id} variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {feature.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {feature.description}
                </Typography>
                <Typography variant="body2">
                  Base Price: ${feature.basePrice}
                </Typography>
                <Typography variant="body2">
                  Required: {feature.isRequired ? 'Yes' : 'No'}
                </Typography>
                {feature.multiCurrencyPrices && (
                  <Typography variant="body2">
                    Multi-currency prices:{' '}
                    {JSON.stringify(feature.multiCurrencyPrices)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" sx={{ mt: 3 }}>
          No features available
        </Typography>
      )}
    </Box>
  );
}
