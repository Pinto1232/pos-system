import { styled } from '@mui/material/styles';
import { Card, Typography, Box } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  backgroundColor: '#fff',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(230, 232, 240, 0.8)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(210, 215, 235, 1)',
  },
  width: '100%',
  height: 'auto',
  minHeight: 320,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  justifyContent: 'space-between',

  [theme.breakpoints.down('md')]: {
    minHeight: 300,
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: 280,
    padding: theme.spacing(2),
  },
}));

export const CircleNumber = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: '50%',
  backgroundColor: '#6366f1',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
  border: '2px solid rgba(255, 255, 255, 0.8)',
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  marginTop: theme.spacing(1),
  color: '#1e293b',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: 0,
    width: '40px',
    height: '3px',
    borderRadius: '2px',
    background: 'linear-gradient(90deg, #6366f1, #a5b4fc)',
  },
}));

export const SubTitle = styled(Typography)(({ theme }) => ({
  color: '#64748b',
  marginBottom: theme.spacing(2),
  fontSize: '0.9rem',
}));

export const BulletList = styled('ul')({
  margin: 0,
  paddingLeft: 0,
  listStyle: 'none',
  maxHeight: '80px',
  overflow: 'auto',
  marginTop: '8px',
  marginBottom: '8px',
  width: '100%',
  '&::-webkit-scrollbar': {
    width: '3px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f8fafc',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#e2e8f0',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#cbd5e1',
  },
});

export const DataPoint = styled('li')(({ theme }) => ({
  marginBottom: '6px',
  fontSize: '0.85rem',
  position: 'relative',
  paddingLeft: theme.spacing(1.5),
  color: '#475569',
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
  '&::before': {
    content: '"•"',
    position: 'absolute',
    left: 0,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  '& a': {
    textDecoration: 'none',
    color: '#475569',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#4338ca',
    },
  },
}));

export const Percentage = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: '1.5rem',
  marginTop: 0,
  textAlign: 'right',
  zIndex: 1,
  display: 'flex',
  alignItems: 'baseline',
  color: '#64748b',
  '& span:first-of-type': {
    fontSize: '2.25rem',
    fontWeight: 700,
    color: '#1e293b',
    marginRight: '4px',
  },
  '& span:last-of-type': {
    fontSize: '1.25rem',
    fontWeight: 500,
    color: '#64748b',
  },
}));

export const ViewDetails = styled(Typography)(() => ({
  marginTop: 0,
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  alignItems: 'center',
  textDecoration: 'none',
  color: '#4f46e5',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  display: 'inline-flex',
  padding: '6px 12px',
  borderRadius: '20px',
  backgroundColor: 'rgba(79, 70, 229, 0.08)',
  border: '1px solid rgba(79, 70, 229, 0.2)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  '&:hover': {
    color: '#4338ca',
    transform: 'translateX(3px)',
    backgroundColor: 'rgba(79, 70, 229, 0.12)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(79, 70, 229, 0.3)',
  },
  '&::after': {
    content: '"→"',
    marginLeft: '6px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    fontSize: '1.1rem',
  },
  '&:hover::after': {
    marginLeft: '10px',
    transform: 'translateX(2px)',
  },
}));
