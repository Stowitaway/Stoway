export const TERMS_VERSION = "2026-10-09";
export const COMMUNITY_AGREEMENT_VERSION = "2026-10-10";

// Splits "...{terms}..." into text/link fragments, so `links.terms` can be
// rendered as an inline <a>, e.g. { terms: { label: "Terms", href: "/legal#terms" } }.
export function interpolateLinks(text, links) {
  const parts = text.split(/\{(\w+)\}/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) return part;
    const link = links[part];
    if (!link) return `{${part}}`;
    return (
      <a key={i} href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    );
  });
}
