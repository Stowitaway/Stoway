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
        className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6"
        style={{ fontSize: "var(--text-md)", color: "var(--text-muted)", lineHeight: 1.6 }}
      >
        <div
          className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3"
          style={{ rowGap: "var(--space-3)" }}
        >
          <button
            type="button"
            onClick={handleListSpaceClick}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "var(--text-link)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              font: "inherit",
              textAlign: "left",
            }}
          >
            {t("listYourSpace")}
          </button>
          <Link to="/how-it-works">{t("footer.howItWorks")}</Link>
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
