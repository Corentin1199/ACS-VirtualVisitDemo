// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'de',
    debug: true,
    react: { useSuspense: false },
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
      //   loadPath: 'public/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;
