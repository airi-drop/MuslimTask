# Requirements Document

> Spec ID: `phase-2-design-system`
> Source PRD: `MIHRAB-PRD-v2.md` §§1.1, 1.2, 1.3, 1.5, 1.6
> UI Reference: `MIHRAB-UI-REFERENCE.md`
> Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Adhan.js, localStorage
> Predecessor: `phase-1-rename` (complete)

## Introduction

Phase 2 lays the design-system foundation for Mihrab without touching page
components. It introduces the PRD §1.1 color tokens, the §1.5 utility CSS,
the §1.3 theme module, repoints the manifest at the static PNG icon assets
already present in `/public/`, and swaps the inline `<CrescentLogo />` SVG
inside the navbar's existing gradient backplate for the new
`/public/logo.svg`.

**Operating principle for this phase: additive, non-breaking, reversible.**
Every existing page must keep rendering identically with no class-name
churn, no font swap, and no theme-toggle regression. Component-level
migration to the new tokens is deferred to Phase 3+.

### In scope

| Area | Files |
|---|---|
| Tailwind tokens (additive) | `tailwind.config.ts` |
| Global utilities | `src/app/globals.css` |
| Theme module (new) | `src/lib/theme.ts` |
| PWA manifest icons | `src/app/manifest.ts` |
| Navbar logo (single inline-SVG swap) | `src/components/Navbar.tsx` (two `<CrescentLogo />` call sites only) |
| Asset verification | `public/logo.svg`, `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`, `public/apple-touch-icon.png`, `public/favicon.png`, `public/icon-1024.png` |

### Out of scope (deferred)

- Migrating any component class names from `parchment-*` / `emerald-*` /
  `neon-*` / `space-*` / `amber-*` to the new `bg-*` / `green-*` / `gold-*` /
  `text-*` PRD tokens. Legacy tokens stay live alongside the new ones.
- Changing fonts (`Inter` / `Space_Grotesk` / `Amiri` stay in `layout.tsx`);
  PRD §1.2 (Cormorant / Cinzel / DM Sans) is deferred.
- Rewriting `src/components/ThemeToggle.tsx`. The existing `.dark`-class +
  `mt:theme` localStorage path keeps working. The new `theme.ts` runs in
  bridge mode (writes both attribute and class, reads both keys).
- Deleting the four dynamic icon routes (`src/app/icon.tsx`, `icon2.tsx`,
  `apple-icon.tsx`, `maskable-icon/route.tsx`). They will be left in place
  but unreferenced from the manifest.
- Editing any other `src/app/**/page.tsx` or `src/components/**` file.
- Adding `lucide-react` or any new dependency.
- The remaining Navbar tagline / Share-card subtitle ("QUEST IBADAH HARIAN")
  copy update — tracked from Phase 1 follow-ups, deferred again here.

## Glossary

- **PRD tokens** — the color names defined in PRD §1.1 (e.g. `bg-deepest`,
  `green-main`, `gold-light`, `text-primary`).
- **Legacy tokens** — the existing Tailwind palette used by every component
  today (`parchment-*`, `emerald-*`, `neon-*`, `space-*`, `amber-*`).
- **Bridge mode (theme)** — `theme.ts` writes the new `data-theme` attribute
  AND the legacy `.dark` class, and reads from both `mihrab-theme` and the
  legacy `mt:theme` localStorage keys. This guarantees the existing
  `ThemeToggle` continues to work unmodified while new code can target the
  PRD API.
- **Dual `darkMode` selector** — Tailwind `darkMode: ['class', '[data-theme="dark"]']`,
  so both selector strategies generate dark variants.
- **Static PNG icons** — the files in `/public/` (`icon-192.png`,
  `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`) that
  replace the dynamic icon routes as the manifest sources.
- **Inline `<CrescentLogo />`** — the small inline SVG component defined at
  the bottom of `src/components/Navbar.tsx`, rendered inside both the
  desktop and mobile navbar logo backplates.

## Requirements

### Requirement 1: Tailwind tokens (additive)

**User Story:** As a developer building Phase 3+ components, I want the
PRD §1.1 color tokens available in Tailwind without losing the legacy
palette, so I can adopt the new design system component by component
without breaking existing pages.

#### Acceptance Criteria

1. **R1.1** `tailwind.config.ts` SHALL extend `theme.extend.colors` with the PRD §1.1 tokens — `bg-deepest`, `bg-deep`, `bg-mid`, `bg-surface`, `bg-raised`, `bg-card`; `green-dim`, `green-mid`, `green-main`, `green-light`, `green-glow`; `gold-dim`, `gold-mid`, `gold-main`, `gold-light`, `gold-glow`; `text-primary`, `text-secondary`, `text-muted`, `text-ghost`; and the light-mode overrides `light-bg`, `light-bg-card`, `light-bg-surface`, `light-text`, `light-text-muted`, `light-green`, `light-gold` — using the exact hex values from PRD §1.1.
2. **R1.2** `tailwind.config.ts` SHALL keep the legacy `parchment`, `emerald`, `amber`, `neon`, `space` color palettes byte-identical so existing component class names continue to resolve.
3. **R1.3** `tailwind.config.ts` SHALL change `darkMode` from `"class"` to `['class', '[data-theme="dark"]']` so dark-variant utilities trigger on both the legacy `.dark` class AND the new `data-theme="dark"` attribute.
4. **R1.4** `tailwind.config.ts` SHALL extend `theme.extend.fontFamily` with two new keys, `ornament` and `ui`, mapped to the PRD-recommended stacks (`['Cinzel', 'serif']` and `['DM Sans', 'sans-serif']` respectively). The existing `display`, `sans`, and `arabic` keys SHALL remain unchanged so current components keep their fonts.
5. **R1.5** `tailwind.config.ts` SHALL extend `theme.extend.fontSize` with `xxs: '0.625rem'` (PRD §1.1).
6. **R1.6** `tailwind.config.ts` SHALL extend `theme.extend.animation` with `pulse-gold`, `fade-in`, `slide-up`, `shimmer`, and SHALL extend `theme.extend.keyframes` with the matching `pulseGold`, `fadeIn`, `slideUp`, `shimmer` definitions (PRD §1.1). Existing `glow` and `spin-slow` animations SHALL remain.
7. **R1.7** `tailwind.config.ts` SHALL NOT change the existing `borderRadius` scale. Tailwind's defaults for `xl` (12px) and `2xl` (16px) and `3xl` (24px) are already used by every component; the PRD §1.1 override (`xl: 16px`, `2xl: 24px`, `3xl: 32px`) is deferred to avoid silently shifting every rounded corner in the app.
8. **R1.8** Running `npm run build` after the token additions SHALL succeed with no new TypeScript or ESLint errors.

### Requirement 2: Global CSS utilities

**User Story:** As a developer building responsive Mihrab UI, I want the
PRD §1.5 utility classes available globally so I can apply safe-area
padding, dynamic viewport height, and minimum touch targets uniformly.

#### Acceptance Criteria

1. **R2.1** `src/app/globals.css` SHALL append (not replace) the four PRD §1.5 utility blocks: `.pb-safe`, `.pt-safe`, `.touch-target`, `.h-dvh`.
2. **R2.2** `src/app/globals.css` SHALL append the `* { -webkit-tap-highlight-color: transparent; }` rule.
3. **R2.3** `src/app/globals.css` SHALL append `html { scroll-behavior: smooth; }`.
4. **R2.4** `src/app/globals.css` SHALL preserve the existing `:root` / `.dark` CSS variables, the `body` background-image dot grid, all `@layer components` rules (`.card`, `.card-feature`, `.pill`, `.stat-tile`, `.hud-frame`, `.arabic`, `.text-glow-neon`, `.text-glow-amber`), and the scrollbar styles byte-identical.
5. **R2.5** New utilities SHALL be placed at the end of the file, after the existing scrollbar block, with a clear comment header (`/* Phase 2 — PRD §1.5 utilities */`).

### Requirement 3: Theme module (bridge mode)

**User Story:** As a developer adopting the PRD §1.3 theme API, I want a
`src/lib/theme.ts` module that exposes `getTheme` / `setTheme` / `initTheme`
backed by `localStorage["mihrab-theme"]` and `data-theme` on `<html>`,
while still keeping the existing `ThemeToggle` (`.dark` class +
`mt:theme`) working untouched.

#### Acceptance Criteria

1. **R3.1** A new file `src/lib/theme.ts` SHALL be created exporting `Theme` (`'dark' | 'light'`), `THEME_KEY` (= `'mihrab-theme'`), `getTheme()`, `setTheme(theme: Theme): void`, and `initTheme(): void`.
2. **R3.2** `getTheme()` SHALL return the value of `localStorage[THEME_KEY]` if set, otherwise the value of `localStorage["mt:theme"]` (legacy key) if set, otherwise `'dark'`. SSR-safe: returns `'dark'` when `window` is undefined.
3. **R3.3** `setTheme(theme)` SHALL: (a) write the value to `localStorage[THEME_KEY]`, (b) ALSO write the value to `localStorage["mt:theme"]` so the legacy `ThemeToggle` reads it after refresh, (c) set `document.documentElement.setAttribute('data-theme', theme)`, (d) toggle `document.documentElement.classList.toggle('dark', theme === 'dark')` so legacy `.dark`-prefixed CSS keeps working.
4. **R3.4** `initTheme()` SHALL call `getTheme()` and apply both the attribute and the class as in R3.3.
5. **R3.5** `theme.ts` SHALL NOT import from `ThemeToggle.tsx` or any other module to avoid circular bootstrapping.
6. **R3.6** `src/components/ThemeToggle.tsx` SHALL NOT be edited in this phase. Its current `KEY = "mt:theme"` and `applyTheme()` continue to drive the `.dark` class as today.
7. **R3.7** `src/app/layout.tsx` SHALL NOT be edited in this phase to wire `initTheme()`. The existing `themeBootScript` already handles the no-flash boot. (A future phase will replace `themeBootScript` with a script that calls `initTheme()` once `ThemeToggle` itself is migrated.)

### Requirement 4: Manifest icons

**User Story:** As a user installing the Mihrab PWA, I want the home-screen
and splash-screen icons to come from the static PNG assets shipped in
`/public/` so the install identity uses production-ready bitmaps instead
of dynamically rendered "M" placeholders.

#### Acceptance Criteria

1. **R4.1** `src/app/manifest.ts` `icons` array SHALL be replaced with three entries: `{ src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" }`, `{ src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" }`, `{ src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }`.
2. **R4.2** All other `manifest.ts` fields from Phase 1 (`name`, `short_name`, `description`, `start_url`, `scope`, `display`, `orientation`, `theme_color`, `background_color`, `lang`, `categories`, `shortcuts`) SHALL remain byte-identical.
3. **R4.3** Apple-specific icon discovery SHALL keep working via the existing `<link rel="apple-touch-icon">` / `apple-touch-icon.png` convention. `apple-touch-icon.png` is in `/public/` and is auto-served by Next.js at `/apple-touch-icon.png` without any code change.
4. **R4.4** The dynamic icon routes (`src/app/icon.tsx`, `src/app/icon2.tsx`, `src/app/apple-icon.tsx`, `src/app/maskable-icon/route.tsx`) SHALL NOT be deleted in this phase. They will become orphans (unreferenced by the manifest) and are scheduled for removal in a later phase.

### Requirement 5: Navbar logo swap

**User Story:** As a user opening any Mihrab page, I want the navbar to
display the new mihrab-arch logo instead of the legacy crescent-and-star
inline SVG, so the brand asset matches the rebrand.

#### Acceptance Criteria

1. **R5.1** In `src/components/Navbar.tsx`, BOTH inline `<CrescentLogo … />` call sites (one in the desktop top nav around line 51, one in the mobile top bar around line 137) SHALL be replaced with `next/image` rendering `/logo.svg` at exactly 28×28 CSS pixels, with `alt="Mihrab"` and `priority` for the desktop instance.
2. **R5.2** The surrounding gradient backplate (`<div className="relative grid h-11 w-11 ...">` desktop, `<div className="relative grid h-9 w-9 ...">` mobile) and the neon glow dot SHALL remain unchanged. Only the inner inline SVG is swapped.
3. **R5.3** The `CrescentLogo` function definition at the bottom of `Navbar.tsx` SHALL remain in the file (unused) to avoid touching the surrounding helper-icon block. It MAY be deleted in a later phase.
4. **R5.4** `next/image` SHALL be imported at the top of `Navbar.tsx` (`import Image from "next/image";`) if not already present.
5. **R5.5** No other JSX, classes, or icon components in `Navbar.tsx` SHALL be modified.

### Requirement 6: Asset verification

**User Story:** As a maintainer validating the rebrand assets, I want the
seven required logo / icon files present and serving the new Mihrab
artwork.

#### Acceptance Criteria

1. **R6.1** `/public/logo.svg`, `/public/icon-192.png`, `/public/icon-512.png`, `/public/icon-maskable-512.png`, `/public/apple-touch-icon.png`, `/public/favicon.png`, `/public/icon-1024.png` SHALL all exist on disk.
2. **R6.2** `/public/logo.svg` SHALL be the new mihrab-arch artwork (background `#0C1A14`, gold arch). The existing file already matches this; verification only.
3. **R6.3** No PNG asset SHALL be modified in this phase. Implementation only verifies presence and lets `manifest.ts` reference them.
4. **R6.4** If any required file is missing on the implementer's machine, implementation SHALL stop and report the missing file rather than fabricating a placeholder.

### Requirement 7: Backward compatibility

**User Story:** As an existing user upgrading to a Phase 2 build, I want
every page to render identically to Phase 1, with no broken styles, no
broken theme toggle, and no broken share/install flows.

#### Acceptance Criteria

1. **R7.1** Every existing page (Beranda, Quest, Tasbih, Statistik, Achievement, Mihrab hub, Quran reader, Doa, Dzikir, Settings, Offline) SHALL render with the same visual output as before Phase 2 — same fonts, same colors, same layout.
2. **R7.2** `ThemeToggle` (the round button in the navbar) SHALL continue to switch between light and dark mode with no regression.
3. **R7.3** `npm run build` and `npm run lint` SHALL succeed with no new errors introduced by this phase.
4. **R7.4** No `console` warnings or errors SHALL be introduced at runtime by the additions in `theme.ts`, `globals.css`, or `tailwind.config.ts`.

## Acceptance Criteria (rollup)

- **A1** `tailwind.config.ts` defines all PRD §1.1 color tokens AND retains every legacy color, with `darkMode` as `['class', '[data-theme="dark"]']`. New `ornament` / `ui` font families and `xxs` font size are present. New animations (`pulse-gold`, `fade-in`, `slide-up`, `shimmer`) are present alongside legacy `glow` / `spin-slow`.
- **A2** `src/app/globals.css` contains the four utility classes (`.pb-safe`, `.pt-safe`, `.touch-target`, `.h-dvh`), the global tap-highlight reset, and `html { scroll-behavior: smooth; }` appended at the end. All pre-existing rules are preserved.
- **A3** `src/lib/theme.ts` exists and exports `Theme`, `THEME_KEY`, `getTheme`, `setTheme`, `initTheme` per R3.1–R3.5. Calling `setTheme('dark')` from a browser console mutates both `mihrab-theme` AND `mt:theme` localStorage entries, sets `data-theme="dark"` on `<html>`, and adds the `.dark` class.
- **A4** `src/app/manifest.ts` `icons` array references the three static PNGs (R4.1) and every other field is unchanged from Phase 1.
- **A5** `src/components/Navbar.tsx` renders `<Image src="/logo.svg" width={28} height={28} alt="Mihrab" />` inside both the desktop and mobile gradient backplates, replacing the prior `<CrescentLogo />` calls.
- **A6** All seven files from R6.1 are present in `/public/`.
- **A7** `npm run build` and `npm run lint` succeed with no new errors.
- **A8** Manual smoke (Beranda + Quest + Settings) shows no visual regression from Phase 1; the theme toggle still works.

## Non-goals (will NOT change in this phase)

- Component class-name migration to PRD tokens.
- Font swap (Cormorant / Cinzel / DM Sans) — `layout.tsx` and the loaded
  `Inter` / `Space_Grotesk` / `Amiri` families stay.
- Borderradius scale override (PRD §1.1 `xl: 16px`, `2xl: 24px`,
  `3xl: 32px`).
- ThemeToggle rewrite or theme-boot-script swap in `layout.tsx`.
- Bottom-nav redesign / new routes / max-width shell.
- Deleting dynamic icon routes.
- Any IndexedDB / localStorage schema change.

## Open questions

- **O-1 Borderradius override timing.** PRD §1.1 specifies a different
  scale for `xl` / `2xl` / `3xl` than Tailwind's defaults. Adopting now
  changes every rounded corner in every existing component. Recommend
  adopting in Phase 3 alongside the component migration. R1.7 reflects
  this. Confirm or override.
- **O-2 Dynamic icon routes lifecycle.** Once the manifest is repointed,
  the four dynamic routes serve nothing meaningful. They will need
  deletion. Recommend a small follow-up spec dedicated to that cleanup.
- **O-3 Font migration.** PRD §1.2 asks for Cormorant / Cinzel / DM Sans.
  This phase does not load them (would force a `layout.tsx` edit, which
  the user excluded). Future phase needs to swap in `next/font/google`
  imports and update `tailwind.config.ts` `fontFamily` mappings.

## Risks

- **Risk-Token-Collisions** Tailwind's color-key resolution prefers nested
  objects; we are using flat hyphenated keys (`'bg-deepest'`, `'green-main'`).
  This is a documented Tailwind pattern but must be tested by generating a
  utility (e.g. `bg-bg-deepest`, `bg-green-main`) and confirming it
  compiles. Mitigated by R1.8 / A7 (build must succeed).
- **Risk-Logo-Aspect** `/public/logo.svg` is square (4000×4000 viewBox). At
  28×28 inside a 44×44 (desktop) or 36×36 (mobile) backplate it will fit
  visually, but the legacy `<CrescentLogo />` was 24×24 (desktop) /
  16×16 (mobile). The new size is a deliberate change toward the PRD
  brand presence; documented here so it isn't a surprise.
- **Risk-Bridge-Drift** Bridge mode in `theme.ts` keeps two storage keys
  in sync. If a future contributor uses only `setTheme` from one side
  and only `localStorage.getItem("mt:theme")` from the other, drift is
  possible. Mitigated by R3.3 dual-write; long-term fix is to migrate
  ThemeToggle and delete the legacy key in a later phase.
- **Risk-Manifest-Cache** Browsers cache `manifest.webmanifest`. Already
  documented in Phase 1. The Phase 1 SW VERSION bump (`v1.2.0`) ensures
  most users will refetch on next visit; users with the app already
  pinned to a home screen may still need to reinstall to see the new
  PNG icons.
