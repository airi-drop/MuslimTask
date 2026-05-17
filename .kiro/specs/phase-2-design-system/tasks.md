# Implementation Plan: Phase 2 — Design System & Tailwind Update

> Spec ID: `phase-2-design-system`
> Companions: [requirements.md](./requirements.md), [design.md](./design.md)

## Overview

Tasks 1–5 are independent leaf edits, each maps to a single design
sub-change and a single file (or new file). Task 0 verifies the asset
inventory before any code change so we fail fast on missing PNGs.
Task 6 is the verification gate and depends on tasks 0–5.

## Tasks

- [ ] 0. Verify asset inventory
  - List `/public/` and confirm all seven required files exist on disk:
    `logo.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`,
    `apple-touch-icon.png`, `favicon.png`, `icon-1024.png`.
  - If any file is missing, halt the phase and report it. Do NOT generate
    placeholder assets.
  - Spot-check `public/logo.svg`: confirm it's the new mihrab-arch artwork
    (background `#0C1A14`, gold arch). Verification only — do not modify.
  - _Design ref: Components and Interfaces → Asset verification_ · _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 1. Extend Tailwind tokens
  - In `tailwind.config.ts`:
    - Change `darkMode: "class"` to `darkMode: ["class", '[data-theme="dark"]']`.
    - Add the PRD §1.1 colors (flat hyphenated keys: `bg-deepest`, `bg-deep`, `bg-mid`, `bg-surface`, `bg-raised`, `bg-card`, `green-dim`, `green-mid`, `green-main`, `green-light`, `green-glow`, `gold-dim`, `gold-mid`, `gold-main`, `gold-light`, `gold-glow`, `text-primary`, `text-secondary`, `text-muted`, `text-ghost`, `light-bg`, `light-bg-card`, `light-bg-surface`, `light-text`, `light-text-muted`, `light-green`, `light-gold`) at the top of `theme.extend.colors`, BEFORE the existing palette blocks.
    - Add `ornament: ["Cinzel", "serif"]` and `ui: ["DM Sans", "sans-serif"]` to `theme.extend.fontFamily` without touching `display`, `sans`, `arabic`.
    - Add `theme.extend.fontSize: { xxs: "0.625rem" }`.
    - Add four animations (`pulse-gold`, `fade-in`, `slide-up`, `shimmer`) and four matching keyframes (`pulseGold`, `fadeIn`, `slideUp`, `shimmer`) alongside the existing `glow` / `spin-slow`.
  - Do NOT modify `content`, `boxShadow`, `backgroundImage`, `gridTemplateColumns`, or add a `borderRadius` override.
  - Do NOT remove or rename any legacy color block (`parchment`, `emerald`, `amber`, `neon`, `space`).
  - _Design ref: Components and Interfaces → `tailwind.config.ts`_ · _Requirements: 1.1–1.7_

- [ ] 2. Append PRD §1.5 utilities to globals.css
  - In `src/app/globals.css`, append a new block at the very end of the file (after the `::-webkit-scrollbar*` rules) with the PRD §1.5 utilities: `.pb-safe`, `.pt-safe`, `.touch-target`, the global `* { -webkit-tap-highlight-color: transparent; }` reset, `.h-dvh`, and `html { scroll-behavior: smooth; }`.
  - Prefix the block with the comment header `/* Phase 2 — PRD §1.5 utilities */`.
  - Do NOT modify or remove any pre-existing rule (`:root`, `.dark`, `body`, `@layer components`, scrollbar styles).
  - _Design ref: Components and Interfaces → `src/app/globals.css`_ · _Requirements: 2.1–2.5_

- [ ] 3. Create theme module (bridge mode)
  - Create new file `src/lib/theme.ts`.
  - Export `Theme = "dark" | "light"`, `THEME_KEY = "mihrab-theme"`, and (for visibility) `LEGACY_THEME_KEY = "mt:theme"`.
  - Export `getTheme()`: SSR-guard returns `"dark"`; otherwise returns `localStorage[THEME_KEY]` if `"dark"|"light"`, else `localStorage[LEGACY_THEME_KEY]` if `"dark"|"light"`, else `"dark"`.
  - Export `setTheme(theme)`: SSR-guard no-op; writes to BOTH `localStorage[THEME_KEY]` AND `localStorage[LEGACY_THEME_KEY]`; sets `data-theme` attribute on `<html>`; toggles `.dark` class on `<html>`.
  - Export `initTheme()`: SSR-guard no-op; reads `getTheme()` and applies attribute + class (without re-writing localStorage).
  - Do NOT import any other project module. Do NOT touch `ThemeToggle.tsx` or `layout.tsx`.
  - _Design ref: Components and Interfaces → `src/lib/theme.ts` (new file)_ · _Requirements: 3.1–3.7_

- [ ] 4. Repoint manifest icons to static PNGs
  - In `src/app/manifest.ts`: replace the four-entry `icons` array with the three-entry array referencing `/icon-192.png` (192×192, any), `/icon-512.png` (512×512, any), `/icon-maskable-512.png` (512×512, maskable).
  - Do NOT modify any other manifest field (`name`, `short_name`, `description`, `start_url`, `scope`, `display`, `orientation`, `theme_color`, `background_color`, `lang`, `categories`, `shortcuts`).
  - Do NOT delete or modify the dynamic icon routes (`src/app/icon.tsx`, `icon2.tsx`, `apple-icon.tsx`, `maskable-icon/route.tsx`). They become orphans, intentional.
  - _Design ref: Components and Interfaces → `src/app/manifest.ts`_ · _Requirements: 4.1–4.4_

- [ ] 5. Swap Navbar logo to Mihrab arch
  - In `src/components/Navbar.tsx`:
    - Add `import Image from "next/image";` near the top (alongside the existing `next/link` and `next/navigation` imports).
    - Desktop top nav (~line 51): replace `<CrescentLogo className="h-6 w-6" />` with `<Image src="/logo.svg" alt="Mihrab" width={28} height={28} priority />`. Keep the surrounding `<div className="relative grid h-11 w-11 ...">` and the trailing neon-dot `<span>` exactly as today.
    - Mobile top bar (~line 137): replace `<CrescentLogo className="h-4 w-4" />` with `<Image src="/logo.svg" alt="Mihrab" width={28} height={28} />`. Keep the surrounding `<div className="relative grid h-9 w-9 ...">`.
  - Do NOT delete the `CrescentLogo` function definition near the bottom of the file (it remains unused intentionally).
  - Do NOT modify any other class, JSX block, or icon component in `Navbar.tsx`.
  - _Design ref: Components and Interfaces → `src/components/Navbar.tsx`_ · _Requirements: 5.1–5.5_

- [ ] 6. Verify the design-system additions
  - Depends on tasks 0–5.
  - Static grep:
    - `grep -n "darkMode" tailwind.config.ts` shows the dual selector `["class", '[data-theme="dark"]']`.
    - `grep -n "parchment\|emerald\|neon\|space\|amber" tailwind.config.ts` still matches all five legacy palette blocks.
    - `grep -n "CrescentLogo" src/components/Navbar.tsx` returns exactly one match (the unused function definition); zero JSX call sites.
    - `grep -n "Image src=\"/logo.svg\"" src/components/Navbar.tsx` returns exactly two matches.
  - Run `npm run lint` and `npm run build`; both must complete without new errors introduced by this phase.
  - Spot-check `src/app/manifest.ts`: `icons` array has exactly three entries (`/icon-192.png`, `/icon-512.png`, `/icon-maskable-512.png`).
  - Document any check (DevTools manifest preview, runtime theme bridge equivalence, visual smoke pass) that cannot be exercised in this environment.
  - _Design ref: Testing Strategy_ · _Requirements: 7.3, A1–A8_

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["0", "1", "2", "3", "4", "5"],
      "description": "Independent edits — each touches a disjoint file (or creates a new one)."
    },
    {
      "wave": 2,
      "tasks": ["6"],
      "description": "Verification gate — runs after all foundational edits land."
    }
  ]
}
```

Visual:

```
0 ──┐
1 ──┤
2 ──┼──▶ 6 (verification)
3 ──┤
4 ──┤
5 ──┘
```

- Task 0 is the asset-inventory gate; if assets are missing, the phase
  halts before any code change. In practice it can run alongside the
  other leaves because the file-system inspection is read-only.
- Tasks 1–5 are independent leaf edits and may run in any order or in
  parallel. Each touches a disjoint file (or creates a new one).
- Task 6 (verification) depends on tasks 0–5. It must run last.

## Notes

- **Additive-only mindset.** Phase 2 must not modify any page component
  class names, fonts, or storage keys consumed by Phase 1 code. Token
  migration belongs to Phase 3+.
- **No new dependencies.** No `lucide-react`, no test framework, no
  Google-Fonts loader. Cinzel and DM Sans become addressable via Tailwind
  `font-ornament` / `font-ui` but are not loaded yet.
- **Three intentional orphans.** After Phase 2 lands, `src/app/icon.tsx`,
  `src/app/icon2.tsx`, `src/app/apple-icon.tsx`,
  `src/app/maskable-icon/route.tsx`, and the `CrescentLogo` function in
  `src/components/Navbar.tsx` are all unreferenced. They stay in place to
  avoid touching unrelated files; cleanup is deferred to a follow-up
  spec.
- **Mobile logo is visibly bigger.** The 16×16 inline crescent inside the
  36×36 mobile backplate becomes a 28×28 mihrab-arch render. Documented as
  Risk-Logo-Aspect in requirements §Risks.
