import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../lib/translations';

type TranslationKey = keyof typeof translations['en'];

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('buurtplay_language');
    if (saved === 'en' || saved === 'nl') {
      return saved as Language;
    }
    // Detect Dutch browser language, otherwise default to English
    if (typeof navigator !== 'undefined' && navigator.language.startsWith('nl')) {
      return 'nl';
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('buurtplay_language', lang);
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations['en'];
    let text = langDict[key] || translations['en'][key] || String(key);

    if (params) {
      Object.entries(params).forEach(([paramName, value]) => {
        text = text.replace(new RegExp(`{${paramName}}`, 'g'), String(value));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
