import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Select({ options = [], className = "", children, ...rest }) {
  return (
    <select className={cx("sw-select", className)} {...rest}>
      {children || options.map((o) => {
        const value = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label ?? o.value;
        return <option key={value} value={value}>{label}</option>;
      })}
    </select>
  );
}
