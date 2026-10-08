import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Field({ label, hint, error, className = "", children }) {
  return (
    <label className={cx("sw-field", className)}>
      {label && <span className="sw-field__label">{label}</span>}
      {children}
      {error ? <span className="sw-field__error">{error}</span> : hint && <span className="sw-field__hint">{hint}</span>}
    </label>
  );
}
export function Input({ invalid = false, className = "", ...rest }) {
  return <input className={cx("sw-input", className)} aria-invalid={invalid || undefined} {...rest} />;
}
