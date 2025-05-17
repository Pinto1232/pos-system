'use client';

import React, { memo, useState, useEffect, useContext, useRef } from 'react';

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
import axios from 'axios';
import { useSpinner } from '@/contexts/SpinnerContext';
import { redirectToKeycloakRegistration } from '@/utils/authUtils';
import { AuthContext } from '@/contexts/AuthContext';

interface LoginFormProps {
  title?: string;
  subtitle?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  buttonText?: string;
  onSubmit?: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = memo(
  ({ title = 'Welcome Back', subtitle = 'Please enter your credentials to access your account', buttonText = 'Sign In', onSubmit }) => {
    const { startLoading, stopLoading } = useSpinner();
    const [error, setError] = useState<string | null>(null);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logoError, setLogoError] = useState(false);
    const [loginAttempt, setLoginAttempt] = useState(0);
    const [loginStatus, setLoginStatus] = useState('');

    // Get the login function from AuthContext
    const { login, error: authError } = useContext(AuthContext);

    // Check if backend and Keycloak are available on component mount
    // Use a ref to track if the check has already been performed
    const serviceCheckPerformedRef = useRef(false);

    useEffect(() => {
      // Only perform the check once per component instance
      if (serviceCheckPerformedRef.current) return;

      const checkServices = async () => {
        serviceCheckPerformedRef.current = true;

        // Check backend status
        try {
          console.log('Checking backend status...');
          const backendResponse = await axios.get('/api/health', {
            timeout: 5000,
          });
          console.log('Backend status check response:', JSON.stringify(backendResponse.status, null, 2));
        } catch (err) {
          console.warn('Backend status check failed:', JSON.stringify(err, null, 2));
          setError('Backend server may be unavailable. Please try again later or contact support.');
          setSnackbarOpen(true);
          return;
        }

        try {
          console.log('Checking Keycloak status...');
          const keycloakResponse = await axios.get('http://localhost:8282/realms/pisval-pos-realm/.well-known/openid-configuration', {
            timeout: 5000,
          });
          console.log('Keycloak status check response:', JSON.stringify(keycloakResponse.status, null, 2));
        } catch (err) {
          console.warn('Keycloak status check failed:', JSON.stringify(err, null, 2));
          setError('Authentication server (Keycloak) may be unavailable. Please try again later or contact support.');
          setSnackbarOpen(true);
        }
      };

      checkServices();

      return () => {
        serviceCheckPerformedRef.current = false;
      };
    }, []);

    useEffect(() => {
      if (authError) {
        setError(authError);
        setSnackbarOpen(true);
        setIsFadingOut(false);
        stopLoading();
      }
    }, [authError, stopLoading]);

    const handleLogin = async (event: React.FormEvent) => {
      event.preventDefault();

      startLoading({ timeout: 15000 });
      setIsFadingOut(true);
      setLoginStatus('Connecting to authentication server...');

      const nextAttempt = loginAttempt + 1;
      setLoginAttempt(nextAttempt);
      console.log(`Login attempt #${nextAttempt}`);

      if (!email || !password) {
        setError('Please fill in all fields');
        setSnackbarOpen(true);
        setIsFadingOut(false);
        stopLoading();
        setLoginStatus('');
        return;
      }

      if (onSubmit) {
        onSubmit(email, password);
      }

      try {
        // Store credentials in sessionStorage for Keycloak to use
        sessionStorage.setItem('kc_username', email);
        sessionStorage.setItem('kc_password', password);

        console.log('Initiating Keycloak login...');

        await login();

        setLoginStatus('Authenticating...');
      } catch (err: Error | unknown) {
        console.error('Login initiation failed:', JSON.stringify(err, null, 2));

        let errorMessage = 'Login failed. Please try again.';

        if (err instanceof Error) {
          errorMessage = `Login error: ${err.message}`;
        }

        setError(errorMessage);
        setSnackbarOpen(true);
        setIsFadingOut(false);
        stopLoading();
        setLoginStatus('');
      }
    };

    const handleLogoError = () => {
      console.warn("Logo image '/Pisval_Logo.jpg' failed to load.");
      setLogoError(true);
    };

    return (
      <>
        {!isLoggedIn && (
          <div className={`${styles.LoginContent} ${isFadingOut ? styles.fadeOut : ''}`}>
            <Box className={styles.logoContainer}>
              {logoError ? (
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="caption">Logo</Typography>
                </Box>
              ) : (
                <Image
                  src="/Pisval_Logo.jpg"
                  alt="POS Logo"
                  width={60}
                  height={60}
                  className={styles.logoImage}
                  onError={handleLogoError}
                  priority
                />
              )}
            </Box>

            <Typography variant="h6" className={styles.heading}>
              {title}
            </Typography>
            <Typography variant="body1" className={styles.subtext}>
              {subtitle}
            </Typography>

            <form className={styles.form} onSubmit={handleLogin}>
              <Box mb={2}>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.textField}
                  required
                  slotProps={{
                    inputLabel: {
                      shrink: !!email || undefined,
                    },
                  }}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                    inputLabel: {
                      shrink: !!password || undefined,
                    },
                  }}
                  className={styles.textField}
                  required
                />
              </Box>

              <Box className={styles.options}>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Remember me"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.75rem',
                      color: '#64748b',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.2rem',
                      color: '#3b82f6',
                    },
                  }}
                  className={styles.rememberMeContainer}
                />
                <Link href="#" className={styles.forgotPassword}>
                  Forgot password?
                </Link>
              </Box>

              <Button type="submit" variant="contained" fullWidth className={styles.loginButton} disabled={isFadingOut}>
                {isFadingOut ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    {loginStatus || 'Signing in...'}
                  </Box>
                ) : (
                  buttonText
                )}
              </Button>

              <Box className={styles.registerContainer} mt={2} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      redirectToKeycloakRegistration();
                    }}
                    className={styles.registerLink}
                  >
                    Register now
                  </Link>
                </Typography>
              </Box>
            </form>
          </div>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          className={styles.snackbar}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="error" variant="filled" sx={{ width: '100%' }} className={styles.alert}>
            {error}
          </Alert>
        </Snackbar>
      </>
    );
  }
);

LoginForm.displayName = 'LoginForm';

export default LoginForm;
