# Design Document

> Spec ID: `phase-2-design-system`
> Companion: [requirements.md](./requirements.md)
> Approach: additive, non-breaking, reversible. New module created
> (`src/lib/theme.ts`); three files patched (`tailwind.config.ts`,
> `src/app/globals.css`, `src/app/manifest.ts`); one component touched at
> two call sites (`src/components/Navbar.tsx`); seven asset files
> verified, none modified.

## Overview

Phase 2 introduces the Mihrab design-system foundation without touching
any page component. The work falls into five independent sub-changes:

1. Extend the Tailwind config with PRD §1.1 color tokens, two new font
   keys (`ornament`, `ui`), the `xxs` font size, four new animations, and
   a dual `darkMode` selector. Legacy palette stays.
2. Append PRD §1.5 utility CSS (`.pb-safe`, `.pt-safe`, `.touch-target`,
   `.h-dvh`, tap-highlight reset, smooth scroll) to `globals.css`. Every
   existing rule is preserved.
3. Create `src/lib/theme.ts` exposing the PRD §1.3 API (`getTheme`,
   `setTheme`, `initTheme`, `THEME_KEY`) running in bridge mode: writes
   the new `data-theme` attribute AND the legacy `.dark` class, dual-
   writes both `mihrab-theme` and `mt:theme` localStorage keys.
4. Repoint `src/app/manifest.ts` `icons` at the three static PNGs already
   in `/public/`. The four dynamic icon routes are left as orphans.
5. Replace the two `<CrescentLogo />` call sites in
   `src/components/Navbar.tsx` with `next/image` rendering `/logo.svg` at
   28×28 px. Surrounding gradient backplates and neon dots stay.

No build pipeline, dependency, or page logic changes. Verification
relies on `npm run build`, `npm run lint`, static grep, and a manual
smoke pass.

## Architecture

The phase touches three architectural layers, all foundational. No
component or route consumes the new APIs yet; that is Phase 3+ work.

| Layer | Files | Change kind |
|---|---|---|
| Design tokens | `tailwind.config.ts` | Additive extension |
| Global CSS | `src/app/globals.css` | Append-only |
| Theme module | `src/lib/theme.ts` (new) | New file |
| PWA manifest | `src/app/manifest.ts` | Replace one array |
| Navbar branding | `src/components/Navbar.tsx` | Two-call-site swap + one import |
| Static assets | `public/*.png`, `public/logo.svg` | Verify only |

The PRD-recommended "wholesale replace" approach (PRD §1.1 says "Replace
the existing theme extension with…") is rejected here. Every existing
component depends on the legacy palette (`parchment-50`, `emerald-700`,
`neon-400`, `space-900`, `amber-300`, etc.). Wholesale replacement
violates the user's "do NOT change page components" constraint and
breaks every page until a separate migration ships. The additive
strategy is the only path that satisfies both the PRD's design-system
goals and the user's component-stability constraint in a single phase.

## Components and Interfaces

### `tailwind.config.ts`

The current export is a single `Config` object with `darkMode: "class"`
and a `theme.extend` block defining `colors`, `fontFamily`, `boxShadow`,
`backgroundImage`, `keyframes`, `animation`, `gridTemplateColumns`. We
edit four sub-fields and add three new sub-fields. Everything else is
preserved.

#### Edit 1: `darkMode`

Replace the line:
```ts
darkMode: "class",
```
with:
```ts
darkMode: ["class", '[data-theme="dark"]'],
```

This makes Tailwind generate `.dark .foo:bar` AND `[data-theme="dark"] .foo:bar`
selectors for every `dark:` utility, so both the legacy class-based path
and the new attribute-based path drive dark variants.

#### Edit 2: `theme.extend.colors`

Add the PRD §1.1 tokens as flat hyphenated keys at the top of the
`colors` object, BEFORE the existing `parchment` / `emerald` / `amber` /
`neon` / `space` blocks. Flat hyphenated keys (`'bg-deepest'`) are a
documented Tailwind pattern; they generate utilities like `bg-bg-deepest`
and `text-text-primary` (the leading prefix is the utility, the rest is
the key).

The exact additions (PRD §1.1 hex values, no edits):

```ts
// === Phase 2 — PRD §1.1 design tokens (additive) ===
"bg-deepest":  "#050E08",
"bg-deep":     "#081210",
"bg-mid":      "#0C1A14",
"bg-surface":  "#102018",
"bg-raised":   "#152A1E",
"bg-card":     "#1A3224",

"green-dim":   "#1E4A2E",
"green-mid":   "#2A6A3E",
"green-main":  "#3A8A52",
"green-light": "#4AAA66",
"green-glow":  "#5DC47A",

"gold-dim":    "#5A3A08",
"gold-mid":    "#8A5A0E",
"gold-main":   "#C4882A",
"gold-light":  "#D4A040",
"gold-glow":   "#E8BC5A",

"text-primary":   "#E8F0EC",
"text-secondary": "#7A9A86",
"text-muted":     "#3A5A44",
"text-ghost":     "#1E3028",

"light-bg":         "#F5F2EC",
"light-bg-card":    "#FFFFFF",
"light-bg-surface": "#EDE9E0",
"light-text":       "#1A2A1E",
"light-text-muted": "#8A9A8E",
"light-green":      "#2A6A3A",
"light-gold":       "#8A5A10",
```

The legacy `parchment`, `emerald`, `amber`, `neon`, `space` blocks below
remain byte-identical. Search-and-replace must preserve their order and
nesting.

#### Edit 3: `theme.extend.fontFamily`

Add two new keys without touching the existing three:

```ts
// existing entries preserved verbatim:
display: ['"Space Grotesk"', "var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
sans:    ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
arabic:  ['"Amiri"', '"Scheherazade New"', "serif"],
// new (Phase 2):
ornament: ["Cinzel", "serif"],
ui:       ["DM Sans", "sans-serif"],
```

The Google-Fonts `<link>` for Cinzel and DM Sans is **not** added in
this phase (would require editing `layout.tsx`). The font-family classes
will resolve to the listed family names; until fonts are loaded, the
browser falls back to the next entry in the stack. This is intentional
— the keys are addressable now so Phase 3+ component code can use
`font-ornament` / `font-ui`, and a later font-loading phase activates
them.

#### Edit 4: `theme.extend.fontSize`

Add a new key. Tailwind's default font-size scale is preserved.

```ts
fontSize: {
  xxs: "0.625rem", // 10px (PRD §1.1)
},
```

#### Edit 5: `theme.extend.animation` and `keyframes`

Add four animations and four keyframes blocks alongside the existing
`glow` and `spin-slow`. Both the existing entries and the new entries
must coexist in the merged object.

Animations (added):
```ts
"pulse-gold": "pulseGold 2s ease-in-out infinite",
"fade-in":    "fadeIn 0.3s ease-out",
"slide-up":   "slideUp 0.3s ease-out",
shimmer:      "shimmer 2s linear infinite",
```

Keyframes (added, exact PRD §1.1 syntax):
```ts
pulseGold: {
  "0%, 100%": { boxShadow: "0 0 4px rgba(196,136,42,0.3)" },
  "50%":      { boxShadow: "0 0 12px rgba(196,136,42,0.7)" },
},
fadeIn: {
  from: { opacity: "0" },
  to:   { opacity: "1" },
},
slideUp: {
  from: { transform: "translateY(16px)", opacity: "0" },
  to:   { transform: "translateY(0)",    opacity: "1" },
},
shimmer: {
  "0%":   { backgroundPosition: "-200% 0" },
  "100%": { backgroundPosition: "200% 0" },
},
```

#### Untouched fields

`content`, `boxShadow`, `backgroundImage`, `gridTemplateColumns`, and
`borderRadius` (Tailwind default) remain exactly as today. The PRD §1.1
borderradius override is deferred per requirements R1.7.

### `src/app/globals.css`

Append-only. The file currently ends with the scrollbar block. Add a
new block at the very end of the file:

```css
/* Phase 2 — PRD §1.5 utilities */

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.pt-safe {
  padding-top: env(safe-area-inset-top, 0px);
}

.touch-target {
  min-height: 48px;
  min-width: 48px;
}

* {
  -webkit-tap-highlight-color: transparent;
}

.h-dvh {
  height: 100dvh;
}

html {
  scroll-behavior: smooth;
}
```

Notes:
- The universal selector adds the tap-highlight reset globally. It does
  not visually change any existing page (no current style relies on the
  default highlight).
- The `html { scroll-behavior: smooth; }` rule is global and additive;
  no current style overrides it.
- The `.h-dvh` utility avoids collision with Tailwind's built-in
  `h-dvh` (Tailwind 3.4+) by declaring the same `height: 100dvh` value;
  if Tailwind's utility resolves first, the cascade favors the more
  specific (last-declared) rule, but both produce identical CSS.

The pre-existing `:root`, `.dark`, `body`, `@layer components`, and
`::-webkit-scrollbar*` rules are not edited.

### `src/lib/theme.ts` (new file)

A new client-only module exposing the PRD §1.3 theme API plus a bridge
to the legacy `.dark`-class + `mt:theme`-key system used by
`ThemeToggle.tsx`.

#### Public API

```ts
export type Theme = "dark" | "light";

export const THEME_KEY = "mihrab-theme";
export const LEGACY_THEME_KEY = "mt:theme"; // exported for visibility

export function getTheme(): Theme;
export function setTheme(theme: Theme): void;
export function initTheme(): void;
```

#### Behaviour

`getTheme()`:
1. SSR guard: if `typeof window === "undefined"`, return `"dark"`.
2. Read `localStorage[THEME_KEY]`. If `"light"` or `"dark"`, return it.
3. Else read `localStorage[LEGACY_THEME_KEY]`. If `"light"` or `"dark"`,
   return it.
4. Else return `"dark"` (PRD default).

`setTheme(theme)`:
1. SSR guard: no-op if `typeof window === "undefined"`.
2. `localStorage.setItem(THEME_KEY, theme)`.
3. `localStorage.setItem(LEGACY_THEME_KEY, theme)` so the legacy
   `ThemeToggle` reads the same value on its next render.
4. `document.documentElement.setAttribute("data-theme", theme)`.
5. `document.documentElement.classList.toggle("dark", theme === "dark")`.

`initTheme()`:
1. SSR guard: no-op if `typeof window === "undefined"`.
2. Read `getTheme()`.
3. Apply attribute and class as in `setTheme` steps 4–5 (without
   re-writing localStorage).

`initTheme()` is provided for future use; this phase does not call it
from `layout.tsx` (per R3.7). The existing `themeBootScript` already
guarantees no-flash boot via the `.dark` class. When `ThemeToggle` is
migrated in a later phase, the boot script will be replaced with a call
to `initTheme()`.

#### Independence

`theme.ts` does not import from any other project module. It is a leaf
module. `ThemeToggle.tsx` is not imported, edited, or referenced.

### `src/app/manifest.ts`

Replace only the `icons` array. Every other field stays identical to
its Phase 1 state.

Before (post-Phase 1):
```ts
icons: [
  { src: "/icon",          sizes: "192x192", type: "image/png", purpose: "any" },
  { src: "/icon2",         sizes: "512x512", type: "image/png", purpose: "any" },
  { src: "/apple-icon",    sizes: "180x180", type: "image/png", purpose: "any" },
  { src: "/maskable-icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
],
```

After (Phase 2):
```ts
icons: [
  { src: "/icon-192.png",          sizes: "192x192", type: "image/png", purpose: "any" },
  { src: "/icon-512.png",          sizes: "512x512", type: "image/png", purpose: "any" },
  { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
],
```

Note: the existing manifest had a 180×180 `apple-icon` entry. Apple's
"add to home screen" flow does NOT read the web app manifest icons
array; it reads the `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`
tag. Next.js auto-emits this link tag for any file at
`/public/apple-touch-icon.png`, which exists on disk. So removing the
180×180 entry from the manifest does not regress iOS install identity;
the dedicated `apple-touch-icon.png` route handles it.

### `src/components/Navbar.tsx`

Two surgical edits at the JSX level, plus one import.

#### Edit 1: import

Add at the top of the file (next to the existing `Link`, `usePathname`,
etc. imports):

```tsx
import Image from "next/image";
```

#### Edit 2: desktop logo (around line 51)

Replace this fragment:
```tsx
<div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-parchment-50 shadow-glow">
  <CrescentLogo className="h-6 w-6" />
  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-neon-400 animate-glow" />
</div>
```

with:
```tsx
<div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-parchment-50 shadow-glow">
  <Image src="/logo.svg" alt="Mihrab" width={28} height={28} priority />
  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-neon-400 animate-glow" />
</div>
```

The 44×44 backplate (`h-11 w-11`), the gradient, the `shadow-glow`, and
the neon dot remain. The 28×28 logo sits centered inside the 44×44
backplate (8px padding all around).

#### Edit 3: mobile logo (around line 137)

Replace this fragment:
```tsx
<div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-parchment-50 shadow-glow">
  <CrescentLogo className="h-4 w-4" />
</div>
```

with:
```tsx
<div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-parchment-50 shadow-glow">
  <Image src="/logo.svg" alt="Mihrab" width={28} height={28} />
</div>
```

The mobile 36×36 (`h-9 w-9`) backplate keeps its gradient and shadow.
The 28×28 logo sits inside with 4px padding all around. This is a
visible enlargement vs. the prior 16×16 inline SVG; documented as
Risk-Logo-Aspect in requirements.

#### Edit 4: leave `CrescentLogo` definition in place

The `function CrescentLogo({ className }: { className?: string })` block
near the bottom of the file is no longer called. It remains in the file
to keep the helper-icon block (`ChevronDownIcon`, `FlameIcon`, `BellIcon`,
`GearIcon`) untouched. A future cleanup phase deletes it.

### Asset verification

The implementation step verifies that all seven required files exist:

```
public/logo.svg
public/icon-192.png
public/icon-512.png
public/icon-maskable-512.png
public/apple-touch-icon.png
public/favicon.png
public/icon-1024.png
```

If any file is missing, implementation halts and reports it. This phase
does not modify any binary asset.

## Data Models

No data models change. New types introduced are local to `theme.ts`:

```ts
export type Theme = "dark" | "light";
```

Storage:
- New localStorage key: `mihrab-theme` (string `"dark"` or `"light"`).
- Legacy localStorage key: `mt:theme` (preserved, dual-written by
  `setTheme`).
- No IndexedDB change.
- No SW cache shape change.

## Correctness Properties

The phase must add the design-system foundation without changing any
visible page output, regressing the theme toggle, or breaking the build.

### Property 1: Build correctness

**Validates: Requirements 1.8, 7.3**

`npm run build` and `npm run lint` succeed with no new errors or
warnings introduced by Phase 2 changes. Tailwind successfully resolves
all new flat-key tokens (e.g. compiling `bg-bg-deepest` and
`text-text-primary` produces valid CSS).

### Property 2: Visual no-regression

**Validates: Requirements 1.2, 2.4, 7.1**

Every existing page route (`/`, `/quest`, `/tasbih`, `/statistik`,
`/achievement`, `/mihrab`, `/mihrab/quran`, `/mihrab/quran/[surah]`,
`/mihrab/quran/bookmark`, `/mihrab/doa`, `/mihrab/dzikir`, `/settings`,
`/offline`) renders with the same fonts, colors, layout, and dark-mode
behavior as before this phase. The only deliberate visual delta is the
navbar logo (R5 / Property 4).

### Property 3: Theme bridge equivalence

**Validates: Requirements 3.2, 3.3, 7.2**

For any value `t ∈ {"dark", "light"}`, calling `setTheme(t)` produces
the same observable state as the legacy `ThemeToggle.toggle()` would
when transitioning to `t`: the `<html>` element has the `.dark` class
iff `t === "dark"`, the `data-theme` attribute equals `t`,
`localStorage["mt:theme"]` equals `t`, and `localStorage["mihrab-theme"]`
equals `t`. Conversely, after `ThemeToggle.toggle()` runs (which writes
only `mt:theme` and toggles `.dark`), a subsequent `getTheme()` call
returns the toggled value via the legacy-key fallback in step 3 of the
read order.

### Property 4: Logo swap correctness

**Validates: Requirements 5.1, 5.2, 5.4**

After the navbar swap, `Navbar.tsx` contains zero `<CrescentLogo />`
JSX usages and exactly two `<Image src="/logo.svg" … />` usages, both
nested inside their respective gradient backplates. The desktop usage
has `priority`; the mobile usage does not. Both render at exactly
28×28 CSS pixels. The function `CrescentLogo(...)` definition still
exists in the file (unused, intentional).

### Property 5: Manifest icon repointing

**Validates: Requirements 4.1, 4.2**

After the manifest edit, `manifest.ts` `icons` array equals exactly
three entries pointing at `/icon-192.png`, `/icon-512.png`,
`/icon-maskable-512.png` with the correct `sizes`, `type`, and
`purpose`. All other manifest fields are byte-identical to the Phase 1
output.

## Error Handling

| Failure mode | Mitigation |
|---|---|
| Missing PNG asset on disk | Verification step lists all seven files; if any is absent, halt and report (R6.4). Do not fabricate placeholders. |
| Tailwind compile error from flat-key tokens | Build runs as part of verification (Property 1). If Tailwind rejects a key (e.g. shadowed by a plugin), the build fails fast with a line-numbered error. |
| `theme.ts` called during SSR | Every public function guards on `typeof window === "undefined"` and returns a sensible default (R3.2 step 1). |
| User has stale `mt:theme` value but no `mihrab-theme` | `getTheme()` falls back through to `mt:theme` (read order step 3). After the next `setTheme` call, both keys are populated. No data loss. |
| `next/image` complaints about `/logo.svg` | `next.config.mjs` does not block SVG imports for `next/image`; SVGs are served as-is, no `dangerouslyAllowSVG` is required for static `/public/` assets referenced by absolute path. If a runtime warning surfaces, document and revisit. |
| Manifest cache stale on installed PWAs | Phase 1 already bumped SW `VERSION` to `v1.2.0`. Most users will refetch the manifest; pinned home-screen icons may need reinstall. Documented as Risk-Manifest-Cache. |

## Testing Strategy

No test framework is added in this phase (consistent with Phase 1).
Verification relies on:

1. **Static grep checks** for backward-compat invariants:
   - `grep -n "darkMode" tailwind.config.ts` → must show
     `darkMode: ["class", '[data-theme="dark"]']`.
   - `grep -n "parchment\|emerald\|neon\|space\|amber" tailwind.config.ts` →
     must still match the legacy palette blocks.
   - `grep -n "CrescentLogo" src/components/Navbar.tsx` → exactly one
     match (the unused function definition); zero JSX call sites.
   - `grep -n "Image src=\"/logo.svg\"" src/components/Navbar.tsx` →
     exactly two matches.
2. **Build & lint**: `npm run build` and `npm run lint` (Property 1).
3. **Tailwind utility compilation smoke**: temporarily add
   `<div className="bg-bg-deepest text-text-primary border-green-main" />`
   to a scratch render in dev, confirm CSS is generated, then revert.
   Rationale: validates the flat-key Tailwind pattern without committing
   any consumer.
4. **Manual smoke pass** (Property 2):
   - Open `/`, `/quest`, `/settings`, `/offline` in dev.
   - Confirm fonts, colors, and layouts unchanged.
   - Toggle dark/light via the existing `ThemeToggle` button — confirm
     the toggle works.
   - Open browser console: run `import("/_next/static/...").then(...)`
     manually if needed, or simply call
     `localStorage.setItem("mihrab-theme","light")` and reload — confirm
     `getTheme()` would honor it (functional check).
5. **Manifest spot-check** (Property 5): DevTools → Application →
   Manifest. Confirm three icons listed, all `.png`, all 192 / 512 /
   512-maskable.
6. **Navbar visual check** (Property 4): the Mihrab arch logo renders
   at the top of every page, both desktop and mobile breakpoints.

If any of the manual checks cannot be exercised in the implementer's
environment, document the limitation and stop at static + build
verification.

A future foundational-testing spec should set up `vitest` so theme-
bridge equivalence (Property 3) can be tested mechanically.
