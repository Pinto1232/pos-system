import React from 'react';
import Hero from './Hero';
import styles from './Hero.module.css';

function HeroContainer() {
  const heading = (
    <>
      <span className={styles.highlightedText}>Transform</span> Your Merchant&apos;s POS Device Into
      a Dynamic Business Management Tool.
    </>
  );

  const subheading = `Pisval Tech POS is a powerful omni-channel business tool that enables banks 
  to deliver unmatched value to their MSME customers. By seamlessly integrating payments with 
  business operations, littlefish simplifies processes and drives growth, empowering businesses to thrive.`;

  const ctaPrimary = 'Book a demo';
  const ctaSecondary = 'Learn about bank solutions';

  const ladyImage = '/pos_3.png';

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
