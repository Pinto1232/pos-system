'use client';

import React, { memo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Image from 'next/image';
import { Button } from '../ui/button/Button';
import axios from 'axios';
import { useSpinner } from '@/contexts/SpinnerContext';

interface LoginFormProps {
  title?: string;
  subtitle?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  buttonText?: string;
  onSubmit?: (
    email: string,
    password: string
  ) => void;

}

const LoginForm: React.FC<LoginFormProps> = memo(
  ({
    title = 'Welcome Back',
    subtitle = 'Please enter your credentials to access your account',
    buttonText = 'Sign In',
    onSubmit,
  }) => {
    const router = useRouter();
    const { startLoading, stopLoading } =
      useSpinner();
    const [error, setError] = useState<
      string | null
    >(null);
    const [isFadingOut, setIsFadingOut] =
      useState(false);
    const [snackbarOpen, setSnackbarOpen] =
      useState(false);
    const [isLoggedIn, setIsLoggedIn] =
      useState(false);
    const [showPassword, setShowPassword] =
      useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logoError, setLogoError] =
      useState(false);

    const handleLogin = async (
      event: React.FormEvent
    ) => {
      event.preventDefault();

      startLoading({ timeout: 8000 });
      setIsFadingOut(true);

      if (!email || !password) {
        setError('Please fill in all fields');
        setSnackbarOpen(true);
        setIsFadingOut(false);
        stopLoading();
        return;
      }

      if (onSubmit) {
        onSubmit(email, password);
      }

      try {
        const response = await axios.post(
          'http://localhost:5107/api/auth/login',
          { email, password }
        );

        const { access_token } = response.data;
        localStorage.setItem(
          'accessToken',
          access_token
        );

        setIsLoggedIn(true);
        setIsFadingOut(false);

        sessionStorage.setItem(
          'freshLogin',
          'true'
        );
        router.push('/dashboard');
      } catch (err) {
        console.error('Login failed:', err);
        setError(
          'Login failed. Please check your credentials and try again.'
        );
        setSnackbarOpen(true);
        setIsFadingOut(false);
        stopLoading();
      }
    };

    const handleLogoError = () => {
      console.warn(
        "Logo image '/Pisval_Logo.jpg' failed to load."
      );
      setLogoError(true);
    };

    return (
      <>
        {!isLoggedIn && (
          <div
            className={`${styles.LoginContent} ${isFadingOut ? styles.fadeOut : ''}`}
          >
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
                  <Typography variant="caption">
                    Logo
                  </Typography>
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

            <Typography
              variant="h6"
              className={styles.heading}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              className={styles.subtext}
            >
              {subtitle}
            </Typography>

            <form
              className={styles.form}
              onSubmit={handleLogin}
            >
              <Box mb={2}>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className={styles.textField}
                  required
                  slotProps={{
                    inputLabel: {
                      shrink: !!email || undefined,
                    }
                  }}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? 'Hide password'
                                : 'Show password'
                            }
                            onClick={() =>
                              setShowPassword(
                                !showPassword
                              )
                            }
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    },
                    inputLabel: {
                      shrink: !!password || undefined,
                    }
                  }}
                  className={styles.textField}
                  required
                />
              </Box>

              <Box className={styles.options}>
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked />
                  }
                  label="Remember me"
                  sx={{
                    '& .MuiFormControlLabel-label':
                    {
                      fontSize: '0.75rem',
                      color: '#64748b',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.2rem',
                      color: '#3b82f6',
                    },
                  }}
                  className={
                    styles.rememberMeContainer
                  }
                />
                <Link
                  href="#"
                  className={
                    styles.forgotPassword
                  }
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                className={styles.loginButton}
              >
                {buttonText}
              </Button>
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
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
            className={styles.alert}
          >
            {error}
          </Alert>
        </Snackbar>
      </>
    );
  }
);

LoginForm.displayName = 'LoginForm';

export default LoginForm;
