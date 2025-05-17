import { Button, Typography, Container, Box, keyframes } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function NotFound() {
  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: 'center',
        py: 8,
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          mb: 4,
          animation: `${floatAnimation} 3s ease-in-out infinite`,
          '& img': {
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
          },
        }}
      >
        <Image src="/404_icons.png" alt="Not Found" width={300} height={300} style={{ margin: '0 auto' }} />
      </Box>
      <Box
        sx={{
          animation: `${fadeIn} 0.8s ease-out`,
          maxWidth: '600px',
          mx: 'auto',
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
            fontSize: {
              xs: '2.5rem',
              md: '3.5rem',
            },
          }}
        >
          404 - Page Not Found
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: 'text.secondary',
            lineHeight: 1.6,
          }}
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/dashboard"
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: '12px',
            textTransform: 'none',
            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0,118,255,0.23)',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease',
            },
          }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
