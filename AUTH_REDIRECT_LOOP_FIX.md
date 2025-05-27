# Authentication Redirect Loop Fix

## 🔍 **Problem Identified**

You were experiencing an infinite redirect loop when accessing `localhost:3000`,
being redirected to URLs like:

```
http://localhost:3000/?state=3034b506-e8e8-4b7b-a31d-d0b220bb9961&session_state=1d8a879a-1532-4f4a-ae48-53ca0421779f&iss=http%3A%2F%2Flocalhost%3A8282%2Frealms%2Fpisval-pos-realm&code=6a5aa33b-d2aa-42b9-82c4-0fb79013d3f8.1d8a879a-1532-4f4a-ae48-53ca0421779f.d4abfb48-65ee-4a2c-ab2e-237195293978
```

## 🔧 **Root Causes Found**

### 1. **Duplicate Registration Handler Calls**

- `handleRegistrationRedirect()` was being called in **both** `layout.tsx` and
  `RegistrationHandler.tsx`
- This caused the function to run on every page load, including OAuth2 responses
- **Fix:** Removed the call from `layout.tsx` (line 31)

### 2. **Incorrect OAuth2 vs Registration Detection**

- The `isRedirectFromRegistration()` function was treating normal OAuth2
  authorization code responses as registration redirects
- OAuth2 responses have `state`, `session_state`, `iss`, and `code` parameters
- **Fix:** Updated logic to distinguish between OAuth2 responses and actual
  registration redirects

### 3. **Client ID Mismatch**

- `authUtils.ts` was using `pos-backend` as default client ID
- Environment variable is set to `pos-frontend`
- **Fix:** Updated default client ID to match environment variable

## ✅ **Fixes Applied**

### 1. **Updated `authUtils.ts`**

```typescript
// ✅ Fixed OAuth2 vs Registration detection
export const isRedirectFromRegistration = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search)

  // Check for specific registration parameters, not just any OAuth2 code
  const hasRegistrationMarker =
    urlParams.has('session_code') ||
    (urlParams.has('code') &&
      localStorage.getItem('pendingRegistration') === 'true')

  // Don't treat normal OAuth2 authorization code responses as registration redirects
  const hasOAuth2Params =
    urlParams.has('state') &&
    urlParams.has('session_state') &&
    urlParams.has('iss') &&
    urlParams.has('code')

  // If it's a normal OAuth2 response, it's not a registration redirect
  if (hasOAuth2Params && !localStorage.getItem('pendingRegistration')) {
    console.log(
      'Detected OAuth2 authorization code response, not registration redirect'
    )
    return false
  }

  return hasRegistrationMarker
}

// ✅ Fixed client ID defaults
const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'pos-frontend'
```

### 2. **Updated `layout.tsx`**

```typescript
// ❌ REMOVED - This was causing duplicate calls
// if (typeof window !== 'undefined') {
//   handleRegistrationRedirect();
// }
```

### 3. **Enhanced Registration Handling**

```typescript
// ✅ Added proper state management
export const markAsNewRegistration = (): void => {
  localStorage.setItem('newRegistration', 'true')
  localStorage.setItem('pendingRegistration', 'true') // ✅ Added this flag
  console.log('User marked as new registration, will be redirected to login')
}

// ✅ Added OAuth2 flow protection
export const handleRegistrationRedirect = (): void => {
  if (isRedirectFromRegistration()) {
    // Handle registration redirect
    localStorage.removeItem('pendingRegistration') // ✅ Clean up flag
    // ... rest of registration logic
  } else {
    // ✅ NEW: Don't interfere with OAuth2 flow
    const urlParams = new URLSearchParams(window.location.search)
    const hasOAuth2Params =
      urlParams.has('state') &&
      urlParams.has('session_state') &&
      urlParams.has('iss') &&
      urlParams.has('code')

    if (hasOAuth2Params) {
      console.log(
        'OAuth2 authorization code detected, letting Keycloak handle authentication'
      )
      return // Let AuthContext handle this
    }
  }
}
```

## 🛠️ **New Debug Tools Created**

### 1. **Debug Page: `/debug-auth-flow`**

- Visit `http://localhost:3000/debug-auth-flow` to analyze authentication state
- Shows URL parameters, localStorage data, and current auth state
- Provides specific recommendations based on detected state
- Includes buttons to clear state and restart auth flow

### 2. **Auth State Cleaner Script**

- `frontend/clear-auth-state.js` - Instructions for manual cleanup
- Browser console function: `clearAuthState()` for automatic cleanup

## 🚀 **How to Test the Fix**

### 1. **Clear Current State**

```bash
# Navigate to debug page
http://localhost:3000/debug-auth-flow

# Or clear manually in browser console:
localStorage.clear();
sessionStorage.clear();
```

### 2. **Test Normal Flow**

```bash
# 1. Navigate to home page
http://localhost:3000

# 2. Should either:
#    - Show content if already authenticated
#    - Redirect to Keycloak login if not authenticated
#    - Complete OAuth2 flow without loops
```

### 3. **Test Registration Flow**

```bash
# 1. Trigger registration (if you have a registration button)
# 2. Should redirect to Keycloak registration
# 3. After registration, should redirect to login
# 4. After login, should complete OAuth2 flow and return to app
```

## 📊 **Expected Behavior After Fix**

### **Normal Authentication Flow:**

1. User visits `localhost:3000`
2. AuthContext checks for existing token
3. If no token, redirects to Keycloak login
4. User logs in at Keycloak
5. Keycloak redirects back with OAuth2 parameters
6. AuthContext processes the authorization code
7. User is authenticated and sees the app

### **Registration Flow:**

1. User clicks registration button
2. Sets `pendingRegistration` flag
3. Redirects to Keycloak registration
4. After registration, redirects to Keycloak login
5. Follows normal authentication flow above

### **No More Loops:**

- OAuth2 responses are properly handled by AuthContext
- Registration redirects are properly detected and handled
- No duplicate processing of authentication responses

## 🔍 **Monitoring & Troubleshooting**

### **Check Browser Console For:**

- `"OAuth2 authorization code detected, letting Keycloak handle authentication"`
- `"Detected redirect from Keycloak registration"`
- Keycloak initialization logs from AuthContext

### **If Issues Persist:**

1. Visit `/debug-auth-flow` page for detailed analysis
2. Check Keycloak server is running on `localhost:8282`
3. Verify client configuration in Keycloak admin console
4. Check environment variables in `.env.local`

### **Common Signs of Success:**

- No infinite redirects
- Clean URLs after authentication
- Proper token storage in localStorage
- Successful API calls with authentication headers

The fix addresses the core issue of conflicting authentication handlers and
should resolve the redirect loop completely.
