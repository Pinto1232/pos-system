'use client';

import React, {
  memo,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import styles from './LoginForm.module.css';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Image from 'next/image';
import { Button } from '../ui/button/Button';
import { useSpinner } from '@/contexts/SpinnerContext';
import { redirectToKeycloakRegistration } from '@/utils/authUtils';
import { AuthContext } from '@/contexts/AuthContext';
import keycloakInstance from '@/auth/keycloak';

const LoginForm = memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');
  const { startLoading, stopLoading } = useSpinner();
  const { login, error: authError } = useContext(AuthContext);
  const serviceCheckPerformedRef = useRef(false);

  const checkKeycloakAvailability = useCallback(async () => {
    if (!serviceCheckPerformedRef.current) {
      serviceCheckPerformedRef.current = true;
      try {
        const wellKnownUrl = `${keycloakInstance.authServerUrl}/realms/${keycloakInstance.realm}/.well-known/openid-configuration`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch(wellKnownUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error('Authentication service is not accessible');
          }

          const config = await response.json();
          if (!config.authorization_endpoint) {
            throw new Error('Invalid Keycloak configuration');
          }

          console.log('Keycloak is available and configured correctly');
        } catch (fetchError: unknown) {
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            throw new Error('Authentication service is not responding');
          }
          throw new Error(
            fetchError instanceof Error
              ? fetchError.message
              : 'Authentication service is not available'
          );
        }
      } catch (err) {
        console.error('Keycloak availability check failed:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Authentication service is temporarily unavailable. Please try again later.'
        );
        setSnackbarOpen(true);
        stopLoading();
      }
    }
  }, [stopLoading, setError, setSnackbarOpen]);

  useEffect(() => {
    if (!serviceCheckPerformedRef.current) {
      checkKeycloakAvailability();
    }
    return () => {
      serviceCheckPerformedRef.current = false;
    };
  }, [checkKeycloakAvailability]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      setSnackbarOpen(true);
      setIsFadingOut(false);
      stopLoading();
    }
  }, [authError, stopLoading]);

  useEffect(() => {
    checkKeycloakAvailability();
  }, [checkKeycloakAvailability]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSnackbarOpen(false);
    setLoginStatus('Authenticating...');

    const loginTimeout = setTimeout(() => {
      stopLoading();
      setError('Login request timed out. Please try again.');
      setSnackbarOpen(true);
      setLoginStatus('');
      setIsFadingOut(false);
    }, 20000);

    startLoading();
    setIsFadingOut(true);

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      sessionStorage.setItem('kc_username', email);
      sessionStorage.setItem('kc_password', password);

      await login().catch((error) => {
        throw error;
      });

      clearTimeout(loginTimeout);
    } catch (err) {
      clearTimeout(loginTimeout);
      console.error('Login failed:', err);

      let errorMessage = 'Login failed. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err && 'error' in err) {
        const keycloakError = err as {
          error: string;
          error_description?: string;
        };
        if (keycloakError.error === 'invalid_grant') {
          errorMessage = 'Invalid username or password';
        } else if (keycloakError.error_description) {
          errorMessage = keycloakError.error_description;
        }
      }

      setError(errorMessage);
      setSnackbarOpen(true);
      setIsFadingOut(false);
      stopLoading();
      setLoginStatus('');

      // Clear stored credentials on error
      sessionStorage.removeItem('kc_username');
      sessionStorage.removeItem('kc_password');
    }
  };

  return (
    <>
      <div
        className={`${styles.LoginContent} ${isFadingOut ? styles.fadeOut : ''}`}
      >
        <div className={styles.logoContainer}>
          {!logoError && (
            <Image
              src="/Pisval_Logo.jpg"
              alt="Pisval Logo"
              width={150}
              height={150}
              onError={() => setLogoError(true)}
              priority
            />
          )}
        </div>

        <Typography variant="h5" component="h1" gutterBottom align="center">
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          gutterBottom
          align="center"
        >
          Please enter your credentials to access your account
        </Typography>

        <form onSubmit={handleLogin} className={styles.form}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={styles.submitButton}
          >
            Sign In
          </Button>

          <Box mt={2} textAlign="center">
            <Link
              component="button"
              variant="body2"
              onClick={() => redirectToKeycloakRegistration()}
              className={styles.registerLink}
            >
              {"Don't have an account? Register here"}
            </Link>
          </Box>
        </form>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        className={styles.snackbar}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={
            error?.toLowerCase().includes('server') ? 'warning' : 'error'
          }
          variant="filled"
          sx={{ width: '100%' }}
          className={styles.alert}
        >
          {error}
          {error?.toLowerCase().includes('server') && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption">
                This might be a temporary issue. Please try again in a few
                minutes or contact support if the problem persists.
              </Typography>
            </Box>
          )}
        </Alert>
      </Snackbar>

      {loginStatus && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
          }}
        >
          <Alert severity="info" icon={<CircularProgress size={20} />}>
            {loginStatus}
          </Alert>
        </Box>
      )}
    </>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
