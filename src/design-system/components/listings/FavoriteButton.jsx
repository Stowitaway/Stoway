import React from "react";
import { Icon } from "../core/Icon";
const cx = (...a) => a.filter(Boolean).join(" ");
export function FavoriteButton({ active = false, plain = false, onToggle, label, className = "", ...rest }) {
  return (
    <button type="button" aria-pressed={active} aria-label={label || (active ? "Remove from favourites" : "Add to favourites")}
      className={cx("sw-fav", plain && "sw-fav--plain", className)}
      onClick={(e) => { e.stopPropagation(); if (onToggle) onToggle(!active); }} {...rest}>
      <Icon name={active ? "heart-fill" : "heart"} />
    </button>
  );
}
