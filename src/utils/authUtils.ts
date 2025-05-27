export const markAsNewRegistration = (): void => {
  localStorage.setItem('newRegistration', 'true');
  localStorage.setItem('pendingRegistration', 'true');
  console.log('User marked as new registration, will be redirected to login');
};

export const redirectToKeycloakRegistration = (
  keycloakUrl: string = process.env.NEXT_PUBLIC_KEYCLOAK_URL ||
    'http://localhost:8282',
  realm: string = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'pisval-pos-realm',
  clientId: string = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||
    'pos-frontend',
  redirectUri: string = window.location.origin + '/'
): void => {
  markAsNewRegistration();

  const registrationUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/registrations?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  console.log(
    'Redirecting to Keycloak registration:',
    JSON.stringify(registrationUrl, null, 2)
  );

  window.location.href = registrationUrl;
};

export const isRedirectFromRegistration = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);

  const hasRegistrationMarker =
    urlParams.has('session_code') ||
    (urlParams.has('code') &&
      localStorage.getItem('pendingRegistration') === 'true');

  const hasOAuth2Params =
    urlParams.has('state') &&
    urlParams.has('session_state') &&
    urlParams.has('iss') &&
    urlParams.has('code');

  if (hasOAuth2Params && !localStorage.getItem('pendingRegistration')) {
    console.log(
      'Detected OAuth2 authorization code response, not registration redirect'
    );
    return false;
  }

  return hasRegistrationMarker;
};

export const handleRegistrationRedirect = (): void => {
  if (isRedirectFromRegistration()) {
    console.log('Detected redirect from Keycloak registration');

    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    localStorage.removeItem('pendingRegistration');
    markAsNewRegistration();

    const keycloakUrl =
      process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8282';
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'pisval-pos-realm';
    const clientId =
      process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'pos-frontend';

    const loginUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin + '/')}&response_type=code&scope=openid`;

    console.log(
      'Redirecting to Keycloak login after registration:',
      JSON.stringify(loginUrl, null, 2)
    );

    setTimeout(() => {
      window.location.href = loginUrl;
    }, 100);
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuth2Params =
      urlParams.has('state') &&
      urlParams.has('session_state') &&
      urlParams.has('iss') &&
      urlParams.has('code');

    if (hasOAuth2Params) {
      console.log(
        'OAuth2 authorization code detected, letting Keycloak handle authentication'
      );

      return;
    }
  }
};
