# Design Document

> Spec ID: `phase-1-rename`
> Companion: [requirements.md](./requirements.md)
> Approach: text-only diff. No new modules, no dependency changes, no
> structural rewrites. Implementation is mechanical string replacement plus
> two structural edits in the service worker.

## Overview

The rename is a flat, file-scoped find-and-replace operation across 14 files,
plus three small structural changes:

1. Bump `package.json` `name` and regenerate `package-lock.json`.
2. Bump the service-worker `VERSION`, swap the cache-name prefix from `mt-`
   to `mh-`, and broaden the activate cleanup predicate so legacy `mt-*`
   caches are reclaimed on first upgrade.
3. Reword the manifest brand fields and keep icons/shortcuts intact.

No runtime behaviour is added or removed. No tests are added in this phase
(the project currently has no test harness, so introducing one is out of
scope for a rename pass — see "Testing Strategy").

## Architecture

Three logical layers are touched, all at the **identity** boundary. No
architectural relationship between modules changes.

| Layer | Files | Change kind |
|---|---|---|
| Build manifest | `package.json`, `package-lock.json` | Package name |
| App identity | `src/app/manifest.ts`, `src/app/layout.tsx`, every `metadata` export under `src/app/**` | SEO + PWA metadata |
| User-facing surface | `src/components/Navbar.tsx`, `src/components/InstallPrompt.tsx`, `src/lib/share.ts`, `src/components/ShareCardButton.tsx` | Visible strings |
| Diagnostics | `src/components/PWARegister.tsx`, `public/sw.js` | Logs + cache namespace |
| Docs | `README.md` | Hero copy |

No file creation, no file deletion, no rename of files on disk. The folder
`src/app/mihrab/...` keeps its name; `mihrab` there is a route slug, not a
brand identifier (it predates this rename and survives unchanged).

## Components and Interfaces

This phase does not introduce, remove, or restructure any components or
interfaces. It only edits string literals and four constants inside
existing modules. The "components" of this rename are therefore the
**files being modified** and the **constants/strings within them**, listed
below as the substitution surface.

### Substitution surface

#### `package.json`

Replace:
```json
"name": "muslim-task",
```
with:
```json
"name": "mihrab",
```
Then run `npm install` to regenerate `package-lock.json` (auto-updates the
`name` field at root and inside `packages.""`).

#### `README.md`

Replace the heading line `# MuslimTask` with `# Mihrab`. Replace the hero
paragraph (lines 3–4) with the rebrand copy below. Keep the rest of the file
(Tech section, Development section) unchanged for now — those describe the
existing implementation accurately.

```markdown
# Mihrab

**Tracker kualitas ibadah harian.** Ukur, tingkatkan, dan banggakan perjalanan spiritualmu lewat sistem Amal Score, rank Islami, dan achievement. Offline-first, full Indonesian.
```

#### `src/app/manifest.ts`

Edit the returned manifest object as follows. Icons and shortcuts arrays
remain byte-identical.

| Field | Before | After |
|---|---|---|
| `name` | `"MuslimTask — Quest Ibadah Harian"` | `"Mihrab"` |
| `short_name` | `"MuslimTask"` | `"Mihrab"` |
| `description` | `"Tingkatkan konsistensi ibadah lewat sistem quest, streak, dan achievement. Offline-first."` | `"Tracker kualitas ibadah harian. Ukur, tingkatkan, banggakan perjalanan spiritualmu."` |
| `theme_color` | `"#04261A"` | `"#0C1A14"` |
| `background_color` | `"#070F18"` | `"#050E08"` |
| `categories` | `["lifestyle", "education", "productivity"]` | `["lifestyle", "health"]` |

Untouched fields: `start_url`, `scope`, `display`, `orientation`, `lang`,
`icons`, `shortcuts`.

#### `src/app/layout.tsx`

Edit only the `metadata` object literal. Do not touch fonts, imports,
viewport, or JSX.

| Property | Before | After |
|---|---|---|
| `metadataBase` | `new URL("https://muslimtask.app")` | unchanged (Open Question O-1; deferred per requirements R3.6) |
| `title` | `"MuslimTask — Quest Ibadah Harian"` | `"Mihrab — Tracker Kualitas Ibadah"` |
| `description` | `"Tingkatkan konsistensi ibadahmu lewat sistem quest, streak, dan achievement. Offline-first, full Indonesian."` | `"Tracker kualitas ibadah harian. Ukur, tingkatkan, banggakan perjalanan spiritualmu."` |
| `applicationName` | `"MuslimTask"` | `"Mihrab"` |
| `appleWebApp.title` | `"MuslimTask"` | `"Mihrab"` |

`appleWebApp.capable`, `appleWebApp.statusBarStyle`, and
`formatDetection.telephone` remain as-is.

#### Per-route metadata files

Pure string substitutions of the suffix `— MuslimTask` to `— Mihrab` in each
of the following `metadata` (or `generateMetadata`) exports:

| File | Title before | Title after |
|---|---|---|
| `src/app/offline/page.tsx` | `"Offline — MuslimTask"` | `"Offline — Mihrab"` |
| `src/app/quest/page.tsx` | `"Quest — MuslimTask"` | `"Quest — Mihrab"` |
| `src/app/settings/page.tsx` | `"Pengaturan — MuslimTask"` | `"Pengaturan — Mihrab"` |
| `src/app/tasbih/page.tsx` | `"Tasbih Digital — MuslimTask"` | `"Tasbih Digital — Mihrab"` |
| `src/app/mihrab/dzikir/page.tsx` | `"Dzikir — MuslimTask"` | `"Dzikir — Mihrab"` |
| `src/app/mihrab/doa/page.tsx` | `"Doa Harian — MuslimTask"` | `"Doa Harian — Mihrab"` |
| `src/app/mihrab/quran/bookmark/page.tsx` | `"Bookmark Al-Quran — MuslimTask"` | `"Bookmark Al-Quran — Mihrab"` |
| `src/app/mihrab/quran/[surah]/page.tsx` | fallback `"Surah tidak ditemukan — MuslimTask"`, dynamic `` `${meta.namaLatin} (${meta.arti}) — MuslimTask` `` | fallback `"Surah tidak ditemukan — Mihrab"`, dynamic `` `${meta.namaLatin} (${meta.arti}) — Mihrab` `` |

`description` fields on these routes are unchanged unless they themselves
reference the brand (none currently do).

#### `src/components/Navbar.tsx`

Two visible occurrences of the brand wordmark. Both are plain text inside
JSX `<div>` / `<span>` and require no class or layout changes.

- Desktop top nav (around line 56):
  ```tsx
  MuslimTask
  ```
  → `Mihrab`
- Mobile top bar (around line 142):
  ```tsx
  MuslimTask
  ```
  → `Mihrab`

The tagline `QUEST IBADAH HARIAN` (line 59) is **not** changed in this
phase. It will be replaced when the navbar is restructured per PRD §NAVBAR
STRUCTURE in a later phase. Leaving it now avoids touching unrelated copy.

#### `src/components/InstallPrompt.tsx`

Single replacement (around line 112):
- `Pasang MuslimTask` → `Pasang Mihrab`

The supporting copy ("Akses lebih cepat dan tetap jalan offline.") is
unchanged. The localStorage key `DISMISS_KEY = "mt:installPromptDismissed"`
is intentionally **not** renamed: doing so would re-prompt every existing
user who already dismissed the install hint. This is a minor brand drift in
a private string and is documented as a follow-up.

#### `src/components/PWARegister.tsx`

Single replacement in the `console.warn` at line 42:
- `"[MuslimTask] SW registration failed"` → `"[Mihrab] SW registration failed"`

#### `src/lib/share.ts`

Four edits inside the canvas renderer and share helper:

1. Brand text on the share card (line 188):
   - `ctx.fillText("MUSLIMTASK", padX, 80);`
   - → `ctx.fillText("MIHRAB", padX, 80);`

2. Footer URL on the share card (line 310):
   - `ctx.fillText("muslimtask.app", padX, footY);`
   - → `ctx.fillText("mihrab.app", padX, footY);`

3. `navigator.share` payload (lines 396–397):
   ```ts
   title: "MuslimTask",
   text: text ?? "My daily worship progress 💚 #MuslimTask",
   ```
   →
   ```ts
   title: "Mihrab",
   text: text ?? "My daily worship progress 💚 #Mihrab",
   ```

The "QUEST IBADAH HARIAN" subtitle drawn at line 122 is left as-is in this
phase for the same reason as the Navbar tagline: it will be replaced when
the share card is redesigned. The rest of the canvas (gradients, patterns,
motivational quote, stat boxes) is untouched.

#### `src/components/ShareCardButton.tsx`

Single replacement of the download filename prefix (around line 48):
- `` `muslimtask-streak-${...}.png` `` → `` `mihrab-streak-${...}.png` ``

#### `public/sw.js`

Three edits:

1. Header comment (line 2):
   ```js
    * MuslimTask Service Worker
   ```
   → ` * Mihrab Service Worker`

2. Cache version + prefix constants (lines 12–14):
   ```js
   const VERSION = "v1.1.0";
   const CACHE_HTML = `mt-html-${VERSION}`;
   const CACHE_STATIC = `mt-static-${VERSION}`;
   const CACHE_DATA = `mt-data-${VERSION}`;
   ```
   →
   ```js
   const VERSION = "v1.2.0";
   const CACHE_HTML = `mh-html-${VERSION}`;
   const CACHE_STATIC = `mh-static-${VERSION}`;
   const CACHE_DATA = `mh-data-${VERSION}`;
   ```

3. Activate cleanup predicate (around lines 50–58). Current code only
   matches `mt-` keys, so an existing user upgrading to the new SW would
   leave their old `mt-*` caches orphaned forever and never reclaim that
   storage. Broaden it to match either prefix:
   ```js
   keys
     .filter(
       (k) =>
         k.startsWith("mt-") &&
         ![CACHE_HTML, CACHE_STATIC, CACHE_DATA].includes(k),
     )
     .map((k) => caches.delete(k)),
   ```
   →
   ```js
   keys
     .filter(
       (k) =>
         (k.startsWith("mt-") || k.startsWith("mh-")) &&
         ![CACHE_HTML, CACHE_STATIC, CACHE_DATA].includes(k),
     )
     .map((k) => caches.delete(k)),
   ```

Everything else in `sw.js` (precache list, fetch routing, networkFirst /
cacheFirst / staleWhileRevalidate helpers, message handler) is unchanged.

## Data Models

No data models change in this phase.

- IndexedDB schema (`src/lib/idb.ts`, `DB_NAME = "muslimtask"`): unchanged
  (requirements R9.1).
- localStorage keys: unchanged (R9.2). The private install-prompt dismiss
  key `mt:installPromptDismissed` is intentionally retained.
- TypeScript types: no `interface`, `type`, enum, or schema definition is
  touched.
- Service-worker cache **identifiers** change (`mt-*` → `mh-*`) but the
  **shape** of cached entries (request keys, response bodies) is identical.
  This is a namespace move, not a schema change.

## Correctness Properties

The rename must preserve every observable behaviour except the four
intentional surface changes (visible brand text, manifest fields, page
titles, SW cache namespace).

### Property 1: Identity invariant

**Validates: Requirements 1.1, 1.3, 2.1, 2.2, 3.1, 4.1, 5.1, 5.2, 6.1, 7.1, 8.1, 9.1**

After the change, `grep -ri "MuslimTask" src public README.md package.json` returns 0 matches; `grep -ri "muslim-task\|muslimtask" ...` returns exactly the two intentional retentions (`src/lib/idb.ts` `DB_NAME`, `src/app/layout.tsx` `metadataBase`).

### Property 2: Behavioural invariant

**Validates: Requirements 3.7, 8.5, 9.2**

No code path inside `progress.ts`, `xp` calculations, prayer engine, quests, achievements, dzikir/doa lookup, Quran reader, or theme toggle is altered. Every route renders the same React tree (modulo brand strings) and produces the same persisted state.

### Property 3: Storage compatibility

**Validates: Requirements 9.1, 9.2**

A user upgrading from a build with the old name retains all localStorage data and IndexedDB content. The SW activate handler reclaims the legacy `mt-*` caches; everything else (data persistence) is untouched.

### Property 4: SW lifecycle correctness

**Validates: Requirements 8.2, 8.3, 8.4**

The new SW activates without orphaning caches. The cleanup predicate matches both `mt-*` and `mh-*` keys, deleting any whose name doesn't equal one of the three current `CACHE_*` constants. After activation, `caches.keys()` returns exactly `[CACHE_HTML, CACHE_STATIC, CACHE_DATA]` (subject to runtime additions during fetches).

### Property 5: Build correctness

**Validates: Requirements 1.2, 2.7**

`npm run build` and `npm run lint` complete without new errors introduced by this phase. Type-checking still passes; no import paths or symbol names change.

## Error Handling

This phase has minimal new error surface. Risks and their mitigations:

- **`npm install` failure during lockfile regen.** Surface the npm error to the developer; do not hand-edit `package-lock.json`. If install fails for an unrelated reason (registry, cache), retry; the rename itself does not depend on package resolution changes.
- **Service worker fails to activate after deploy.** Existing SW lifecycle and `controllerchange` reload in `PWARegister.tsx` are unchanged. If the new SW errors during install (cache.put failure for a precache URL), behaviour matches today: the per-URL `try/catch` in the install handler swallows the error and runtime fetches will repopulate. No regression introduced.
- **Stale `manifest.webmanifest` in installed PWAs.** Browsers may not refetch the manifest immediately. Documented as Risk-Cache-Stale in requirements §Risks. Mitigation is reinstall; we cannot force this from JS.
- **Static-grep verification false negative.** If a brand string is added in a file not covered by the substitution list (e.g. a new component added in another phase), the verification grep will catch it during PR review.

## Testing Strategy

The project currently has no test harness (no `jest`, `vitest`, `playwright`,
or `@testing-library/*` in `package.json`). Introducing one is out of scope
for a rename pass. Verification therefore relies on:

1. **Static grep checks** (mapped to acceptance criteria A1, A2):
   - `grep -ri "MuslimTask" src public README.md package.json` → 0 matches.
   - `grep -ri "muslim-task\|muslimtask" src public README.md package.json` → only the two intentional matches in `src/lib/idb.ts` and `src/app/layout.tsx`.

2. **Build & lint** (A3): `npm run build` and `npm run lint` must complete without new errors introduced by this phase.

3. **Manual DevTools checks**, where the environment supports them:
   - **Manifest (A4):** `npm run dev`, DevTools → Application → Manifest. Verify `name`, `short_name`, `description`, `theme_color`, `background_color`.
   - **Service worker (A5):** hard reload after a previous build was loaded. DevTools → Application → Cache Storage shows `mh-html-v1.2.0`, `mh-static-v1.2.0`, `mh-data-v1.2.0`. Any pre-existing `mt-*` caches are gone after activation completes.
   - **Page titles (A6):** tab title for `/` reads `Mihrab — Tracker Kualitas Ibadah`. Spot-check `/quest`, `/settings`, `/offline`, `/mihrab/quran/1`, `/mihrab/quran/bookmark`.
   - **UI strings (A7):** navbar wordmark renders `Mihrab` on desktop and mobile. Trigger `beforeinstallprompt` (Application → Manifest → "Add to homescreen" testing) and confirm the card title reads `Pasang Mihrab`.
   - **Share card (A8):** from a page mounting `ShareCardButton`, generate a card. Confirm header shows `MIHRAB`, footer shows `mihrab.app`, downloaded filename starts `mihrab-streak-`, `navigator.share` (where supported) has title `Mihrab` and `#Mihrab` hashtag.
   - **Backward compat (A9):** Before running the new build for the first time, populate localStorage and IndexedDB with the previous build (or copy data from a current dev session). After upgrade, verify streak/XP/Quran cache still load.

4. **Rollback path.** If post-deploy verification fails, `git revert` the rename commit. The SW activate cleanup predicate matches both `mt-*` and `mh-*`, so reverting also reclaims any `mh-*` caches that were briefly created — no permanent storage drift on user devices.

If checks 4 (in the manual list) cannot be exercised in this environment,
document the limitation and stop at static + build verification (1–2). A
follow-up spec should introduce `vitest` so future renames and refactors
have automated coverage.
