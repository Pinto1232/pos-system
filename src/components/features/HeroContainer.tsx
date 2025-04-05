import React from 'react';
import Hero from './Hero';
import styles from './Hero.module.css';

function HeroContainer() {
  const heading = (
    <>
      <span className={styles.highlightedText}>Transform</span> Your Merchant&apos;s POS Device
      <span className={styles.emphasis}>
        Into a Dynamic Business Management Tool
      </span>
    </>
  );

  const subheading =
    'Pisval Tech POS is a powerful omni-channel business tool that enables ' +
    'banks to deliver unmatched value to their MSME customers.\n\n' +
    'By seamlessly integrating payments with business operations, we simplify ' +
    'processes and drive growth, empowering businesses to thrive.';

  const ctaPrimary = 'Book a Demo';
  const ctaSecondary = 'Learn About Bank Solutions';

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
