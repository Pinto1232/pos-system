'use client';

import React, { memo, Suspense } from 'react';
import styles from './Footer.module.css';
import {
  Container,
  Typography,
  Box,
  Link,
  TextField,
} from '@mui/material';
import SocialIcons from '@/components/ui/socialIcons/SocialIcons';
import { Button } from '../ui/button/Button';

const Footer: React.FC = memo(() => {
  return (
    <footer className={styles.footer}>
      <Container maxWidth="lg">
        <Box className={styles.subscription}>
          <Typography
            variant="h5"
            className={styles.heading}
          >
            SUBSCRIBE NOW
            <br />
            FOR UPDATES AND EXCLUSIVE OFFERS!
          </Typography>
          <Box className={styles.inputBox}>
            <TextField
              variant="outlined"
              placeholder="Enter your email"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  borderRadius: '4px',
                  height: '48px',
                  boxShadow:
                    '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow:
                      '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow:
                      '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#000000',
                  padding: '14px 20px',
                  fontSize: '16px',
                },
                '& .MuiOutlinedInput-notchedOutline':
                  {
                    border: 'none',
                  },
              }}
            />
            <Button className={styles.sendButton}>
              SUBSCRIBE
            </Button>
          </Box>
        </Box>

        <Box className={styles.divider} />

        <Box className={styles.footerContent}>
          <Box>
            <Typography
              variant="h6"
              className={styles.sectionTitle}
            >
              Company
            </Typography>
            <ul className={styles.list}>
              <li>
                <Link
                  href="#"
                  className={styles.link}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={styles.link}
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={styles.link}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={styles.link}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </Box>

          <Box>
            <Typography
              variant="h6"
              className={styles.sectionTitle}
            >
              Contact
            </Typography>
            <Typography className={styles.text}>
              Tel: +1 5263 2540 981
            </Typography>
            <Typography className={styles.text}>
              Tel: +1 5263 5720 450
            </Typography>
            <Typography className={styles.text}>
              Email: info@info.com
            </Typography>
            <Typography className={styles.text}>
              Email: career@career.com
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h6"
              className={styles.sectionTitle}
            >
              Cape Town Office
            </Typography>
            <Typography className={styles.text}>
              361 Avisco Green St,
            </Typography>
            <Typography className={styles.text}>
              Lovasa Avenue, Los Angeles
            </Typography>
            <Typography className={styles.text}>
              90251, US
            </Typography>
          </Box>

          <Box className={styles.socialContainer}>
            <Typography
              variant="h6"
              className={styles.sectionTitle}
            >
              Follow Us On
            </Typography>
            <SocialIcons />
          </Box>
        </Box>

        <Box
          className={styles.copyrightContainer}
        >
          <Link
            href="#"
            className={styles.privacy}
          >
            Privacy Policy
          </Link>
          <Typography
            variant="body2"
            className={styles.copyright}
          >
            © {new Date().getFullYear()} Pisval
            Tech. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
});

Footer.displayName = 'Footer';

const LazyFooter = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Footer />
  </Suspense>
);

export default LazyFooter;
