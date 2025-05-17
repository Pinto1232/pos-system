'use client';

import React, { Suspense, useEffect, useState } from 'react';
import styles from './Jumbotron.module.css';

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
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getResponsiveHeight = () => {
    if (windowWidth === null) return height;

    if (windowWidth <= 480) return '300px';
    if (windowWidth <= 768) return '350px';
    if (windowWidth <= 1024) return '400px';
    return height;
  };

  return (
    <div
      className={styles.jumbotronContainer}
      style={{ height: getResponsiveHeight() }}
    >
      <div
        className={styles.overlay}
        style={{ backgroundColor: overlayColor }}
      />
      <div
        className={styles.backgroundImage}
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      <div className={styles.content}>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.subheading}>{subheading}</p>
      </div>
    </div>
  );
};
const Jumbotron = React.memo(JumbotronComponent);

const LazyJumbotron = (props: JumbotronProps) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Jumbotron {...props} />
  </Suspense>
);

export default LazyJumbotron;
