import { useEffect, useState } from "react";
import { ROOM_TYPES, localizedText } from "../data/listings";
import { useLanguage } from "../i18n/LanguageContext";

export default function ListingDetailModal({ listing, onClose, onRequest }) {
  const { t, locale } = useLanguage();
  const [photoIndex, setPhotoIndex] = useState(0);

  const type = ROOM_TYPES.find((rt) => rt.value === listing.type);
  const hasPhotos = listing.photos?.length > 0;
  const photos = hasPhotos ? listing.photos : [];
  const hasMultiplePhotos = photos.length > 1;

  const goPrev = () =>
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  const goNext = () => setPhotoIndex((i) => (i + 1) % photos.length);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (hasMultiplePhotos && e.key === "ArrowLeft") {
        setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
      }
      if (hasMultiplePhotos && e.key === "ArrowRight") {
        setPhotoIndex((i) => (i + 1) % photos.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hasMultiplePhotos, photos.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-kraft-900/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border-2 border-kraft-400 bg-kraft-50 shadow-2xl"
      >
        <div
          className={`relative flex h-72 items-center justify-center sm:h-96 ${
            hasPhotos ? "bg-kraft-100" : type?.tintClass
          }`}
        >
          {hasPhotos ? (
            <img
              src={photos[photoIndex]}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <img src={type?.icon} alt="" className="h-24 w-24 object-contain" />
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label={t("modal.close")}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-kraft-900/70 text-kraft-50 hover:bg-kraft-900"
          >
            ✕
          </button>

          {hasMultiplePhotos && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-kraft-900/70 text-kraft-50 hover:bg-kraft-900"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-kraft-900/70 text-kraft-50 hover:bg-kraft-900"
              >
                ›
              </button>

              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoIndex(i)}
                    aria-label={`Photo ${i + 1}`}
                    className={`h-2 w-2 rounded-full ${
                      i === photoIndex ? "bg-kraft-50" : "bg-kraft-50/40"
                    }`}
                  />
                ))}
              </div>

              <span className="absolute left-3 top-3 rounded bg-kraft-900/70 px-2 py-0.5 text-xs font-medium text-kraft-50">
                {photoIndex + 1} / {photos.length}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-semibold text-kraft-900">
              {localizedText(listing.title, locale)}
            </h2>
            <span className="shrink-0 rounded bg-kraft-50 px-2 py-1 text-sm font-semibold text-price shadow-sm">
              €{listing.price}
              {t("perMonth")}
            </span>
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

          <p className="text-sm text-kraft-800">
            {localizedText(listing.description, locale)}
          </p>

          <div className="mt-2 flex items-center justify-between border-t border-kraft-300 pt-3 text-sm">
            <span className="text-kraft-700">
              {t("rentedBy", { host: listing.host })}
            </span>
            <button
              type="button"
              onClick={() => onRequest(listing)}
              className="rounded-md border border-kraft-900 bg-transparent px-4 py-2 font-medium text-kraft-900 transition hover:bg-kraft-900/5"
            >
              {t("request")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
