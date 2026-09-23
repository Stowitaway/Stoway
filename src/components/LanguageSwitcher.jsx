import { useEffect, useRef, useState } from "react";
import { LOCALES } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-11 items-center gap-1.5 rounded-md border border-kraft-300 bg-kraft-50 px-3.5 text-base font-medium text-kraft-800 hover:bg-kraft-200"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <span className="text-xs text-kraft-500">▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-10 mt-1 w-32 overflow-hidden rounded-md border border-kraft-300 bg-kraft-50 shadow-lg"
        >
          {LOCALES.map(({ code, label, flag }) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === code}
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                  locale === code
                    ? "bg-kraft-200 font-medium text-kraft-900"
                    : "text-kraft-800 hover:bg-kraft-100"
                }`}
              >
                <span>{flag}</span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
