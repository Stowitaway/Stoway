import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");
export function PriceStamp({ amount, currency = "€", unit = "month", size = "md", className = "", ...rest }) {
  return (
    <span className={cx("sw-price", size === "lg" && "sw-price--lg", className)} {...rest}>
      {currency}{amount}{unit && <span className="sw-price__unit">{unit}</span>}
    </span>
  );
}
