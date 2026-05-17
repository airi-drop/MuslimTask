# MIHRAB — UI Reference Guide
> Attach this alongside MIHRAB-PRD.md when prompting Kiro
> Version 1.0 · May 2026

---

## DESIGN PHILOSOPHY

**Reference:** Muslim Pro (simple, clean, information-dense without feeling cramped)
**NOT:** Bulky cards, oversized elements, excessive padding, decorative noise

Core principle: Every pixel earns its place. If it doesn't help the user worship better, remove it.

---

## COLOR SYSTEM

### Dark Mode (default)

| Token | Hex | Usage |
|---|---|---|
| `bg-deepest` | `#060F09` | App background, page base |
| `bg-deep` | `#0A1510` | Bottom nav, modals |
| `bg-mid` | `#0F1E14` | Section backgrounds |
| `bg-surface` | `#152A1C` | Cards, input fields |
| `bg-raised` | `#1C3824` | Elevated cards, highlighted rows |
| `green-dim` | `#1A4028` | Borders, dividers |
| `green-mid` | `#236B3A` | Secondary actions, muted icons |
| `green-main` | `#2E8A4A` | Primary buttons, active states |
| `green-light` | `#3EAA5E` | Active nav icons, links |
| `green-glow` | `#52C472` | Countdown timer, positive numbers |
| `gold-dim` | `#4A3008` | Gold borders |
| `gold-mid` | `#7A500E` | Muted gold elements |
| `gold-main` | `#C4882A` | Rank badges, achievement accents |
| `gold-light` | `#D4A040` | XP chips, gold text |
| `gold-glow` | `#E8BC5A` | Achievement highlights, special moments |
| `text-primary` | `#E4EDE8` | Main text, headings |
| `text-secondary` | `#6E9478` | Subtext, descriptions |
| `text-muted` | `#335A3E` | Labels, placeholders |
| `text-ghost` | `#1A3022` | Disabled text, very subtle |
| `border-subtle` | `rgba(46,138,74,0.10)` | Card borders, dividers |
| `border-mid` | `rgba(46,138,74,0.20)` | Active borders |
| `border-gold` | `rgba(196,136,42,0.22)` | Gold element borders |

### Light Mode

| Token | Hex | Usage |
|---|---|---|
| `bg-deepest` | `#F4F1EB` | App background |
| `bg-deep` | `#EDE8DF` | Bottom nav |
| `bg-mid` | `#E6E0D5` | Section backgrounds |
| `bg-surface` | `#FAFAF8` | Cards |
| `bg-raised` | `#FFFFFF` | Elevated cards |
| `green-main` | `#236B3A` | Primary buttons (darker for contrast) |
| `green-light` | `#1A5430` | Active nav, links |
| `gold-main` | `#A06B18` | Gold accents (darker for contrast) |
| `text-primary` | `#141E17` | Main text |
| `text-secondary` | `#3D6048` | Subtext |
| `text-muted` | `#7A9A82` | Labels |
| `border-subtle` | `rgba(35,107,58,0.10)` | Borders |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `xp-full` | `#52C472` | Full XP (on-time) |
| `xp-good` | `#8ABF4A` | Good XP (slight delay) |
| `xp-mid` | `#D4A040` | Mid XP (late) |
| `xp-low` | `#C47A3A` | Low XP (very late) |
| `status-done` | `#2E8A4A` | Claimed/done state |
| `status-current` | `#C4882A` | Current/active prayer |
| `status-upcoming` | `#1A3022` | Not yet |

---

## TYPOGRAPHY

### Font Stack
```
Display:  'Cormorant Garamond' — headings, large numbers, greeting, rank name
Ornament: 'Cinzel'             — section labels, nav labels, badge text (ALL CAPS)
UI:       'DM Sans'            — body text, descriptions, time, XP values
```

### Type Scale (mobile, base 16px)

| Role | Font | Size | Weight | Usage |
|---|---|---|---|---|
| Display XL | Cormorant | 36px | 500 italic | Amal Score large number |
| Display L | Cormorant | 24px | 500 italic | Prayer name in countdown, rank name |
| Display M | Cormorant | 20px | 500 | Section headings |
| Ornament | Cinzel | 9px | 500 | Section labels, nav, badges — UPPERCASE + tracking |
| Body M | DM Sans | 14px | 400 | Descriptions, prayer row text |
| Body S | DM Sans | 12px | 400 | Secondary info, time labels |
| Label | DM Sans | 10px | 500 | Stat labels, captions |
| Micro | DM Sans | 8–9px | 500 | Chip labels, very small UI |

### Typography Rules
- Numbers (XP, score, streak, countdown): always `font-display`
- Section labels: always `font-ornament`, uppercase, `tracking-widest`
- Body copy and UI interactions: always `font-sans`
- Never mix more than 2 font families in one component
- Line height: 1.0 for display numbers, 1.4 for body, 1.6 for descriptions

---

## ICONOGRAPHY

### Icon Library: Lucide React
Install: `npm install lucide-react`
Import: `import { IconName } from 'lucide-react'`

### Icon Size Rules
| Context | Size | Stroke |
|---|---|---|
| Bottom nav | 20×20px | 1.5 |
| Section header | 16×16px | 1.5 |
| Inline (next to text) | 14×14px | 1.5 |
| Status indicator | 12×12px | 2 |

### Icon Map — Bottom Navigation

| Tab | Icon | Lucide name |
|---|---|---|
| Beranda | House | `Home` |
| Amal | CheckSquare | `ClipboardCheck` |
| Ibadah | BookOpen | `BookOpen` |
| Statistik | BarChart2 | `BarChart2` |
| Profil | User | `User` |

### Icon Map — Features & Actions

| Feature | Icon | Lucide name |
|---|---|---|
| Lokasi/kota | MapPin | `MapPin` |
| Notifikasi | Bell | `Bell` |
| Pengaturan | Settings | `Settings` |
| Edit | Pencil | `Pencil` |
| Klaim/checklist | CheckCircle | `CheckCircle2` |
| Terkunci | Lock | `Lock` |
| Share | Share2 | `Share2` |
| Download | Download | `Download` |
| Streak/api | Flame | `Flame` |
| Kalender Hijri | Calendar | `Calendar` |
| XP/Bintang | Zap | `Zap` |
| Achievement | Trophy | `Trophy` |
| Rank naik | TrendingUp | `TrendingUp` |
| Waktu salat | Clock | `Clock3` |
| Tasbih | Circle | `Circle` (counter dot) |
| Quran | BookMarked | `BookMarked` |
| Doa | HandMetal → | `Hands` — pakai emoji 🤲 instead |
| Dzikir pagi | Sunrise | `Sunrise` |
| Dzikir petang | Sunset | `Sunset` |
| Puasa | Moon | `Moon` |
| Sedekah | Heart | `Heart` |
| Jamaah | Users | `Users` |
| Sunnah | Star | `Star` |
| Tahajud | MoonStar | `MoonStar` |
| Tema gelap | Moon | `Moon` |
| Tema terang | Sun | `Sun` |

### Icon Color Rules
```
Active nav icon:     text-green-light (#3EAA5E)
Inactive nav icon:   text-ghost (#1A3022)
Feature icons:       text-secondary (#6E9478)
Gold/achievement:    text-gold-main (#C4882A)
Status done:         text-green-main (#2E8A4A)
Status current:      text-gold-main (#C4882A)
Disabled:            text-ghost (#1A3022), opacity-50
```

---

## SPACING SYSTEM

```
4px  — xs  — gap between inline elements, icon-to-text
8px  — sm  — internal card padding (tight), gap between chips
12px — md  — standard gap between list items
16px — lg  — card padding (standard), section gap
20px — xl  — section padding horizontal (page edges)
24px — 2xl — gap between sections
32px — 3xl — large section spacing
```

**Page horizontal padding:** `px-5` (20px) — consistent across all screens
**Bottom nav height:** `h-16` (64px) + `safe-area-inset-bottom`
**Page content bottom padding:** `pb-20` (80px) to clear bottom nav

---

## COMPONENT SPECS

### Bottom Navigation
```
Height: 64px + safe area
Background: bg-deep (dark) / bg-deep (light)
Border top: 1px border-subtle
Tab width: equal flex (20% each)
Icon: 20px, stroke 1.5
Label: 10px, Cinzel, uppercase, tracking-wide
Active: green-light icon + green-light label + 3px dot above label
Inactive: ghost icon + ghost label
Transition: color 150ms ease
NO background highlight on active tab — dot only
```

### Cards
```
Base card:
  bg-surface, border border-subtle, rounded-2xl, p-4

Elevated card (countdown):
  bg-raised, border border-mid, rounded-2xl, p-4
  Top highlight: 1px line, gradient transparent→green-dim→transparent

Gold card (achievement):
  bg-[rgba(196,136,42,0.05)], border border-gold, rounded-2xl, p-4

DO NOT use drop shadows — use borders only
DO NOT use rounded-full on cards — max rounded-2xl
```

### Prayer Row (in Amal tab)
```
Height: 56px minimum
Layout: [icon 16px] [name + time col, flex-1] [XP badge] [claim button]
Divider: 1px border-subtle between rows (not full-width, inset 20px left)
Name: 14px DM Sans medium, text-primary
Time: 12px DM Sans, text-secondary
Claimed state: name text-muted, checkmark icon green-main
Current state: left accent bar 2px green-main + name text-primary bold
```

### Prayer Strip (Home — horizontal chips)
```
5 chips in a row, equal flex
Each chip: rounded-xl, py-2, text-center
Name: 7px Cinzel uppercase
Time: 9px DM Sans bold
Status icon: 8px (✓ / ● / –)
State colors:
  done:     bg-green-dim/20, border-green-dim, text-green-mid
  current:  bg-gold-dim/20, border-gold-main, text-gold-light
  upcoming: bg-transparent, border-ghost, text-ghost
Gap between chips: 4px
```

### Countdown Card
```
Layout: two columns
Left col: label (9px Cinzel muted) + prayer name (20px Cormorant italic)
Right col: MM:SS (28px Cormorant, green-glow) + "menit lagi" (9px muted)
Bottom row: window info left + klaim button right
Klaim button: only visible when prayer time has started
  Style: bg-green-main, text-white, text-[11px] font-bold uppercase tracking-wide
  rounded-lg px-4 py-2 min-h-[36px]
```

### Stat Mini Box (Home — 3 boxes)
```
Equal flex, rounded-xl, bg-surface, border border-subtle
Padding: px-3 py-2
Value: 18px Cormorant medium — green-glow / gold-light / teal
Label: 7px DM Sans medium, text-muted
```

### Quest Row (Home preview + Amal tab)
```
Height: 44px
Left: 6px dot indicator
  done:    bg-green-main, shadow-[0_0_4px_rgba(46,138,74,0.5)]
  partial: bg-gold-main
  empty:   border-1.5 border-ghost, bg-transparent
Middle: quest name (10px DM Sans medium) + 2px progress bar below
Right: XP label (9px DM Sans bold)
  done:    text-green-mid
  partial: text-gold-main
  empty:   text-ghost
```

### Rank Badge
```
Font: Cinzel, 9px, uppercase, tracking-[0.1em]
Color: text-gold-light
Background: rgba(196,136,42,0.10)
Border: 1px border-gold
Border radius: rounded-full
Padding: px-3 py-1
Prefix: rank emoji + space + rank name
```

### XP Chip
```
Font: DM Sans, 10px, bold
Color: text-gold-light
Background: rgba(196,136,42,0.10)
Border: 1px border-gold
Border radius: rounded-full
Padding: px-2 py-0.5
Content: "+XX XP"
```

### Achievement Badge Card
```
Grid: 3 columns
Each card: rounded-xl, p-3, text-center
Unlocked tiers:
  biasa:      bg-surface, border-subtle
  menengah:   bg-green-dim/10, border-green-dim
  langka:     bg-gold-dim/10, border-gold
  legendaris: bg-gradient-to-br from-green-dim/10 to-gold-dim/10, border-green-light/30
Locked: all above + overlay rgba(6,15,9,0.55) + lock icon centered
Emoji: 24px
Name: 7px Cinzel, 2 lines max, text-center
```

---

## LAYOUT RULES

### Muslim Pro-inspired Principles (apply to all screens)

1. **No giant cards** — prayer info shows as rows, not big boxes with massive padding
2. **Consistent left alignment** — text starts at 20px from edge, always
3. **Sections separated by subtle dividers** — not by big spacing gaps
4. **Information density** — show more in less space, but with clear hierarchy
5. **No decorative elements** — no background patterns, no gradient blobs, no illustration noise
6. **Tap targets ≥ 48px** — but visual size can be smaller (use padding to extend hit area)

### Screen Layout Template
```
[Status bar safe area]
[Page header — 52px: title left + action right]
[Scrollable content — padding px-5]
  [Section 1]
  [Divider: h-px bg-border-subtle mx-0]
  [Section 2]
  [Divider]
  [Section 3]
[Bottom nav — fixed]
```

### Home Screen Specific
```
Total visible without scroll at 375px height:
  Header:         52px
  Rank row:       32px
  Countdown card: 88px
  Prayer strip:   58px
  Divider:        1px
  Stats row:      56px
  Quest header:   28px
  3 quest rows:   132px (44px each)
  ──────────────────────
  Total:          ~447px ✅ fits in 375px viewport (667px height)
```

---

## INTERACTION & ANIMATION

### Rules
- **No page transition animations** — instant navigation only
- **Button press:** `active:scale-[0.97] transition-transform duration-75`
- **Claim success:** brief green flash on prayer chip — `animate-pulse` once
- **Achievement unlock toast:** slide in from top, 4s then slide out
- **Progress bars:** `transition-[width] duration-500 ease-out` on mount
- **Countdown:** update every second via `setInterval`, no animation
- **Theme toggle:** instant, no fade transition

### Toast (Achievement Unlock)
```
Position: top-4, centered, z-50
Width: max-w-[320px]
Background: bg-raised, border border-gold
Border radius: rounded-2xl
Padding: px-4 py-3
Content: [trophy icon gold] [achievement name bold] [description small]
Animation: slide down from top (-translate-y-full → translate-y-0), 300ms ease-out
Auto dismiss: 4000ms → slide back up
```

---

## DO's AND DON'Ts FOR KIRO

### DO ✅
- Use `rounded-2xl` for cards, `rounded-xl` for chips, `rounded-full` for badges
- Use border-only separation (no box-shadow)
- Keep horizontal padding consistent at `px-5` on all pages
- Use `font-display` (Cormorant) for all numbers and prayer names
- Use `font-ornament` (Cinzel) for all section labels in UPPERCASE
- Use `lucide-react` for all icons — no emoji as icons except achievement emojis
- Apply `dark:` prefix for all color classes
- Test every component at 375px width

### DON'T ❌
- Don't use `shadow-*` utilities — use borders instead
- Don't use `rounded-3xl` or `rounded-full` on cards
- Don't use gradients on backgrounds (only on buttons and progress fills)
- Don't use `Inter`, `Roboto`, or system fonts
- Don't add illustrations or decorative SVGs on any screen
- Don't use `text-white` — use `text-primary` token instead
- Don't create components larger than needed — reference Muslim Pro density
- Don't add horizontal scroll anywhere unintentional
- Don't use emoji as nav icons — use Lucide only

---

## REFERENCE SCREENSHOTS NOTES
(Based on Muslim Pro app observed UI)

- Prayer times shown as **simple list rows** — name left, time right, checkbox far right
- Home screen shows **next prayer prominently** but not in an oversized card
- Bottom nav is **thin and minimal** — icons only + small label
- Stats/progress shown as **thin horizontal bars**, not thick chunky ones
- Section headers are **small, muted, uppercase** — not bold headings
- Color usage is **restrained** — green accent only on key interactive elements

---

*Mihrab · UI Reference v1.0 · May 2026*
