#!/usr/bin/env node

/**
 * Clear Authentication State Script
 *
 * This script helps clear stuck authentication state that might cause redirect loops.
 * Run this when you're experiencing authentication redirect loops.
 */

console.log('🔧 Authentication State Cleaner');
console.log('================================');

const instructions = `
This script provides instructions to clear stuck authentication state.

If you're experiencing redirect loops, follow these steps:

1. 📱 BROWSER STEPS:
   - Open your browser's Developer Tools (F12)
   - Go to the Application/Storage tab
   - Clear localStorage for localhost:3000:
     * newRegistration
     * pendingRegistration  
     * accessToken
     * Any other auth-related keys
   - Clear sessionStorage as well
   - Clear cookies for localhost:3000

2. 🌐 MANUAL URL CLEANUP:
   - If you're stuck on a URL with parameters like:
     ?state=...&session_state=...&iss=...&code=...
   - Navigate directly to: http://localhost:3000/debug-auth-flow
   - This will help you understand what's happening

3. 🔄 RESTART STEPS:
   - Close all browser tabs for localhost:3000
   - Restart your browser
   - Navigate to: http://localhost:3000

4. 🐛 DEBUG STEPS:
   - Visit: http://localhost:3000/debug-auth-flow
   - This page will show you the current authentication state
   - Follow the recommendations on that page

5. ⚙️ KEYCLOAK STEPS (if needed):
   - Check if Keycloak is running on http://localhost:8282
   - Verify the realm 'pisval-pos-realm' exists
   - Verify the client 'pos-frontend' is configured correctly

6. 🔍 COMMON ISSUES FIXED:
   - ✅ Removed duplicate handleRegistrationRedirect() call from layout.tsx
   - ✅ Fixed OAuth2 vs registration redirect detection
   - ✅ Fixed client ID mismatch (now using 'pos-frontend')
   - ✅ Added proper state management for registration flow

If you're still having issues after these steps, check the browser console
for error messages and authentication flow logs.
`;

console.log(instructions);

// If running in a browser environment, provide a helper function
if (typeof window !== 'undefined') {
  window.clearAuthState = function () {
    console.log('🧹 Clearing authentication state...');

    // Clear localStorage
    const authKeys = [
      'newRegistration',
      'pendingRegistration',
      'accessToken',
      'sidebarActiveItem',
    ];
    authKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        console.log(`Removing localStorage: ${key}`);
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage
    const sessionKeys = ['kc_username', 'kc_password'];
    sessionKeys.forEach((key) => {
      if (sessionStorage.getItem(key)) {
        console.log(`Removing sessionStorage: ${key}`);
        sessionStorage.removeItem(key);
      }
    });

    console.log('✅ Authentication state cleared');
    console.log('🔄 Redirecting to clean home page...');

    // Redirect to clean URL
    window.location.href = '/';
  };

  console.log(
    '💡 You can also run clearAuthState() in the browser console to clear auth state automatically.'
  );
}

module.exports = {
  clearAuthInstructions: instructions,
};
