import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend, { HttpBackendOptions } from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const isClient = typeof window !== 'undefined';

if (isClient) {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init<HttpBackendOptions>({
      fallbackLng: 'en',

      debug: process.env.NODE_ENV === 'development',

      ns: ['common'],
      defaultNS: 'common',

      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },

      partialBundledLanguages: false,

      load: 'currentOnly',

      saveMissing: false,

      detection: {
        order: ['localStorage', 'cookie', 'navigator'],

        caches: ['localStorage', 'cookie'],

        cookieOptions: {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
          domain: window.location.hostname,
        },
      },

      interpolation: {
        escapeValue: false,
      },

      react: {
        useSuspense: true,
      },
    });
}

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
