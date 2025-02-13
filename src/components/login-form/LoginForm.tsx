"use client";

import React, { memo } from "react";
import styles from "./LoginForm.module.css";
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    Link,
    Divider,
} from "@mui/material";
import Input from "../ui/input/Input";
import Image from "next/image";
import Button from "@mui/material/Button";

interface LoginFormProps {
    title?: string;
    subtitle?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
    buttonText?: string;
    onSubmit?: (email: string, password: string) => void;
    showSocialLogin?: boolean;
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
                            Continue with Google
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
                            Continue with Facebook
                        </Button>
                    </Box>
                )}

                <Divider textAlign="center" sx={{ mb: 4 }} >
                    <span >or continue with email</span>
                </Divider>

                <form onSubmit={handleLogin}>
                    <Box mb={2}>
                        <Input
                            name="email"
                            label={emailPlaceholder}
                        />
                    </Box>

                    <Box mb={2}>
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
        );
    }
);

LoginForm.displayName = "LoginForm";
export default LoginForm;