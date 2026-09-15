import { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, translate } from "./translations";

const STORAGE_KEY = "stoway-locale";
const SUPPORTED = LOCALES.map((l) => l.code);

function getInitialLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch {
    // localStorage unavailable, fall through to browser/default
  }
  const browserLang = navigator.language?.slice(0, 2);
  if (SUPPORTED.includes(browserLang)) return browserLang;
  return DEFAULT_LOCALE;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  const setLocale = (code) => {
    setLocaleState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore write errors (e.g. private browsing)
    }
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
