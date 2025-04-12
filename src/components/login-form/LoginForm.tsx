'use client';

import React, { memo, useState } from 'react'; // Ensure useState is imported
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
      useState(false); // <-- State to track logo loading error

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
          // Consider moving URL to environment variables
          'http://localhost:5107/api/auth/login',
          {
            email,
            password,
          }
        );
        const { access_token } = response.data;
        // Consider using more secure storage if needed (e.g., httpOnly cookies managed server-side)
        localStorage.setItem(
          'accessToken',
          access_token
        );
        console.log(
          'Login successful:',
          response.data
        );
        setIsFadingOut(false); // Reset fade out on success before navigation
        setIsLoggedIn(true); // Set logged in state
        router.push('/dashboard'); // Navigate after successful login
      } catch (err) {
        // Use 'err' for catch block variable
        console.error('Login failed:', err);
        // Provide more specific error messages if the API returns them
        setError(
          'Login failed. Please check your credentials and try again.'
        );
        setSnackbarOpen(true);
        setIsFadingOut(false); // Reset fade out on error
        setLoading(false); // Ensure loading is stopped on error
      }
      // Removed setLoading(false) from here as it should only be set on error or completion if needed elsewhere
    };

    // Handler for image loading errors
    const handleLogoError = () => {
      console.warn(
        "Logo image '/logo-placeholder.png' failed to load."
      );
      setLogoError(true);
    };

    return (
      <>
        {!isLoggedIn && (
          <Box
            className={`${styles.LoginContainer} ${
              isFadingOut ? styles.fadeOut : ''
            }`}
            sx={{
              position: 'relative',
              zIndex: isFadingOut ? 0 : 1,
              boxShadow: isFadingOut
                ? 'none'
                : '0px 0px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Box className={styles.formBox}>
              {onClose && (
                <IconButton
                  aria-label="Close login form" // Add aria-label for accessibility
                  className={styles.closeButton}
                  onClick={onClose}
                >
                  <CloseIcon />
                </IconButton>
              )}
              <Box
                className={styles.logoContainer}
              >
                {/* --- Conditional Logo Rendering --- */}
                {logoError ? (
                  // Fallback element if the image fails to load
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      backgroundColor: 'grey.300', // Use theme colors if possible
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1, // Use theme spacing/values
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
            </Box>
          </Box>
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
