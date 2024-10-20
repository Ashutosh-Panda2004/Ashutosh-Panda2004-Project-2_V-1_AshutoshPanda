// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define your translations
const resources = {
  en: {
    translation: {
      "weatherExplorer": "Weather Explorer",
      // Add more key-value pairs as needed
    }
  },
  es: {
    translation: {
      "weatherExplorer": "Explorador del Clima",
      // Add more key-value pairs as needed
    }
  },
  fr: {
    translation: {
      "weatherExplorer": "Explorateur Météo",
      // Add more key-value pairs as needed
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language
    interpolation: {
      escapeValue: false // React already protects from XSS
    }
  });

export default i18n;
