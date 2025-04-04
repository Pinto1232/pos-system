import { styled } from '@mui/material/styles';
import { Card, Box, Typography, Button } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: 12,
  padding: theme.spacing(2),
  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
  height: '100%',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 12px 25px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-3px)',
  },
}));

export const TopLeftBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
  borderRadius: 8,
  padding: theme.spacing(0.5, 1),
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#fff',
  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
  zIndex: 2,
}));

export const TopRightIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#fff',
  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
  zIndex: 2,
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  fontWeight: 700,
  fontSize: '1rem',
  letterSpacing: '-0.01em',
  color: '#1F2937',
}));

export const CardSubTitle = styled(Typography)(({ theme }) => ({
  color: '#6B7280',
  fontSize: '0.8rem',
  marginBottom: theme.spacing(1.5),
  fontWeight: 500,
}));

export const BottomRightImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  right: theme.spacing(1),
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: 16,
  border: '2px solid #fff',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05) rotate(5deg)',
  },
}));

export const PriceText = styled(Typography)(() => ({
  fontWeight: 800,
  fontSize: '1.2rem',
  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

export const CardButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 600,
  position: 'absolute',
  bottom: 16,
  right: 16,
  zIndex: 999,
  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
  color: '#fff',
  borderRadius: 8,
  padding: theme.spacing(0.75, 2),
  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #4338CA, #6D28D9)',
    boxShadow: '0 6px 15px rgba(79, 70, 229, 0.4)',
    transform: 'translateY(-2px)',
  },
}));

export const InfoLines = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const BankCardContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(105deg, #000, #3B82F6)',
  color: '#fff',
  borderRadius: 16,
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  minHeight: 160,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '300px',
  boxShadow: '0 10px 20px rgba(30, 58, 138, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(30, 58, 138, 0.4)',
  },
}));

export const BankCardRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(1.5),
  alignItems: 'start',
  '& > *': {
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  },
}));

export const BankCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: theme.spacing(1),
  '& > *': {
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  },
}));

export const BankCardNumber = styled(Typography)(({ theme }) => ({
  letterSpacing: '2px',
  fontWeight: 700,
  fontSize: '1.2rem',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
}));

export const StatusIndicator = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '0.8rem',
  height: '0.8rem',
  marginLeft: theme.spacing(1),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '0.4rem',
    height: '0.4rem',
    borderRadius: '50%',
    zIndex: 1,
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '50%': {
      transform: 'scale(1.5)',
      opacity: 0.5,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
}));
