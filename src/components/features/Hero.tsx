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

          <Box className={styles.heroButtons}>
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
          </Box>
        </Box>

        <Box
          className={styles.heroImageSection}
          sx={{
            order: { xs: 0, md: 1 },
            marginBottom: { xs: '1.5rem', md: 0 },
            width: { xs: '100%', md: 'auto' },
            maxWidth: { xs: '450px', md: 'none' },
            margin: { xs: '0 auto', md: 0 },
          }}
        >
          <Image
            src={ladyImage}
            alt="POS Devices"
            className={styles.heroLadyImage}
            width={450}
            height={450}
            sizes="(max-width: 768px) 90vw, 450px"
            priority
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Hero;
