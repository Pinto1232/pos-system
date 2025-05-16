'use client';
import {
  Suspense,
  useState,
  useEffect,
  useRef,
  useContext,
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
import { useRouter } from 'next/navigation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useSpinner } from '@/contexts/SpinnerContext';
import { AuthContext } from '@/contexts/AuthContext';

function SuccessContent({
  onConfirm,
}: {
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const router = useRouter();
  const { clearCart } = useCart();
  const { setLoading } = useSpinner();
  const hasCleared = useRef(false);
  const { authenticated, token, isInitialized } =
    useContext(AuthContext);

  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

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

  const handleClose = () => {
    setOpen(false);
  };

  const handleReturnToDashboard = async (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    onConfirm();
    handleClose();
    setLoading(true);
    sessionStorage.setItem(
      'fromPaymentSuccess',
      'true'
    );
    if (!isInitialized) return;
    if (!authenticated || !token) {
      router.replace(
        '/?error=Session expired, please login again'
      );
      return;
    }
    let payload = null;
    let roles = [];
    try {
      payload = JSON.parse(
        atob(token.split('.')[1])
      );
      roles =
        payload?.realm_access?.roles ||
        payload?.roles ||
        [];
    } catch {
      router.replace(
        '/?error=Session invalid, please login again'
      );
      return;
    }
    // TEMPORARILY DISABLED: Role check is bypassed for development
    console.log(
      '⚠️ WARNING: Role check is temporarily disabled for development'
    );
    console.log(
      '⚠️ This should be re-enabled before deploying to production'
    );

    // Original role check code (commented out)
    /*
    if (
      !roles.includes('dashboard') &&
      !roles.includes('admin')
    ) {
      router.replace(
        '/?error=You do not have permission to access the dashboard'
      );
      return;
    }
    */
    setTimeout(() => {
      router.push('/dashboard');
    }, 100);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
            onClick={handleClose}
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
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                duration: 0.6,
              }}
              whileHover={{
                scale: 1.1,
                rotate: [0, 10, -10, 10, -10, 0],
                transition: { duration: 0.5 },
              }}
            >
              <CheckCircleOutlineIcon
                sx={{
                  fontSize: 64,
                  color:
                    theme.palette.success.main,
                  mb: 2,
                }}
              />
            </motion.div>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#000',
              }}
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
              onClick={handleReturnToDashboard}
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
  const handleConfirm = () => {
    console.log('Confirmed!');
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent onConfirm={handleConfirm} />
    </Suspense>
  );
}
