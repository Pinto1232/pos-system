import React from 'react';
import { Typography, Link } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import {
  LoginContainer,
  LoginWrapper,
  LeftSection,
  LogoWrapper,
  RightSection,
  StyledTextField,
  StyledLoginButton,
  TopLinks,
} from './login.style';

const LoginPage = () => {
  return (
    <LoginContainer>
      <LoginWrapper>
        {/* Left Section */}
        <LeftSection>
          <LogoWrapper>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
              POS
            </Typography>
          </LogoWrapper>
          <Typography variant="body2">Powered by Pisval Tech</Typography>
        </LeftSection>

        {/* Right Section */}
        <RightSection>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '20px',
              color: '#1E3A8A',
            }}
          >
            LOGIN TO CONTINUE
          </Typography>

          {/* Username */}
          <div>
            <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <PersonIcon sx={{ marginRight: '10px', color: '#1E3A8A' }} /> Username
            </Typography>
            <StyledTextField variant="outlined" fullWidth placeholder="Username" />
          </div>

          {/* Password */}
          <div style={{ marginTop: '20px' }}>
            <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <LockIcon sx={{ marginRight: '10px', color: '#1E3A8A' }} /> Password/PIN
            </Typography>
            <StyledTextField variant="outlined" fullWidth type="password" placeholder="Password/PIN" />
          </div>

          {/* Help Link */}
          <Typography
            variant="body2"
            sx={{ textAlign: 'right', marginTop: '10px', marginBottom: '20px', color: '#1E3A8A' }}
          >
            Need help? Contact Administrator
          </Typography>

          {/* Login Button */}
          <StyledLoginButton fullWidth>Login</StyledLoginButton>

          {/* Top Links */}
          <TopLinks>
            <Link href="#" underline="hover" sx={{ color: '#1E3A8A' }}>
              Employee
            </Link>
            <Link href="#" underline="hover" sx={{ color: '#1E3A8A' }}>
              Admin
            </Link>
          </TopLinks>
        </RightSection>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default LoginPage;
