'use client';

import React, {
  memo,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
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
import { useTranslationContext } from '@/i18n';

interface LoginFormProps {
  onClose?: () => void;
}

const arePropsEqual = (
  prevProps: LoginFormProps,
  nextProps: LoginFormProps
) => {
  return prevProps.onClose === nextProps.onClose;
};

const LoginForm = memo(({ onClose }: LoginFormProps) => {
  const renderCount = React.useRef(0);
  renderCount.current += 1;
  console.log(
    `🔄 LoginForm render #${renderCount.current} at:`,
    new Date().toISOString()
  );

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

  // Memoize translation keys to check if translations are loaded
  const translationKeys = useMemo(
    () => [
      'auth.welcomeBack',
      'auth.enterCredentials',
      'auth.email',
      'auth.password',
    ],
    []
  );

  const areTranslationsLoaded = useMemo(() => {
    return translationKeys.every((key) => {
      const translation = t(key);
      return (
        translation && translation !== key && !translation.includes('auth.')
      );
    });
  }, [translationKeys, t]);

  useEffect(() => {
    console.log('LoginForm: Current language:', currentLanguage?.code);
    console.log('LoginForm: Translations loaded:', areTranslationsLoaded);

    if (areTranslationsLoaded !== translationsLoaded) {
      setTranslationsLoaded(areTranslationsLoaded);
    }

    if (!areTranslationsLoaded && currentLanguage?.code) {
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
  }, [areTranslationsLoaded, translationsLoaded, currentLanguage?.code]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      setSnackbarOpen(true);
      setIsFadingOut(false);
      stopLoading();
    }
  }, [authError, stopLoading]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      console.log('LoginForm: handleLogin CALLED');
      e.preventDefault();

      setError(null);
      setSnackbarOpen(false);
      console.log('LoginForm: About to setLoginStatus to Redirecting...');
      setLoginStatus(t('auth.redirectingToLogin'));
      console.log('LoginForm: setLoginStatus to Redirecting... DONE');

      startLoading();
      setIsFadingOut(true);

      let redirectTimeout: NodeJS.Timeout | undefined;

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

        console.log('LoginForm: Initiating redirect-based authentication...');
        console.log('LoginForm: About to call login() function');

        redirectTimeout = setTimeout(() => {
          console.log('LoginForm: Redirect timeout - closing modal');
          console.error(
            '❌ REDIRECT TIMEOUT: The redirect to Keycloak did not happen within 3 seconds'
          );
          console.error('This usually means:');
          console.error('1. Keycloak server is not running');
          console.error('2. Keycloak configuration is incorrect');
          console.error('3. Network connectivity issues');

          setError(
            'Authentication redirect failed. Please check if the authentication server is running.'
          );
          setSnackbarOpen(true);
          setIsFadingOut(false);
          stopLoading();
          setLoginStatus('');

          if (onClose) {
            onClose();
          }
        }, 5000); // Increased to 5 seconds to give more time

        // Note: This will redirect the entire page to Keycloak
        // The modal will disappear because of the page redirect
        console.log('LoginForm: Calling await login()...');
        await login();
        console.log(
          'LoginForm: login() completed without redirect (unexpected)'
        );

        // Clear timeout if we reach here (shouldn't happen in normal redirect flow)
        clearTimeout(redirectTimeout);
        console.log('LoginForm: This should not be reached in redirect flow');
      } catch (err) {
        if (redirectTimeout) {
          clearTimeout(redirectTimeout);
        }
        console.log('LoginForm: In catch block.');
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
    },
    [email, password, t, startLoading, stopLoading, login, onClose]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleRememberMeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRememberMe(e.target.checked);
    },
    []
  );

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  return (
    <>
      {!translationsLoaded ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            flexDirection: 'column',
            p: 3,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading translations...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Current language: {currentLanguage?.code || 'unknown'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            If this takes too long, there may be a translation loading issue.
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
                onChange={handleEmailChange}
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
                onChange={handlePasswordChange}
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
                        onClick={handleTogglePassword}
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
                    onChange={handleRememberMeChange}
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
            onClose={handleSnackbarClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            className={styles.snackbar}
          >
            <Alert
              onClose={handleSnackbarClose}
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
}, arePropsEqual);

LoginForm.displayName = 'LoginForm';

export default LoginForm;
