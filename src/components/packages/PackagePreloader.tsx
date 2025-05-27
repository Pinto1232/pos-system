'use client';

import { useEffect } from 'react';
import { usePackageDataPreloader } from '@/hooks/usePackageDataPreloader';

interface PackagePreloaderProps {
  children: React.ReactNode;
}

const PackagePreloader: React.FC<PackagePreloaderProps> = ({ children }) => {
  const { preloadData } = usePackageDataPreloader();

  useEffect(() => {
    const timer = setTimeout(() => {
      preloadData().catch((error) => {
        console.warn('Failed to preload package data:', error);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [preloadData]);

  return <>{children}</>;
};

export default PackagePreloader;
