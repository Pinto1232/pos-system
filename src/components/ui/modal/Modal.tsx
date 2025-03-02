import React, { memo } from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styles from "./Modal.module.css";

interface SuccessMessageProps {
  open: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = memo(({
  open,
  onClose,
  message,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { width: "600px", height: "200px", backgroundColor: "#f0f0f0" } }}>
      <div className={styles.modalHeader}>
        <Typography variant="h6" style={{ fontSize: "1.75rem", color: "#333" }}>
          Package Save Status
        </Typography>
        <IconButton onClick={onClose} className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent style={{ color: "#333" }}>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} variant="contained" color="primary">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
});

SuccessMessage.displayName = "SuccessMessage";

export default SuccessMessage;
