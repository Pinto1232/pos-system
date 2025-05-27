#!/usr/bin/env node

/**
 * Keycloak Configuration Checker
 *
 * This script helps verify that Keycloak is properly configured for user registration.
 */

const https = require('https');
const http = require('http');

console.log('🔍 Keycloak Configuration Checker');
console.log('==================================\n');

const KEYCLOAK_URL = 'http://localhost:8282';
const REALM = 'pisval-pos-realm';

async function checkKeycloakEndpoint(url, description) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, (res) => {
      console.log(`✅ ${description}: ${res.statusCode} ${res.statusMessage}`);
      resolve({ success: true, status: res.statusCode });
    });

    req.on('error', (err) => {
      console.log(`❌ ${description}: ${err.message}`);
      resolve({ success: false, error: err.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`⏰ ${description}: Timeout (5s)`);
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function checkKeycloakConfiguration() {
  console.log('🔍 Checking Keycloak endpoints...\n');

  // Check if Keycloak is running
  const keycloakCheck = await checkKeycloakEndpoint(
    KEYCLOAK_URL,
    'Keycloak Server'
  );

  if (!keycloakCheck.success) {
    console.log('\n❌ Keycloak server is not accessible!');
    console.log('   Make sure Keycloak is running on http://localhost:8282');
    return;
  }

  // Check realm endpoint
  await checkKeycloakEndpoint(
    `${KEYCLOAK_URL}/realms/${REALM}`,
    `Realm: ${REALM}`
  );

  // Check well-known configuration
  await checkKeycloakEndpoint(
    `${KEYCLOAK_URL}/realms/${REALM}/.well-known/openid_configuration`,
    'OpenID Configuration'
  );

  // Check admin console
  await checkKeycloakEndpoint(`${KEYCLOAK_URL}/admin/`, 'Admin Console');

  console.log('\n📋 Configuration Checklist:');
  console.log('==========================');

  console.log('\n🔧 Manual Steps Required:');
  console.log('1. Access Keycloak Admin Console:');
  console.log(`   → ${KEYCLOAK_URL}/admin/`);
  console.log('\n2. Login with admin credentials');
  console.log('\n3. Select realm: pisval-pos-realm');
  console.log('\n4. Go to: Realm Settings > Login tab');
  console.log('\n5. Enable: "User registration"');
  console.log('\n6. Click: "Save"');
  console.log('\n7. Test: Navigate to your app and check login page');

  console.log('\n🎯 Expected Result:');
  console.log(
    'After enabling registration, your Keycloak login page should show:'
  );
  console.log('- Username/email field');
  console.log('- Password field');
  console.log('- "Sign In" button');
  console.log('- "Register" link ← This is what you want to see');
  console.log('- "Forgot Password?" link (optional)');

  console.log('\n🔍 Verification Steps:');
  console.log('1. Clear browser cache (Ctrl+F5)');
  console.log('2. Navigate to: http://localhost:3000');
  console.log('3. Should redirect to Keycloak login');
  console.log('4. Look for "Register" link on login page');

  console.log('\n📞 If Registration Link Missing:');
  console.log('- Double-check you selected the correct realm');
  console.log('- Ensure "User registration" is toggled ON');
  console.log('- Click "Save" after making changes');
  console.log('- Clear browser cache and try again');

  console.log('\n🚀 Quick Test URLs:');
  console.log(`Admin Console: ${KEYCLOAK_URL}/admin/`);
  console.log(`Realm Info: ${KEYCLOAK_URL}/realms/${REALM}`);
  console.log(`Your App: http://localhost:3000`);
  console.log(`Debug Page: http://localhost:3000/debug-auth-flow`);
}

// Run the check
checkKeycloakConfiguration().catch(console.error);

// Export for use in other scripts
module.exports = {
  checkKeycloakConfiguration,
  KEYCLOAK_URL,
  REALM,
};
