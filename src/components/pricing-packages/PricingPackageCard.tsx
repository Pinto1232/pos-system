'use client';

import React, { memo } from 'react';
import styles from '@/components/pricing-packages/PricingPackages.module.css';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card/Card';
import { Button } from '@/components/ui/button/Button';
import iconMap from '@/utils/icons';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';

interface PricingPackageProps {
  packageData: {
    id: number;
    title: string;
    description: string;
    icon: string;
    extraDescription: string;
    price: number;
    testPeriodDays: number;
    type:
      | 'starter'
      | 'growth'
      | 'enterprise'
      | 'custom'
      | 'premium';
  };
  onBuyNow: () => void;
  currency: string;
  rate: number;
}

const PricingPackageCard: React.FC<PricingPackageProps> =
  memo(
    ({
      packageData,
      onBuyNow,
      currency,
      rate,
    }) => {
      const { isPackageDisabled } =
        usePackageSelection();
      const isDisabled = isPackageDisabled(
        packageData.id
      );

      const IconComponent =
        iconMap[packageData.icon] ||
        iconMap['MUI:DefaultIcon'];
      // The price is already converted on the backend, so we don't need to apply the rate again
      const convertedPrice =
        packageData.price.toFixed(2);
      const isCustom =
        packageData.type === 'custom';

      // Get the appropriate currency symbol
      const currencySymbols: Record<
        string,
        string
      > = {
        USD: '$',
        ZAR: 'R',
        GBP: '£',
        EUR: '€',
        JPY: '¥',
        CNY: '¥',
        INR: '₹',
        AUD: 'A$',
        CAD: 'C$',
        BRL: 'R$',
      };

      const displayCurrency =
        currencySymbols[currency] || currency;

      return (
        <Card
          className={`${styles.card} ${isCustom ? styles.custom : ''} ${isDisabled ? styles.disabled : ''}`}
        >
          {isCustom && (
            <div className={styles.customBadge}>
              Custom
            </div>
          )}
          <CardHeader className={styles.header}>
            <div className={styles.iconWrapper}>
              {IconComponent &&
                React.createElement(
                  IconComponent,
                  { className: styles.icon }
                )}
            </div>
            <h2 className={styles.title}>
              {packageData.title}
            </h2>
          </CardHeader>

          <CardContent className={styles.content}>
            <ul>
              {packageData.description
                .split('. ')
                .map((desc, index) => (
                  <li key={index}>
                    {desc.trim()}
                  </li>
                ))}
            </ul>
          </CardContent>

          <div className={styles.priceSection}>
            {packageData.testPeriodDays > 0 && (
              <div className={styles.trial}>
                {packageData.testPeriodDays} days
                free trial
              </div>
            )}
            <div className={styles.price}>
              <span className={styles.currency}>
                {displayCurrency}
              </span>
              {convertedPrice}
              <span className={styles.period}>
                /month
              </span>
            </div>
          </div>

          <CardFooter className={styles.footer}>
            <Button
              className={`${styles.button} ${
                isCustom
                  ? styles.contactButton
                  : ''
              }`}
              onClick={onBuyNow}
              disabled={isDisabled}
            >
              {isCustom ? 'Buy Now' : 'Buy Now'}
            </Button>
          </CardFooter>
        </Card>
      );
    }
  );

PricingPackageCard.displayName =
  'PricingPackageCard';
export default PricingPackageCard;
