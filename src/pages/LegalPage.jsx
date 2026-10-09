import { useMemo } from "react";
import policiesRaw from "../content/legal/policies.md?raw";
import { Link } from "../lib/navigation";
import { renderMarkdown, splitByLang } from "../lib/markdown";
import { useLanguage } from "../i18n/LanguageContext";

export default function LegalPage() {
  const { t, locale } = useLanguage();

  const { html, isFallback } = useMemo(() => {
    const blocks = splitByLang(policiesRaw);
    const fallback = locale === "de" || locale === "it";
    const source = blocks[locale] ?? blocks.en;
    return {
      html: renderMarkdown(source, { assignTermsPrivacyIds: true }),
      isFallback: fallback,
    };
  }, [locale]);

  return (
    <div className="article-page">
      <div className="mb-6 flex gap-2">
        <Link to="/legal#terms" className="sw-chip">
          {t("legalTabTerms")}
        </Link>
        <Link to="/legal#privacy" className="sw-chip">
          {t("legalTabPrivacy")}
        </Link>
      </div>
      {isFallback && t("legalFallbackNote") && (
        <p className="mb-6" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
          {t("legalFallbackNote")}
        </p>
      )}
      <article className="legal-article" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
