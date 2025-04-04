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
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  height = '500px',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => setImageLoaded(true);
  }, [backgroundImage]);

  return (
    <div
      className={styles.jumbotronContainer}
      style={{
        backgroundImage: imageLoaded
          ? `
          ${overlayColor},
          url(${backgroundImage})
        `
          : overlayColor,
        height: height,
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
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
