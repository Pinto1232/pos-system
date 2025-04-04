import { styled } from '@mui/material/styles';
import { Card, Typography, Box } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: '#fff',
  transition: 'all 0.3s ease',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    background: 'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)',
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  },
  width: 370,
  height: 315,
  cursor: 'pointer',

  // Responsive styles
  [theme.breakpoints.down('md')]: {
    width: 300,
    height: 280,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: 'auto',
    padding: theme.spacing(2),
  },
}));

export const CircleNumber = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(-1),
}));

export const SubTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

export const BulletList = styled('ul')({
  margin: 0,
  paddingLeft: 0,
  listStyle: 'none',
  maxHeight: '150px',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c5c5c5',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#a8a8a8',
  },
});

export const DataPoint = styled('li')(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  fontSize: '0.9rem',
  position: 'relative',
  paddingLeft: theme.spacing(1.5),
  '&::before': {
    content: '"•"',
    position: 'absolute',
    left: 0,
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  '& a': {
    textDecoration: 'none',
    color: '#000',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      paddingLeft: '2px',
    },
  },
}));

export const Percentage = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  marginTop: 0,
  top: theme.spacing(2),
  right: theme.spacing(2),
  textAlign: 'right',
  zIndex: 1,
  display: 'flex',
  alignItems: 'baseline',
  '& span:first-of-type': {
    fontSize: '2rem',
  },
  '& span:last-of-type': {
    fontSize: '1rem',
  },
}));

export const ViewDetails = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: '0.9rem',
  fontWeight: 600,
  textAlign: 'right',
  cursor: 'pointer',
  alignItems: 'center',
  justifyItems: 'center',
  textDecoration: 'none',
  color: theme.palette.primary.main,
  transition: 'all 0.2s ease',
  display: 'inline-flex',
  '&:hover': {
    transform: 'translateX(3px)',
  },
}));
