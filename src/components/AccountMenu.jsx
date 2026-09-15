import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function AccountMenu() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

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
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-kraft-300 bg-kraft-50 text-kraft-800 hover:bg-kraft-200"
      >
        ☰
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-48 overflow-hidden rounded-md border border-kraft-300 bg-kraft-50 shadow-lg">
          <div className="truncate border-b border-kraft-200 px-4 py-3 text-sm font-medium text-kraft-900">
            {user.user_metadata?.full_name || user.email}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-kraft-800 hover:bg-kraft-100"
          >
            {t("auth.logOut")}
          </button>
        </div>
      )}
    </div>
  );
}
