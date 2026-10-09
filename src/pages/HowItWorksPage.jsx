import { useEffect, useMemo, useRef } from "react";
import howItWorksRaw from "../content/how-it-works.md?raw";
import { Link, navigate } from "../lib/navigation";
import { renderMarkdown, splitByLang } from "../lib/markdown";
import { useLanguage } from "../i18n/LanguageContext";
import { Button } from "../design-system/components/core/Button";

export default function HowItWorksPage({ onListSpaceClick }) {
  const { t, locale } = useLanguage();
  const articleRef = useRef(null);

  const html = useMemo(() => {
    const blocks = splitByLang(howItWorksRaw);
    const source = blocks[locale] ?? blocks.en;
    return renderMarkdown(source);
  }, [locale]);

  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const handler = (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (href && href.startsWith("/")) {
        e.preventDefault();
        navigate(href);
      }
    };
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, []);

  return (
    <div className="article-page">
      <article ref={articleRef} className="legal-article" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="mt-8 flex gap-3">
        <Button variant="primary" onClick={onListSpaceClick}>
          {t("listYourSpace")}
        </Button>
        <Link to="/" className="sw-btn sw-btn--outline">
          {t("backToListings")}
        </Link>
      </div>
    </div>
  );
}
