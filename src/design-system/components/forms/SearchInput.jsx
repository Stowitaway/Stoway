import React from "react";
import { Icon } from "../core/Icon";
const cx = (...a) => a.filter(Boolean).join(" ");
export function SearchInput({ label, compact = false, onSubmit, buttonLabel = "Search", className = "", ...rest }) {
  return (
    <form className={cx("sw-search", compact && "sw-search--compact", className)} role="search" onSubmit={(e) => { e.preventDefault(); if (onSubmit) onSubmit(); }}>
      <label className="sw-search__field">
        {label && !compact && <span className="sw-search__label">{label}</span>}
        <input type="text" className="sw-search__input" {...rest} />
      </label>
      <button type="submit" className="sw-search__btn" aria-label={buttonLabel}><Icon name="search" /></button>
    </form>
  );
}
