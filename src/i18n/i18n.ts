import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend, { HttpBackendOptions } from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '../../public/locales/en/common.json';

const isClient = typeof window !== 'undefined';

const i18n = i18next.createInstance();

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    fallbackLng: 'en',
    debug: true,
    ns: ['common'],
    defaultNS: 'common',

    resources: {
      en: {
        common: enTranslations,
      },
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'no-store',
      },
    },

    partialBundledLanguages: true,
    load: 'currentOnly',
    saveMissing: false,

    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
      cookieOptions: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        domain: isClient ? window.location.hostname : '',
      },
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false, // Disable suspense to prevent issues with SSR
    },
  })
  .then(() => {
    if (isClient) {
      console.log('i18n initialized successfully');
      console.log('Available languages:', i18n.languages);
      console.log('Current language:', i18n.language);

      if (!i18n.hasResourceBundle('en', 'common')) {
        console.log('Adding English resources manually after initialization');
        i18n.addResourceBundle('en', 'common', enTranslations, true, true);
      }

      console.log(
        'Has resources:',
        i18n.hasResourceBundle(i18n.language, 'common')
      );
      console.log(
        'Resources:',
        i18n.getResourceBundle(i18n.language, 'common')
      );
    }
  })
  .catch((error) => {
    console.error('Error initializing i18n:', error);
  });

export default i18n;

export const AVAILABLE_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    flag: 'za',
    region: 'South Africa',
  },
  {
    code: 'pt',
    name: 'Português',
    flag: 'ao',
    region: 'Angola',
  },
  {
    code: 'es',
    name: 'Español',
    flag: 'es',
    region: 'Spain',
  },
  {
    code: 'fr',
    name: 'Français',
    flag: 'fr',
    region: 'France',
  },
];

export const getLanguageByCode = (code: string) => {
  return (
    AVAILABLE_LANGUAGES.find((lang) => lang.code === code) ||
    AVAILABLE_LANGUAGES[0]
  );
};

export const changeLanguage = (languageCode: string) => {
  return i18n.changeLanguage(languageCode);
};
