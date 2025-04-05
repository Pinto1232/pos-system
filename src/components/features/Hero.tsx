import React from 'react';
import Image from 'next/image';
import { Box, Typography, Button, Link } from '@mui/material';
import styles from './Hero.module.css';

interface HeroProps {
  heading: React.ReactNode;
  subheading: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ladyImage: string;
}

function Hero({ heading, subheading, ctaPrimary, ctaSecondary, ladyImage }: HeroProps) {
  const formattedSubheading = subheading.split('\n\n').map((paragraph, index) => (
    <React.Fragment key={index}>
      {paragraph}
      {index < subheading.split('\n\n').length - 1 && <br />}
      {index < subheading.split('\n\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <Box className={styles.heroContainer__wrapper}>
      <Box className={styles.heroContainer}>
        <Box className={styles.heroTextSection}>
          <Typography sx={{ color: '#000' }} variant="h1">
            {heading}
          </Typography>
          <Typography variant="subtitle1" className={styles.heroSubheading}>
            {formattedSubheading}
          </Typography>

          <Box className={styles.heroButtons}>
            <Button variant="contained" className={styles.heroBtnPrimary}>
              {ctaPrimary}
            </Button>
            <Link href="#" underline="hover" className={styles.heroLinkSecondary}>
              {ctaSecondary} &rarr;
            </Link>
          </Box>
        </Box>

        <Box className={styles.heroImageSection}>
          <Image
            src={ladyImage}
            alt="Smiling lady"
            className={styles.heroLadyImage}
            width={450}
            height={450}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Hero;
