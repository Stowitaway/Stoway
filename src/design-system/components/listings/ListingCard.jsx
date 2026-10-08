import React from "react";
import { Badge } from "../core/Badge";
import { PriceStamp } from "../core/PriceStamp";
import { Icon } from "../core/Icon";
import { FavoriteButton } from "./FavoriteButton";
import { RoomTypeIcon } from "./RoomTypeIcon";
const cx = (...a) => a.filter(Boolean).join(" ");
const GLYPH = { cellar: "house-down", garage: "car-front-fill", storage: "door-closed" };
export function ListingCard({ title, neighbourhood, typeLabel, type = "storage", size, price, priceUnit = "month", host, hostLabel, photos = [], badge, favorite = false, onToggleFavorite, highlighted = false, onOpen, className = "", ...rest }) {
  const meta = [neighbourhood, typeLabel, size != null ? size + " m²" : null].filter(Boolean).join(" · ");
  return (
    <article tabIndex={0} className={cx("sw-listing", highlighted && "sw-listing--highlighted", className)} onClick={onOpen} onKeyDown={(e) => { if (e.key === "Enter" && onOpen) onOpen(); }} {...rest}>
      <div className="sw-listing__media">
        {photos.length > 0 ? <img src={photos[0]} alt="" /> : (
          <div className={cx("sw-listing__placeholder", "sw-roomicon--" + type)}><Icon name={GLYPH[type] || "box"} /></div>
        )}
        {badge && <span className="sw-listing__tag"><Badge variant="light">{badge}</Badge></span>}
        <span className="sw-listing__fav"><FavoriteButton active={favorite} onToggle={onToggleFavorite} /></span>
        {photos.length > 1 && <span className="sw-listing__count"><Badge icon="camera">{photos.length}</Badge></span>}
      </div>
      <div className="sw-listing__info">
        <h3 className="sw-listing__title">{title}</h3>
        <span>{meta}</span>
        {(hostLabel || host) && <span>{hostLabel || "Hosted by " + host}</span>}
        <span className="sw-listing__price"><PriceStamp amount={price} unit={priceUnit} /></span>
      </div>
    </article>
  );
}
