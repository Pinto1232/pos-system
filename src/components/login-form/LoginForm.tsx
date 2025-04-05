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
  onSubmit?: (email: string, password: string) => void;
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
    const [error, setError] = useState<string | null>(null);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event: React.FormEvent) => {
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
        localStorage.setItem('accessToken', access_token);
        console.log('Login successful:', response.data);
        setIsFadingOut(false);
        setIsLoggedIn(true);
        router.push('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        setError('Login failed. Please check your credentials and try again.');
        setSnackbarOpen(true);
        setIsFadingOut(false);
        setLoading(false);
      }
    };

    return (
      <>
        {!isLoggedIn && (
          <Box
            className={`${styles.LoginContainer} ${isFadingOut ? styles.fadeOut : ''}`}
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
                <IconButton className={styles.closeButton} onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              )}
              <Box className={styles.logoContainer}>
                <Image
                  src="/logo-placeholder.png"
                  alt="POS Logo"
                  width={60}
                  height={60}
                  className={styles.logoImage}
                />
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
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.textField}
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
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
                  />
                </Box>

                <Box className={styles.options}>
                  <FormControlLabel
                    control={<Checkbox className={styles.checkbox} />}
                    label="remember me"
                    className={styles.rememberMe}
                  />
                  <Link href="#" className={styles.forgotPassword}>
                    forgot password?
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          className={styles.snackbar}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="error"
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
