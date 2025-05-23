'use client';

import React, { useEffect, useState } from 'react';

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

interface CoreFeature {
  id: string | number;
  name: string;
  description?: string;
}

interface UsageBasedPricing {
  id: string | number;
  name: string;
  price: number;
  unit?: string;
}

interface FeaturesResponse {
  coreFeatures: CoreFeature[];
  addOns: AddOn[];
  usageBasedPricing: UsageBasedPricing[];
}

export default function TestAddOnsPage() {
  const [customAddOns, setCustomAddOns] = useState<AddOn[]>([]);
  const [generalAddOns, setGeneralAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testEndpoints = async () => {
      try {
        console.log('Testing custom features endpoint...');
        const customResponse = await fetch(
          '/api/pricing-packages/custom/features'
        );
        if (customResponse.ok) {
          const customData: FeaturesResponse = await customResponse.json();
          console.log('Custom features response:', customData);
          setCustomAddOns(customData.addOns || []);
        } else {
          console.error(
            'Custom features endpoint failed:',
            customResponse.status
          );
        }

        console.log('Testing general add-ons endpoint...');
        const generalResponse = await fetch('/api/AddOns?isActive=true');
        if (generalResponse.ok) {
          const generalData = await generalResponse.json();
          console.log('General add-ons response:', generalData);
          setGeneralAddOns(generalData.data || generalData || []);
        } else {
          console.error(
            'General add-ons endpoint failed:',
            generalResponse.status
          );
        }
      } catch (err) {
        console.error('Error testing endpoints:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testEndpoints();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Testing Add-ons Fix</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Add-ons Fix Test Results</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h2>Custom Features Endpoint Add-ons</h2>
        <p>
          <strong>Endpoint:</strong> /api/pricing-packages/custom/features
        </p>
        <p>
          <strong>Count:</strong> {customAddOns.length}
        </p>
        {customAddOns.length > 0 ? (
          <div
            style={{
              backgroundColor: '#e8f5e8',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <strong>✅ SUCCESS:</strong> Custom features endpoint returns
            add-ons!
            <ul>
              {customAddOns.map((addOn) => (
                <li key={addOn.id}>
                  <strong>{addOn.name}</strong> - ${addOn.price} (
                  {addOn.category})
                  <br />
                  <small>{addOn.description}</small>
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
            endpoint
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>General Add-ons Endpoint</h2>
        <p>
          <strong>Endpoint:</strong> /api/AddOns?isActive=true
        </p>
        <p>
          <strong>Count:</strong> {generalAddOns.length}
        </p>
        {generalAddOns.length > 0 ? (
          <div
            style={{
              backgroundColor: '#e8f5e8',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <strong>✅ SUCCESS:</strong> General add-ons endpoint returns
            add-ons!
            <ul>
              {generalAddOns.slice(0, 3).map((addOn) => (
                <li key={addOn.id}>
                  <strong>{addOn.name}</strong> - ${addOn.price} (
                  {addOn.category})
                  <br />
                  <small>{addOn.description}</small>
                </li>
              ))}
              {generalAddOns.length > 3 && (
                <li>
                  <em>... and {generalAddOns.length - 3} more</em>
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#fff3cd',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <strong>⚠️ INFO:</strong> No add-ons found in general endpoint (this
            is OK for the fix)
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Fix Status</h2>
        {customAddOns.length > 0 ? (
          <div
            style={{
              backgroundColor: '#e8f5e8',
              padding: '1rem',
              borderRadius: '4px',
            }}
          >
            <strong>✅ FIX SUCCESSFUL:</strong> Custom Pro package will now
            display add-ons in the Package Details section!
            <br />
            <small>
              The custom features endpoint is returning {customAddOns.length}{' '}
              add-ons that will be used by customizable packages.
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
            returning add-ons.
            <br />
            <small>
              The Custom Pro package will still show &quot;No add-ons available
              at the moment.&quot;
            </small>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
        }}
      >
        <h3>How to Test the Fix</h3>
        <ol>
          <li>
            Go to{' '}
            <a href="/pricing-packages" target="_blank">
              /pricing-packages
            </a>
          </li>
          <li>Click on the &quot;Custom Pro&quot; package</li>
          <li>Navigate to the &quot;Package Details&quot; step (first step)</li>
          <li>Look for add-ons in the table below the pricing information</li>
          <li>
            You should now see the add-ons listed instead of &quot;No add-ons
            available at the moment&quot;
          </li>
        </ol>
      </div>
    </div>
  );
}
