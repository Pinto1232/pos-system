'use client';

import React, { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { TranslatedText } from '@/i18n';
import styles from './FeaturesSlider.module.css';

const HiOutlineCreditCard = dynamic(
  () => import('react-icons/hi2').then((mod) => mod.HiOutlineCreditCard),
  { ssr: false, loading: () => <div style={{ width: 50, height: 50 }} /> }
);

const HiOutlineChartBar = dynamic(
  () => import('react-icons/hi2').then((mod) => mod.HiOutlineChartBar),
  { ssr: false, loading: () => <div style={{ width: 50, height: 50 }} /> }
);

const HiOutlineSquares2X2 = dynamic(
  () => import('react-icons/hi2').then((mod) => mod.HiOutlineSquares2X2),
  { ssr: false, loading: () => <div style={{ width: 50, height: 50 }} /> }
);

interface FeatureItemProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  link: string;
}

const FeatureItem = memo(
  ({ icon, title, description, link }: FeatureItemProps) => {
    return (
      <div className={styles.slideItem}>
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>{icon}</div>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Link href={link} className={styles.learnMore}>
          <TranslatedText
            i18nKey="common.learnMore"
            defaultValue="Learn more"
          />
        </Link>
      </div>
    );
  }
);

FeatureItem.displayName = 'FeatureItem';

function FeaturesGrid() {
  const featuresData = useMemo(
    () => [
      {
        icon: <HiOutlineCreditCard size={50} />,
        title: (
          <TranslatedText
            i18nKey="salesManagement.title"
            defaultValue="Sales Management"
          />
        ),
        description: (
          <TranslatedText
            i18nKey="salesManagement.description"
            defaultValue="Streamline your transactions with an intuitive POS interface. Process sales, returns, and payments quickly and efficiently."
          />
        ),
        link: '/features/sales-management',
      },
      {
        icon: <HiOutlineChartBar size={50} />,
        title: (
          <TranslatedText
            i18nKey="realtimeAnalytics.title"
            defaultValue="Real-time Analytics"
          />
        ),
        description: (
          <TranslatedText
            i18nKey="realtimeAnalytics.description"
            defaultValue="Track your business performance with detailed reports on sales, inventory, and customer behavior. Make data-driven decisions instantly."
          />
        ),
        link: '/features/analytics',
      },
      {
        icon: <HiOutlineSquares2X2 size={50} />,
        title: (
          <TranslatedText
            i18nKey="inventoryControl.title"
            defaultValue="Inventory Control"
          />
        ),
        description: (
          <TranslatedText
            i18nKey="inventoryControl.description"
            defaultValue="Manage your stock levels effortlessly with automated tracking, reorder alerts, and multi-location inventory management."
          />
        ),
        link: '/features/inventory',
      },
    ],
    []
  );

  return (
    <div className={styles.sliderContainer}>
      {featuresData.map((item, index) => (
        <FeatureItem
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
          link={item.link}
        />
      ))}
    </div>
  );
}

export default memo(FeaturesGrid);
