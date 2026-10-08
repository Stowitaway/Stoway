import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");
export function MapMarker({ price, currency = "€", active = false, favorite = false, className = "", ...rest }) {
  return <span className={cx("sw-marker", active && "sw-marker--active", favorite && "sw-marker--favorite", className)} {...rest}>{currency}{price}</span>;
}
export function MarkerHtml({ price, currency = "€", active = false, favorite = false }) {
  return '<span class="sw-marker' + (active ? " sw-marker--active" : "") + (favorite ? " sw-marker--favorite" : "") + '">' + currency + price + "</span>";
}
