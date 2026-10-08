import React from "react";
import { Icon } from "./Icon";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Button({ variant = "primary", size = "md", block = false, icon, iconRight, type = "button", className = "", children, ...rest }) {
  return (
    <button type={type} className={cx("sw-btn", "sw-btn--" + variant, size !== "md" && "sw-btn--" + size, block && "sw-btn--block", className)} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
      {iconRight && <Icon name={iconRight} />}
    </button>
  );
}
