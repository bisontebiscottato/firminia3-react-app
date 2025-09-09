import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './locales/en.json';
import it from './locales/it.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const resources = {
  en: {
    translation: en
  },
  it: {
    translation: it
  },
  es: {
    translation: es
  },
  fr: {
    translation: fr
  }
};

// Configurazione con inizializzazione sincrona
const savedLanguage = localStorage.getItem('i18nextLng');
const initialLanguage = savedLanguage || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: initialLanguage, // Imposta la lingua immediatamente
    debug: false,
    
    detection: {
      order: ['localStorage'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false,
    },
    
    // Assicurati che i18n sia pronto prima del render
    initImmediate: false,
    
    // Callback quando i18n è pronto
    onInit: (t) => {
      console.log('i18n initialized with language:', i18n.language);
    }
  });

// Salva la lingua nel localStorage se non esiste
if (!savedLanguage) {
  localStorage.setItem('i18nextLng', 'en');
}

export default i18n;
