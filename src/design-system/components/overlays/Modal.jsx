import React from "react";
import { IconButton } from "../core/IconButton";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Modal({ title, onClose, footer, size = "md", flush = false, closeLabel = "Close", headerless = false, children, className = "" }) {
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="sw-modal__scrim" onClick={onClose}>
      <div role="dialog" aria-modal="true" className={cx("sw-modal", size === "lg" && "sw-modal--lg", className)} onClick={(e) => e.stopPropagation()}>
        {!headerless && (
          <div className="sw-modal__header">
            <IconButton icon="x-lg" size="sm" label={closeLabel} onClick={onClose} />
            <h2 className="sw-modal__title">{title}</h2>
            <span />
          </div>
        )}
        <div className={cx("sw-modal__body", flush && "sw-modal__body--flush")}>{children}</div>
        {footer && <div className="sw-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
