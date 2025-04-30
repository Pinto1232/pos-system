'use client';
import {
  Suspense,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

function SuccessContent() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setOpen(true);
  }, []);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    outline: 'none',
  };

  return (
    <Modal
      open={open}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <IconButton
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: theme.palette.grey[500],
            }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              pt: 2,
            }}
          >
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 64,
                color: theme.palette.success.main,
                mb: 2,
              }}
            />

            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Payment Successful! 🎉
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color:
                  theme.palette.text.secondary,
                mb: 3,
              }}
            >
              Thank you for your purchase. Your
              order has been processed
              successfully.
            </Typography>

            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontSize: 16,
              }}
            >
              Return to Dashboard
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
