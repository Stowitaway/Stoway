import React from "react";
import { Icon } from "./Icon";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Badge({ variant = "overlay", icon, className = "", children, ...rest }) {
  return <span className={cx("sw-badge", "sw-badge--" + variant, className)} {...rest}>{icon && <Icon name={icon} />}{children}</span>;
}
