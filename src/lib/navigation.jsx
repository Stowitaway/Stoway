import { useEffect, useState } from "react";

const NAVIGATE_EVENT = "stoway:navigate";

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    window.addEventListener(NAVIGATE_EVENT, handler);
    return () => {
      window.removeEventListener("popstate", handler);
      window.removeEventListener(NAVIGATE_EVENT, handler);
    };
  }, []);

  return path;
}

export function navigate(to) {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));

  const hashIndex = to.indexOf("#");
  if (hashIndex !== -1) {
    const id = to.slice(hashIndex + 1);
    const el = id ? document.getElementById(id) : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
  }
  window.scrollTo({ top: 0 });
}

export function Link({ to, onClick, children, ...rest }) {
  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    if (isModified) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
