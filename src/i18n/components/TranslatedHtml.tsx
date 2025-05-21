'use client';

import React from 'react';
import { useTranslationContext } from '../TranslationProvider';

const isBrowser = typeof window !== 'undefined';

type TranslationValue = string | number | boolean | null | undefined;

interface TranslatedHtmlProps {
  i18nKey: string;
  values?: Record<string, TranslationValue | Record<string, TranslationValue>>;
  components?: Record<string, React.ReactNode>;
  defaultValue?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export const TranslatedHtml: React.FC<TranslatedHtmlProps> = ({
  i18nKey,
  values,
  defaultValue,
  className,
  style,
  as: Component = 'div',
}) => {
  const { t } = useTranslationContext();

  const translatedHtml = isBrowser
    ? t(i18nKey, { ...values, defaultValue })
    : defaultValue || i18nKey;

  return (
    <Component
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: translatedHtml }}
    />
  );
};

export default TranslatedHtml;
