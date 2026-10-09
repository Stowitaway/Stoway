import { Link, navigate, usePath } from "../lib/navigation";
import { useLanguage } from "../i18n/LanguageContext";

export default function Footer({ onListSpaceClick }) {
  const { t } = useLanguage();
  const path = usePath();

  const handleListSpaceClick = (e) => {
    e.preventDefault();
    if (path !== "/") {
      navigate("/");
      // Let the home page mount before opening the modal.
      setTimeout(() => onListSpaceClick(), 0);
    } else {
      onListSpaceClick();
    }
  };

  return (
    <footer
      className="mt-16"
      style={{ borderTop: "var(--border-width-hairline) solid var(--border-subtle)", background: "var(--surface-sunken)" }}
    >
      <div
        className="mx-auto flex max-w-7xl flex-col flex-wrap items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6"
        style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.6 }}
      >
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link to="/how-it-works">{t("footer.howItWorks")}</Link>
          <button
            type="button"
            onClick={handleListSpaceClick}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "inherit",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              font: "inherit",
            }}
          >
            {t("listYourSpace")}
          </button>
          <Link to="/legal">{t("footerLegal")}</Link>
          <Link to="/contact">{t("footerContact")}</Link>
          <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">
            {t("footerComplaints")}
          </a>
        </div>
        <span>
          © {new Date().getFullYear()} Stoway · <span>{t("footer.madeIn")}</span>
        </span>
      </div>
    </footer>
  );
}
