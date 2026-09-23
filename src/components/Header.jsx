import { useAuth } from "../auth/AuthContext";
import logo from "../assets/brand/logo.png";
import { ROOM_TYPES } from "../data/listings";
import { useLanguage } from "../i18n/LanguageContext";
import AccountMenu from "./AccountMenu";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({
  search,
  onSearchChange,
  activeType,
  onTypeChange,
  onListSpaceClick,
  onAuthClick,
  onChatClick,
}) {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="border-b border-kraft-300 bg-kraft-50 font-display">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-7 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-22 w-22 rounded-xl" />
            <div className="flex flex-col" style={{ lineHeight: 1.1 }}>
              <h1 className="text-3xl font-semibold tracking-wide text-kraft-900">
                Stoway
              </h1>
              <span
                style={{
                  fontFamily:
                    'system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
                  fontSize: "0.85rem",
                  fontWeight: 400,
                  color: "#8a7f6e",
                  letterSpacing: "0.02em",
                  marginTop: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                {t("tagline")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onListSpaceClick}
              className="shrink-0 rounded-md bg-stamp px-5 py-3 text-base font-medium text-kraft-50 transition hover:opacity-90"
            >
              {t("listYourSpace")}
            </button>

            {user && (
              <button
                type="button"
                onClick={onChatClick}
                aria-label={t("chat.title")}
                title={t("chat.title")}
                className="flex h-11 w-11 items-center justify-center rounded-md border border-kraft-300 bg-kraft-50 text-lg text-kraft-800 hover:bg-kraft-200"
              >
                ✉️
              </button>
            )}

            <LanguageSwitcher />

            {user ? (
              <AccountMenu />
            ) : (
              <button
                type="button"
                onClick={onAuthClick}
                className="rounded-md border border-kraft-300 px-3 py-1.5 text-sm font-medium text-kraft-800 hover:bg-kraft-200"
              >
                {t("auth.logIn")}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative lg:w-3/5">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-kraft-600">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-md border border-kraft-300 bg-kraft-50 py-3 pl-11 pr-4 text-base text-kraft-900 placeholder:text-kraft-500 focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
            />
          </div>

          <div className="flex flex-wrap gap-2 lg:w-2/5 lg:justify-end">
            <button
              type="button"
              onClick={() => onTypeChange("all")}
              className={`rounded-full border px-4 py-2 text-base font-medium transition ${
                activeType === "all"
                  ? "border-kraft-700 bg-kraft-700 text-kraft-50"
                  : "border-kraft-300 bg-kraft-50 text-kraft-800 hover:bg-kraft-200"
              }`}
            >
              {t("filterAll")}
            </button>
            {ROOM_TYPES.map((rt) => (
              <button
                key={rt.value}
                type="button"
                onClick={() => onTypeChange(rt.value)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-base font-medium transition ${
                  activeType === rt.value
                    ? "border-kraft-700 bg-kraft-700 text-kraft-50"
                    : "border-kraft-300 bg-kraft-50 text-kraft-800 hover:bg-kraft-200"
                }`}
              >
                <img src={rt.icon} alt="" className="h-5 w-5 rounded-sm object-cover" />
                {t(`roomTypes.${rt.value}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
