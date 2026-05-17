# Implementation Plan: Phase 1 — Rename & Manifest Update

> Spec ID: `phase-1-rename`
> Companions: [requirements.md](./requirements.md), [design.md](./design.md)

## Overview

Tasks 1–11 are independent leaf edits; each maps to a single design section
and a single file (or, in the case of task 5, a flat list of metadata
files). They can run in any order or in parallel. Task 12 is the
verification gate and depends on tasks 1–11.

## Tasks

- [x] 1. Rename the npm package
  - Edit `package.json`: change `"name": "muslim-task"` to `"name": "mihrab"`.
  - Run `npm install` to regenerate `package-lock.json` (root `name` and `packages.""` `name` both update automatically).
  - Do not bump `version`. Do not add or remove dependencies.
  - _Design ref: Components and Interfaces → `package.json`_ · _Requirements: R1.1, R1.2_

- [x] 2. Update README hero
  - In `README.md`: replace the `# MuslimTask` heading and the immediately following hero paragraph with the rebrand copy from design (Components and Interfaces → `README.md`).
  - Leave the `## Fitur`, `## Tech`, and `## Development` sections unchanged.
  - _Design ref: Components and Interfaces → `README.md`_ · _Requirements: R1.3_

- [x] 3. Update PWA manifest fields
  - In `src/app/manifest.ts`: edit the returned manifest object — `name`, `short_name`, `description`, `theme_color`, `background_color`, `categories` per the table in design.
  - Do not modify `start_url`, `scope`, `display`, `orientation`, `lang`, `icons`, or `shortcuts`.
  - _Design ref: Components and Interfaces → `src/app/manifest.ts`_ · _Requirements: R2.1–R2.7_

- [x] 4. Update root layout SEO metadata
  - In `src/app/layout.tsx`: edit only the `metadata` object — `title`, `description`, `applicationName`, `appleWebApp.title` per the design table.
  - Leave `metadataBase`, fonts, viewport, JSX, and all imports untouched.
  - _Design ref: Components and Interfaces → `src/app/layout.tsx`_ · _Requirements: R3.1–R3.7_

- [x] 5. Update per-route page titles
  - For each of the 8 files listed in design (Components and Interfaces → Per-route metadata files), replace the title-suffix `— MuslimTask` with `— Mihrab` (and the dynamic-title template in `[surah]/page.tsx`).
  - Do not touch `description` fields.
  - Files: `src/app/offline/page.tsx`, `src/app/quest/page.tsx`, `src/app/settings/page.tsx`, `src/app/tasbih/page.tsx`, `src/app/mihrab/dzikir/page.tsx`, `src/app/mihrab/doa/page.tsx`, `src/app/mihrab/quran/bookmark/page.tsx`, `src/app/mihrab/quran/[surah]/page.tsx`.
  - _Design ref: Components and Interfaces → Per-route metadata files_ · _Requirements: R4.1_

- [x] 6. Update Navbar wordmark
  - In `src/components/Navbar.tsx`: replace both `MuslimTask` text occurrences (desktop top nav, mobile top bar) with `Mihrab`.
  - Do not change the `QUEST IBADAH HARIAN` tagline (deferred per design).
  - Do not change classes, structure, or icon components.
  - _Design ref: Components and Interfaces → `src/components/Navbar.tsx`_ · _Requirements: R5.1_

- [x] 7. Update InstallPrompt title
  - In `src/components/InstallPrompt.tsx`: replace `Pasang MuslimTask` with `Pasang Mihrab`.
  - Do not rename the private `DISMISS_KEY` constant (intentional per design).
  - _Design ref: Components and Interfaces → `src/components/InstallPrompt.tsx`_ · _Requirements: R5.2_

- [x] 8. Update PWARegister log prefix
  - In `src/components/PWARegister.tsx`: change the `console.warn` argument from `"[MuslimTask] SW registration failed"` to `"[Mihrab] SW registration failed"`.
  - _Design ref: Components and Interfaces → `src/components/PWARegister.tsx`_ · _Requirements: R6.1_

- [x] 9. Update share-card brand strings
  - In `src/lib/share.ts`: apply the four edits in design (Components and Interfaces → `src/lib/share.ts`) — canvas header text `MUSLIMTASK` → `MIHRAB`, footer URL `muslimtask.app` → `mihrab.app`, `navigator.share` `title` → `"Mihrab"`, default share `text` hashtag `#MuslimTask` → `#Mihrab`.
  - Do not change the canvas subtitle `QUEST IBADAH HARIAN` (deferred per design).
  - Do not modify gradients, patterns, stat boxes, or layout coordinates.
  - _Design ref: Components and Interfaces → `src/lib/share.ts`_ · _Requirements: R7.1–R7.3_

- [x] 10. Update share-card download filename
  - In `src/components/ShareCardButton.tsx`: change the filename template prefix `muslimtask-streak-` to `mihrab-streak-`.
  - _Design ref: Components and Interfaces → `src/components/ShareCardButton.tsx`_ · _Requirements: R7.4_

- [x] 11. Rebrand the service worker
  - In `public/sw.js`: apply the three edits in design (Components and Interfaces → `public/sw.js`).
    1. Header comment `MuslimTask Service Worker` → `Mihrab Service Worker`.
    2. Bump `VERSION` from `"v1.1.0"` to `"v1.2.0"` and change the three cache-name templates from `mt-*` to `mh-*`.
    3. Broaden the `activate`-event cleanup filter so it matches keys starting with either `mt-` or `mh-` (not just `mt-`), preserving the keep-list `[CACHE_HTML, CACHE_STATIC, CACHE_DATA]`.
  - Do not modify the precache list, fetch routing, helper functions, or the message handler.
  - _Design ref: Components and Interfaces → `public/sw.js`_ · _Requirements: R8.1–R8.5_

- [x] 12. Verify the rebrand
  - Depends on tasks 1–11.
  - Run static checks per design Testing Strategy step 1: `grep -ri "MuslimTask" src public README.md package.json` returns 0; `grep -ri "muslim-task\|muslimtask" src public README.md package.json` returns only the two intentional matches in `src/lib/idb.ts` and `src/app/layout.tsx`.
  - Run `npm run build` and `npm run lint`; both must complete without new errors introduced by this phase.
  - Manually verify in `npm run dev` (where feasible): manifest values in DevTools (A4), tab title for `/` (A6), Navbar wordmark (A7), share card (A8). Document any check that cannot be exercised in this environment.
  - _Design ref: Testing Strategy_ · _Requirements: A1–A9_

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
      "description": "Independent leaf edits — each touches a disjoint file or set of metadata files; can run in any order or in parallel."
    },
    {
      "wave": 2,
      "tasks": ["12"],
      "description": "Verification gate — runs after all rename edits land."
    }
  ]
}
```

Visual:

```
1  ──┐
2  ──┤
3  ──┤
4  ──┤
5  ──┼──▶ 12 (verification)
6  ──┤
7  ──┤
8  ──┤
9  ──┤
10 ──┤
11 ──┘
```

- Tasks 1–11 are independent leaves and may execute in any order or in
  parallel. Each touches a disjoint file (or, for task 5, a disjoint set
  of metadata files).
- Task 12 (verification) depends on tasks 1–11. It must run last.

## Notes

- **No new dependencies.** Every edit is a string replacement or a structural
  edit inside an existing file. Do not add `lucide-react`, a test framework,
  or any other package in this phase.
- **No file moves or renames on disk.** The substitution surface is content-only.
  The workspace folder name on the user's machine is out of scope.
- **Two intentional retentions** that should still match `muslimtask` after
  this phase: `src/lib/idb.ts` `DB_NAME` and `src/app/layout.tsx`
  `metadataBase`. Both are documented in requirements (R9.1, R3.6) and
  tracked as Open Questions O-1 and O-2.
- **Service-worker upgrade.** Task 11 bumps `VERSION` and broadens the
  activate cleanup so existing users on the old SW reclaim their `mt-*`
  caches on first activate of the new SW. Returning users will pay a
  one-time cache-miss cost; no data loss.
