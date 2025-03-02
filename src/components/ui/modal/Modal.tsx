import React, { memo, Suspense, useState } from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  textColor?: string;
  headingSize?: string;
  width?: string;
  height?: string;
  bgColor?: string;
  showCloseIcon?: boolean;
}

const Modal: React.FC<ModalProps> = memo(({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirm",
  textColor = "#000",
  headingSize = "1.5rem",
  width = "500px",
  height = "auto",
  bgColor = "#fff",
  showCloseIcon = true,
}) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { width, height, backgroundColor: bgColor } }}>
      {title && (
        <div className={styles.modalHeader}>
          <Typography variant="h6" style={{ fontSize: headingSize, color: textColor }}>
            {title}
          </Typography>
          {showCloseIcon && (
            <IconButton onClick={onClose} className={styles.closeButton}>
              <CloseIcon />
            </IconButton>
          )}
        </div>
      )}
      <DialogContent style={{ color: textColor }}>{children}</DialogContent>
      <DialogActions>
        {onConfirm && <Button onClick={onConfirm} variant="contained" color="primary">{confirmText}</Button>}
      </DialogActions>
    </Dialog>
  );
});

Modal.displayName = "Modal";

const LazyModal = () => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Modal
        open={open}
        onClose={handleClose}
        title="Sample Title"
      >
        <div>Modal Content</div>
      </Modal>
    </Suspense>
  );
};

export default LazyModal;
