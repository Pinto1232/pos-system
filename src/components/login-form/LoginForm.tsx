"use client";

import React, { memo, Suspense } from "react";
import styles from "./LoginForm.module.css";
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    Link,
    Divider,
    IconButton,
} from "@mui/material";
import Input from "../ui/input/Input";
import Image from "next/image";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

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
        emailPlaceholder = "Email",
        passwordPlaceholder = "Password",
        buttonText = "Login",
        onSubmit,
        showSocialLogin = true,
        onClose, 
    }) => {
        const handleLogin = (event: React.FormEvent) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
            const password = (form.elements.namedItem('password') as HTMLInputElement).value;
            if (onSubmit) {
                onSubmit(email, password);
            }
        };

        return (
            <Box className={styles.formContainer}>
                <Box>
                {onClose && (
                    <IconButton className={styles.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                )}
                <Box className={styles.logoContainer}>
               
                    <Image
                        src="/logo.png"
                        alt=""
                        width={40}
                        height={40}
                        className={styles.logoImage}
                    />
                    <Typography variant="h5" className={styles.logoText}>
                        Pisval Tech POS
                    </Typography>
                </Box>

                <Typography variant="h4" className={styles.heading}>
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
                                    src="/google-icon.svg"
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
                                    src="/facebook-icon.svg"
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
                    <span >or continue with email</span>
                </Divider>

                <form onSubmit={handleLogin}>
                    <Box mb={1}>
                        <Input
                            name="email"
                            label={emailPlaceholder}
                        />
                    </Box>

                    <Box mb={1}>
                        <Input
                            name="password"
                            label={passwordPlaceholder}
                            type="password"
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