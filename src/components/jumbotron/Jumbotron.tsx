'use client';

import React, {
  Suspense,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import Image from 'next/image';
import styles from './Jumbotron.module.css';

interface JumbotronProps {
  heading: React.ReactNode;
  subheading: React.ReactNode;
  backgroundImage: string;
  overlayColor?: string;
  height?: string;
  priority?: boolean;
  isAboveFold?: boolean;
}

const STATIC_BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz4KPC9zdmc+';

const JumbotronSkeleton: React.FC<Pick<JumbotronProps, 'height'>> = ({
  height = '500px',
}) => (
  <div
    className={styles.jumbotronContainer}
    style={{
      height,
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div className={styles.content}>
      <div
        style={{
          width: '60%',
          height: '3.5rem',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          marginBottom: '1.5rem',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
      <div
        style={{
          width: '40%',
          height: '1.5rem',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          margin: '0 auto',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
    </div>
  </div>
);

const JumbotronComponent: React.FC<JumbotronProps> = ({
  heading,
  subheading,
  backgroundImage,
  overlayColor = 'rgba(0, 0, 0, 0.6)',
  height = '500px',
  priority = true,
  isAboveFold = true,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024;
  });

  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', throttledResize, { passive: true });
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  const responsiveHeight = useMemo(() => {
    if (windowWidth <= 480) return '300px';
    if (windowWidth <= 768) return '350px';
    if (windowWidth <= 1024) return '400px';
    return height;
  }, [windowWidth, height]);

  useEffect(() => {
    if (priority && isAboveFold) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = backgroundImage;
      link.fetchPriority = 'high';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [backgroundImage, priority, isAboveFold]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    console.warn('Failed to load jumbotron background image:', backgroundImage);
  }, [backgroundImage]);

  return (
    <div
      className={styles.jumbotronContainer}
      style={{
        height: responsiveHeight,

        backgroundColor: isImageLoaded ? 'transparent' : '#f0f0f0',
      }}
    >
      <div
        className={styles.overlay}
        style={{
          backgroundColor: overlayColor,
          opacity: isImageLoaded ? 1 : 0.3,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      <div className={styles.backgroundImageContainer}>
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          priority={priority}
          quality={90}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={STATIC_BLUR_DATA_URL}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'opacity 0.3s ease-in-out',
            opacity: isImageLoaded ? 1 : 0,
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

const EagerJumbotron = (props: JumbotronProps) => {
  if (props.isAboveFold) {
    return <Jumbotron {...props} />;
  }

  return (
    <Suspense fallback={<JumbotronSkeleton height={props.height} />}>
      <Jumbotron {...props} />
    </Suspense>
  );
};

export default EagerJumbotron;
