# Requirements Document

> Spec ID: `phase-1-rename`
> Source PRD: `MIHRAB-PRD-v2.md` → "RENAME CHECKLIST" + §1.6 manifest update
> UI Reference: `MIHRAB-UI-REFERENCE.md`
> Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Adhan.js, localStorage

## Introduction

Rebrand the existing `MuslimTask` PWA to **Mihrab** at the identity layer
(name, manifest, SEO metadata, visible app text, PWA cache namespace) without
changing any feature logic, navigation structure, theme tokens, or storage
schema. After this phase, the app should still behave identically; only its
name, manifest, page titles, and PWA install identity reflect "Mihrab".

This phase is the **rename pass only**. Design-system tokens, fonts, theme
overhaul, bottom-nav restructure, and new routes (`/amal`, `/ibadah`,
`/profil`) are explicitly out of scope and tracked under PRD Phase 1.x–Phase 5+.

### In scope

| Area | Files |
|---|---|
| Package identity | `package.json` (name field) |
| README | `README.md` (title, hero copy) |
| PWA manifest | `src/app/manifest.ts` (name, short_name, description, theme_color, background_color, categories; shortcuts kept as-is) |
| Root SEO metadata | `src/app/layout.tsx` (title, description, applicationName, appleWebApp.title) |
| Per-route page titles | `src/app/offline/page.tsx`, `src/app/quest/page.tsx`, `src/app/settings/page.tsx`, `src/app/tasbih/page.tsx`, `src/app/mihrab/dzikir/page.tsx`, `src/app/mihrab/doa/page.tsx`, `src/app/mihrab/quran/bookmark/page.tsx`, `src/app/mihrab/quran/[surah]/page.tsx` |
| Visible UI strings | `src/components/Navbar.tsx`, `src/components/InstallPrompt.tsx` |
| Diagnostic strings | `src/components/PWARegister.tsx` (console prefix) |
| Share artifacts | `src/lib/share.ts` (canvas brand text, footer URL, share title/text), `src/components/ShareCardButton.tsx` (download filename prefix) |
| Service worker | `public/sw.js` (header comment, `CACHE_*` prefixes, activate cleanup filter, `VERSION` bump) |

### Out of scope (deferred)

- Tailwind theme tokens (`tailwind.config.ts`), Google Fonts swap, `globals.css` additions.
- Theme system rewrite (`src/lib/theme.ts`, `data-theme` attribute pattern).
- Bottom-nav redesign / new routes / new layout shell (`max-w-[430px]`).
- Storage key migration to `mihrab-*` namespace (PRD §3.3) — only ships with new features that consume those keys.
- Adding `lucide-react` or any new dependency.
- Domain change from `muslimtask.app` (see Open Question O-1).

## Glossary

- **Mihrab** — the new product name. Replaces "MuslimTask" everywhere except the deferred surfaces listed above.
- **Manifest** — the PWA web app manifest emitted by `src/app/manifest.ts` and served as `/manifest.webmanifest`.
- **Service worker (SW)** — `public/sw.js`, registered by `src/components/PWARegister.tsx` in production only.
- **Cache prefix** — the leading namespace on cache-storage keys created by the SW (`mt-*` today, `mh-*` after this phase).
- **`metadataBase`** — Next.js root URL used to build absolute OG/canonical URLs.
- **Per-route metadata** — exported `metadata` or `generateMetadata` objects on individual `app/**/page.tsx` files.

## Requirements

### Requirement 1: Package and repo identity

**User Story:** As a developer cloning the repo, I want `package.json` and `README.md` to identify the project as "Mihrab" so the project name on disk matches the product brand.

#### Acceptance Criteria

1. **R1.1** The `name` field in `package.json` SHALL be `"mihrab"`.
2. **R1.2** When `npm install` is run after the rename, `package-lock.json` SHALL be regenerated to reflect the new package name.
3. **R1.3** The top-level heading in `README.md` SHALL be `# Mihrab` and the hero paragraph SHALL describe Mihrab as a daily-worship-quality tracker (paraphrasing PRD §APP OVERVIEW), not "Quest ibadah harian".

### Requirement 2: PWA manifest

**User Story:** As a user installing the PWA, I want the home-screen icon, splash screen, and OS-level identity to read "Mihrab" so the installed app matches what I see in the browser.

#### Acceptance Criteria

1. **R2.1** `manifest.ts` SHALL set `name: "Mihrab"` and `short_name: "Mihrab"`.
2. **R2.2** `manifest.ts` SHALL set `description: "Tracker kualitas ibadah harian. Ukur, tingkatkan, banggakan perjalanan spiritualmu."` (verbatim from PRD §1.6).
3. **R2.3** `manifest.ts` SHALL set `theme_color: "#0C1A14"` and `background_color: "#050E08"` (PRD §1.6 values).
4. **R2.4** `manifest.ts` SHALL set `categories: ["lifestyle", "health"]` (PRD §1.6).
5. **R2.5** `manifest.ts` SHALL keep the existing four icon entries (`/icon`, `/icon2`, `/apple-icon`, `/maskable-icon`) unchanged. Rationale: the dynamic icon routes already exist and produce the required PNGs at the right sizes; deleting them would orphan working code. Static PNG references from PRD §1.6 are deferred to a future phase that swaps icon assets.
6. **R2.6** `manifest.ts` SHALL keep the existing `shortcuts` array unchanged (Quest / Tasbih / Al-Quran / Statistik). Their target routes still exist in this phase.
7. **R2.7** `manifest.ts` SHALL keep `start_url: "/"`, `scope: "/"`, `display: "standalone"`, `orientation: "portrait"`, `lang: "id"`.

### Requirement 3: Root layout SEO metadata

**User Story:** As a search engine or social-share crawler hitting any Mihrab page, I want the document `<title>`, description, and application identity to read "Mihrab" so previews and bookmarks reflect the rebrand.

#### Acceptance Criteria

1. **R3.1** `metadata.title` in `src/app/layout.tsx` SHALL be `"Mihrab — Tracker Kualitas Ibadah"`.
2. **R3.2** `metadata.description` SHALL be `"Tracker kualitas ibadah harian. Ukur, tingkatkan, banggakan perjalanan spiritualmu."` (matches manifest for SEO consistency).
3. **R3.3** `metadata.applicationName` SHALL be `"Mihrab"`.
4. **R3.4** `appleWebApp.title` SHALL be `"Mihrab"`.
5. **R3.5** `metadata.formatDetection.telephone: false` SHALL be preserved.
6. **R3.6** `metadataBase` SHALL remain `https://muslimtask.app` for now; see Open Question O-1.
7. **R3.7** No theme-color, font, or viewport configuration SHALL change in this phase.

### Requirement 4: Per-route page metadata

**User Story:** As a user with a tab open on any Mihrab route, I want the browser-tab title to identify the page and end in "Mihrab" so I can recognise the app at a glance.

#### Acceptance Criteria

1. **R4.1** Every per-route `metadata` export currently formatted as `"<Page> — MuslimTask"` SHALL be reformatted to `"<Page> — Mihrab"`. Affected pages:
   - `src/app/offline/page.tsx` → `"Offline — Mihrab"`
   - `src/app/quest/page.tsx` → `"Quest — Mihrab"` (description unchanged)
   - `src/app/settings/page.tsx` → `"Pengaturan — Mihrab"`
   - `src/app/tasbih/page.tsx` → `"Tasbih Digital — Mihrab"` (description unchanged)
   - `src/app/mihrab/dzikir/page.tsx` → `"Dzikir — Mihrab"`
   - `src/app/mihrab/doa/page.tsx` → `"Doa Harian — Mihrab"` (description unchanged)
   - `src/app/mihrab/quran/bookmark/page.tsx` → `"Bookmark Al-Quran — Mihrab"`
   - `src/app/mihrab/quran/[surah]/page.tsx` → fallback `"Surah tidak ditemukan — Mihrab"`; dynamic title `"<NamaLatin> (<Arti>) — Mihrab"`.

### Requirement 5: Visible UI strings

**User Story:** As a user looking at any chrome surface (top nav, install prompt), I want the brand text to read "Mihrab" so the in-app experience matches the rebrand.

#### Acceptance Criteria

1. **R5.1** `src/components/Navbar.tsx` SHALL display `Mihrab` in the brand wordmark (both occurrences). Tagline / sub-text and styling tokens SHALL remain unchanged in this phase.
2. **R5.2** `src/components/InstallPrompt.tsx` install card title SHALL read `"Pasang Mihrab"`.

### Requirement 6: Diagnostic and developer strings

**User Story:** As a developer reading browser console output during PWA debugging, I want log prefixes to identify the app as "Mihrab" so logs are filterable and accurate.

#### Acceptance Criteria

1. **R6.1** The `console.warn` prefix in `src/components/PWARegister.tsx` SHALL be `"[Mihrab]"` (e.g. `"[Mihrab] SW registration failed"`).

### Requirement 7: Share artifacts

**User Story:** As a user sharing my progress card to social media, I want the brand text, footer URL, share title, hashtag, and downloaded filename to reference "Mihrab" so the artefact reflects the rebrand.

#### Acceptance Criteria

1. **R7.1** In `src/lib/share.ts`, the canvas brand text currently rendering `"MUSLIMTASK"` SHALL render `"MIHRAB"`.
2. **R7.2** In `src/lib/share.ts`, the canvas footer URL currently rendering `"muslimtask.app"` SHALL render `"mihrab.app"`. (See Open Question O-1: this string is decoupled from `metadataBase`; we update the visible footer to the target brand URL even if hosting hasn't moved yet.)
3. **R7.3** In `src/lib/share.ts`, the `navigator.share` payload SHALL use `title: "Mihrab"` and the default `text` SHALL replace the `#MuslimTask` hashtag with `#Mihrab` while keeping the rest of the copy intact.
4. **R7.4** In `src/components/ShareCardButton.tsx`, the downloaded PNG filename prefix SHALL be `"mihrab-streak-"` instead of `"muslimtask-streak-"`.

### Requirement 8: Service worker

**User Story:** As an existing user upgrading the installed PWA, I want the service worker to reactivate cleanly under the new brand and reclaim stale caches so the rebrand reaches my device without leaving orphan storage.

#### Acceptance Criteria

1. **R8.1** The header comment in `public/sw.js` SHALL read `"Mihrab Service Worker"`.
2. **R8.2** The cache-name prefix SHALL change from `mt-` to `mh-`. Specifically: ``CACHE_HTML = `mh-html-${VERSION}` ``, ``CACHE_STATIC = `mh-static-${VERSION}` ``, ``CACHE_DATA = `mh-data-${VERSION}` ``.
3. **R8.3** The `VERSION` constant SHALL bump from `"v1.1.0"` to `"v1.2.0"` so that the next install treats this as a new release.
4. **R8.4** The `activate` event cleanup filter SHALL delete BOTH legacy `mt-*` caches AND any `mh-*` caches that don't match the current version. The keep-list remains `[CACHE_HTML, CACHE_STATIC, CACHE_DATA]`, and the deletion predicate SHALL match keys starting with either `mt-` or `mh-`. This guarantees existing users on the old SW have their stale caches reclaimed on first activate of the new SW.
5. **R8.5** All other SW logic (precache list, fetch strategies, message handler) SHALL remain unchanged.

### Requirement 9: Storage compatibility

**User Story:** As an existing user with offline Quran data, bookmarks, streaks, and XP, I want my data to survive the rebrand so I don't lose progress.

#### Acceptance Criteria

1. **R9.1** `src/lib/idb.ts` `DB_NAME` SHALL remain `"muslimtask"` in this phase. Renaming the IndexedDB database orphans every existing user's offline Quran cache and bookmarks. A migration is required before changing this and is tracked under Open Question O-2.
2. **R9.2** No localStorage keys in `progress.ts`, `settings.ts`, `stats.ts`, `quests.ts`, `achievements.ts`, etc. SHALL be renamed in this phase.

## Acceptance Criteria (rollup)

- **A1** `grep -ri "MuslimTask"` against `src/`, `public/`, `README.md`, `package.json` returns zero matches (case-sensitive). The PRD and UI-reference markdown files are exempt.
- **A2** `grep -ri "muslim-task\|muslimtask"` against the same scope returns matches only in (a) `src/lib/idb.ts` (`DB_NAME = "muslimtask"`, intentional per R9.1) and (b) `src/app/layout.tsx` (`metadataBase` URL, intentional per R3.6 / O-1). All other matches are gone.
- **A3** Running `npm run build` (Next.js production build) completes without new TypeScript or lint errors introduced by this phase.
- **A4** Running `npm run dev` and opening Chrome DevTools → Application → Manifest shows: name `Mihrab`, short_name `Mihrab`, description matching R2.2, theme_color `#0C1A14`, background_color `#050E08`.
- **A5** DevTools → Application → Service Workers shows the registered SW; on a hard reload, the active caches are named `mh-html-v1.2.0`, `mh-static-v1.2.0`, `mh-data-v1.2.0`. Any pre-existing `mt-*` caches are deleted after activation.
- **A6** Browser tab title for the home route reads `Mihrab — Tracker Kualitas Ibadah`. Each per-route page from R4.1 shows its updated title.
- **A7** The Navbar brand wordmark renders `Mihrab` (desktop and mobile variants). The PWA install prompt card title renders `Pasang Mihrab`.
- **A8** Generating a streak share card (`ShareCardButton`) produces a PNG whose filename starts with `mihrab-streak-`, whose canvas reads `MIHRAB` in the header and `mihrab.app` in the footer, and whose `navigator.share` title is `Mihrab`.
- **A9** Existing IndexedDB-cached Quran data and localStorage progress/streak/XP from a previous build SHALL still be readable after upgrade (regression check on R9.1 / R9.2).

## Non-goals (will NOT change in this phase)

- Tailwind theme tokens, dark/light palette, font families.
- Bottom-nav structure, route map, or layout shell width.
- IndexedDB schema or localStorage keys.
- Icon PNG assets (only manifest references; assets ship as-is).
- Hosting or domain configuration.
- Any business logic in `progress.ts`, `xp` calculation, prayer engine, achievements, quests, etc.

## Open questions

- **O-1 metadataBase domain.** The current `metadataBase` is `https://muslimtask.app`. Three options:
  1. Leave as-is for now (R3.6, current draft) — safest, defers DNS work.
  2. Change to `https://mihrab.app` immediately, even if not yet pointed at Vercel.
  3. Change to a placeholder env-driven value.
  Decision needed before merge so OG/canonical URLs are correct. Default in this spec: option 1.

- **O-2 IndexedDB rename.** PRD storage keys (`mihrab-profile`, etc., §3.3) imply an eventual rename of the DB too. Two paths:
  1. Keep `DB_NAME = "muslimtask"` forever (drift, but zero data loss).
  2. Add a one-shot migration: on first boot of the renamed app, copy data from `muslimtask` DB to `mihrab` DB, then delete the old one.
  This phase defers the decision (R9.1). Recommend tracking as a separate spec.

- **O-3 SEO root title.** R3.1 proposes `"Mihrab — Tracker Kualitas Ibadah"`. PRD doesn't pin an exact tagline. Confirm or override.

## Risks

- **Risk-SW** Bumping `VERSION` and changing the cache prefix in one release means returning users get a one-time cache miss and re-download of HTML/static assets. This is expected and the SW handles it via the activate cleanup. No data loss.
- **Risk-Cache-Stale** Browsers cache `manifest.webmanifest` aggressively in some installs. Users with the app already installed may need to reinstall to see the new name on the home-screen icon. Document this in PR notes.
- **Risk-Brand-Drift** If O-1 / O-3 are deferred indefinitely, `muslimtask.app` will linger in `metadataBase` and on canonical/OG URLs even though every visible string says Mihrab. Track as follow-up.
