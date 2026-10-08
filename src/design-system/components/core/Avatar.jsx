import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Avatar({ name = "", size = 40, src, className = "", style, ...rest }) {
  const initial = name.trim().charAt(0).toUpperCase();
  if (src) return <img src={src} alt={name} width={size} height={size} className={cx("sw-avatar", className)} style={{ objectFit: "cover", ...style }} {...rest} />;
  return <span className={cx("sw-avatar", className)} style={{ width: size, height: size, fontSize: size * 0.42, ...style }} aria-label={name} {...rest}>{initial}</span>;
}
