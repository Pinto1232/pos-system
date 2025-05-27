#!/usr/bin/env node

/**
 * Keycloak Diagnostics Test Script
 * Run this script to test Keycloak connectivity and configuration
 */

const https = require('https');
const http = require('http');

const KEYCLOAK_URL = 'http://localhost:8282';
const REALM = 'pisval-pos-realm';
const CLIENT_ID = 'pos-frontend';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const req = protocol.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testKeycloakConnectivity() {
  console.log('🔍 Testing Keycloak Connectivity...\n');

  const tests = [
    {
      name: 'Keycloak Server Base URL',
      url: KEYCLOAK_URL,
      expectedStatus: [200, 302],
    },
    {
      name: 'Keycloak Realms Endpoint',
      url: `${KEYCLOAK_URL}/realms`,
      expectedStatus: [200],
    },
    {
      name: 'Specific Realm Configuration',
      url: `${KEYCLOAK_URL}/realms/${REALM}`,
      expectedStatus: [200],
    },
    {
      name: 'Realm OpenID Configuration',
      url: `${KEYCLOAK_URL}/realms/${REALM}/.well-known/openid_configuration`,
      expectedStatus: [200],
    },
    {
      name: 'Realm JWKS Endpoint',
      url: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`,
      expectedStatus: [200],
    },
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`URL: ${test.url}`);

      const response = await makeRequest(test.url);
      const isSuccess = test.expectedStatus.includes(response.statusCode);

      console.log(`Status: ${response.statusCode} ${isSuccess ? '✅' : '❌'}`);

      if (isSuccess) {
        console.log('✅ PASS\n');
        results.push({ test: test.name, status: 'success', details: response });
      } else {
        console.log(
          `❌ FAIL - Expected status ${test.expectedStatus.join(' or ')}, got ${response.statusCode}\n`
        );
        results.push({ test: test.name, status: 'error', details: response });
      }
    } catch (error) {
      console.log(`❌ FAIL - ${error.message}\n`);
      results.push({ test: test.name, status: 'error', error: error.message });
    }
  }

  return results;
}

async function main() {
  console.log('🚀 Keycloak Diagnostics Test\n');
  console.log(`Keycloak URL: ${KEYCLOAK_URL}`);
  console.log(`Realm: ${REALM}`);
  console.log(`Client ID: ${CLIENT_ID}\n`);

  try {
    const results = await testKeycloakConnectivity();

    console.log('\n📊 Summary:');
    const passed = results.filter((r) => r.status === 'success').length;
    const failed = results.filter((r) => r.status === 'error').length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed > 0) {
      console.log('\n🔧 Recommendations:');
      console.log('1. Ensure Keycloak is running on port 8282');
      console.log('2. Verify the realm "pisval-pos-realm" exists');
      console.log('3. Check that the realm is properly configured');
      console.log('4. Ensure CORS is configured for your frontend domain');
    } else {
      console.log('\n🎉 All tests passed! Keycloak appears to be healthy.');
    }
  } catch (error) {
    console.error('❌ Diagnostic test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
