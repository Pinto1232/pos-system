"use client";

import React, { memo, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    Link,
    Divider,
    IconButton,
    TextField,
    Snackbar,
    Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { Button } from "../ui/button/Button";
import axios from 'axios';

interface LoginFormProps {
    title?: string;
    subtitle?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
    buttonText?: string;
    onSubmit?: (email: string, password: string) => void;
    showSocialLogin?: boolean;
    onClose?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = memo(
    ({
        title = "Login in your Account",
        subtitle = "",
        buttonText = "Login",
        onSubmit,
        showSocialLogin = true,
        onClose,
    }) => {
        const router = useRouter();
        const [error, setError] = useState<string | null>(null);
        const [isFadingOut, setIsFadingOut] = useState(false);
        const [snackbarOpen, setSnackbarOpen] = useState(false);

        const handleLogin = async (event: React.FormEvent) => {
            event.preventDefault();
            setIsFadingOut(true); // Start fade-out effect immediately
            const form = event.target as HTMLFormElement;
            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
            const password = (form.elements.namedItem('password') as HTMLInputElement).value;
            if (onSubmit) {
                onSubmit(email, password);
            }

            try {
                const response = await axios.post('http://localhost:5107/api/auth/login', { email, password });
                const { access_token } = response.data;
                localStorage.setItem('accessToken', access_token);
                console.log('Login successful:', response.data);
                setTimeout(() => {
                    router.push('/dashboard'); 
                }, 700); 
            } catch (error) {
                console.error('Login failed:', error);
                setError('Login failed. Please check your credentials and try again.');
                setSnackbarOpen(true);
                setIsFadingOut(false);
            }
        };

        return (
            <>
                <Box className={`${styles.LoginContainer} ${isFadingOut ? styles.fadeOut : ''}`}>
                    <Box className={styles.formBox}>
                        {onClose && (
                            <IconButton className={styles.closeButton} onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        )}
                        <Box className={styles.logoContainer}>
                            <Typography variant="h5" className={styles.logoText}>
                                Pisval Tech POS
                            </Typography>
                        </Box>

                        <Typography variant="h6" className={styles.heading}>
                            {title}
                        </Typography>
                        <Typography variant="body1" className={styles.subtext}>
                            {subtitle}
                        </Typography>

                        {showSocialLogin && (
                            <Box className={styles.socialButtons}>
                                <Button
                                    className={styles.googleButton}
                                    startIcon={
                                        <Image
                                            src="/google.png"
                                            alt=""
                                            width={20}
                                            height={20}
                                        />
                                    }
                                >
                                    Google
                                </Button>
                                <Button
                                    className={styles.facebookButton}
                                    startIcon={
                                        <Image
                                            src="/facebook.png"
                                            alt=""
                                            width={20}
                                            height={20}
                                        />
                                    }
                                >
                                    Facebook
                                </Button>
                            </Box>
                        )}

                        <Divider textAlign="center" sx={{ mb: 4 }} >
                            <span>or continue with email</span>
                        </Divider>

                        <form onSubmit={handleLogin} style={{ marginTop: '-30px' }}>
                            <Box mb={1}>
                                <TextField
                                    id="standard-email"
                                    name="email"
                                    label="email"
                                    variant="standard"
                                    fullWidth
                                />
                            </Box>

                            <Box mb={1}>
                                <TextField
                                    id="standard-password"
                                    name="password"
                                    label="password"
                                    variant="standard"
                                    fullWidth
                                />
                            </Box>

                            <Box className={styles.options}>
                                <FormControlLabel
                                    control={<Checkbox className={styles.checkbox} />}
                                    label="Remember me"
                                    className={styles.rememberMe}
                                />
                                <Link href="#" className={styles.forgotPassword}>
                                    Forgot Password?
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
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    sx={{ width: '466px', bottom: '20px' }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </>
        );
    }
);

LoginForm.displayName = "LoginForm";

const LazyLoginForm = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
    </Suspense>
);

export default LazyLoginForm;