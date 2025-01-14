import { styled } from '@mui/material/styles';
import { Box, Button, TextField } from '@mui/material';

export const LoginContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F4F6F8',
});

export const LoginWrapper = styled(Box)({
  display: 'flex',
  width: '800px',
  backgroundColor: 'white',
  boxShadow: '0px 4px 16px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  overflow: 'hidden',
});

export const LeftSection = styled(Box)({
  backgroundColor: '#1E3A8A',
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  color: 'white',
});

export const LogoWrapper = styled(Box)({
  width: '120px',
  height: '120px',
  backgroundColor: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
});

export const RightSection = styled(Box)({
  flex: '1.5',
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

export const StyledTextField = styled(TextField)({
  marginTop: '10px',
});

export const StyledLoginButton = styled(Button)({
  backgroundColor: '#1E3A8A',
  color: 'white',
  fontWeight: 'bold',
  padding: '10px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#173570',
  },
});

export const TopLinks = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '20px',
  gap: '15px',
});
