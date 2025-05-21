'use client';

import { useEffect, useState } from 'react';
import { useTranslationContext } from './TranslationProvider';

const isBrowser = typeof window !== 'undefined';

type TranslationValue = string | number | boolean | null | undefined;

interface TranslationObject {
  [key: string]: TranslationValue | TranslationArray | TranslationObject;
}

type TranslationArray = Array<
  TranslationValue | TranslationArray | TranslationObject
>;

export function useTranslateData<
  T extends Record<
    string,
    TranslationValue | TranslationArray | TranslationObject
  >,
>(
  data: T | null | undefined,
  translationKeys: (keyof T)[]
): T | null | undefined {
  const { t, currentLanguage } = useTranslationContext();
  const [translatedData, setTranslatedData] = useState<T | null | undefined>(
    data
  );

  useEffect(() => {
    if (!data) {
      setTranslatedData(data);
      return;
    }

    if (!isBrowser) {
      setTranslatedData(data);
      return;
    }

    const newData = { ...data };

    translationKeys.forEach((key) => {
      if (typeof newData[key] === 'string') {
        const originalValue = newData[key] as string;

        if (originalValue.includes('.')) {
          newData[key] = t(originalValue) as T[typeof key];
        } else {
          newData[key] = originalValue as T[typeof key];
        }
      } else if (Array.isArray(newData[key])) {
        newData[key] = (newData[key] as TranslationArray).map((item) => {
          if (typeof item === 'string' && item.includes('.')) {
            return t(item);
          }
          return item;
        }) as T[typeof key];
      }
    });

    setTranslatedData(newData);
  }, [data, t, currentLanguage.code, translationKeys]);

  return translatedData;
}

export default useTranslateData;
