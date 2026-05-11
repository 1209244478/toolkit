'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Locale, Translations } from './translations';
import { DEFAULT_LOCALE, translations } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: translations[DEFAULT_LOCALE],
});

const STORAGE_KEY = 'toolkit-locale';

function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'zh' || stored === 'en') return stored;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE;
    return detectLocale();
  });

  useEffect(() => {
    const detected = detectLocale();
    if (detected !== locale) {
      setLocaleState(detected);
    }
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
  }, []);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export type { Locale };
