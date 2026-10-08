import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Card({ variant = "outlined", interactive = false, as = "div", className = "", children, ...rest }) {
  const Tag = as;
  return <Tag className={cx("sw-card", variant !== "plain" && "sw-card--" + variant, interactive && "sw-card--interactive", className)} {...rest}>{children}</Tag>;
}
export function CardMedia({ className = "", children, ...rest }) {
  return <div className={cx("sw-card__media", className)} {...rest}>{children}</div>;
}
export function CardBody({ className = "", children, ...rest }) {
  return <div className={cx("sw-card__body", className)} {...rest}>{children}</div>;
}
export function CardFooter({ className = "", children, ...rest }) {
  return <div className={cx("sw-card__footer", className)} {...rest}>{children}</div>;
}
