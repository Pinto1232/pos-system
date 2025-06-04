'use client';

import React from 'react';
import Hero from './Hero';
import styles from './Hero.module.css';
import { TranslatedText, useTranslationContext } from '@/i18n';

function HeroContainer() {
  const { currentLanguage } = useTranslationContext();

  console.log('Current language in HeroContainer:', currentLanguage.code);

  const heading = (
    <TranslatedText
      i18nKey="hero.changeForMore"
      defaultValue="Change for a Fast, Reliable, and Smart Point of Sale System"
      as="span"
      className={styles.highlightedText}
    />
  );

  const subheading = (
    <TranslatedText
      i18nKey="hero.subheading"
      defaultValue="An all-in-one POS solution designed to streamline sales, manage inventory, and grow your business with ease"
    />
  );

  const ctaPrimary = (
    <TranslatedText i18nKey="hero.ctaPrimary" defaultValue="Book a Demo" />
  );
  const ctaSecondary = (
    <TranslatedText
      i18nKey="hero.ctaSecondary"
      defaultValue="Learn About Solutions"
    />
  );

  const ladyImage = '/pos.png';

  return (
    <Hero
      heading={heading}
      subheading={subheading}
      ctaPrimary={ctaPrimary}
      ctaSecondary={ctaSecondary}
      ladyImage={ladyImage}
    />
  );
}

export default HeroContainer;
