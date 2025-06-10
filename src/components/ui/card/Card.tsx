'use client';

import React, { memo, Suspense } from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = memo(
  ({ children, className, ...props }) => {
    return (
      <div className={`${styles.card} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = memo(
  ({ children, className }) => {
    return (
      <div className={`${styles.cardHeader} ${className}`}>{children}</div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = memo(
  ({ children, className }) => {
    return (
      <div className={`${styles.cardContent} ${className}`}>{children}</div>
    );
  }
);
CardContent.displayName = 'CardContent';

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = memo(
  ({ children, className }) => {
    return (
      <div className={`${styles.cardFooter} ${className}`}>{children}</div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

const LazyCard = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Card>
      <div>Card Content</div>
    </Card>
  </Suspense>
);

export default LazyCard;
