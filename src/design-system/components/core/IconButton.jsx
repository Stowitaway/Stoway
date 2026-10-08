import React from "react";
import { Icon } from "./Icon";
const cx = (...a) => a.filter(Boolean).join(" ");
export function IconButton({ icon, variant = "ghost", size = "md", label, dot = false, className = "", children, ...rest }) {
  return (
    <button type="button" aria-label={label} title={label} className={cx("sw-iconbtn", variant !== "ghost" && "sw-iconbtn--" + variant, size !== "md" && "sw-iconbtn--" + size, className)} {...rest}>
      {icon ? <Icon name={icon} /> : children}
      {dot && <span className="sw-iconbtn__dot" />}
    </button>
  );
}
