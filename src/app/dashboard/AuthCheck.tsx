//import { headers } from 'next/headers';
//import { redirect } from 'next/navigation';

/**
 * Server Component for checking authentication
 * This component checks if the user is authenticated on the server
 * and redirects to the login page if not
 *
 * TEMPORARILY DISABLED FOR DEVELOPMENT - Authentication checks are bypassed
 */
export default async function AuthCheck() {
  // TEMPORARILY DISABLED: Authentication check is bypassed for development
  console.log(
    '⚠️ WARNING: Authentication check is temporarily disabled for development'
  );
  console.log(
    '⚠️ This should be re-enabled before deploying to production'
  );

  // Use a mock token for development
  //const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWZhdWx0LXVzZXIiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTkxNjIzOTAyMiwicm9sZXMiOlsiZGFzaGJvYXJkIiwidXNlciJdfQ.mMSYCImrC4qU18UQnAEPJRyTQwbKdX5awyEJFLrpxUc';

  // Return null to allow access to the dashboard without authentication
  return null;

  /* ORIGINAL AUTHENTICATION CODE - COMMENTED OUT TEMPORARILY
  let authToken;

  try {
    // Get the authorization header
    const headersList = headers();
    const authorization = headersList.get('authorization');

    // Check for authorization header
    if (authorization && authorization.startsWith('Bearer ')) {
      authToken = authorization.substring(7);
    } else {
      // For development purposes, assume authenticated
      // In production, you would redirect to login
      console.log('No authorization header found, using mock token for development');
      authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWZhdWx0LXVzZXIiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTkxNjIzOTAyMiwicm9sZXMiOlsiZGFzaGJvYXJkIiwidXNlciJdfQ.mMSYCImrC4qU18UQnAEPJRyTQwbKdX5awyEJFLrpxUc';
    }

    // If no auth token is found, redirect to login
    if (!authToken) {
      redirect('/?error=You must be logged in to access the dashboard');
      return null;
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    // If there's an error, assume not authenticated in production
    // For development, continue with a mock token
    console.log('Using mock token for development due to error');
    authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWZhdWx0LXVzZXIiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTkxNjIzOTAyMiwicm9sZXMiOlsiZGFzaGJvYXJkIiwidXNlciJdfQ.mMSYCImrC4qU18UQnAEPJRyTQwbKdX5awyEJFLrpxUc';
  }

  try {
    // Parse JWT token to validate it
    const tokenParts = authToken.split('.');
    if (tokenParts.length !== 3) {
      redirect('/?error=Invalid authentication token');
      return null;
    }

    // Check token expiration
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      redirect('/?error=Your session has expired. Please log in again');
      return null;
    }

    // Check if user has required roles
    let hasRequiredRole = false;

    // Extract roles from various locations in the token
    const roles: string[] = [];

    if (payload.realm_access && Array.isArray(payload.realm_access.roles)) {
      roles.push(...payload.realm_access.roles);
    }

    if (payload.roles && Array.isArray(payload.roles)) {
      roles.push(...payload.roles);
    }

    if (payload.resource_access) {
      const clientIds = Object.keys(payload.resource_access);
      for (const clientId of clientIds) {
        const clientRoles = payload.resource_access[clientId]?.roles;
        if (Array.isArray(clientRoles)) {
          roles.push(...clientRoles);
        }
      }
    }

    // Check if user has required roles
    hasRequiredRole = roles.includes('dashboard') ||
                     roles.includes('admin') ||
                     roles.includes('user') ||
                     roles.length === 0;

    if (!hasRequiredRole) {
      redirect('/?error=You do not have permission to access the dashboard');
      return null;
    }

    // User is authenticated and has required roles
    return null;
  } catch (error) {
    console.error('Error validating auth token:', error);
    // For development, continue without redirecting
    console.log('Continuing with mock authentication for development');
    return null;
  }
  */
}
