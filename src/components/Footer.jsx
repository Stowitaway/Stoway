export default function Footer() {
  return (
    <footer
      className="mt-16"
      style={{ borderTop: "var(--border-width-hairline) solid var(--border-subtle)", background: "var(--surface-sunken)" }}
    >
      <div
        className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8 px-4 py-8 sm:px-6"
        style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.6 }}
      >
        <div className="max-w-md">
          <div className="mb-1.5 font-bold" style={{ color: "var(--text-strong)" }}>Legal Notice</div>
          <p className="m-0">
            Stoway is currently operated as an early-stage pilot project, based in Lisbon, Portugal.
            This is a pilot project and not yet a registered company. A formal business registration
            will follow as the project develops.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span>
            Contact: <a href="mailto:stowitaway00@gmail.com">stowitaway00@gmail.com</a>
          </span>
          <span>© {new Date().getFullYear()} Stoway</span>
        </div>
      </div>
    </footer>
  );
}
