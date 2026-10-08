import { ListingCard as DSListingCard } from "../design-system/components/listings/ListingCard";
import { localizedText } from "../data/listings";
import { useLanguage } from "../i18n/LanguageContext";

export default function ListingCard({
  listing,
  highlighted,
  onOpen,
  onRequest,
  isFavorite,
  onToggleFavorite,
}) {
  const { t, locale } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <DSListingCard
        id={`listing-${listing.id}`}
        title={localizedText(listing.title, locale)}
        neighbourhood={listing.neighbourhood}
        typeLabel={t(`roomTypes.${listing.type}`)}
        type={listing.type}
        size={listing.size}
        price={listing.price}
        priceUnit={t("perMonth")}
        hostLabel={t("rentedBy", { host: listing.host })}
        photos={listing.photos ?? []}
        favorite={isFavorite}
        onToggleFavorite={() => onToggleFavorite(listing)}
        highlighted={highlighted}
        onOpen={() => onOpen(listing)}
      />
      <p className="m-0 line-clamp-2" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
        {localizedText(listing.description, locale)}
      </p>
      <button
        type="button"
        className="sw-btn sw-btn--outline sw-btn--sm self-start"
        onClick={(e) => {
          e.stopPropagation();
          onRequest(listing);
        }}
      >
        {t("request")}
      </button>
    </div>
  );
}
