import React from "react";
import { Icon } from "../core/Icon";
const cx = (...a) => a.filter(Boolean).join(" ");
export function FilterChip({ selected = false, icon, className = "", children, ...rest }) {
  return (
    <button type="button" aria-pressed={selected} className={cx("sw-chip", className)} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}
