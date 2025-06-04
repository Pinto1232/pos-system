'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGUAGES, getLanguageByCode } from './i18n';

const isBrowser = typeof window !== 'undefined';

export type Language = {
  code: string;
  name: string;
  flag: string;
  region: string;
};

type TranslationOptions = {
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | null
    | TranslationOptions;
};

type TranslationContextType = {
  currentLanguage: Language;
  changeLanguage: (languageCode: string) => void;
  t: (key: string, options?: TranslationOptions) => string;
  languages: Language[];
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
}) => {
  const { t, i18n } = useTranslation();

  const getDefaultLanguage = (): Language => {
    if (isBrowser) {
      console.log('Checking language preferences...');

      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        try {
          const parsed = JSON.parse(savedLanguage);
          const exists = AVAILABLE_LANGUAGES.some(
            (lang) => lang.code === parsed.code
          );
          if (exists) {
            console.log('Using saved language:', parsed);
            return parsed as Language;
          }
        } catch (e) {
          console.error('Error parsing saved language:', e);
        }
      }

      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
      };

      const cookieLang = getCookie('i18next');
      if (cookieLang) {
        const langMatch = AVAILABLE_LANGUAGES.find(
          (lang) => lang.code === cookieLang
        );
        if (langMatch) {
          console.log('Using cookie language:', langMatch);
          return langMatch;
        }
      }

      try {
        const browserLang = navigator.language.toLowerCase();
        const baseCode = browserLang.split('-')[0];
        const baseMatch = AVAILABLE_LANGUAGES.find(
          (lang) => lang.code === baseCode
        );
        if (baseMatch) {
          console.log('Using browser language:', baseMatch);
          return baseMatch;
        }
      } catch (e) {
        console.error('Error detecting browser language:', e);
      }
    }

    console.log('Using default language: en');
    return (
      AVAILABLE_LANGUAGES.find((lang) => lang.code === 'en') ||
      AVAILABLE_LANGUAGES[0]
    );
  };

  const [currentLanguage, setCurrentLanguage] =
    useState<Language>(getDefaultLanguage());

  const handleChangeLanguage = useCallback(
    (languageCode: string) => {
      console.log('Attempting to change language to:', languageCode);
      const language = getLanguageByCode(languageCode);
      setCurrentLanguage(language);

      if (isBrowser) {
        try {
          localStorage.setItem('language', JSON.stringify(language));
          i18n.changeLanguage(languageCode);

          const loadTranslations = async () => {
            try {
              if (!i18n.hasResourceBundle(languageCode, 'common')) {
                console.log(`Loading translations for ${languageCode}...`);
                const response = await fetch(
                  `/locales/${languageCode}/common.json`
                );

                if (response.ok) {
                  const translations = await response.json();
                  console.log(`Loaded translations:`, translations);

                  i18n.addResourceBundle(
                    languageCode,
                    'common',
                    translations,
                    true,
                    true
                  );

                  const currentBundle = i18n.getResourceBundle(
                    languageCode,
                    'common'
                  );
                  console.log(`Current resource bundle:`, currentBundle);

                  setCurrentLanguage({ ...language });
                } else {
                  console.error(
                    `Failed to load translations for ${languageCode}, status: ${response.status}`
                  );
                }
              } else {
                console.log(`Translations already loaded for ${languageCode}`);
                const currentBundle = i18n.getResourceBundle(
                  languageCode,
                  'common'
                );
                console.log(`Current resource bundle:`, currentBundle);
              }
            } catch (error) {
              console.error(
                `Error loading translations for ${languageCode}:`,
                error
              );
            }
          };

          loadTranslations();

          document.documentElement.lang = languageCode;
          document.cookie = `i18next=${languageCode}; path=/; max-age=${
            60 * 60 * 24 * 365
          }; SameSite=Lax`;

          const event = new CustomEvent('languageChanged', {
            detail: {
              language: languageCode,
              region: language.region,
            },
          });
          window.dispatchEvent(event);
        } catch (error) {
          console.error(`Error changing language to ${languageCode}:`, error);
        }
      }
    },
    [i18n]
  );

  useEffect(() => {
    if (isBrowser) {
      handleChangeLanguage(currentLanguage.code);

      console.log(
        'Current language resources:',
        i18n.getResourceBundle(currentLanguage.code, 'common')
      );
    }
  }, [currentLanguage.code, handleChangeLanguage, i18n]);

  const contextValue: TranslationContextType = {
    currentLanguage,
    changeLanguage: handleChangeLanguage,
    t,
    languages: AVAILABLE_LANGUAGES,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      'useTranslationContext must be used within a TranslationProvider'
    );
  }
  return context;
};
