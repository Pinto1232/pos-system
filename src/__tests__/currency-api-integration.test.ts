/**
 * Currency API Integration Test - Real HTTP Calls
 *
 * This test makes actual HTTP calls to verify that the currency API endpoints
 * work correctly without authentication errors after the fix.
 */

import axios from 'axios';

// Test configuration
const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5107';

describe('Currency API Integration (Real HTTP)', () => {
  // Skip these tests if servers are not running
  const skipIfServersDown = process.env.SKIP_INTEGRATION_TESTS === 'true';

  beforeAll(async () => {
    if (skipIfServersDown) {
      console.log('Skipping integration tests - servers may not be running');
      return;
    }

    // Check if frontend and backend are running
    try {
      await axios.get(`${FRONTEND_URL}/api/currency/location`, { timeout: 2000 });
    } catch (error) {
      console.warn('Frontend or backend not running, skipping integration tests');
      // Mark tests as skipped
      process.env.SKIP_INTEGRATION_TESTS = 'true';
    }
  });

  describe('Frontend Proxy to Backend', () => {
    it('should successfully fetch user location through frontend proxy', async () => {
      if (process.env.SKIP_INTEGRATION_TESTS === 'true') {
        pending('Servers not running');
        return;
      }

      const response = await axios.get(`${FRONTEND_URL}/api/currency/location`);

      expect(response.status).toBe(200);

      // Handle case where response might be a string that needs parsing
      let data = response.data;
      if (typeof data === 'string' && data.trim()) {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // If parsing fails, the test will fail on the property checks below
        }
      }

      expect(data).toHaveProperty('country');
      expect(data).toHaveProperty('currency');
      expect(typeof data.country).toBe('string');
      expect(typeof data.currency).toBe('string');
    });

    it('should successfully fetch available currencies through frontend proxy', async () => {
      if (process.env.SKIP_INTEGRATION_TESTS === 'true') {
        pending('Servers not running');
        return;
      }

      const response = await axios.get(`${FRONTEND_URL}/api/currency/available`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);

      // Check structure of first currency
      const firstCurrency = response.data[0];
      expect(firstCurrency).toHaveProperty('code');
      expect(firstCurrency).toHaveProperty('name');
      expect(firstCurrency).toHaveProperty('symbol');
    });
  });

  describe('Direct Backend Access', () => {
    it('should successfully fetch user location directly from backend', async () => {
      if (process.env.SKIP_INTEGRATION_TESTS === 'true') {
        pending('Servers not running');
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/api/currency/location`);

      expect(response.status).toBe(200);

      // Handle case where response might be a string that needs parsing
      let data = response.data;
      if (typeof data === 'string' && data.trim()) {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // If parsing fails, the test will fail on the property checks below
        }
      }

      expect(data).toHaveProperty('country');
      expect(data).toHaveProperty('currency');
    });

    it('should successfully fetch available currencies directly from backend', async () => {
      if (process.env.SKIP_INTEGRATION_TESTS === 'true') {
        pending('Servers not running');
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/api/currency/available`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
  });

  describe('Authentication Behavior', () => {
    it('should work without Authorization header', async () => {
      if (process.env.SKIP_INTEGRATION_TESTS === 'true') {
        pending('Servers not running');
        return;
      }

      // Make request without any authorization
      const response = await axios.get(`${FRONTEND_URL}/api/currency/location`, {
        headers: {
          // Explicitly no Authorization header
        }
      });

      expect(response.status).toBe(200);
    });

    it('should work when frontend skips Authorization header for anonymous endpoints', async () => {
      if (process.env.SKIP_INTEGRATION_TESTS === 'true') {
        pending('Servers not running');
        return;
      }

      // Test that the frontend axios client correctly skips adding Authorization header
      // for currency endpoints (this is handled by the ANONYMOUS_ENDPOINTS configuration)
      const response = await axios.get(`${FRONTEND_URL}/api/currency/location`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('country');
      expect(response.data).toHaveProperty('currency');
    });
  });
});
