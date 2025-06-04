'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Typography, Button, Link } from '@mui/material';
import styles from './Hero.module.css';

interface HeroProps {
  heading: React.ReactNode;
  subheading: React.ReactNode;
  ctaPrimary: React.ReactNode;
  ctaSecondary: React.ReactNode;
  ladyImage: string;
}

function Hero({
  heading,
  subheading,
  ctaPrimary,
  ctaSecondary,
  ladyImage,
}: HeroProps) {
  const formattedSubheading = React.isValidElement(subheading)
    ? subheading
    : String(subheading)
        .split('\n\n')
        .map((paragraph, index) => (
          <React.Fragment key={index}>
            {paragraph}
            {index < String(subheading).split('\n\n').length - 1 && <br />}
            {index < String(subheading).split('\n\n').length - 1 && <br />}
          </React.Fragment>
        ));

  return (
    <Box
      className={styles.heroContainer__wrapper}
      sx={{
        padding: { xs: '5px', sm: '10px' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'rgba(0, 204, 255, 0.8)',
          boxShadow: '0 0 10px rgba(0, 204, 255, 0.5)',
          zIndex: 1,
          animation: 'pulse 4s infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'rgba(147, 51, 234, 0.8)',
          boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
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
            variant="h1"
            component="h1"
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
          >
            {heading}
          </Typography>

          <Typography className={styles.heroSubheading}>
            {formattedSubheading}
          </Typography>

          <Box className={styles.heroButtons}>
            <Button
              variant="contained"
              className={styles.heroBtnPrimary}
              sx={{
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#2563eb !important',
                },
              }}
            >
              {ctaPrimary}
            </Button>
            <Link
              href="#solutions"
              underline="none"
              className={styles.heroLinkSecondary}
              sx={{
                '&:hover': {
                  color: '#2563eb !important',
                },
              }}
            >
              {ctaSecondary}
            </Link>
          </Box>
        </Box>

        <Box
          className={styles.heroImageSection}
          sx={{
            order: { xs: 0, md: 1 },
          }}
        >
          <Image
            src={ladyImage}
            alt="POS System"
            width={500}
            height={500}
            className={styles.heroLadyImage}
            priority
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Hero;
