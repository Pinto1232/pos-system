import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import {
  TranslationValue,
  TranslationArray,
  TranslationObject,
} from '@/services/translationService';

export async function getServerTranslations(
  namespace: string = 'common',
  language?: string
) {
  try {
    if (!language) {
      const cookieStore = await cookies();
      const languageCookie = cookieStore.get('i18next');
      language = languageCookie?.value || 'en';
    }

    if (!['en', 'pt', 'es', 'fr'].includes(language)) {
      language = 'en';
    }

    const filePath = path.join(
      process.cwd(),
      'public',
      'locales',
      language,
      `${namespace}.json`
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`Translations not found for ${language}/${namespace}`);
    }

    const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    return translations;
  } catch (error) {
    console.error('Error fetching server translations:', error);

    return {};
  }
}

export async function translateServer(
  key: string,
  options: Record<string, TranslationValue | TranslationObject> = {},
  namespace: string = 'common',
  language?: string
): Promise<string> {
  try {
    const translations = await getServerTranslations(namespace, language);

    const keyParts = key.split('.');

    let translation = translations;
    for (const part of keyParts) {
      if (translation && translation[part]) {
        translation = translation[part];
      } else {
        translation = null;
        break;
      }
    }

    if (translation && typeof translation === 'string') {
      let result = translation;
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        });
      }
      return result;
    }

    return options.defaultValue || key;
  } catch (error) {
    console.error('Error translating on server:', error);
    return options.defaultValue || key;
  }
}

export async function translateDynamicContentServer<
  T extends Record<
    string,
    TranslationValue | TranslationArray | TranslationObject
  >,
>(
  content: T,
  keys: (keyof T)[],
  namespace: string = 'common',
  language?: string
): Promise<T> {
  try {
    const translations = await getServerTranslations(namespace, language);

    const translatedContent = { ...content };

    for (const key of keys) {
      if (typeof translatedContent[key] === 'string') {
        const originalValue = translatedContent[key] as string;

        if (originalValue.includes('.')) {
          const keyParts = originalValue.split('.');

          let translation = translations;
          for (const part of keyParts) {
            if (translation && translation[part]) {
              translation = translation[part];
            } else {
              translation = null;
              break;
            }
          }

          if (translation && typeof translation === 'string') {
            translatedContent[key] = translation as unknown as T[typeof key];
          }
        }
      } else if (Array.isArray(translatedContent[key])) {
        translatedContent[key] = (
          translatedContent[key] as TranslationArray
        ).map((item) => {
          if (typeof item === 'string' && item.includes('.')) {
            const keyParts = item.split('.');

            let translation = translations;
            for (const part of keyParts) {
              if (translation && translation[part]) {
                translation = translation[part];
              } else {
                translation = null;
                break;
              }
            }

            if (translation && typeof translation === 'string') {
              return translation;
            }
          }
          return item;
        }) as unknown as T[typeof key];
      }
    }

    return translatedContent;
  } catch (error) {
    console.error('Error translating dynamic content on server:', error);
    return content;
  }
}
