'use client';

import React, {
  memo,
  Suspense,
  useEffect,
  useRef,
} from 'react';
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
import { useCustomization } from '@/contexts/CustomizationContext';
import eventBus, {
  UI_EVENTS,
} from '@/utils/eventBus';

const Footer: React.FC = memo(() => {
  const { navbarColor } = useCustomization();

  const footerBoxRef =
    useRef<HTMLDivElement>(null);
  const footerElementRef =
    useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleCustomizationUpdate = (data: {
      navbarColor?: string;
    }) => {
      if (
        footerBoxRef.current &&
        data.navbarColor
      ) {
        footerBoxRef.current.style.backgroundColor =
          data.navbarColor;
      }

      if (
        footerElementRef.current &&
        data.navbarColor
      ) {
        footerElementRef.current.style.backgroundColor =
          data.navbarColor;
      }
    };

    eventBus.on(
      UI_EVENTS.CUSTOMIZATION_UPDATED,
      handleCustomizationUpdate
    );

    handleCustomizationUpdate({ navbarColor });

    return () => {
      eventBus.off(
        UI_EVENTS.CUSTOMIZATION_UPDATED,
        handleCustomizationUpdate
      );
    };
  }, [navbarColor]);

  useEffect(() => {
    if (footerBoxRef.current) {
      footerBoxRef.current.style.backgroundColor =
        navbarColor;
    }
    if (footerElementRef.current) {
      footerElementRef.current.style.backgroundColor =
        navbarColor;
    }
  }, [navbarColor]);

  return (
    <Box
      ref={footerBoxRef}
      sx={{
        backgroundColor: navbarColor,
        display: 'block',
        width: '100%',
        margin: 0,
        padding: 0,
        transition: 'background-color 0.3s ease',
      }}
    >
      <footer
        ref={footerElementRef}
        className={styles.footer}
        style={{
          backgroundColor: navbarColor,
          transition:
            'background-color 0.3s ease',
        }}
      >
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
              <Button
                className={styles.sendButton}
              >
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
                Lovasa Avenue, Cape Town,
              </Typography>
              <Typography className={styles.text}>
                90251, US
              </Typography>
            </Box>

            <Box
              className={styles.socialContainer}
            >
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
    </Box>
  );
});

Footer.displayName = 'Footer';

const LazyFooter = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Footer />
  </Suspense>
);

export default LazyFooter;
