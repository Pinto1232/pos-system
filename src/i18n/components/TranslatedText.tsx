'use client';

import React from 'react';
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

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  i18nKey,
  values,
  defaultValue,
  className,
  style,
  as: Component = 'span',
}) => {
  const { t } = useTranslationContext();

  let translatedText;

  if (isBrowser) {
    try {
      console.log(
        `Translating key: ${i18nKey}, default: ${defaultValue}`,
        values ? `with values:` : '',
        values
      );
      translatedText = t(i18nKey, {
        defaultValue,
        ns: 'common',
        ...values,
      });

      if (translatedText === i18nKey) {
        console.warn(
          `Translation key "${i18nKey}" not found, using default value`
        );
        translatedText = defaultValue || i18nKey;
      } else {
        console.log(`Translated text for ${i18nKey}:`, translatedText);
      }
    } catch (error) {
      console.error(`Translation error for key ${i18nKey}:`, error);
      translatedText = defaultValue || i18nKey;
    }
  } else {
    translatedText = defaultValue || i18nKey;
  }

  return (
    <Component className={className} style={style}>
      {translatedText}
    </Component>
  );
};

export default TranslatedText;
