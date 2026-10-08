import { useAuth } from "../auth/AuthContext";
import logo from "../assets/brand/stoway-logo-blue.png";
import { Button } from "../design-system/components/core/Button";
import { IconButton } from "../design-system/components/core/IconButton";
import { SearchInput } from "../design-system/components/forms/SearchInput";
import { FilterChip } from "../design-system/components/navigation/FilterChip";
import { Dropdown } from "../design-system/components/navigation/Dropdown";
import { Avatar } from "../design-system/components/core/Avatar";
import { ROOM_TYPES } from "../data/listings";
import { LOCALES } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";

const ROOM_ICON = { cellar: "house-down", garage: "car-front-fill", storage: "door-closed" };

export default function Header({
  search,
  onSearchChange,
  activeType,
  onTypeChange,
  onListSpaceClick,
  onAuthClick,
  onChatClick,
  onFavoritesClick,
}) {
  const { t, locale, setLocale } = useLanguage();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20" style={{ background: "var(--surface-page)" }}>
      <div style={{ borderBottom: "var(--border-width-hairline) solid var(--border-subtle)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 sm:flex-nowrap">
          <a href="#" onClick={(e) => e.preventDefault()} className="flex shrink-0 items-center gap-2.5">
            <img src={logo} alt="" width={44} height={44} style={{ margin: "-4px -2px -4px -6px" }} />
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--brand)" }}>
              Stoway
            </span>
          </a>

          <div className="order-last w-full sm:order-none sm:flex-1 sm:max-w-[560px]">
            <SearchInput
              compact
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder")}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" onClick={onListSpaceClick}>
              {t("listYourSpace")}
            </Button>

            <IconButton
              icon="heart"
              variant="outline"
              label={t("favorites.title")}
              onClick={onFavoritesClick}
            />

            {user && (
              <IconButton
                icon="envelope"
                variant="outline"
                label={t("chat.title")}
                onClick={onChatClick}
              />
            )}

            <Dropdown
              trigger={<IconButton icon="translate" variant="outline" label={t("language")} />}
              heading={t("language")}
              value={locale}
              onSelect={setLocale}
              items={LOCALES.map(({ code, name }) => ({ value: code, label: <em>{name}</em> }))}
            />

            {user ? (
              <Dropdown
                trigger={<Avatar name={user.user_metadata?.full_name || user.email} size={40} />}
                heading={user.user_metadata?.full_name || user.email}
                onSelect={(v) => v === "out" && signOut()}
                items={[{ value: "out", label: t("auth.logOut"), icon: "box-arrow-right" }]}
              />
            ) : (
              <Button variant="primary" size="sm" onClick={onAuthClick}>
                {t("auth.logIn")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-4 sm:px-6">
        <FilterChip selected={activeType === "all"} onClick={() => onTypeChange("all")}>
          {t("filterAll")}
        </FilterChip>
        {ROOM_TYPES.map((rt) => (
          <FilterChip
            key={rt.value}
            icon={ROOM_ICON[rt.value]}
            selected={activeType === rt.value}
            onClick={() => onTypeChange(rt.value)}
          >
            {t(`roomTypes.${rt.value}`)}
          </FilterChip>
        ))}
      </div>
    </header>
  );
}
