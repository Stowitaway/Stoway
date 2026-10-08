import { useEffect, useState } from "react";
import { ROOM_TYPES, localizedText } from "../data/listings";
import { useLanguage } from "../i18n/LanguageContext";
import { Icon } from "../design-system/components/core/Icon";
import { IconButton } from "../design-system/components/core/IconButton";
import { Button } from "../design-system/components/core/Button";
import { Tag } from "../design-system/components/core/Tag";
import { Badge } from "../design-system/components/core/Badge";
import { PriceStamp } from "../design-system/components/core/PriceStamp";
import { FavoriteButton } from "../design-system/components/listings/FavoriteButton";

const ROOM_ICON = { cellar: "house-down", garage: "car-front-fill", storage: "door-closed" };

export default function ListingDetailModal({
  listing,
  onClose,
  onRequest,
  isFavorite,
  onToggleFavorite,
}) {
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
    <div className="sw-modal__scrim" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="sw-modal sw-modal--lg"
        style={{ maxHeight: "90vh" }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ aspectRatio: "4 / 3", background: "var(--surface-muted)" }}
        >
          {hasPhotos ? (
            <img src={photos[photoIndex]} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className={`sw-roomicon--${type?.value}`} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={ROOM_ICON[type?.value] || "box"} style={{ fontSize: 56 }} />
            </div>
          )}

          <span className="absolute right-3 top-3">
            <IconButton icon="x-lg" variant="onimage" label={t("modal.close")} onClick={onClose} />
          </span>
          <span className="absolute left-3 top-3">
            <FavoriteButton active={isFavorite} onToggle={() => onToggleFavorite(listing)} />
          </span>

          {hasMultiplePhotos && (
            <>
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <IconButton icon="chevron-left" variant="onimage" label="Previous photo" onClick={goPrev} />
              </span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <IconButton icon="chevron-right" variant="onimage" label="Next photo" onClick={goNext} />
              </span>
              <span className="absolute bottom-3 left-3">
                <Badge variant="overlay">{photoIndex + 1} / {photos.length}</Badge>
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3" style={{ padding: "var(--pad-modal-y) var(--pad-modal-x)", overflowY: "auto" }}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="m-0" style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--text-strong)" }}>
              {localizedText(listing.title, locale)}
            </h2>
            <PriceStamp amount={listing.price} unit={t("perMonth")} size="lg" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tag icon="geo-alt-fill">{listing.neighbourhood}</Tag>
            <Tag>{t(`roomTypes.${type?.value}`)}</Tag>
            <Tag>{listing.size} m²</Tag>
          </div>

          <p className="m-0" style={{ fontSize: "var(--text-md)", color: "var(--text-body)" }}>
            {localizedText(listing.description, locale)}
          </p>

          <div
            className="mt-2 flex items-center justify-between pt-3"
            style={{ borderTop: "var(--border-width-hairline) solid var(--border-subtle)" }}
          >
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              {t("rentedBy", { host: listing.host })}
            </span>
            <Button variant="primary" onClick={() => onRequest(listing)}>
              {t("request")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
