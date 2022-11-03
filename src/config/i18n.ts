import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from 'assets/locales/en/translation.json';

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: __DEV__,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  resources: {
    en: {
      translation: en,
    },
  },
});

export default i18next;
