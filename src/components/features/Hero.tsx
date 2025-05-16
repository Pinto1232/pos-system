'use client';

import React from 'react';
import Image from 'next/image';
import {
  Box,
  Typography,
  Button,
  Link,
} from '@mui/material';
import styles from './Hero.module.css';

interface HeroProps {
  heading: React.ReactNode;
  subheading: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ladyImage: string;
}

function Hero({
  heading,
  subheading,
  ctaPrimary,
  ctaSecondary,
  ladyImage,
}: HeroProps) {
  const formattedSubheading = subheading
    .split('\n\n')
    .map((paragraph, index) => (
      <React.Fragment key={index}>
        {paragraph}
        {index <
          subheading.split('\n\n').length - 1 && (
          <br />
        )}
        {index <
          subheading.split('\n\n').length - 1 && (
          <br />
        )}
      </React.Fragment>
    ));

  return (
    <Box
      className={styles.heroContainer__wrapper}
      sx={{
        padding: { xs: '5px', sm: '10px' },
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'rgba(0, 204, 255, 0.8)',
          boxShadow:
            '0 0 10px rgba(0, 204, 255, 0.5)',
          zIndex: 1,
          animation: 'pulse 4s infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: 'rgba(255, 105, 180, 0.8)',
          boxShadow:
            '0 0 10px rgba(255, 105, 180, 0.5)',
          zIndex: 1,
          animation: 'pulse 3s infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'rgba(147, 51, 234, 0.8)',
          boxShadow:
            '0 0 10px rgba(147, 51, 234, 0.5)',
          zIndex: 1,
          animation: 'pulse 5s infinite',
        }}
      />
      <Box className={styles.colorfulCircle} />

      <Box
        className={styles.heroContainer}
        sx={{
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          padding: {
            xs: '1.5rem 0.75rem',
            sm: '2rem 1rem',
            md: '3rem 1rem',
          },
          gap: {
            xs: '1rem',
            sm: '1.5rem',
            md: '2rem',
          },
        }}
      >
        <Box
          className={styles.heroTextSection}
          sx={{
            order: { xs: 1, md: 0 },
            maxWidth: { xs: '100%', md: '600px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: {
              xs: 'center',
              md: 'flex-start',
            },
          }}
        >
          <Typography
            sx={{
              color: '#000',
              fontSize: {
                xs: '1.5rem',
                sm: '1.75rem',
                md: '2rem',
              },
              textAlign: {
                xs: 'center',
                md: 'left',
              },
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
            variant="h1"
          >
            {heading}
          </Typography>
          <Typography
            variant="subtitle1"
            className={styles.heroSubheading}
            sx={{
              fontSize: {
                xs: '0.875rem',
                sm: '1rem',
                md: '1.125rem',
              },
              textAlign: {
                xs: 'center',
                md: 'left',
              },
              maxWidth: {
                xs: '100%',
                md: '600px',
              },
            }}
          >
            {formattedSubheading}
          </Typography>

          <Box
            className={styles.heroButtons}
            sx={{ position: 'relative' }}
          >
            <Button
              variant="contained"
              className={styles.heroBtnPrimary}
              sx={{
                fontSize: {
                  xs: '0.875rem',
                  sm: '1rem',
                },
                padding: {
                  xs: '0.6rem 1.4rem',
                  sm: '0.8rem 1.8rem',
                },
              }}
            >
              {ctaPrimary}
            </Button>
            <Link
              href="#"
              underline="hover"
              className={styles.heroLinkSecondary}
              sx={{
                fontSize: {
                  xs: '0.875rem',
                  sm: '1rem',
                },
                marginLeft: {
                  xs: '0',
                  sm: '20px',
                },
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {ctaSecondary} &rarr;
            </Link>

            {/* Decorative dot below the button - visible only on laptop screens */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '-30px',
                left: '25%',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background:
                  'rgba(255, 165, 0, 0.8)',
                boxShadow:
                  '0 0 10px rgba(255, 165, 0, 0.5)',
                zIndex: 1,
                animation: 'pulse 4s infinite',
                display: {
                  xs: 'none',
                  sm: 'none',
                  md: 'block',
                  lg: 'none',
                  xl: 'none',
                },
              }}
            />
          </Box>
        </Box>

        <Box
          className={styles.heroImageSection}
          sx={{
            order: { xs: 0, md: 1 },
            marginBottom: { xs: '1.5rem', md: 0 },
            width: { xs: '100%', md: '50%' },
            maxWidth: {
              xs: '800px',
              md: '600px',
            },
            margin: { xs: '0 auto', md: 0 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src={ladyImage}
            alt="POS Devices"
            className={styles.heroLadyImage}
            width={600}
            height={600}
            sizes="(max-width: 480px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 500px, 600px"
            style={{
              objectFit: 'contain',
              width: '100%',
              height: 'auto',
              maxHeight: '600px',
            }}
            priority
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Hero;
