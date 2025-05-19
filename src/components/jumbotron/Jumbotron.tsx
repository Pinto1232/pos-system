'use client';

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import styles from './Jumbotron.module.css';
import { getBlurDataURL } from '@/utils/imageOptimization';

interface JumbotronProps {
  heading: string;
  subheading: string;
  backgroundImage: string;
  overlayColor?: string;
  height?: string;
}

const JumbotronComponent: React.FC<JumbotronProps> = ({
  heading,
  subheading,
  backgroundImage,
  overlayColor = 'rgba(0, 0, 0, 0.6)',
  height = '500px',
}) => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setWindowWidth(window.innerWidth);

    const resizeObserver = new ResizeObserver((entries) => {
      setWindowWidth(window.innerWidth);
    });

    resizeObserver.observe(document.body);
    return () => resizeObserver.disconnect();
  }, []);

  const responsiveHeight = useMemo(() => {
    if (windowWidth === null) return height;

    if (windowWidth <= 480) return '300px';
    if (windowWidth <= 768) return '350px';
    if (windowWidth <= 1024) return '400px';
    return height;
  }, [windowWidth, height]);

  const blurDataURL = useMemo(() => getBlurDataURL(), []);

  return (
    <div
      className={styles.jumbotronContainer}
      style={{ height: responsiveHeight }}
    >
      <div
        className={styles.overlay}
        style={{ backgroundColor: overlayColor }}
      />
      <div className={styles.backgroundImageContainer}>
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          priority={true}
          quality={85}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.subheading}>{subheading}</p>
      </div>
    </div>
  );
};

const Jumbotron = React.memo(JumbotronComponent);

const LazyJumbotron = (props: JumbotronProps) => (
  <Suspense fallback={null}>
    <Jumbotron {...props} />
  </Suspense>
);

export default LazyJumbotron;
