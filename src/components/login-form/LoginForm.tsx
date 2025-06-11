'use client';

import React, { memo, useState, useEffect, useContext } from 'react';
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
import { useTranslationContext } from '@/i18n';

interface LoginFormProps {
  onClose?: () => void;
}

const LoginForm = memo(({ onClose }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');
  const [translationsLoaded, setTranslationsLoaded] = useState(false);
  const { startLoading, stopLoading } = useSpinner();
  const { login, error: authError } = useContext(AuthContext);
  const { t, currentLanguage } = useTranslationContext();

  // Debug translations and check if they're loaded
  useEffect(() => {
    console.log('LoginForm: Current language:', currentLanguage);
    const translationTest = {
      welcomeBack: t('auth.welcomeBack'),
      enterCredentials: t('auth.enterCredentials'),
      email: t('auth.email'),
      password: t('auth.password'),
    };
    console.log('LoginForm: Translation test:', translationTest);

    const areTranslationsLoaded = Object.values(translationTest).every(
      (value) => value && !value.includes('auth.')
    );
    console.log('LoginForm: Translations loaded:', areTranslationsLoaded);
    setTranslationsLoaded(areTranslationsLoaded);

    if (!areTranslationsLoaded) {
      console.log('LoginForm: Attempting to reload translations');

      fetch(`/locales/${currentLanguage.code}/common.json`)
        .then((response) => response.json())
        .then((data) => {
          console.log('LoginForm: Manually loaded translations:', data);

          setTranslationsLoaded(true);
        })
        .catch((err) => {
          console.error(
            'LoginForm: Failed to manually load translations:',
            err
          );
        });
    }
  }, [t, currentLanguage]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      setSnackbarOpen(true);
      setIsFadingOut(false);
      stopLoading();
    }
  }, [authError, stopLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    console.log('LoginForm: handleLogin CALLED');
    e.preventDefault();

    setError(null);
    setSnackbarOpen(false);
    console.log('LoginForm: About to setLoginStatus to Authenticating...');
    setLoginStatus(t('auth.authenticating'));
    console.log('LoginForm: setLoginStatus to Authenticating... DONE');

    const loginTimeout = setTimeout(() => {
      stopLoading();
      setError(t('errors.loginTimeout'));
      setSnackbarOpen(true);
      setLoginStatus('');
      setIsFadingOut(false);
    }, 20000);

    startLoading();
    setIsFadingOut(true);

    try {
      console.log(
        `LoginForm: In try block. Email: "${email}", Password: "${password ? '******' : ''}"`
      );
      if (!email || !password) {
        console.log('LoginForm: Email or password empty, throwing error.');
        throw new Error(t('errors.emailPasswordRequired'));
      }

      sessionStorage.setItem('kc_username', email);
      sessionStorage.setItem('kc_password', password);

      console.log('LoginForm: typeof login is', typeof login);
      console.log('LoginForm: PRE-AWAIT login()');
      try {
        await login();
        console.log('LoginForm: POST-AWAIT login() - SUCCESS');

        if (onClose) {
          onClose();
        }
      } catch (specificLoginError) {
        console.error(
          'LoginForm: ERROR during await login() call itself:',
          specificLoginError
        );
        throw specificLoginError;
      }
      clearTimeout(loginTimeout);
    } catch (err) {
      console.log('LoginForm: In catch block.');
      clearTimeout(loginTimeout);
      console.error('Login failed:', err);

      let errorMessage = t('errors.loginFailed');
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err && 'error' in err) {
        const keycloakError = err as {
          error: string;
          error_description?: string;
        };
        if (keycloakError.error === 'invalid_grant') {
          errorMessage = t('errors.invalidCredentials');
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
      {!translationsLoaded ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flexDirection: 'column',
            p: 3,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </Box>
      ) : (
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
              {t('auth.welcomeBack')}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
              align="center"
            >
              {t('auth.enterCredentials')}
            </Typography>

            <form onSubmit={handleLogin} className={styles.form}>
              <TextField
                fullWidth
                label={t('auth.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                autoComplete="email"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#000000',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0',
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3b82f6',
                  },
                }}
              />

              <TextField
                fullWidth
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                autoComplete="current-password"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#000000',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0',
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3b82f6',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label={t('auth.togglePasswordVisibility')}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
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
                label={t('auth.rememberMe')}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={styles.submitButton}
              >
                {t('auth.loginButton')}
              </Button>

              <Box mt={2} textAlign="center">
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => redirectToKeycloakRegistration()}
                  className={styles.registerLink}
                >
                  {t('auth.noAccount')} {t('auth.registerButton')}
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
                    {t('errors.serverIssue')}
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
      )}
    </>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
