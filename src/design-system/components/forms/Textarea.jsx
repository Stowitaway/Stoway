import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Textarea({ rows = 4, className = "", ...rest }) {
  return <textarea rows={rows} className={cx("sw-textarea", className)} {...rest} />;
}
