"use client";

import React, { memo } from "react";
import { Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from "@mui/icons-material/Done";
import styles from "./SuccessMessage.module.css";

interface SuccessMessageProps {
    open: boolean;
    onClose: () => void;
    message?: string;
    onConfirm: () => void;
    onReturn: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = memo(
    ({ open, onClose, message, onConfirm, onReturn }) => {
        if (!open) return null;

        return (
            <div className={styles.successMessageOverlay}>
                {/* Modal Container */}
                <div className={styles.successMessageContainer}>
                    {/* Close Icon (Top-Right) */}
                    <IconButton className={styles.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>

                    {/* Green Circular Icon */}
                    <div className={styles.successIconContainer}>
                        <CheckCircleIcon className={styles.successIcon} />
                    </div>

                    {/* "Success" Heading */}
                    <Typography variant="h5" className={styles.successTitle}>
                        Success
                    </Typography>

                    {/* Message Text */}
                    <Typography className={styles.successText}>
                        {message ||
                            "Your action was successful. Please proceed or contact support if you have any questions."}
                    </Typography>

                    {/* Confirm Button */}
                    <div className={styles.successMessageActions}>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: "#1e3a8a" }}
                            onClick={onReturn}
                            startIcon={<ArrowBackIcon />}
                        >
                            Return
                        </Button>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: "#1e3a8a" }}
                            onClick={onConfirm}
                            startIcon={<DoneIcon />}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
);

SuccessMessage.displayName = "SuccessMessage";

export default SuccessMessage;
