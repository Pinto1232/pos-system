'use client';

import React, { memo, useMemo, useRef } from 'react';
import { useTranslationContext } from '../TranslationProvider';

const isBrowser = typeof window !== 'undefined';

type TranslationValue = string | number | boolean | null | undefined;

interface TranslatedTextProps {
  i18nKey: string;
  values?: Record<string, TranslationValue | Record<string, TranslationValue>>;
  components?: Record<string, React.ReactNode>;
  defaultValue?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

const arePropsEqual = (
  prevProps: TranslatedTextProps,
  nextProps: TranslatedTextProps
) => {
  return (
    prevProps.i18nKey === nextProps.i18nKey &&
    prevProps.defaultValue === nextProps.defaultValue &&
    prevProps.className === nextProps.className &&
    prevProps.as === nextProps.as &&
    JSON.stringify(prevProps.values) === JSON.stringify(nextProps.values) &&
    JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
  );
};

export const TranslatedText: React.FC<TranslatedTextProps> = memo(
  ({
    i18nKey,
    values,
    defaultValue,
    className,
    style,
    as: Component = 'span',
  }) => {
    const { t } = useTranslationContext();

    const renderCount = useRef(0);
    if (process.env.NODE_ENV === 'development') {
      renderCount.current += 1;
      if (renderCount.current > 3) {
        console.warn(
          `⚠️  TranslatedText re-rendered ${renderCount.current} times for key: ${i18nKey}`
        );
      }
    }

    const translationOptions = useMemo(
      () => ({
        defaultValue,
        ns: 'common',
        ...values,
      }),
      [defaultValue, values]
    );

    const translatedText = useMemo(() => {
      if (!isBrowser) {
        return defaultValue || i18nKey;
      }

      try {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `Translating key: ${i18nKey}, default: ${defaultValue}`,
            values ? `with values:` : '',
            values
          );
        }

        const result = t(i18nKey, translationOptions);

        if (result === i18nKey) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `Translation key "${i18nKey}" not found, using default value`
            );
          }
          return defaultValue || i18nKey;
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Translated text for ${i18nKey}:`, result);
          }
          return result;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`Translation error for key ${i18nKey}:`, error);
        }
        return defaultValue || i18nKey;
      }
    }, [i18nKey, translationOptions, t, defaultValue, values]);

    return (
      <Component className={className} style={style}>
        {translatedText}
      </Component>
    );
  },
  arePropsEqual
);

TranslatedText.displayName = 'TranslatedText';

export default TranslatedText;
