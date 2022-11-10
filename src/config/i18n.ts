import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en as enUS, enGB, registerTranslation} from 'react-native-paper-dates';
import en from 'assets/locales/en/translation.json';

registerTranslation('en', enUS);
registerTranslation('en-GB', enGB);

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
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
