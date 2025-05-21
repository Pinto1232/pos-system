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
import { TranslatedText } from '@/i18n';
import { useTranslationContext } from '@/i18n';

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

const PricingPackageCard: React.FC<PricingPackageProps> = memo(
  ({ packageData, onBuyNow }) => {
    const { isPackageDisabled, isPurchasedPackage } = usePackageSelection();
    const { currency, rate, formatPrice, currencySymbol } = useCurrency();
    const { currentLanguage, t } = useTranslationContext();
    const isDisabled = isPackageDisabled(packageData.id);
    const isPurchased = isPurchasedPackage(packageData.id);

    const IconComponent =
      iconMap[packageData.icon] || iconMap['MUI:DefaultIcon'];

    let displayPrice = packageData.price;

    if (
      packageData.type.toLowerCase().includes('custom') &&
      displayPrice === 0
    ) {
      const customBasePrice = 129.99;

      displayPrice = customBasePrice;
    }

    let multiCurrency: Record<string, number> | null = null;
    if (packageData.multiCurrencyPrices) {
      try {
        multiCurrency = JSON.parse(packageData.multiCurrencyPrices);
      } catch (e) {
        console.error(
          'Error parsing multiCurrencyPrices:',
          JSON.stringify(e, null, 2)
        );
      }
    }

    if (currency && multiCurrency && multiCurrency[currency]) {
      displayPrice = multiCurrency[currency];
      console.log(
        `Using specific ${currency} price from multiCurrencyPrices: ${displayPrice}`
      );
    } else if (currency !== 'USD') {
      displayPrice = displayPrice * rate;
      console.log(
        `Converting price from USD to ${currency} using rate ${rate}: ${displayPrice}`
      );
    }

    const convertedPrice = formatPrice(displayPrice);
    const isCustom = packageData.type.toLowerCase().includes('custom');

    const displayCurrency = currencySymbol;

    const translatedExtraDescription = t(
      `packages.extraDescriptions.${packageData.type}`,
      {
        defaultValue: packageData.extraDescription,
      }
    );

    console.log(
      `Package card ${packageData.title} (${packageData.type}) price: ${displayPrice}, formatted: ${convertedPrice}, currency: ${currency}, language: ${currentLanguage.code}`
    );

    return (
      <Card
        className={`${styles.card} ${isCustom ? styles.custom : ''} ${isDisabled ? styles.disabled : ''} ${packageData.type}`}
      >
        {isCustom && (
          <div className={styles.customBadge}>
            <TranslatedText i18nKey="packages.custom" defaultValue="Custom" />
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
            <TranslatedText
              i18nKey={`packages.titles.${packageData.type}`}
              defaultValue={packageData.title}
            />
          </h2>
        </CardHeader>

        <CardContent className={styles.content}>
          <div className={styles.extraDescription}>
            {translatedExtraDescription}
          </div>
          <ul>
            {(
              t(`packages.descriptions.${packageData.type}`, {
                defaultValue: packageData.description,
              }) || packageData.description
            )
              .split(';')
              .map((desc: string, index: number) => (
                <li key={index}>{desc.trim()}</li>
              ))}
          </ul>
        </CardContent>

        <div className={styles.priceSection}>
          {packageData.testPeriodDays > 0 && (
            <div className={styles.trial}>
              <TranslatedText
                i18nKey="packages.freeTrial"
                values={{ days: packageData.testPeriodDays }}
                defaultValue={`${packageData.testPeriodDays} days free trial`}
              />
            </div>
          )}
          <div className={styles.price}>
            {isCustom ? (
              <div className={styles.customPriceContainer}>
                <span className={styles.customPriceLabel}>
                  <TranslatedText
                    i18nKey="packages.startingAt"
                    defaultValue="Starting at"
                  />
                </span>
                <div className={styles.customPriceWrapper}>
                  <span className={styles.currency}>{displayCurrency}</span>
                  <span className={styles.priceValue}>{convertedPrice}</span>
                  <span className={styles.period}>
                    <TranslatedText
                      i18nKey="packages.perMonth"
                      defaultValue="/month"
                    />
                  </span>
                </div>
              </div>
            ) : (
              <>
                <span className={styles.currency}>{displayCurrency}</span>
                <span className={styles.priceValue}>{convertedPrice}</span>
                <span className={styles.period}>
                  <TranslatedText
                    i18nKey="packages.perMonth"
                    defaultValue="/month"
                  />
                </span>
              </>
            )}
          </div>
        </div>

        <CardFooter className={styles.footer}>
          {isPurchased ? (
            <Button
              className={`${styles.button}`}
              sx={{ backgroundColor: '#4CAF50' }}
              disabled
            >
              <TranslatedText
                i18nKey="packages.currentPlan"
                defaultValue="Current Plan"
              />
            </Button>
          ) : (
            <Button
              className={`${styles.button} ${isCustom ? styles.contactButton : ''}`}
              onClick={onBuyNow}
              disabled={isDisabled}
            >
              {isCustom ? (
                <TranslatedText
                  i18nKey="packages.customize"
                  defaultValue="Customize"
                />
              ) : (
                <TranslatedText
                  i18nKey="packages.buyNow"
                  defaultValue="Buy Now"
                />
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
);

PricingPackageCard.displayName = 'PricingPackageCard';
export default PricingPackageCard;
