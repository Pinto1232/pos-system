'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';

export default function DebugAuthFlow() {
  const [urlParams, setUrlParams] = useState<Record<string, string>>({});
  const [localStorageData, setLocalStorageData] = useState<
    Record<string, string>
  >({});
  const [authState, setAuthState] = useState<string>('checking');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramObj: Record<string, string> = {};
    params.forEach((value, key) => {
      paramObj[key] = value;
    });
    setUrlParams(paramObj);

    const storageData: Record<string, string> = {};
    const keys = [
      'newRegistration',
      'pendingRegistration',
      'accessToken',
      'sidebarActiveItem',
    ];
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) {
        storageData[key] = value;
      }
    });
    setLocalStorageData(storageData);

    const hasOAuth2Params =
      params.has('state') &&
      params.has('session_state') &&
      params.has('iss') &&
      params.has('code');

    const hasRegistrationMarker =
      params.has('session_code') ||
      (params.has('code') &&
        localStorage.getItem('pendingRegistration') === 'true');

    if (hasOAuth2Params) {
      setAuthState('oauth2_response');
    } else if (hasRegistrationMarker) {
      setAuthState('registration_redirect');
    } else if (Object.keys(paramObj).length === 0) {
      setAuthState('clean_url');
    } else {
      setAuthState('unknown');
    }
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('newRegistration');
    localStorage.removeItem('pendingRegistration');
    localStorage.removeItem('accessToken');
    window.location.href = '/debug-auth-flow';
  };

  const clearUrlParams = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.reload();
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'oauth2_response':
        return 'info';
      case 'registration_redirect':
        return 'warning';
      case 'clean_url':
        return 'success';
      default:
        return 'error';
    }
  };

  const getStateDescription = (state: string) => {
    switch (state) {
      case 'oauth2_response':
        return 'This appears to be a normal OAuth2 authorization code response from Keycloak. The AuthContext should handle this automatically.';
      case 'registration_redirect':
        return 'This appears to be a redirect from Keycloak registration. The RegistrationHandler should process this.';
      case 'clean_url':
        return 'Clean URL with no parameters. This is the normal state.';
      default:
        return 'Unknown state. This might indicate an issue with the authentication flow.';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🔍 Authentication Flow Debug
      </Typography>

      <Alert severity={getStateColor(authState)} sx={{ mb: 3 }}>
        <Typography variant="h6">Current State: {authState}</Typography>
        <Typography variant="body2">
          {getStateDescription(authState)}
        </Typography>
      </Alert>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          URL Parameters
        </Typography>
        {Object.keys(urlParams).length === 0 ? (
          <Typography color="text.secondary">No URL parameters</Typography>
        ) : (
          <Box component="pre" sx={{ fontSize: '0.875rem', overflow: 'auto' }}>
            {JSON.stringify(urlParams, null, 2)}
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          LocalStorage Data
        </Typography>
        {Object.keys(localStorageData).length === 0 ? (
          <Typography color="text.secondary">
            No relevant localStorage data
          </Typography>
        ) : (
          <Box component="pre" sx={{ fontSize: '0.875rem', overflow: 'auto' }}>
            {JSON.stringify(localStorageData, null, 2)}
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recommendations
        </Typography>
        {authState === 'oauth2_response' && (
          <Alert severity="info">
            <Typography variant="body2">
              • This is a normal OAuth2 response. If you're seeing a redirect
              loop, the issue is likely in the RegistrationHandler interfering
              with the OAuth2 flow.
              <br />
              • The AuthContext should automatically process this authorization
              code.
              <br />• Try going back to the home page to let the normal auth
              flow complete.
            </Typography>
          </Alert>
        )}
        {authState === 'registration_redirect' && (
          <Alert severity="warning">
            <Typography variant="body2">
              • This appears to be a registration redirect.
              <br />
              • The RegistrationHandler should process this and redirect to
              Keycloak login.
              <br />• If this is stuck in a loop, there might be an issue with
              the registration detection logic.
            </Typography>
          </Alert>
        )}
        {authState === 'clean_url' && (
          <Alert severity="success">
            <Typography variant="body2">
              • This is the normal state with no authentication parameters.
              <br />• You can safely navigate to the home page.
            </Typography>
          </Alert>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={goToHome}>
          Go to Home Page
        </Button>
        <Button variant="outlined" onClick={clearUrlParams}>
          Clear URL Parameters
        </Button>
        <Button variant="outlined" color="warning" onClick={clearLocalStorage}>
          Clear LocalStorage & Restart
        </Button>
      </Box>

      <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Current URL
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
          {window.location.href}
        </Typography>
      </Paper>
    </Box>
  );
}
