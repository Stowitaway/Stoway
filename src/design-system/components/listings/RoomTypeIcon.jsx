import React from "react";
import { Icon } from "../core/Icon";
const cx = (...a) => a.filter(Boolean).join(" ");
const GLYPH = { cellar: "house-down", garage: "car-front-fill", storage: "door-closed" };
export function RoomTypeIcon({ type, size = 40, bare = false, className = "", style, ...rest }) {
  return (
    <span className={cx("sw-roomicon", bare ? "sw-roomicon--bare" : "sw-roomicon--" + type, className)} style={{ width: bare ? undefined : size, height: bare ? undefined : size, ...style }} {...rest}>
      <Icon name={GLYPH[type] || "box"} size={bare ? undefined : Math.round(size * 0.48)} />
    </span>
  );
}
