import { ROOM_TYPES } from "../data/listings";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({
  search,
  onSearchChange,
  activeType,
  onTypeChange,
  onListSpaceClick,
}) {
  const { t } = useLanguage();

  return (
    <header className="border-b border-kraft-300 bg-kraft-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <h1 className="text-2xl font-semibold tracking-wide text-kraft-900">
              Stowt
            </h1>
            <span className="hidden text-sm text-kraft-700 sm:inline">
              · {t("tagline")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={onListSpaceClick}
              className="shrink-0 rounded-md bg-stamp px-4 py-2 text-sm font-medium text-kraft-50 transition hover:opacity-90"
            >
              {t("listYourSpace")}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-kraft-600">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-md border border-kraft-300 bg-kraft-50 py-2 pl-9 pr-3 text-sm text-kraft-900 placeholder:text-kraft-500 focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onTypeChange("all")}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
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
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  activeType === rt.value
                    ? "border-kraft-700 bg-kraft-700 text-kraft-50"
                    : "border-kraft-300 bg-kraft-50 text-kraft-800 hover:bg-kraft-200"
                }`}
              >
                {rt.icon} {t(`roomTypes.${rt.value}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
