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
import { useCurrency } from '@/contexts/CurrencyContext';

interface PricingPackageProps {
  packageData: {
    id: number;
    title: string;
    description: string;
    icon: string;
    extraDescription: string;
    price: number;
    testPeriodDays: number;
    type: string;
    currency?: string;
    multiCurrencyPrices?: string;
  };
  onBuyNow: () => void;
}

const PricingPackageCard: React.FC<PricingPackageProps> =
  memo(({ packageData, onBuyNow }) => {
    const { isPackageDisabled } =
      usePackageSelection();
    const {
      currency,
      rate,
      formatPrice,
      currencySymbol,
    } = useCurrency();
    const isDisabled = isPackageDisabled(
      packageData.id
    );

    const IconComponent =
      iconMap[packageData.icon] ||
      iconMap['MUI:DefaultIcon'];

    // Start with the base price from the package data
    let displayPrice = packageData.price;

    // Handle custom package base price
    if (
      packageData.type.toLowerCase().includes('custom') &&
      displayPrice === 0
    ) {
      // Use 129.99 as the base price in USD
      const customBasePrice = 129.99;

      // Store this as the display price in USD before any currency conversion
      displayPrice = customBasePrice;
    }

    // Parse multi-currency prices if available
    let multiCurrency: Record<
      string,
      number
    > | null = null;
    if (packageData.multiCurrencyPrices) {
      try {
        multiCurrency = JSON.parse(
          packageData.multiCurrencyPrices
        );
      } catch (e) {
        console.error(
          'Error parsing multiCurrencyPrices:',
          e
        );
      }
    }

    // Apply currency conversion
    if (
      currency &&
      multiCurrency &&
      multiCurrency[currency]
    ) {
      // If we have a specific price for this currency, use it directly
      displayPrice = multiCurrency[currency];
      console.log(`Using specific ${currency} price from multiCurrencyPrices: ${displayPrice}`);
    } else if (currency !== 'USD') {
      // Only apply rate conversion if we're not in USD and don't have a specific price
      displayPrice = displayPrice * rate;
      console.log(`Converting price from USD to ${currency} using rate ${rate}: ${displayPrice}`);
    }

    const convertedPrice =
      formatPrice(displayPrice);
    const isCustom =
      packageData.type.toLowerCase().includes('custom');

    const displayCurrency = currencySymbol;

    console.log(
      `Package card ${packageData.title} (${packageData.type}) price: ${displayPrice}, formatted: ${convertedPrice}, currency: ${currency}`
    );

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
              React.createElement(IconComponent, {
                className: styles.icon,
              })}
          </div>
          <h2 className={styles.title}>
            {packageData.title}
          </h2>
        </CardHeader>

        <CardContent className={styles.content}>
          <ul>
            {packageData.description
              .split(';')
              .map((desc, index) => (
                <li key={index}>{desc.trim()}</li>
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
            {isCustom ? (
              <div
                className={
                  styles.customPriceContainer
                }
              >
                <span
                  className={
                    styles.customPriceLabel
                  }
                >
                  Starting at
                </span>
                <div
                  className={
                    styles.customPriceWrapper
                  }
                >
                  <span
                    className={styles.currency}
                  >
                    {displayCurrency}
                  </span>
                  <span
                    className={styles.priceValue}
                  >
                    {convertedPrice}
                  </span>
                  <span className={styles.period}>
                    /month
                  </span>
                </div>
              </div>
            ) : (
              <>
                <span className={styles.currency}>
                  {displayCurrency}
                </span>
                <span
                  className={styles.priceValue}
                >
                  {convertedPrice}
                </span>
                <span className={styles.period}>
                  /month
                </span>
              </>
            )}
          </div>
        </div>

        <CardFooter className={styles.footer}>
          <Button
            className={`${styles.button} ${
              isCustom ? styles.contactButton : ''
            }`}
            onClick={onBuyNow}
            disabled={isDisabled}
          >
            {isCustom ? 'Customize' : 'Buy Now'}
          </Button>
        </CardFooter>
      </Card>
    );
  });

PricingPackageCard.displayName =
  'PricingPackageCard';
export default PricingPackageCard;
