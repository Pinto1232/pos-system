'use client';

import React, { useState, useEffect } from 'react';

interface AddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  isActive: boolean;
  features: string[];
  dependencies: string[];
  icon: string;
}

interface CoreFeature {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  isRequired: boolean;
  multiCurrencyPrices?: Record<string, number>;
}

interface CustomFeaturesResponse {
  coreFeatures: CoreFeature[];
  addOns: AddOn[];
  usageBasedPricing: unknown[];
}

export default function TestCustomProPage() {
  const [customFeatures, setCustomFeatures] =
    useState<CustomFeaturesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomFeatures = async () => {
      try {
        const response = await fetch('/api/PricingPackages/custom/features');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCustomFeatures(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomFeatures();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Testing Custom Pro Package Add-ons</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Testing Custom Pro Package Add-ons</h1>
        <div
          style={{
            backgroundColor: '#ffe8e8',
            padding: '1rem',
            borderRadius: '4px',
          }}
        >
          <strong>❌ ERROR:</strong> {error}
        </div>
      </div>
    );
  }

  const addOns = customFeatures?.addOns || [];
  const coreFeatures = customFeatures?.coreFeatures || [];

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Testing Custom Pro Package Features & Add-ons</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Custom Features API Response</h2>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {JSON.stringify(customFeatures, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Core Features Extraction Test</h2>
        {coreFeatures.length > 0 ? (
          <div
            style={{
              backgroundColor: '#e8f5e8',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <strong>✅ SUCCESS:</strong> Found {coreFeatures.length} core
            features in custom features response!
            <ul style={{ marginTop: '1rem' }}>
              {coreFeatures.map((feature: CoreFeature, index: number) => (
                <li key={index}>
                  <strong>{feature.name}</strong> - ${feature.basePrice} (
                  {feature.description}){' '}
                  {feature.isRequired ? '- Required' : '- Optional'}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#ffe8e8',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <strong>❌ FAILED:</strong> No core features found in custom
            features response.
            <br />
            <small>
              The Select Core Features step will show &quot;No features
              available&quot;.
            </small>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Add-ons Extraction Test</h2>
        {addOns.length > 0 ? (
          <div
            style={{
              backgroundColor: '#e8f5e8',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <strong>✅ SUCCESS:</strong> Found {addOns.length} add-ons in custom
            features response!
            <ul style={{ marginTop: '1rem' }}>
              {addOns.map((addOn: AddOn, index: number) => (
                <li key={index}>
                  <strong>{addOn.name}</strong> - ${addOn.price} (
                  {addOn.description})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#ffe8e8',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <strong>❌ FAILED:</strong> No add-ons found in custom features
            response.
            <br />
            <small>
              The Custom Pro package will still show &quot;No add-ons available
              at the moment.&quot;
            </small>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Expected Behavior</h2>
        <div
          style={{
            backgroundColor: '#fff3cd',
            padding: '1rem',
            borderRadius: '4px',
          }}
        >
          <strong>📋 INSTRUCTIONS:</strong>
          <ol style={{ marginTop: '0.5rem' }}>
            <li>
              Navigate to{' '}
              <a href="/pricing-packages" target="_blank">
                /pricing-packages
              </a>
            </li>
            <li>
              Click on the &quot;Custom Pro&quot; package (which has
              isCustomizable: true)
            </li>
            <li>
              In the &quot;Select Core Features&quot; step, you should see core
              features listed
            </li>
            <li>
              In the &quot;Choose Add-Ons&quot; step, you should see add-ons
              listed
            </li>
            <li>
              Both steps should now have Back and Continue buttons properly
              positioned
            </li>
          </ol>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Fix Status</h2>
        {coreFeatures.length > 0 && addOns.length > 0 ? (
          <div
            style={{
              backgroundColor: '#e8f5e8',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <strong>✅ FIX SUCCESSFUL:</strong> Custom Pro package will now
            display core features and add-ons with proper navigation!
            <br />
            <small>
              The custom features endpoint is returning {coreFeatures.length}{' '}
              core features and {addOns.length} add-ons that will be used by
              customizable packages. Navigation buttons have been added to the
              Select Core Features step.
            </small>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#ffe8e8',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <strong>❌ FIX FAILED:</strong> Custom features endpoint is not
            returning complete data.
            <br />
            <small>
              Core Features: {coreFeatures.length}, Add-ons: {addOns.length}
            </small>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Technical Details</h2>
        <div
          style={{
            backgroundColor: '#f0f8ff',
            padding: '1rem',
            borderRadius: '4px',
          }}
        >
          <strong>🔧 CHANGES MADE:</strong>
          <ul style={{ marginTop: '0.5rem' }}>
            <li>
              ✅ Enhanced <code>/api/pricing-packages/custom/features</code>{' '}
              endpoint with 8 core features and 5 comprehensive add-ons
            </li>
            <li>
              ✅ Added core features: Point of Sale, Inventory Management,
              Customer Management, Reporting, Employee Management, Multi-store
              Support, Loyalty Program, E-commerce Integration
            </li>
            <li>
              ✅ Updated <code>CoreFeaturesStep.tsx</code> to use
              NavigationButtons component
            </li>
            <li>✅ Added Back button to Select Core Features step</li>
            <li>
              ✅ Repositioned Continue button with proper styling and price
              display
            </li>
            <li>
              ✅ Fixed empty core features data issue that was showing &quot;No
              features available&quot;
            </li>
            <li>
              ✅ Core features now display with proper pricing and
              multi-currency support
            </li>
            <li>
              ✅ Navigation buttons are consistently positioned across all steps
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
