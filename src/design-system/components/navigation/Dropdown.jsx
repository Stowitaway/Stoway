import React from "react";
import { Icon } from "../core/Icon";
const cx = (...a) => a.filter(Boolean).join(" ");
export function Dropdown({ items = [], value, onSelect, trigger, heading, className = "" }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className={cx("sw-dropdown", className)}>
      <span onClick={() => setOpen((o) => !o)} aria-expanded={open}>{trigger}</span>
      {open && (
        <ul role="listbox" className="sw-dropdown__menu">
          {heading && <li className="sw-dropdown__heading">{heading}</li>}
          {items.map((item) => (
            <li key={item.value}>
              <button type="button" role="option" aria-selected={item.value === value} className="sw-dropdown__item"
                onClick={() => { if (onSelect) onSelect(item.value); setOpen(false); }}>
                {item.icon && <Icon name={item.icon} />}
                {item.glyph && <span>{item.glyph}</span>}
                <span>{item.label}</span>
                {value !== undefined && item.value === value && <Icon name="check-lg" className="sw-dropdown__check" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
