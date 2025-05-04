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
import CloseIcon from '@mui/icons-material/Close';
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
  onClose?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = memo(
  ({
    title = 'Welcome Back',
    subtitle = 'Please enter your credentials to access your account',
    buttonText = 'Sign In',
    onSubmit,
    onClose,
  }) => {
    const router = useRouter();
    const { setLoading } = useSpinner();
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
      setIsFadingOut(true);
      setLoading(true);

      if (!email || !password) {
        setError('Please fill in all fields');
        setSnackbarOpen(true);
        setIsFadingOut(false);
        setLoading(false);
        return;
      }

      if (onSubmit) {
        onSubmit(email, password);
      }

      try {
        const response = await axios.post(
          'http://localhost:5107/api/auth/login',
          {
            email,
            password,
          }
        );
        const { access_token } = response.data;
        localStorage.setItem(
          'accessToken',
          access_token
        );
        console.log(
          'Login successful:',
          response.data
        );
        setIsFadingOut(false);
        setIsLoggedIn(true);
        router.push('/dashboard');
      } catch (err) {
        console.error('Login failed:', err);
        setError(
          'Login failed. Please check your credentials and try again.'
        );
        setSnackbarOpen(true);
        setIsFadingOut(false);
        setLoading(false);
      }
    };

    const handleLogoError = () => {
      console.warn(
        "Logo image '/logo-placeholder.png' failed to load."
      );
      setLogoError(true);
    };

    return (
      <>
        {!isLoggedIn && (
          <div
            className={`${styles.LoginContent} ${isFadingOut ? styles.fadeOut : ''}`}
          >
            {onClose && (
              <IconButton
                aria-label="Close login form"
                className={styles.closeButton}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
            )}
            <Box
              className={styles.logoContainer}
            >
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
                  InputLabelProps={{
                    shrink:
                      !!email || undefined,
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
                  InputProps={{
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
                    ),
                  }}
                  className={styles.textField}
                  required
                  InputLabelProps={{
                    shrink:
                      !!password || undefined,
                  }}
                />
              </Box>

              <Box className={styles.options}>
                <FormControlLabel
                  control={
                    <Checkbox
                      className={
                        styles.checkbox
                      }
                    />
                  }
                  label="Remember me"
                  className={styles.rememberMe}
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