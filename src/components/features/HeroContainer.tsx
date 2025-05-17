'use client';

import React from 'react';
import Hero from './Hero';
import styles from './Hero.module.css';

function HeroContainer() {
  const heading = (
    <>
      <span className={styles.highlightedText}>Change for a more</span>
      <span className={styles.regularText}> Fast, Reliable, and </span>
      <span className={styles.emphasis}>Smart Point of Sale System.</span>
    </>
  );

  const subheading =
    'An all-in-one POS solution designed to streamline sales,  ' +
    'manage inventory, and grow your business with ease.\n\n' +
    '';

  const ctaPrimary = 'Book a Demo';
  const ctaSecondary = 'Learn About Solutions';

  const ladyImage = '/pos.png';

  return (
    <Hero
      heading={heading}
      subheading={subheading}
      ctaPrimary={ctaPrimary}
      ctaSecondary={ctaSecondary}
      ladyImage={ladyImage}
    />
  );
}

export default HeroContainer;
