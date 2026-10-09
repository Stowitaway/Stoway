import { Link } from "../lib/navigation";
import { useLanguage } from "../i18n/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="article-page">
      <article className="legal-article">
        <h1>{t("contactTitle")}</h1>
        <p>{t("contactIntro")}</p>
        <p>
          <a href="mailto:stoway.support@gmail.com" style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-semibold)" }}>
            stoway.support@gmail.com
          </a>
        </p>
        <p>
          {t("contactComplaints")}{" "}
          <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">
            livroreclamacoes.pt
          </a>
        </p>
        <p>
          <Link to="/">{t("backToListings")}</Link>
        </p>
      </article>
    </div>
  );
}
