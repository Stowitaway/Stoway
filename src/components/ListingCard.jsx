import { ROOM_TYPES, localizedText } from "../data/listings";
import { useLanguage } from "../i18n/LanguageContext";

export default function ListingCard({ listing, highlighted, onOpen, onRequest }) {
  const { t, locale } = useLanguage();
  const type = ROOM_TYPES.find((rt) => rt.value === listing.type);
  const hasPhotos = listing.photos?.length > 0;

  return (
    <article
      id={`listing-${listing.id}`}
      onClick={() => onOpen(listing)}
      className={`flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-kraft-50 transition hover:shadow-md ${
        highlighted
          ? "border-stamp ring-2 ring-stamp"
          : "border-kraft-300"
      }`}
    >
      <div
        className={`relative flex h-36 items-center justify-center border-b border-kraft-300 ${
          hasPhotos ? "bg-kraft-100" : type?.tintClass
        }`}
      >
        {hasPhotos ? (
          <img
            src={listing.photos[0]}
            alt={t(`roomTypes.${type?.value}`)}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={type?.icon}
            alt={t(`roomTypes.${type?.value}`)}
            className="h-16 w-16 object-contain"
          />
        )}
        {hasPhotos && listing.photos.length > 1 && (
          <span className="absolute left-3 top-3 rounded bg-kraft-900/70 px-2 py-0.5 text-xs font-medium text-kraft-50">
            📷 {listing.photos.length}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded bg-kraft-50 px-2 py-0.5 text-sm font-semibold text-price shadow-sm">
          €{listing.price}{t("perMonth")}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight text-kraft-900">
            {localizedText(listing.title, locale)}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-kraft-700">
          <span className="rounded-full bg-kraft-200 px-2 py-0.5">
            📍 {listing.neighbourhood}
          </span>
          <span className="rounded-full bg-kraft-200 px-2 py-0.5">
            {t(`roomTypes.${type?.value}`)}
          </span>
          <span className="rounded-full bg-kraft-200 px-2 py-0.5">
            {listing.size} m²
          </span>
        </div>

        <p className="line-clamp-3 flex-1 text-sm text-kraft-800">
          {localizedText(listing.description, locale)}
        </p>

        <div className="mt-2 flex items-center justify-between border-t border-kraft-300 pt-2 text-sm">
          <span className="text-kraft-700">
            {t("rentedBy", { host: listing.host })}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRequest(listing);
            }}
            className="rounded-md border border-kraft-900 bg-transparent px-3 py-1.5 font-medium text-kraft-900 transition hover:bg-kraft-900/5"
          >
            {t("request")}
          </button>
        </div>
      </div>
    </article>
  );
}
