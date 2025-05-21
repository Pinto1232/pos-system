'use client';

import React from 'react';
import { useTranslationContext } from './TranslationProvider';

const isBrowser = typeof window !== 'undefined';

import type { Language } from './TranslationProvider';

type TranslationValue = string | number | boolean | null | undefined;

interface TranslationOptions {
  [key: string]:
    | TranslationValue
    | Record<string, TranslationValue>
    | TranslationOptions;
}

export function withTranslation<P extends object>(
  Component: React.ComponentType<
    P & {
      t: (key: string, options?: TranslationOptions) => string;
      currentLanguage: Language;
    }
  >
) {
  const WithTranslation = (props: P) => {
    const { t, currentLanguage } = useTranslationContext();

    const defaultTranslate = (key: string) => key;

    const translateFn = isBrowser ? t : defaultTranslate;

    return (
      <Component {...props} t={translateFn} currentLanguage={currentLanguage} />
    );
  };

  const displayName = Component.displayName || Component.name || 'Component';
  WithTranslation.displayName = `withTranslation(${displayName})`;

  return WithTranslation;
}

export default withTranslation;
