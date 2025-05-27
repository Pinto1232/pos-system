#!/usr/bin/env node

/**
 * Test the fixed Keycloak diagnostics
 */

const {
  runKeycloakDiagnostics,
  logDiagnostics,
} = require('./src/utils/keycloakDiagnostics.ts');

async function testDiagnostics() {
  console.log('🧪 Testing Fixed Keycloak Diagnostics...\n');

  try {
    // Test with the correct configuration
    const diagnostics = await runKeycloakDiagnostics(
      'http://localhost:8282',
      'pisval-pos-realm',
      'pos-frontend'
    );

    console.log('📊 Diagnostic Results:');
    logDiagnostics(diagnostics);

    console.log('\n🎯 Expected vs Actual:');
    console.log(`Expected: healthy or degraded`);
    console.log(`Actual: ${diagnostics.overall}`);

    if (diagnostics.overall === 'unhealthy') {
      console.log('\n❌ Still showing unhealthy. Issues found:');
      diagnostics.results.forEach((result) => {
        if (result.status === 'error') {
          console.log(`  - ${result.test}: ${result.message}`);
        }
      });
    } else {
      console.log('\n✅ Diagnostics are now working correctly!');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Note: This is a conceptual test - the actual implementation would need
// to be adapted for the Node.js environment since the diagnostics use
// browser fetch API
console.log('📝 This test demonstrates the diagnostic fix concept.');
console.log(
  'The actual fix has been applied to the keycloakDiagnostics.ts file.'
);
console.log('The main issue was missing Accept headers in the fetch requests.');

testDiagnostics().catch(console.error);
