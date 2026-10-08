import React from "react";
import { Icon } from "../core/Icon";
const cx = (...a) => a.filter(Boolean).join(" ");
export function EmptyState({ icon = "search", title, children, action, className = "" }) {
  return (
    <div className={cx("sw-empty", className)}>
      <span className="sw-empty__icon"><Icon name={icon} /></span>
      {title && <span className="sw-empty__title">{title}</span>}
      {children && <p>{children}</p>}
      {action && <div className="sw-empty__action">{action}</div>}
    </div>
  );
}
