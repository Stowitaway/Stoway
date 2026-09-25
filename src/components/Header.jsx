import { useAuth } from "../auth/AuthContext";
import logo from "../assets/brand/logo.png";
import { ROOM_TYPES } from "../data/listings";
import { useLanguage } from "../i18n/LanguageContext";
import AccountMenu from "./AccountMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import RoomTypeIcon from "./RoomTypeIcon";

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
    <header className="border-b border-kraft-300 bg-page font-display">
      <div className="mx-auto flex max-w-7xl flex-col gap-3.5 px-4 py-3.5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-[66px] w-[66px] shrink-0 rounded-xl" />
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
                  color: "#8e8e93",
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
                className="flex h-11 w-11 items-center justify-center rounded-md border border-kraft-300 bg-kraft-50 text-kraft-800 hover:bg-kraft-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-kraft-600"
              aria-hidden="true"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-md border border-kraft-300 bg-kraft-50 py-3 pl-11 pr-4 text-base text-kraft-900 placeholder:text-[#8E8E93] focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
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
                <RoomTypeIcon icon={rt.icon} className="h-5 w-5 rounded-sm object-cover" />
                {t(`roomTypes.${rt.value}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
