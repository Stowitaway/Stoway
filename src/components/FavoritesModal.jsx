import { useLanguage } from "../i18n/LanguageContext";
import { Modal } from "../design-system/components/overlays/Modal";
import { EmptyState } from "../design-system/components/overlays/EmptyState";
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
    <Modal title={t("favorites.title")} onClose={onClose} size="lg">
      {listings.length === 0 ? (
        <EmptyState icon="heart" title={t("favorites.title")}>
          {t("favorites.empty")}
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
    </Modal>
  );
}
