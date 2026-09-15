import { createContext, ComponentChildren } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';
import { SupportedLocale, TranslationDictionary } from './types';
import { en } from './locales/en';
import { zhCN } from './locales/zh-CN';
import { zhTW } from './locales/zh-TW';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { es } from './locales/es';
import { pt } from './locales/pt';
import { de } from './locales/de';
import { fr } from './locales/fr';

const DICTIONARIES: Record<SupportedLocale, TranslationDictionary> = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ja,
  ko,
  es,
  pt,
  de,
  fr,
};

const VALID_LOCALES = new Set<SupportedLocale>([
  'en',
  'zh-CN',
  'zh-TW',
  'ja',
  'ko',
  'es',
  'pt',
  'de',
  'fr',
]);

const STORAGE_KEY = 'willitcrop_locale';

/**
 * Detects the user's preferred locale based on localStorage or browser navigator.languages.
 * Accurately differentiates Traditional Chinese (zh-TW/HK/MO/Hant) vs Simplified Chinese (zh-CN/SG/Hans).
 */
export function detectDeviceLocale(): SupportedLocale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_LOCALES.has(saved as SupportedLocale)) {
      return saved as SupportedLocale;
    }
  } catch {
    // localStorage might be unavailable or restricted
  }

  const navLangs = typeof navigator !== 'undefined'
    ? (navigator.languages?.length ? navigator.languages : [navigator.language || 'en'])
    : ['en'];

  for (const lang of navLangs) {
    const lower = lang.toLowerCase();
    // Traditional Chinese
    if (
      lower.startsWith('zh-tw') ||
      lower.startsWith('zh-hk') ||
      lower.startsWith('zh-mo') ||
      lower.includes('hant')
    ) {
      return 'zh-TW';
    }
    // Simplified Chinese
    if (lower.startsWith('zh')) {
      return 'zh-CN';
    }
    if (lower.startsWith('ja')) return 'ja';
    if (lower.startsWith('ko')) return 'ko';
    if (lower.startsWith('es')) return 'es';
    if (lower.startsWith('pt')) return 'pt';
    if (lower.startsWith('de')) return 'de';
    if (lower.startsWith('fr')) return 'fr';
    if (lower.startsWith('en')) return 'en';
  }

  return 'en';
}

interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ComponentChildren }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(detectDeviceLocale);

  const setLocale = (newLocale: SupportedLocale) => {
    if (VALID_LOCALES.has(newLocale)) {
      setLocaleState(newLocale);
      try {
        localStorage.setItem(STORAGE_KEY, newLocale);
      } catch {
        // Ignored
      }
    }
  };

  useEffect(() => {
    // Keep html lang attribute in sync
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: DICTIONARIES[locale] || DICTIONARIES.en,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
