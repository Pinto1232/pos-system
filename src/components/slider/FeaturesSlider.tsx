'use client';

import React from 'react';
import { HiOutlineCreditCard, HiOutlineChartBar, HiOutlineSquares2X2 } from 'react-icons/hi2';
import Link from 'next/link';

import styles from './FeaturesSlider.module.css';

const featuresData = [
  {
    icon: <HiOutlineCreditCard size={50} />,
    title: 'Sales Management',
    description:
      'Streamline your transactions with an intuitive POS interface. Process sales, returns, and payments quickly and efficiently.',
    link: '/features/sales-management',
  },
  {
    icon: <HiOutlineChartBar size={50} />,
    title: 'Real-time Analytics',
    description:
      'Track your business performance with detailed reports on sales, inventory, and customer behavior. Make data-driven decisions instantly.',
    link: '/features/analytics',
  },
  {
    icon: <HiOutlineSquares2X2 size={50} />,
    title: 'Inventory Control',
    description:
      'Manage your stock levels effortlessly with automated tracking, reorder alerts, and multi-location inventory management.',
    link: '/features/inventory',
  },
];

export default function FeaturesGrid() {
  return (
    <div className={styles.sliderContainer}>
      {featuresData.map((item, index) => (
        <div key={index} className={styles.slideItem}>
          <div className={styles.iconWrapper}>
            <div className={styles.icon}>{item.icon}</div>
          </div>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.description}>{item.description}</p>
          <Link href={item.link} className={styles.learnMore}>
            Learn more
          </Link>
        </div>
      ))}
    </div>
  );
}
