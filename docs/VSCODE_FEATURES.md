# Task: Report button, account deletion, host responsibility, terms at signup, footer additions

**Do `docs/VSCODE_LEGAL_FOOTER.md` first.** This task reuses its routing (`usePath`, `navigate`, `Link` in `src/lib/navigation.js`), its `/legal` page styles and its footer.

Attach this file, `supabase/legal_features.sql` and `src/content/how-it-works.md` to the chat.

## Context

- Supabase client: `src/lib/supabaseClient.js`. Auth: `src/auth/AuthContext.jsx` (`signUp(email, password, fullName)`, `signIn`, `signOut`, `user`).
- Listing photos are uploaded to the `listing-photos` bucket under the path `${user.id}/...` (see `uploadPhotos` in `src/components/ListSpaceModal.jsx`).
- UI components live in `src/design-system/components/` (`Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Modal`, `Dropdown`...). Reuse them and the existing CSS variables; do not add a UI library.
- All user-facing text goes through `t()`. Translations for every new key are in Step 7.
- Current terms version: `"2026-10-09"`. Put it in one constant, `TERMS_VERSION`, in `src/lib/legal.js`, and import it wherever it's needed.

## Step 0 — Database (done by a founder, not by the assistant)

A founder runs `supabase/legal_features.sql` once in the Supabase dashboard (SQL Editor → New query → Run). It:

- creates the `reports` table (insert-only from the site)
- adds `host_terms_accepted_at` and `host_terms_version` to `listings`, and makes them required for new listings
- adds the `delete_my_account()` function
- emails every new report to stoway.support@gmail.com (database trigger + Resend). No email code is needed in the site

Do not change the SQL. The code below assumes it has been run.

## Step 1 — Report button

1. Create `src/components/ReportModal.jsx`, built on the existing `Modal`. Props: `targetType` (`"listing"` | `"conversation"`), `targetId`, `onClose`.
2. Fields:
   - **Reason**: a `Select` with the six reasons: `illegal`, `scam`, `prohibited_items`, `misleading`, `abuse`, `other`.
   - **Details**: a `Textarea`, required, 10–2000 characters, with a character counter.
   - **Email**: optional, shown only when the user is signed out. Signed in, send `reporter_email: user.email`.
   - **Good faith**: a required checkbox (`report.goodFaith`).
3. On submit, insert into `reports`: `reporter_id` (the user's id, or `null` when signed out), `reporter_email`, `target_type`, `target_id`, `reason`, `details`, `good_faith: true`. Do **not** chain `.select()`, because the table has no read policy.
4. Show `report.thanks` on success, or `report.error` on failure. Disable the submit button while sending.
5. **Placement:**
   - `ListingDetailModal.jsx`: a small text-style "Report" link (`report.button`) at the bottom of the modal, with a flag icon. It opens `ReportModal` with `targetType="listing"`. Signed-out visitors can use it too.
   - `ChatModal.jsx`: in the open conversation's header, an `IconButton` with a flag icon, labelled `report.titleConversation`. It opens `ReportModal` with `targetType="conversation"` and the conversation id.

## Step 2 — Account settings and account deletion

1. In `Header.jsx`, add an "Account settings" item (`account.settings`, icon `gear`) to the avatar dropdown, above "Log out". It navigates to `/account`.
2. Add the route `/account` in `App.jsx` → `src/pages/AccountPage.jsx`. Signed-out visitors are sent to `/` and the login modal opens.
3. **AccountPage** (same layout width as the legal page) shows:
   - name (`user.user_metadata.full_name`) and email, read-only
   - a "Delete account" section with a red-outlined border and the warning text `account.deleteWarning`
   - an input where the user types their email to confirm (`account.deleteConfirm`). The delete button stays disabled until the typed value matches `user.email`, ignoring case and surrounding spaces.
4. **On delete:**
   1. List every file in the `listing-photos` bucket under the folder `${user.id}` with `supabase.storage.from("listing-photos").list(user.id, { limit: 1000 })`, then delete them with `.remove(paths)`. Repeat until the list is empty.
   2. Call `supabase.rpc("delete_my_account")`.
   3. Call `signOut()`, navigate to `/`, and show `account.deleted` as a short message or toast.
   4. If any step fails, stop, show `report.error`, and keep the user signed in.

## Step 3 — Host accepts responsibility when publishing a listing

1. In `ListSpaceModal.jsx`, add a required checkbox just above the submit buttons, with the label `hostTerms.label`. In that label, `{terms}` becomes a link with the text `legalTabTerms`, pointing to `/legal#terms`. It opens in a new tab so the form isn't lost.
2. The submit button stays disabled until the box is ticked. If the form is submitted without it, show `hostTerms.required` under the checkbox.
3. In the `listings` insert, add `host_terms_accepted_at: new Date().toISOString()` and `host_terms_version: TERMS_VERSION`.

## Step 4 — Terms acceptance at signup

1. In `AuthModal.jsx`, in **sign-up mode only**, add a required checkbox labelled `auth.acceptTerms`. In that label, `{terms}` links to `/legal#terms` and `{privacy}` links to `/legal#privacy`, both opening in a new tab, with link texts `legalTabTerms` and `legalTabPrivacy`.
2. Block sign-up until the box is ticked.
3. In `AuthContext.jsx`, pass the extra metadata when signing up: `options: { data: { full_name, terms_accepted_at: new Date().toISOString(), terms_version: TERMS_VERSION } }`.

## Step 5 — How it works / FAQ page

1. Add the route `/how-it-works` → `src/pages/HowItWorksPage.jsx`.
2. Render `src/content/how-it-works.md` the same way as the legal page:
   - import it with `?raw`
   - split it on `<!-- lang:xx -->` (five languages: en, pt, de, it, fr), falling back to `en`
   - render it with `marked`, reusing the same article styles
3. Internal links in the rendered HTML (`href` starting with `/`) must navigate without a full page reload. Intercept clicks on the article container and call `navigate()`.
4. Below the article, add two buttons: "List your space" (same action as the header button) and "Back to listings" (`/`).
5. Page title: `howTitle` + " · Stoway".

## Step 6 — Footer additions

Update `Footer.jsx`:

- **Links row, in this order:** How it works (`/how-it-works`), List your space, Terms & Privacy, Contact, Complaints book.
- **"List your space"** must behave exactly like the header's "List your space" button: it opens the login modal when signed out, and the list-space modal when signed in. Pass the same handler from `App.jsx` to `Footer` as an `onListSpaceClick` prop. When the user is on another page (`/legal`, `/contact`, ...), navigate to `/` first, then open the modal. Render it as a link-styled `<button>`, not an `<a>`.
- **Right side:** `© {year} Stoway · {footer.madeIn}`. Wrap "Made in Lisbon" in a `<span>` so it can be styled separately later.
- On mobile, the links wrap onto several lines and the © line moves below them, aligned left.

## Step 7 — Translations

Merge these keys into each locale in `src/i18n/translations.js`. Some keys are nested (`report`, `account`, `hostTerms`, `footer`); `auth.acceptTerms` goes into the existing `auth` object. Keep any existing keys. `{terms}` and `{privacy}` are placeholders, replaced by link elements (Steps 3–4); do not translate them.

```js
// en
howTitle: "How it works",
footer: { howItWorks: "How it works", madeIn: "Made in Lisbon" },
report: {
  button: "Report",
  titleListing: "Report this listing",
  titleConversation: "Report this conversation",
  reason: "Reason",
  reasons: { illegal: "Illegal content", scam: "Scam or fraud", prohibited_items: "Prohibited items or use", misleading: "Misleading or fake listing", abuse: "Harassment or abuse", other: "Other" },
  details: "Explain what is wrong and why",
  email: "Your email (optional, so we can follow up)",
  goodFaith: "I confirm this report is accurate and made in good faith.",
  submit: "Send report",
  thanks: "Thank you. We will review your report.",
  error: "Something went wrong. Please try again or write to stoway.support@gmail.com.",
},
account: {
  settings: "Account settings",
  name: "Name",
  email: "Email",
  deleteTitle: "Delete account",
  deleteWarning: "This permanently deletes your account, your listings and photos, your favourites and your conversations. It cannot be undone.",
  deleteConfirm: "Type your email to confirm",
  deleteButton: "Delete my account permanently",
  deleted: "Your account has been deleted.",
},
hostTerms: {
  label: "I accept responsibility for the items stored in my space, as set out in section 4.6 of the {terms}.",
  required: "Please accept this to publish your listing.",
},
// inside auth:
acceptTerms: "I am 18 or older and accept the {terms}. I have read the {privacy}.",
```

```js
// pt
howTitle: "Como funciona",
footer: { howItWorks: "Como funciona", madeIn: "Feito em Lisboa" },
report: {
  button: "Denunciar",
  titleListing: "Denunciar este anúncio",
  titleConversation: "Denunciar esta conversa",
  reason: "Motivo",
  reasons: { illegal: "Conteúdo ilegal", scam: "Burla ou fraude", prohibited_items: "Bens ou utilização proibidos", misleading: "Anúncio enganoso ou falso", abuse: "Assédio ou abuso", other: "Outro" },
  details: "Explique o problema e porquê",
  email: "O seu email (opcional, para lhe darmos resposta)",
  goodFaith: "Confirmo que esta denúncia é exata e feita de boa-fé.",
  submit: "Enviar denúncia",
  thanks: "Obrigado. Vamos analisar a sua denúncia.",
  error: "Ocorreu um erro. Tente novamente ou escreva para stoway.support@gmail.com.",
},
account: {
  settings: "Definições da conta",
  name: "Nome",
  email: "Email",
  deleteTitle: "Eliminar conta",
  deleteWarning: "Isto elimina definitivamente a sua conta, os seus anúncios e fotografias, os seus favoritos e as suas conversas. Não pode ser anulado.",
  deleteConfirm: "Escreva o seu email para confirmar",
  deleteButton: "Eliminar a minha conta definitivamente",
  deleted: "A sua conta foi eliminada.",
},
hostTerms: {
  label: "Aceito a responsabilidade pelos bens guardados no meu espaço, nos termos da secção 4.6 dos {terms}.",
  required: "Aceite para publicar o seu anúncio.",
},
// inside auth:
acceptTerms: "Tenho 18 anos ou mais e aceito os {terms}. Li a {privacy}.",
```

```js
// de
howTitle: "So funktioniert's",
footer: { howItWorks: "So funktioniert's", madeIn: "Gemacht in Lissabon" },
report: {
  button: "Melden",
  titleListing: "Dieses Inserat melden",
  titleConversation: "Dieses Gespräch melden",
  reason: "Grund",
  reasons: { illegal: "Rechtswidriger Inhalt", scam: "Betrug", prohibited_items: "Verbotene Gegenstände oder Nutzung", misleading: "Irreführendes oder gefälschtes Inserat", abuse: "Belästigung oder Beleidigung", other: "Sonstiges" },
  details: "Beschreibe, was nicht stimmt und warum",
  email: "Deine E-Mail (optional, für Rückfragen)",
  goodFaith: "Ich bestätige, dass diese Meldung zutreffend ist und in gutem Glauben erfolgt.",
  submit: "Meldung senden",
  thanks: "Danke. Wir prüfen deine Meldung.",
  error: "Etwas ist schiefgelaufen. Bitte versuche es erneut oder schreib an stoway.support@gmail.com.",
},
account: {
  settings: "Kontoeinstellungen",
  name: "Name",
  email: "E-Mail",
  deleteTitle: "Konto löschen",
  deleteWarning: "Dadurch werden dein Konto, deine Inserate und Fotos, deine Favoriten und deine Unterhaltungen endgültig gelöscht. Das kann nicht rückgängig gemacht werden.",
  deleteConfirm: "Gib zur Bestätigung deine E-Mail-Adresse ein",
  deleteButton: "Mein Konto endgültig löschen",
  deleted: "Dein Konto wurde gelöscht.",
},
hostTerms: {
  label: "Ich übernehme die Verantwortung für die in meinem Raum gelagerten Gegenstände gemäß Abschnitt 4.6 der {terms}.",
  required: "Bitte bestätige dies, um dein Inserat zu veröffentlichen.",
},
// inside auth:
acceptTerms: "Ich bin mindestens 18 Jahre alt und akzeptiere die {terms}. Ich habe die {privacy} gelesen.",
```

```js
// it
howTitle: "Come funziona",
footer: { howItWorks: "Come funziona", madeIn: "Fatto a Lisbona" },
report: {
  button: "Segnala",
  titleListing: "Segnala questo annuncio",
  titleConversation: "Segnala questa conversazione",
  reason: "Motivo",
  reasons: { illegal: "Contenuto illegale", scam: "Truffa o frode", prohibited_items: "Oggetti o usi vietati", misleading: "Annuncio ingannevole o falso", abuse: "Molestie o abusi", other: "Altro" },
  details: "Spiega il problema e perché",
  email: "La tua email (facoltativa, per risponderti)",
  goodFaith: "Confermo che questa segnalazione è accurata e fatta in buona fede.",
  submit: "Invia segnalazione",
  thanks: "Grazie. Esamineremo la tua segnalazione.",
  error: "Qualcosa è andato storto. Riprova o scrivi a stoway.support@gmail.com.",
},
account: {
  settings: "Impostazioni account",
  name: "Nome",
  email: "Email",
  deleteTitle: "Elimina account",
  deleteWarning: "Questo elimina definitivamente il tuo account, i tuoi annunci e foto, i preferiti e le conversazioni. L'operazione non può essere annullata.",
  deleteConfirm: "Digita la tua email per confermare",
  deleteButton: "Elimina definitivamente il mio account",
  deleted: "Il tuo account è stato eliminato.",
},
hostTerms: {
  label: "Accetto la responsabilità per gli oggetti depositati nel mio spazio, come previsto dalla sezione 4.6 dei {terms}.",
  required: "Accetta per pubblicare il tuo annuncio.",
},
// inside auth:
acceptTerms: "Ho almeno 18 anni e accetto i {terms}. Ho letto l'{privacy}.",
```

```js
// fr
howTitle: "Comment ça marche",
footer: { howItWorks: "Comment ça marche", madeIn: "Fait à Lisbonne" },
report: {
  button: "Signaler",
  titleListing: "Signaler cette annonce",
  titleConversation: "Signaler cette conversation",
  reason: "Motif",
  reasons: { illegal: "Contenu illicite", scam: "Arnaque ou fraude", prohibited_items: "Biens ou usage interdits", misleading: "Annonce trompeuse ou fausse", abuse: "Harcèlement ou abus", other: "Autre" },
  details: "Expliquez le problème et pourquoi",
  email: "Votre email (facultatif, pour vous répondre)",
  goodFaith: "Je confirme que ce signalement est exact et fait de bonne foi.",
  submit: "Envoyer le signalement",
  thanks: "Merci. Nous allons examiner votre signalement.",
  error: "Une erreur s'est produite. Réessayez ou écrivez à stoway.support@gmail.com.",
},
account: {
  settings: "Paramètres du compte",
  name: "Nom",
  email: "Email",
  deleteTitle: "Supprimer le compte",
  deleteWarning: "Cette action supprime définitivement votre compte, vos annonces et photos, vos favoris et vos conversations. Elle est irréversible.",
  deleteConfirm: "Saisissez votre email pour confirmer",
  deleteButton: "Supprimer définitivement mon compte",
  deleted: "Votre compte a été supprimé.",
},
hostTerms: {
  label: "J'accepte la responsabilité des biens stockés dans mon espace, conformément à la section 4.6 des {terms}.",
  required: "Veuillez accepter pour publier votre annonce.",
},
// inside auth:
acceptTerms: "J'ai 18 ans ou plus et j'accepte les {terms}. J'ai lu la {privacy}.",
```

## Done when

- [ ] A signed-out visitor can report a listing; a signed-in user can report a conversation. A new row appears in Supabase → Table Editor → `reports`, and an email arrives at stoway.support@gmail.com.
- [ ] Account settings is reachable from the avatar menu. Deleting an account removes the user's photos from Storage, their listings, favourites and conversations, and signs them out.
- [ ] A listing cannot be published without ticking the responsibility checkbox; new rows in `listings` have `host_terms_accepted_at` and `host_terms_version` filled in.
- [ ] Sign-up is blocked until the terms checkbox is ticked; new users have `terms_accepted_at` and `terms_version` in their metadata.
- [ ] `/how-it-works` renders in all five languages, and its link to section 4.6 opens the Terms without a full reload.
- [ ] The footer shows How it works · List your space · Terms & Privacy · Contact · Complaints book, and "© {year} Stoway · Made in Lisbon", translated.
- [ ] "List your space" in the footer works from every page, signed in or out.
- [ ] `npm run build` and `npm run lint` pass.
