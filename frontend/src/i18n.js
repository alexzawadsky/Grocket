import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from "i18next-http-backend";
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem('i18nextLng') || 'en',
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n