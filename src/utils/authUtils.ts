/**
 * Utility functions for authentication and registration
 */

/**
 * Sets a flag in localStorage to indicate a new user registration
 * This will be used by the AuthContext to force a redirect to the Keycloak login page
 */
export const markAsNewRegistration = (): void => {
  localStorage.setItem('newRegistration', 'true');
  console.log(
    'User marked as new registration, will be redirected to login'
  );
};

/**
 * Redirects to Keycloak registration page
 * @param keycloakUrl The base URL of the Keycloak server
 * @param realm The Keycloak realm
 * @param clientId The client ID
 * @param redirectUri The URI to redirect to after registration
 */
export const redirectToKeycloakRegistration = (
  keycloakUrl: string = process.env
    .NEXT_PUBLIC_KEYCLOAK_URL ||
    'http://localhost:8282',
  realm: string = process.env
    .NEXT_PUBLIC_KEYCLOAK_REALM ||
    'pisval-pos-realm',
  clientId: string = process.env
    .NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||
    'pos-backend',
  redirectUri: string = window.location.origin +
    '/'
): void => {
  // Mark as new registration so the user will be redirected to login after registration
  markAsNewRegistration();

  // Construct the Keycloak registration URL
  const registrationUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/registrations?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  console.log(
    'Redirecting to Keycloak registration:',
    registrationUrl
  );

  // Redirect to the Keycloak registration page
  window.location.href = registrationUrl;
};

/**
 * Checks if the current URL indicates a redirect from Keycloak registration
 * @returns boolean True if the URL indicates a redirect from registration
 */
export const isRedirectFromRegistration =
  (): boolean => {
    // Check for Keycloak registration success parameters in URL
    const urlParams = new URLSearchParams(
      window.location.search
    );
    return (
      urlParams.has('session_code') ||
      urlParams.has('code')
    );
  };

/**
 * Handles the redirect from Keycloak registration
 * This should be called on pages that might receive redirects from Keycloak
 */
export const handleRegistrationRedirect =
  (): void => {
    if (isRedirectFromRegistration()) {
      console.log(
        'Detected redirect from Keycloak registration'
      );

      // Clear any URL parameters to avoid issues with the application
      if (
        window.history &&
        window.history.replaceState
      ) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }

      // Mark as new registration to ensure login flow
      markAsNewRegistration();

      // Get Keycloak configuration
      const keycloakUrl =
        process.env.NEXT_PUBLIC_KEYCLOAK_URL ||
        'http://localhost:8282';
      const realm =
        process.env.NEXT_PUBLIC_KEYCLOAK_REALM ||
        'pisval-pos-realm';
      const clientId =
        process.env
          .NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||
        'pos-backend';

      // Redirect to Keycloak login page
      const loginUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin + '/')}&response_type=code&scope=openid`;

      console.log(
        'Redirecting to Keycloak login after registration:',
        loginUrl
      );

      // Use a small timeout to ensure the localStorage flag is set before redirecting
      setTimeout(() => {
        window.location.href = loginUrl;
      }, 100);
    }
  };
