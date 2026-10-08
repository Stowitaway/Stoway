import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Icon({ name, size, label, className = "", style, ...rest }) {
  return <i className={cx("bi", "bi-" + name, "sw-icon", className)} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={{ fontSize: size, ...style }} {...rest} />;
}
