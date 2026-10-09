import { marked } from "marked";

// Splits a content file into per-language blocks, keyed by the `<!-- lang:xx -->`
// marker that precedes each one. Content before the first marker (the file's
// own header comment) is ignored.
export function splitByLang(source) {
  const blocks = {};
  const regex = /<!--\s*lang:(\w+)\s*-->/g;
  const markers = [...source.matchAll(regex)];
  for (let i = 0; i < markers.length; i += 1) {
    const lang = markers[i][1];
    const start = markers[i].index + markers[i][0].length;
    const end = i + 1 < markers.length ? markers[i + 1].index : source.length;
    blocks[lang] = source.slice(start, end).trim();
  }
  return blocks;
}

// Renders markdown to HTML for the shared `.legal-article` styles: wraps
// tables so they scroll horizontally instead of the whole page, and
// optionally tags the first two <h1>s as #terms / #privacy anchors.
export function renderMarkdown(md, { assignTermsPrivacyIds = false } = {}) {
  let html = marked.parse(md, { gfm: true });

  html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");

  if (assignTermsPrivacyIds) {
    let count = 0;
    html = html.replace(/<h1>/g, () => {
      count += 1;
      if (count === 1) return '<h1 id="terms">';
      if (count === 2) return '<h1 id="privacy">';
      return "<h1>";
    });
  }

  return html;
}
