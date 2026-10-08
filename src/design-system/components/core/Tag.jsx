import React from "react";
import { Icon } from "./Icon";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Tag({ variant = "neutral", icon, className = "", children, ...rest }) {
  return <span className={cx("sw-tag", variant !== "neutral" && "sw-tag--" + variant, className)} {...rest}>{icon && <Icon name={icon} />}{children}</span>;
}
