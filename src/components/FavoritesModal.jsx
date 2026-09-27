import { useLanguage } from "../i18n/LanguageContext";
import ListingCard from "./ListingCard";

export default function FavoritesModal({
  listings,
  onClose,
  onOpenListing,
  onRequest,
  favoriteIds,
  onToggleFavorite,
}) {
  const { t } = useLanguage();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-kraft-900/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border-2 border-kraft-400 bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-kraft-300 bg-kraft-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-kraft-900">
            <span style={{ color: "#ff0000" }}>♥</span> {t("favorites.title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("modal.close")}
            className="rounded-full px-2 py-1 text-kraft-700 hover:bg-kraft-200"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {listings.length === 0 ? (
            <p className="py-8 text-center text-sm text-kraft-600">
              {t("favorites.empty")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onOpen={(l) => {
                    onClose();
                    onOpenListing(l);
                  }}
                  onRequest={onRequest}
                  isFavorite={favoriteIds.has(listing.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
