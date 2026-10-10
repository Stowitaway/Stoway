import { localizedText } from "../data/listings";
import { useLanguage } from "../i18n/LanguageContext";
import { Button } from "../design-system/components/core/Button";
import { IconButton } from "../design-system/components/core/IconButton";
import { EmptyState } from "../design-system/components/overlays/EmptyState";

export default function StowkeeperDashboard({ listings, onAddListing, onEditListing, onDeleteListing }) {
  const { t, locale } = useLanguage();

  return (
    <div className="article-page" style={{ maxWidth: 960 }}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="m-0" style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--weight-bold)", color: "var(--text-strong)" }}>
            {t("stowkeeper.dashboardTitle")}
          </h1>
          <p className="m-0 mt-1" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            {t("stowkeeper.dashboardIntro")}
          </p>
        </div>
        <Button variant="primary" icon="plus-lg" onClick={onAddListing}>
          {t("stowkeeper.addListing")}
        </Button>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          icon="box-seam"
          title={t("stowkeeper.noListings")}
          action={
            <Button variant="outline" onClick={onAddListing}>
              {t("stowkeeper.addListing")}
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center gap-4 rounded-lg p-3"
              style={{ border: "var(--border-width-hairline) solid var(--border-subtle)" }}
            >
              <div
                className="shrink-0 overflow-hidden rounded-md"
                style={{ width: 88, height: 66, background: "var(--surface-muted)" }}
              >
                {listing.photos?.[0] && (
                  <img src={listing.photos[0]} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 truncate" style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>
                  {localizedText(listing.title, locale)}
                </h3>
                <p className="m-0" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  {listing.neighbourhood} · {listing.size} m² · €{listing.price}{t("perMonth")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <IconButton icon="pencil" variant="outline" label={t("stowkeeper.edit")} onClick={() => onEditListing(listing)} />
                <IconButton icon="trash" variant="outline" label={t("stowkeeper.delete")} onClick={() => onDeleteListing(listing)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
