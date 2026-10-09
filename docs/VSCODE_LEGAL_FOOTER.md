# Task: legal pages, contact page and new footer for Stoway

Attach this file and `src/content/legal/policies.md` to the chat, then ask the assistant to carry out every step below.

## Context

- Stack: React 19 + Vite + Tailwind 4. Hosted on Cloudflare Workers (static assets). No router library is installed.
- `src/App.jsx` renders the single home page (listings + map). `src/components/Footer.jsx` is the footer.
- i18n: `useLanguage()` from `src/i18n/LanguageContext.jsx` gives `t(key)` and `locale`. Strings live in `src/i18n/translations.js`, with locales `en`, `pt`, `de`, `it`, `fr`.
- Styling uses the design-system CSS variables already used in `Footer.jsx` (`--text-strong`, `--text-muted`, `--border-subtle`, `--surface-sunken`, `--text-sm`, etc.). Reuse them; do not hard-code colours.
- `src/content/legal/policies.md` holds the Terms of Service and Privacy Policy in three languages. Each language block starts with a marker comment line: `<!-- lang:en -->`, `<!-- lang:pt -->`, `<!-- lang:fr -->`. Each block contains two level-1 headings: the Terms first, then the Privacy Policy.

**Do not edit the wording of `policies.md`.** It is a legal text. Only read it.

## Step 1 — Remove the "Legal Notice" block from the footer

In `src/components/Footer.jsx`, delete the whole `<div className="max-w-md">` block containing "Legal Notice" and the "early-stage pilot project" paragraph. Nothing from that text should remain anywhere on the site.

## Step 2 — Add simple routing (no new router library)

1. Create `src/lib/navigation.js` exporting:
   - `usePath()`: a hook returning `window.location.pathname`, updated on `popstate` and on a custom `stoway:navigate` event.
   - `navigate(to)`: calls `history.pushState({}, "", to)`, dispatches `stoway:navigate`, then scrolls to the element matching the URL hash if there is one, otherwise to the top.
   - `Link`: a component rendering a normal `<a href={to}>`, whose `onClick` calls `navigate(to)` (with `preventDefault`) for plain left-clicks only. Let modifier-clicks (Cmd/Ctrl/middle click) open a new tab normally.
2. In `src/App.jsx`, read `usePath()`:
   - `/legal` → render `<LegalPage />`
   - `/contact` → render `<ContactPage />`
   - anything else → the current home page, unchanged
   - Keep `<Header />` and `<Footer />` on every page. Clicking the Stoway logo in the header should go to `/`.
3. Set `document.title` per page: "Stoway", "Terms & Privacy · Stoway", "Contact · Stoway". Use the translated page title.

## Step 3 — Legal page (`src/pages/LegalPage.jsx`)

1. Install `marked` (`npm install marked`).
2. Import the file as text: `import policies from "../content/legal/policies.md?raw";`.
3. Split it on `/<!-- lang:(\w+) -->/` into `{ en, pt, fr }`. Ignore the comment header before the first marker.
4. Pick the block for the current `locale`. For `de` and `it`, use `en` and show a small note above the text (strings in Step 6).
5. Render with `marked.parse()` into an `<article>` using `dangerouslySetInnerHTML`. The source is our own file, so that is acceptable here.
6. Give the two level-1 headings the ids `terms` and `privacy`, in that order. Use a custom marked renderer, or post-process the HTML. This makes `/legal#terms` and `/legal#privacy` work as anchors.
7. Above the article, add two small tab-style links, "Terms of Service" and "Privacy Policy", pointing to `#terms` and `#privacy`.
8. Readable layout:
   - max width about 760px, centred, comfortable line height
   - clear spacing between `h1`, `h2`, paragraphs and lists; numbered and bulleted lists keep their markers
   - tables: full width, hairline borders, cell padding; on narrow screens they scroll horizontally inside a wrapper, never the whole page
   - links underlined
   - Tailwind 4 resets default styles, so add these styles for the article explicitly (a scoped CSS class in `index.css` is fine)

## Step 4 — Contact page (`src/pages/ContactPage.jsx`)

Same page width and style as the legal page. Content:

- Title (Step 6 strings)
- Intro paragraph
- The email as a large `mailto:` link: `stoway.support@gmail.com`
- A line linking to the electronic complaints book: `https://www.livroreclamacoes.pt` (opens in a new tab, `rel="noopener noreferrer"`)
- A link back to the listings (`/`)

## Step 5 — New footer

Rebuild `Footer.jsx`, keeping its current container, background, border and font styles:

- **Left:** the links "Terms & Privacy" (`/legal`), "Contact" (`/contact`) and "Complaints book" (`https://www.livroreclamacoes.pt`, new tab), in a row that wraps on mobile. The complaints book link is a legal requirement in Portugal: it must stay visible in the footer on every page.
- **Right:** `© {year} Stoway`.
- Use `Link` from Step 2 for the internal links and a normal `<a>` for the external one.
- All labels come from `t()`.

## Step 6 — Translations

Add these keys to every locale in `src/i18n/translations.js`. For `de` and `it`, match the tone (du/Sie, tu/Lei) of the existing strings in those locales, adapting the wording below if needed.

| Key | en | pt | de | it | fr |
| --- | --- | --- | --- | --- | --- |
| `footerLegal` | Terms & Privacy | Termos e Privacidade | AGB & Datenschutz | Termini e Privacy | Conditions et confidentialité |
| `footerContact` | Contact | Contacto | Kontakt | Contatti | Contact |
| `footerComplaints` | Complaints book | Livro de Reclamações | Beschwerdebuch | Libro dei reclami | Livre de réclamations |
| `legalTitle` | Terms & Privacy | Termos e Privacidade | AGB & Datenschutz | Termini e Privacy | Conditions et confidentialité |
| `legalTabTerms` | Terms of Service | Termos de Serviço | Nutzungsbedingungen | Termini di servizio | Conditions d'utilisation |
| `legalTabPrivacy` | Privacy Policy | Política de Privacidade | Datenschutzerklärung | Informativa sulla privacy | Politique de confidentialité |
| `legalFallbackNote` | *(not used)* | *(not used)* | Diese Seite ist auf Englisch, Portugiesisch und Französisch verfügbar. | Questa pagina è disponibile in inglese, portoghese e francese. | *(not used)* |
| `contactTitle` | Contact | Contacto | Kontakt | Contatti | Contact |
| `contactIntro` | Write to us with questions, feedback, a problem with a listing, a request about your data, or a report of illegal content. We aim to reply within 15 working days. | Escreva-nos para questões, sugestões, problemas com um anúncio, pedidos sobre os seus dados ou denúncias de conteúdos ilegais. Procuramos responder no prazo de 15 dias úteis. | Schreiben Sie uns bei Fragen, Feedback, Problemen mit einem Inserat, Anfragen zu Ihren Daten oder Meldungen rechtswidriger Inhalte. Wir antworten in der Regel innerhalb von 15 Werktagen. | Scrivici per domande, suggerimenti, problemi con un annuncio, richieste sui tuoi dati o segnalazioni di contenuti illegali. Cerchiamo di rispondere entro 15 giorni lavorativi. | Écrivez-nous pour toute question, suggestion, problème avec une annonce, demande concernant vos données ou signalement de contenu illicite. Nous nous efforçons de répondre sous 15 jours ouvrés. |
| `contactComplaints` | You can also file a complaint in the electronic complaints book (Livro de Reclamações). | Pode também apresentar uma reclamação no Livro de Reclamações Eletrónico. | Sie können eine Beschwerde auch im elektronischen Beschwerdebuch (Livro de Reclamações) einreichen. | Puoi anche presentare un reclamo nel libro dei reclami elettronico (Livro de Reclamações). | Vous pouvez aussi déposer une réclamation dans le registre électronique des réclamations (Livro de Reclamações). |
| `backToListings` | ← Back to listings | ← Voltar aos anúncios | ← Zurück zu den Inseraten | ← Torna agli annunci | ← Retour aux annonces |

## Step 7 — Cloudflare deep links

After deploying, open `https://stoway.net/legal` directly in a new tab and refresh it. If Cloudflare returns a 404, the Worker is not falling back to `index.html` for unknown paths. Add a `wrangler.jsonc` at the repo root (or edit the existing Wrangler config, if the Cloudflare dashboard shows one), with:

```jsonc
{
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

Keep the existing `name` and `compatibility_date` values from the current Cloudflare project if they exist. Do not create a second Worker.

## Done when

- [ ] No "Legal Notice" or "pilot project" text appears anywhere on the site
- [ ] The footer shows Terms & Privacy, Contact and Complaints book on every page, translated in all five languages
- [ ] `/legal` shows the policies in EN, PT or FR following the site language; DE and IT fall back to EN with the note
- [ ] `/legal#privacy` scrolls to the Privacy Policy
- [ ] `/contact` shows the email as a working `mailto:` link
- [ ] Browser back/forward works between the home page, `/legal` and `/contact`
- [ ] Tables don't cause horizontal page scroll on a phone (375px wide)
- [ ] `npm run build` and `npm run lint` pass
