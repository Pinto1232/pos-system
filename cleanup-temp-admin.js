#!/usr/bin/env node

/**
 * Keycloak Security Cleanup Script
 * This script helps identify and remove temporary/default admin accounts
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🔐 Keycloak Security Cleanup Assistant\n');

  console.log(
    'This script will help you identify and remove temporary admin accounts.'
  );
  console.log(
    'IMPORTANT: Only run this AFTER you have created and tested a permanent admin account!\n'
  );

  const confirmed = await askQuestion(
    'Have you created and tested a permanent admin account? (yes/no): '
  );

  if (confirmed.toLowerCase() !== 'yes') {
    console.log('\n❌ Please create and test a permanent admin account first.');
    console.log(
      'Use the test page at http://localhost:3000/test-admin-access.html'
    );
    rl.close();
    return;
  }

  console.log('\n📋 Common temporary admin accounts to check:');
  console.log('- Username: admin, Password: admin');
  console.log('- Username: admin, Password: password');
  console.log('- Username: admin, Password: admin123');
  console.log('- Any other default credentials you may have used');

  console.log('\n🔧 Manual cleanup steps:');
  console.log(
    '1. Login to Keycloak Admin Console with your NEW permanent admin account'
  );
  console.log('2. Go to Users section');
  console.log(
    '3. Find any temporary admin users (like "admin" with default passwords)'
  );
  console.log('4. Either:');
  console.log('   a) Delete the temporary user completely, OR');
  console.log('   b) Disable the user and change the password');

  console.log('\n⚠️  SECURITY CHECKLIST:');
  console.log('✅ Created permanent admin with strong password');
  console.log('✅ Tested permanent admin access');
  console.log('✅ Assigned proper admin roles');
  console.log('⬜ Removed/disabled temporary admin accounts');
  console.log('⬜ Updated any scripts that use old credentials');
  console.log('⬜ Documented new admin credentials securely');

  const newAdminUsername = await askQuestion(
    '\nWhat is your new permanent admin username? '
  );

  console.log('\n📝 RECOMMENDED NEXT STEPS:');
  console.log(`1. Test login with: ${newAdminUsername}`);
  console.log('2. Verify access to pisval-pos-realm');
  console.log('3. Remove any "admin" users with default passwords');
  console.log('4. Update your documentation');

  console.log('\n🔗 Quick Links:');
  console.log('- Admin Console: http://localhost:8282');
  console.log('- Test Page: http://localhost:3000/test-admin-access.html');
  console.log('- POS Realm: http://localhost:8282/realms/pisval-pos-realm');

  const shouldContinue = await askQuestion(
    '\nWould you like to see additional security recommendations? (yes/no): '
  );

  if (shouldContinue.toLowerCase() === 'yes') {
    console.log('\n🛡️  ADDITIONAL SECURITY RECOMMENDATIONS:');
    console.log('');
    console.log('1. PASSWORD POLICY:');
    console.log('   - Go to Realm Settings → Password Policy');
    console.log('   - Set minimum length (12+ characters)');
    console.log('   - Require uppercase, lowercase, numbers, special chars');
    console.log('');
    console.log('2. SESSION MANAGEMENT:');
    console.log('   - Set reasonable session timeouts');
    console.log('   - Enable "Revoke Refresh Token" for better security');
    console.log('');
    console.log('3. BRUTE FORCE PROTECTION:');
    console.log('   - Go to Realm Settings → Security Defenses');
    console.log('   - Enable "Brute Force Detection"');
    console.log('   - Set max login failures and wait times');
    console.log('');
    console.log('4. BACKUP:');
    console.log('   - Export realm configuration regularly');
    console.log('   - Store backups securely');
    console.log('');
    console.log('5. MONITORING:');
    console.log('   - Monitor admin login events');
    console.log('   - Set up alerts for suspicious activity');
  }

  console.log('\n✅ Security cleanup guidance complete!');
  console.log(
    'Remember to test everything thoroughly before removing old accounts.'
  );

  rl.close();
}

main().catch(console.error);
