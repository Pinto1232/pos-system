'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styles from './JumbotronOptimized.module.css';

interface JumbotronOptimizedProps {
  heading: React.ReactNode;
  subheading: React.ReactNode;
  backgroundImage: string;
  overlayColor?: string;
  priority?: boolean;
  isAboveFold?: boolean;
  preloadSizes?: string;
}

const OPTIMIZED_BLUR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSI2IiBmaWxsPSIjZjBmMGYwIi8+CjwvZXN2Zz4=';

const JumbotronOptimized: React.FC<JumbotronOptimizedProps> = ({
  heading,
  subheading,
  backgroundImage,
  overlayColor = 'rgba(0, 0, 0, 0.6)',
  priority = true,
  isAboveFold = true,
  preloadSizes = '100vw',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (priority && isAboveFold) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = backgroundImage;
      preloadLink.fetchPriority = 'high';
      preloadLink.setAttribute('imagesizes', preloadSizes);
      document.head.appendChild(preloadLink);

      return () => {
        if (document.head.contains(preloadLink)) {
          document.head.removeChild(preloadLink);
        }
      };
    }
  }, [backgroundImage, priority, isAboveFold, preloadSizes]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    console.warn('Jumbotron background image failed to load:', backgroundImage);
  }, [backgroundImage]);

  return (
    <section
      className={styles.jumbotron}
      data-loaded={isLoaded}
      data-error={hasError}
      style={
        {
          '--overlay-color': overlayColor,
        } as React.CSSProperties
      }
    >
      {}
      <div className={styles.imageContainer}>
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority={priority}
          quality={92}
          sizes={preloadSizes}
          placeholder="blur"
          blurDataURL={OPTIMIZED_BLUR}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />
      </div>

      {}
      <div className={styles.overlay} />

      {}
      <div className={styles.content}>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.subheading}>{subheading}</p>
      </div>
    </section>
  );
};

export default React.memo(JumbotronOptimized);
