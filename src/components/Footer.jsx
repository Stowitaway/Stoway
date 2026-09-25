export default function Footer() {
  return (
    <footer className="border-t border-kraft-300 bg-page">
      <div className="mx-auto max-w-7xl px-4 py-6 text-xs leading-relaxed text-kraft-600 sm:px-6">
        <p className="font-semibold text-kraft-700">Legal Notice</p>
        <p className="mt-2">
          Stoway is currently operated as an early-stage pilot project,
          based in Lisbon, Portugal.
        </p>
        <p className="mt-2">
          Contact:{" "}
          <a
            href="mailto:stowitaway00@gmail.com"
            className="underline hover:text-kraft-800"
          >
            stowitaway00@gmail.com
          </a>
        </p>
        <p className="mt-2">
          This is a pilot project and not yet a registered company. A formal
          business registration will follow as the project develops.
        </p>
        <p className="mt-3">© {new Date().getFullYear()} Stoway</p>
      </div>
    </footer>
  );
}
