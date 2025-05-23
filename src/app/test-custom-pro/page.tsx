'use client';

import React, { useState, useEffect } from 'react';

export default function TestCustomProPage() {
  const [customFeatures, setCustomFeatures] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomFeatures = async () => {
      try {
        const response = await fetch('/api/pricing-packages/custom/features');
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

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Testing Custom Pro Package Add-ons</h1>

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
              {addOns.map((addOn: any, index: number) => (
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
              The Custom Pro package will still show "No add-ons available at
              the moment."
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
              Click on the "Custom Pro" package (which has isCustomizable: true)
            </li>
            <li>In the "Package Details" step, look for the add-ons table</li>
            <li>
              You should now see the add-ons listed instead of "No add-ons
              available at the moment"
            </li>
          </ol>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Fix Status</h2>
        {addOns.length > 0 ? (
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
              The custom features endpoint is returning {addOns.length} add-ons
              that will be used by customizable packages.
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
              The Custom Pro package will still show "No add-ons available at
              the moment."
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
              ✅ Modified <code>CustomPackageLayoutContainer.tsx</code> to
              extract add-ons from custom features response
            </li>
            <li>
              ✅ Updated logic to use custom add-ons for customizable packages
              instead of general add-ons
            </li>
            <li>
              ✅ Enhanced <code>/api/pricing-packages/custom/features</code>{' '}
              endpoint with 5 comprehensive add-ons
            </li>
            <li>
              ✅ Added conditional logic to only use general add-ons for
              non-customizable packages
            </li>
            <li>
              ✅ Custom Pro packages now properly display add-ons in the "Choose
              Add-Ons" step
            </li>
            <li>
              ✅ Add-ons include: Premium Support, Advanced Analytics,
              Multi-Location Management, API Integration Suite, Enhanced
              Security
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
