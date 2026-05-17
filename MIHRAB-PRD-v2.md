# MIHRAB — Product Requirements Document
> Islamic Spiritual Habit Tracker · PWA → Google Play Store (TWA)
> Version 2.0 · May 2026
> Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Adhan.js · localStorage

---

## APP OVERVIEW

**Mihrab** is a PWA that gamifies daily worship **quality** — not just completion.
Core mechanic: every ibadah is measured by parameters (timing precision, duration, consistency)
→ generates a weekly **Amal Score** → earns an **Islamic Rank** → shareable as pride.

**Target user:** Indonesian Muslims age 18–35.
**Platform:** PWA → Google Play Store via TWA (Trusted Web Activity)
**Hosting:** Vercel (HTTPS auto ✅)

---

## NAVBAR STRUCTURE

```
Beranda · Amal · Ibadah · Statistik · Profil
```

| Tab | Content |
|---|---|
| Beranda | Dashboard: prayer countdown, Amal Score, streak, quest preview |
| Amal | All daily tasks: salat, dzikir, quran, puasa, sedekah |
| Ibadah | Content hub: Tasbih, Doa, Quran reader, Dzikir text |
| Statistik | Amal Score chart, prayer timing breakdown |
| Profil | Rank, achievements, share card generator, settings |

---

## RENAME CHECKLIST (do this first)

- [ ] `public/manifest.json` → update `name` and `short_name` to "Mihrab"
- [ ] `src/app/layout.tsx` → update metadata title, description, theme-color
- [ ] All page titles referencing "MuslimTask" → "Mihrab"
- [ ] `tailwind.config.ts` → update any hardcoded app name references
- [ ] README.md → update

---
---

# PHASE 1 — DESIGN SYSTEM & TAILWIND CONFIG

> Update existing Tailwind config. Do NOT create new CSS files unless specified.
> All styling through Tailwind utility classes + custom theme extension.

## 1.1 tailwind.config.ts

Replace the existing theme extension with:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // === BACKGROUND ===
        'bg-deepest':  '#050E08',
        'bg-deep':     '#081210',
        'bg-mid':      '#0C1A14',
        'bg-surface':  '#102018',
        'bg-raised':   '#152A1E',
        'bg-card':     '#1A3224',

        // === GREEN — Primary ===
        'green-dim':   '#1E4A2E',
        'green-mid':   '#2A6A3E',
        'green-main':  '#3A8A52',
        'green-light': '#4AAA66',
        'green-glow':  '#5DC47A',

        // === GOLD — Accent ===
        'gold-dim':    '#5A3A08',
        'gold-mid':    '#8A5A0E',
        'gold-main':   '#C4882A',
        'gold-light':  '#D4A040',
        'gold-glow':   '#E8BC5A',

        // === TEXT ===
        'text-primary':   '#E8F0EC',
        'text-secondary': '#7A9A86',
        'text-muted':     '#3A5A44',
        'text-ghost':     '#1E3028',

        // === LIGHT MODE OVERRIDES ===
        'light-bg':        '#F5F2EC',
        'light-bg-card':   '#FFFFFF',
        'light-bg-surface':'#EDE9E0',
        'light-text':      '#1A2A1E',
        'light-text-muted':'#8A9A8E',
        'light-green':     '#2A6A3A',
        'light-gold':      '#8A5A10',
      },
      fontFamily: {
        display:  ['Cormorant Garamond', 'serif'],
        ornament: ['Cinzel', 'serif'],
        ui:       ['DM Sans', 'sans-serif'],
        sans:     ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'xxs': '0.625rem', // 10px
      },
      borderRadius: {
        'xl':  '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 4px rgba(196,136,42,0.3)' },
          '50%':      { boxShadow: '0 0 12px rgba(196,136,42,0.7)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

## 1.2 Google Fonts — src/app/layout.tsx

```typescript
import { Cormorant_Garamond, Cinzel, DM_Sans } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ornament',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ui',
  display: 'swap',
})

// Add to <html> className:
// className={`${cormorant.variable} ${cinzel.variable} ${dmSans.variable}`}
```

## 1.3 Theme System — src/lib/theme.ts

```typescript
export type Theme = 'dark' | 'light'

export const THEME_KEY = 'mihrab-theme'

export const getTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark'
  return (localStorage.getItem(THEME_KEY) as Theme) || 'dark'
}

export const setTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export const initTheme = (): void => {
  const theme = getTheme()
  document.documentElement.setAttribute('data-theme', theme)
}
```

## 1.4 Tailwind Dark/Light Mode Pattern

Use this pattern throughout all components:

```typescript
// Dark mode default, light mode via [data-theme="light"] selector
// In Tailwind: use dark: prefix for dark-specific, base for light

// Example card:
<div className="
  bg-bg-surface dark:bg-bg-surface
  border border-text-ghost dark:border-text-ghost
  rounded-xl p-4
  [data-theme='light']:bg-light-bg-card
  [data-theme='light']:border-light-text-muted/20
">
```

> NOTE: Since the app defaults to dark, treat base styles as dark.
> Use `data-[theme=light]:` variant for light mode overrides.

## 1.5 Global CSS — src/app/globals.css

Keep existing, add only:

```css
/* Safe area support */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.pt-safe {
  padding-top: env(safe-area-inset-top, 0px);
}

/* Minimum touch target */
.touch-target {
  min-height: 48px;
  min-width: 48px;
}

/* Prevent tap highlight on mobile */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Dynamic viewport height */
.h-dvh {
  height: 100dvh;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
```

## 1.6 manifest.json Update — public/manifest.json

```json
{
  "name": "Mihrab",
  "short_name": "Mihrab",
  "description": "Tracker kualitas ibadah harian. Ukur, tingkatkan, banggakan perjalanan spiritualmu.",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0C1A14",
  "background_color": "#050E08",
  "lang": "id",
  "categories": ["lifestyle", "health"],
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

**Phase 1 Acceptance Criteria:**
- [ ] Tailwind config updated, all new color tokens working
- [ ] Fonts load correctly (check Network tab)
- [ ] Dark/light mode toggle working via `data-theme` attribute
- [ ] Safe area padding active on mobile
- [ ] manifest.json shows "Mihrab" (check DevTools → Application)

---
---

# PHASE 2 — CORE COMPONENTS

> Build reusable components. All must support dark + light mode.
> Place in `src/components/ui/`
> All components are Client Components unless noted.

## 2.1 Button Components — src/components/ui/Button.tsx

```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'gold' | 'ghost' | 'klaim'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
  fullWidth?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-br from-green-main to-green-mid
    text-white font-semibold text-sm tracking-wide
    rounded-xl active:scale-[0.98] active:opacity-90
    transition-all duration-150
  `,
  gold: `
    bg-gradient-to-br from-gold-main to-gold-dim
    text-white font-semibold text-sm
    rounded-xl active:scale-[0.98]
    transition-all duration-150
  `,
  ghost: `
    bg-transparent text-green-light font-medium text-sm
    border border-green-dim rounded-xl
    active:bg-green-dim/10
    transition-all duration-150
  `,
  klaim: `
    bg-gradient-to-br from-green-main to-green-mid
    text-white font-bold text-[11px] tracking-wider uppercase
    rounded-lg px-4 active:scale-[0.98]
    transition-all duration-150
  `,
}

export default function Button({
  variant = 'primary',
  children,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'min-h-[48px] min-w-[48px] flex items-center justify-center',
        fullWidth && 'w-full',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

## 2.2 Card Components — src/components/ui/Card.tsx

```typescript
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CardVariant = 'base' | 'elevated' | 'gold'

interface CardProps {
  variant?: CardVariant
  children: ReactNode
  className?: string
}

const variants: Record<CardVariant, string> = {
  base: `
    bg-bg-surface border border-text-ghost/30
    rounded-xl p-4
  `,
  elevated: `
    bg-gradient-to-br from-bg-raised to-bg-mid
    border border-green-dim/40 rounded-xl p-4
    relative overflow-hidden
    before:absolute before:top-0 before:left-0 before:right-0
    before:h-px before:bg-gradient-to-r
    before:from-transparent before:via-green-light/40 before:to-transparent
  `,
  gold: `
    bg-gold-main/5 border border-gold-main/25
    rounded-xl p-4
  `,
}

export default function Card({ variant = 'base', children, className }: CardProps) {
  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  )
}
```

## 2.3 Badge Components — src/components/ui/Badge.tsx

```typescript
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'rank' | 'streak' | 'xp' | 'tier-common' | 'tier-mid' | 'tier-rare' | 'tier-legendary'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  rank:           'bg-gold-main/12 border border-gold-main/25 text-gold-light font-ornament text-[9px] tracking-widest',
  streak:         'bg-green-main/10 border border-green-dim/40 text-green-light font-semibold text-[11px]',
  xp:             'bg-green-main/10 border border-green-mid/40 text-green-light font-bold text-[10px]',
  'tier-common':  'bg-bg-surface border border-text-ghost/30 text-text-muted text-[9px]',
  'tier-mid':     'bg-green-main/8 border border-green-dim/40 text-green-light text-[9px]',
  'tier-rare':    'bg-gold-main/10 border border-gold-main/25 text-gold-light text-[9px]',
  'tier-legendary':'bg-gradient-to-r from-green-mid/15 to-gold-dim/15 border border-green-light/30 text-green-glow text-[9px]',
}

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-3 py-1 rounded-full',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
```

## 2.4 Progress Bar — src/components/ui/ProgressBar.tsx

```typescript
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number      // 0–100
  color?: 'green' | 'gold'
  height?: 'xs' | 'sm' | 'md'
  className?: string
}

export default function ProgressBar({
  value,
  color = 'green',
  height = 'sm',
  className,
}: ProgressBarProps) {
  const heights = { xs: 'h-0.5', sm: 'h-1', md: 'h-1.5' }
  const fills = {
    green: 'bg-gradient-to-r from-green-mid to-green-glow',
    gold:  'bg-gradient-to-r from-gold-dim to-gold-light',
  }

  return (
    <div className={cn('w-full bg-bg-surface rounded-full overflow-hidden', heights[height], className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', fills[color])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
```

## 2.5 Bottom Navigation — src/components/layout/BottomNav.tsx

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, BookOpen, BarChart2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/',          label: 'Beranda',   icon: Home },
  { href: '/amal',      label: 'Amal',      icon: CheckSquare },
  { href: '/ibadah',    label: 'Ibadah',    icon: BookOpen },
  { href: '/statistik', label: 'Statistik', icon: BarChart2 },
  { href: '/profil',    label: 'Profil',    icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="
      fixed bottom-0 left-1/2 -translate-x-1/2
      w-full max-w-[430px]
      bg-bg-deep border-t border-green-dim/20
      flex z-50
      pb-safe
    ">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5',
              'min-h-[56px] font-ui text-[10px] font-medium',
              'transition-colors duration-200',
              active ? 'text-green-light' : 'text-text-ghost'
            )}
          >
            <Icon size={18} strokeWidth={active ? 2 : 1.5} />
            <span>{label}</span>
            <span className={cn(
              'w-1 h-1 rounded-full bg-green-light transition-opacity',
              active ? 'opacity-100' : 'opacity-0'
            )} />
          </Link>
        )
      })}
    </nav>
  )
}
```

## 2.6 App Shell — src/app/layout.tsx update

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="dark">
      <body className={`${cormorant.variable} ${cinzel.variable} ${dmSans.variable} font-ui bg-bg-deepest text-text-primary`}>
        <div className="max-w-[430px] mx-auto min-h-dvh flex flex-col relative">
          <main className="flex-1 overflow-y-auto pb-[72px] pt-safe">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
```

**Phase 2 Acceptance Criteria:**
- [ ] All components render correctly in dark + light mode
- [ ] Bottom nav highlights active route
- [ ] Touch targets all ≥ 48px
- [ ] No layout shift when switching themes
- [ ] Fonts apply correctly per component

---
---

# PHASE 3 — PRAYER TIME ENGINE + XP SYSTEM

> Adhan.js is already installed. Build on top of it.
> Place logic in `src/lib/`

## 3.1 Prayer Times — src/lib/prayer.ts

```typescript
import { Coordinates, CalculationMethod, PrayerTimes, Prayer, Qibla } from 'adhan'

export interface PrayerSchedule {
  fajr:    Date
  sunrise: Date
  dhuhr:   Date
  asr:     Date
  maghrib: Date
  isha:    Date
}

export interface PrayerInfo {
  key:          string
  nameId:       string   // Indonesian name
  time:         Date
  timeStr:      string   // "HH:MM"
  isDone:       boolean
  isCurrent:    boolean
  isUpcoming:   boolean
}

const PRAYER_LABELS: Record<string, string> = {
  fajr:    'Subuh',
  sunrise: 'Syuruq',
  dhuhr:   'Dzuhur',
  asr:     'Ashar',
  maghrib: 'Maghrib',
  isha:    'Isya',
}

export const getPrayerTimes = (lat: number, lng: number, date = new Date()): PrayerSchedule => {
  const coords = new Coordinates(lat, lng)
  const params = CalculationMethod.MoonsightingCommittee() // closest to KEMENAG
  const times = new PrayerTimes(coords, date, params)

  return {
    fajr:    times.fajr,
    sunrise: times.sunrise,
    dhuhr:   times.dhuhr,
    asr:     times.asr,
    maghrib: times.maghrib,
    isha:    times.isha,
  }
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('id-ID', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export const getMinutesFromMidnight = (date: Date): number => {
  return date.getHours() * 60 + date.getMinutes()
}

export const getNextPrayer = (schedule: PrayerSchedule, now = new Date()) => {
  const prayers = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
  const nowMs = now.getTime()

  for (const key of prayers) {
    if (schedule[key].getTime() > nowMs) {
      return {
        key,
        nameId:      PRAYER_LABELS[key],
        time:        schedule[key],
        timeStr:     formatTime(schedule[key]),
        minutesLeft: Math.floor((schedule[key].getTime() - nowMs) / 60000),
      }
    }
  }

  // After Isha → next is Fajr tomorrow
  return {
    key:         'fajr',
    nameId:      'Subuh',
    time:        schedule.fajr,
    timeStr:     formatTime(schedule.fajr),
    minutesLeft: null,
  }
}
```

## 3.2 XP Engine — src/lib/xp.ts

```typescript
// =====================
// PRAYER XP — tiered by timing
// =====================
export const calculatePrayerXP = (
  prayerTime: Date,
  claimTime:  Date,
  isJamaah:   boolean = false
): number => {
  const diffMs      = claimTime.getTime() - prayerTime.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 0)   return 0   // not yet time
  
  let xp: number
  if      (diffMinutes <= 10)  xp = 100
  else if (diffMinutes <= 30)  xp = 75
  else if (diffMinutes <= 60)  xp = 50
  else if (diffMinutes <= 120) xp = 25
  else                         xp = 10

  if (isJamaah) xp += 20

  return xp
}

// =====================
// SUNNAH XP
// =====================
export const SUNNAH_XP = {
  rawatib: 15,
  dhuha:   30,
  tahajud: 50,
  witir:   20,
} as const

// =====================
// DZIKIR XP — window-based
// =====================
export const getDzikirXP = (
  type:     'pagi' | 'petang',
  schedule: { fajr: Date; sunrise: Date; asr: Date; maghrib: Date },
  claimTime: Date
): number => {
  const BASE = 15
  const LATE = 5

  if (type === 'pagi') {
    const inWindow = claimTime >= schedule.fajr && claimTime <= schedule.sunrise
    return inWindow ? BASE : LATE
  }

  if (type === 'petang') {
    const inWindow = claimTime >= schedule.asr && claimTime <= schedule.maghrib
    return inWindow ? BASE : LATE
  }

  return 0
}

// =====================
// QURAN XP — by ayat count
// =====================
export const getQuranXP = (ayat: number): number => {
  if (ayat <= 0)  return 0
  if (ayat <= 4)  return 10
  if (ayat <= 10) return 20
  if (ayat <= 20) return 35
  if (ayat >= 30) return 100
  return Math.floor(ayat * 1.5)
}

// =====================
// AMAL SCORE — weekly, 0–1000
// =====================
export interface WeeklyData {
  prayers:      { xp: number }[]
  dzikir:       { pagi: boolean; petang: boolean }[]
  quran:        { ayat: number }[]
  sunnahXP:     number
  dailySummary: { isPerfect: boolean }[]
}

export const calculateAmalScore = (data: WeeklyData): number => {
  let score = 0

  // Prayer score — max 500
  const prayerScore = data.prayers.reduce((acc, p) => acc + (p.xp / 100) * 14.3, 0)
  score += Math.min(prayerScore, 500)

  // Dzikir — max 150
  const dzikirDays = data.dzikir.filter(d => d.pagi && d.petang).length
  score += dzikirDays * (150 / 7)

  // Quran — max 150
  const quranDays = data.quran.filter(d => d.ayat > 0).length
  score += quranDays * (150 / 7)

  // Sunnah — max 100
  score += Math.min(data.sunnahXP, 100)

  // Perfect day bonus — max 100
  const perfectDays = data.dailySummary.filter(d => d.isPerfect).length
  score += perfectDays * (100 / 7)

  return Math.round(Math.min(score, 1000))
}

// =====================
// RANK SYSTEM
// =====================
export interface Rank {
  name:     string
  minScore: number
  emoji:    string
  desc:     string
}

export const RANKS: Rank[] = [
  { name: 'Musafir',    minScore: 0,   emoji: '🌱', desc: 'Baru memulai perjalanan' },
  { name: 'Muwazhzhaf', minScore: 300, emoji: '🥉', desc: 'Mulai konsisten' },
  { name: 'Muhafizh',   minScore: 550, emoji: '🥈', desc: 'Menjaga ibadah dengan baik' },
  { name: 'Muttaqin',   minScore: 750, emoji: '🥇', desc: 'Konsisten dan berkualitas' },
  { name: 'Rabbani',    minScore: 900, emoji: '💎', desc: 'Hampir sempurna' },
]

export const getRank = (amalScore: number): Rank => {
  return [...RANKS].reverse().find(r => amalScore >= r.minScore) ?? RANKS[0]
}

export const getNextRank = (amalScore: number): Rank | null => {
  return RANKS.find(r => r.minScore > amalScore) ?? null
}
```

## 3.3 Storage — src/lib/storage.ts

```typescript
// =====================
// TYPES
// =====================
export interface UserProfile {
  name:     string
  city:     string
  lat:      number
  lng:      number
  theme:    'dark' | 'light'
  notifOn:  boolean
}

export interface PrayerClaim {
  prayer:       string
  claimTime:    string   // ISO string
  prayerTime:   string   // ISO string
  diffMinutes:  number
  xp:           number
  isJamaah:     boolean
  date:         string   // YYYY-MM-DD
}

export interface DailyRecord {
  date:         string
  prayers:      PrayerClaim[]
  dzikirPagi:   boolean
  dzikirPetang: boolean
  quranAyat:    number
  sedekah:      boolean
  puasa:        boolean
  sunnahXP:     number
  totalXP:      number
}

export interface AchievementRecord {
  id:          string
  unlockedAt:  string   // ISO string
}

// =====================
// KEYS
// =====================
const KEYS = {
  profile:      'mihrab-profile',
  daily:        'mihrab-daily',
  achievements: 'mihrab-achievements',
  onboarded:    'mihrab-onboarded',
  weeklyScore:  'mihrab-weekly-score',
} as const

// =====================
// HELPERS
// =====================
const today = (): string => new Date().toISOString().split('T')[0]

const get = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const set = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

// =====================
// PROFILE
// =====================
export const getProfile = (): UserProfile | null => get<UserProfile>(KEYS.profile)

export const saveProfile = (profile: UserProfile): void => set(KEYS.profile, profile)

export const isOnboarded = (): boolean => !!localStorage.getItem(KEYS.onboarded)

export const setOnboarded = (): void => localStorage.setItem(KEYS.onboarded, 'true')

// =====================
// DAILY RECORD
// =====================
export const getTodayRecord = (): DailyRecord => {
  const all = get<Record<string, DailyRecord>>(KEYS.daily) ?? {}
  return all[today()] ?? {
    date:         today(),
    prayers:      [],
    dzikirPagi:   false,
    dzikirPetang: false,
    quranAyat:    0,
    sedekah:      false,
    puasa:        false,
    sunnahXP:     0,
    totalXP:      0,
  }
}

export const saveTodayRecord = (record: DailyRecord): void => {
  const all = get<Record<string, DailyRecord>>(KEYS.daily) ?? {}
  all[today()] = record
  set(KEYS.daily, all)
}

export const getRecord = (date: string): DailyRecord | null => {
  const all = get<Record<string, DailyRecord>>(KEYS.daily) ?? {}
  return all[date] ?? null
}

export const getLast7Days = (): DailyRecord[] => {
  const all = get<Record<string, DailyRecord>>(KEYS.daily) ?? {}
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().split('T')[0]
    return all[key] ?? { date: key, prayers: [], dzikirPagi: false, dzikirPetang: false, quranAyat: 0, sedekah: false, puasa: false, sunnahXP: 0, totalXP: 0 }
  })
}

// =====================
// ACHIEVEMENTS
// =====================
export const getUnlockedAchievements = (): AchievementRecord[] =>
  get<AchievementRecord[]>(KEYS.achievements) ?? []

export const unlockAchievement = (id: string): void => {
  const existing = getUnlockedAchievements()
  if (existing.some(a => a.id === id)) return
  existing.push({ id, unlockedAt: new Date().toISOString() })
  set(KEYS.achievements, existing)
}
```

**Phase 3 Acceptance Criteria:**
- [ ] `getPrayerTimes()` returns correct times for Jakarta
- [ ] `calculatePrayerXP()` returns correct XP for different time gaps
- [ ] `getTodayRecord()` returns empty default for new users
- [ ] `saveTodayRecord()` persists correctly
- [ ] All TypeScript types are strict (no `any`)

---
---

# PHASE 4 — BERANDA (HOME DASHBOARD)

> File: `src/app/page.tsx`
> This is a Client Component (`'use client'`) due to real-time countdown.

## 4.1 Layout Structure

```
[Header: mini logo + user name + XP chip + notif icon]
[Rank badge + streak badge]
[Countdown Card]
[Prayer Strip — 5 chips]
[Divider]
[Stats Row — Amal Score · Streak · Level]
[Quest Preview — 3 items]
```

## 4.2 Countdown Card Spec

```
- Card variant: elevated
- Left: label "Salat Berikutnya" + prayer name (font-display italic text-2xl)
- Right: countdown MM:SS (font-display text-4xl text-green-glow)
- Bottom left: "Window tepat: X mnt" — show remaining time for full XP
- Bottom right: <Button variant="klaim"> — only visible when prayer time has started
- Real-time: useEffect + setInterval every second
```

## 4.3 Prayer Strip Spec

```typescript
// 5 chips, horizontal scroll if needed
// States:
type ChipState = 'done' | 'current' | 'upcoming'

// Chip classes per state:
const chipStyles: Record<ChipState, string> = {
  done:     'border-green-dim/60 bg-green-main/10',
  current:  'border-gold-main bg-gold-main/8 animate-pulse-gold',
  upcoming: 'border-text-ghost/30 bg-bg-surface',
}

const chipNameStyles: Record<ChipState, string> = {
  done:     'text-green-mid',
  current:  'text-gold-light',
  upcoming: 'text-text-muted',
}
```

## 4.4 Stats Row Spec

```
3 equal boxes:
- Amal Score → font-display text-2xl text-green-glow
- Streak → font-display text-2xl text-gold-light
- Level → font-display text-2xl text-[#6AB8A8]

Label: font-ui text-[10px] text-text-muted mt-1
Box: bg-bg-surface border border-text-ghost/30 rounded-xl p-3
```

## 4.5 Quest Preview Spec

```
Header: font-ornament text-[9px] text-text-muted tracking-widest uppercase
        + "X/5 selesai" text-green-light text-[11px] font-semibold

3 items max (prioritize incomplete):
- Dot indicator: done=green-glow w-1.5 h-1.5 / partial=gold-main / empty=border
- Quest name: font-ui text-[11px] text-text-secondary
- Progress bar: h-0.5 mt-1
- XP label: font-bold text-[10px] text-right

Tap anywhere → navigate to /amal
```

**Phase 4 Acceptance Criteria:**
- [ ] Countdown updates every second accurately
- [ ] Klaim button appears only when prayer time has started
- [ ] Prayer strip shows correct state for each prayer
- [ ] Stats pull from localStorage correctly
- [ ] All visible without scroll on 375px screen height

---
---

# PHASE 5 — TAB AMAL

> File: `src/app/amal/page.tsx`
> Replace or heavily modify existing quest page.

## 5.1 Sections

```
1. Header + Daily XP Progress Bar
2. Salat Fardhu (5 prayers)
3. Salat Sunnah
4. Amalan Harian (Dzikir, Quran, Puasa, Sedekah)
```

## 5.2 Prayer Claim Row

```typescript
interface PrayerRowProps {
  prayerKey:   string
  nameId:      string
  scheduledAt: Date
  claim:        PrayerClaim | undefined
  onClaim:     (isJamaah: boolean) => void
}

// States:
// - not yet time: row disabled, show scheduled time
// - claimable: highlight row, show KLAIM button
// - claimed: show XP earned + timing label (Tepat/Agak Telat/Telat/Sangat Telat)

// XP label mapping:
const xpLabel = (diffMinutes: number): string => {
  if (diffMinutes <= 10)  return 'Tepat Waktu ✓'
  if (diffMinutes <= 30)  return 'Agak Telat'
  if (diffMinutes <= 60)  return 'Telat'
  if (diffMinutes <= 120) return 'Sangat Telat'
  return 'Hampir Qadha'
}

// After tap KLAIM → show bottom sheet:
// "Salat berjamaah?" [Ya +20 XP] [Tidak]
```

## 5.3 Sunnah Section

```
Chips for each sunnah prayer.
Window validation — disable if outside time window.

Windows (calculated from schedule):
- Dhuha:   Sunrise + 45min → before Dhuhr
- Tahajud: Isha + ((Fajr - Isha) * 2/3) → Fajr
- Witir:   after Isha
- Rawatib: ±15 min around each fardhu

Disabled chip: opacity-40 + tooltip "Di luar waktu"
```

## 5.4 Dzikir Claim

```
Two rows: Dzikir Pagi + Dzikir Petang

Each row:
- Window indicator: "Valid: Subuh → Syuruq" or "Valid: Ashar → Maghrib"
- Green if within window, muted if outside
- KLAIM button → saves + calculates XP
- After claim: show text of 3 main dzikir as confirmation overlay
```

## 5.5 Quran Input

```
Label: "Al-Quran hari ini"
Quick chips: [1–4 ayat +10 XP] [5–10 ayat +20 XP] [1 halaman +35 XP] [1 juz +100 XP]
Custom input: text field for exact number
Auto-calculate XP preview before confirming
```

## 5.6 Sedekah & Puasa

```
Sedekah:
- Toggle: "Sedekah hari ini?"
- Type chips: [Uang] [Makanan] [Tenaga]
- Same XP regardless of type (niat yang dinilai)

Puasa:
- Toggle: "Puasa hari ini?"
- Type: [Senin-Kamis] [Ayyamul Bidh] [Dawud] [Lainnya]
- Show puasa section only on Mon/Thu or 13/14/15 Hijri
```

**Phase 5 Acceptance Criteria:**
- [ ] Prayer claim saves with correct timestamp and XP
- [ ] Jamaah toggle adds +20 XP correctly
- [ ] Sunnah chips disabled outside time window
- [ ] Quran XP preview shows before saving
- [ ] All data persists after page refresh

---
---

# PHASE 6 — TAB IBADAH

> File: `src/app/ibadah/page.tsx`
> Reorganize existing Mihrab content into this tab.

## 6.1 Grid Layout

```
2-column grid, 8 items:
┌─────────────┬─────────────┐
│   Tasbih    │ Dzikir Pagi │
├─────────────┼─────────────┤
│Dzikir Petang│  Doa Harian │
├─────────────┼─────────────┤
│  Al-Quran   │  Asmaul     │
│             │  Husna      │
└─────────────┴─────────────┘
```

## 6.2 Tasbih Improvements

Move existing Tasbih here. Add:

```typescript
const DZIKIR_PRESETS = [
  { text: 'Subhanallah',          target: 33 },
  { text: 'Alhamdulillah',        target: 33 },
  { text: 'Allahu Akbar',         target: 33 },
  { text: 'La ilaha illallah',    target: 100 },
  { text: 'Astaghfirullah',       target: 100 },
  { text: 'Custom',               target: 33 },
]

// Haptic feedback:
const vibrate = () => {
  if ('vibrate' in navigator) navigator.vibrate(10)
}

// Auto-save last count to localStorage
// Auto-reset after reaching target with celebration UI
```

## 6.3 Dzikir Pages

```
Static JSON data from Hisnul Muslim.
Each dzikir entry:
{
  id:          string
  arabic:      string
  latin:       string
  translation: string
  count:       number   // how many times to read
  benefit:     string
}

UI per item:
- Arabic text: font-display text-xl leading-relaxed text-right dir="rtl"
- Latin: text-text-secondary text-sm
- Translation: text-text-muted text-xs
- Counter: tap to count, shows X/target
- "Selesai semua" button → triggers claim in Amal tab
```

**Phase 6 Acceptance Criteria:**
- [ ] All content loads offline from static JSON
- [ ] Tasbih counter with haptic feedback works on Android
- [ ] Completing dzikir updates today's record in Amal
- [ ] Arabic text renders correctly right-to-left

---
---

# PHASE 7 — TAB STATISTIK

> File: `src/app/statistik/page.tsx`
> Rebuild with meaningful data visualizations.

## 7.1 Layout

```
[Toggle: Minggu Ini | Bulan Ini | All Time]
[Amal Score Line Chart — 7 days]
[Prayer Timing Breakdown]
[Streak History]
[Empty State if no data]
```

## 7.2 Amal Score Chart

```typescript
// Use recharts (already common in Next.js ecosystem)
// Install if needed: npm install recharts

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

// Data shape:
const chartData = last7Days.map(record => ({
  day:   new Date(record.date).toLocaleDateString('id-ID', { weekday: 'short' }),
  score: calculateAmalScoreForDay(record),
}))

// Styling:
// - Line color: #3A8A52 (green-main)
// - Area fill: rgba(58, 138, 82, 0.1)
// - Grid: stroke="#1A3224"
// - Tooltip: custom dark styled
```

## 7.3 Prayer Timing Breakdown

```
Per prayer (Subuh → Isya):
- Name + percentage on-time (claimed ≤10 min)
- Horizontal bar
- Color: green if ≥70%, gold if 40–69%, red if <40%
- "Paling konsisten" badge on highest ✓
- "Perlu ditingkatkan" badge on lowest
```

## 7.4 Empty State

```
SVG illustration (simple mosque silhouette, keep it minimal)
Text: "Mulai hari ini, setiap ibadahmu akan tercatat di sini."
Button: "Mulai Sekarang" → /amal
```

**Phase 7 Acceptance Criteria:**
- [ ] Chart renders with real data from localStorage
- [ ] Empty state shows for new users with no data
- [ ] Prayer breakdown percentages calculate correctly
- [ ] Toggle between week/month/all-time works

---
---

# PHASE 8 — TAB PROFIL + ACHIEVEMENT

> Files:
> `src/app/profil/page.tsx`
> `src/lib/achievements.ts`

## 8.1 Profile Layout

```
[Avatar circle + name + edit button]
[Rank Card]
[Achievement Grid]
[Achievement Progress]
[Share Card Button]
[Settings Section]
```

## 8.2 Rank Card

```
Card variant: gold
- Rank name: font-display italic text-3xl text-gold-light
- Rank emoji: text-4xl
- Amal Score: font-display text-5xl text-green-glow (center)
- Progress to next rank: ProgressBar + "X poin lagi menuju [NextRank]"
- Background subtle glow: radial gradient from gold-main/10
```

## 8.3 Achievement System — src/lib/achievements.ts

```typescript
export type AchievementTier = 'common' | 'intermediate' | 'rare' | 'legendary'

export interface Achievement {
  id:     string
  name:   string
  desc:   string
  tier:   AchievementTier
  emoji:  string
  check:  (stats: UserStats) => boolean
}

export interface UserStats {
  totalPrayers:       number
  currentStreak:      number
  fajrStreak:         number
  tahajudCount:       number
  quranStreak:        number
  sedekahStreak:      number
  amalScore:          number
  weeklyScores:       number[]
  recoveredStreak:    boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  // COMMON
  {
    id:    'first_prayer',
    name:  'Langkah Pertama',
    tier:  'common',
    emoji: '🌱',
    desc:  'Klaim salat pertama kali di Mihrab',
    check: (s) => s.totalPrayers >= 1,
  },
  {
    id:    'streak_3',
    name:  '3 Hari Berturut',
    tier:  'common',
    emoji: '🔥',
    desc:  'Streak 3 hari berturut-turut',
    check: (s) => s.currentStreak >= 3,
  },
  {
    id:    'first_quran',
    name:  'Pembaca Quran',
    tier:  'common',
    emoji: '📖',
    desc:  'Baca Al-Quran pertama kali',
    check: (s) => s.quranStreak >= 1,
  },

  // INTERMEDIATE
  {
    id:    'fajr_14',
    name:  'Fajar Setia',
    tier:  'intermediate',
    emoji: '🌅',
    desc:  'Subuh tepat waktu 14 hari berturut-turut',
    check: (s) => s.fajrStreak >= 14,
  },
  {
    id:    'quran_30',
    name:  'Tilawah 30',
    tier:  'intermediate',
    emoji: '📿',
    desc:  '30 hari berturut baca Al-Quran',
    check: (s) => s.quranStreak >= 30,
  },
  {
    id:    'perfect_week',
    name:  'Perfect Week',
    tier:  'intermediate',
    emoji: '⭐',
    desc:  'Amal Score 900+ dalam satu minggu',
    check: (s) => s.weeklyScores.some(score => score >= 900),
  },

  // RARE
  {
    id:    'tahajud_10',
    name:  'Ahli Malam',
    tier:  'rare',
    emoji: '🌙',
    desc:  'Tahajud 10 kali dalam satu bulan',
    check: (s) => s.tahajudCount >= 10,
  },
  {
    id:    'recovery',
    name:  'La Tahzan',
    tier:  'rare',
    emoji: '💪',
    desc:  'Streak pernah putus, lalu konsisten kembali 90 hari',
    check: (s) => s.recoveredStreak && s.currentStreak >= 90,
  },

  // LEGENDARY
  {
    id:    'pewaris',
    name:  'Pewaris Ibrahim',
    tier:  'legendary',
    emoji: '👑',
    desc:  'Salat 5 waktu tepat waktu semua selama 365 hari',
    check: (s) => s.fajrStreak >= 365,
  },
  {
    id:    'hamba_sejati',
    name:  'Hamba Sejati',
    tier:  'legendary',
    emoji: '💎',
    desc:  'Amal Score 900+ selama 12 minggu berturut-turut',
    check: (s) => s.weeklyScores.filter(Boolean).length >= 12 &&
                  s.weeklyScores.slice(-12).every(score => score >= 900),
  },
]

export const checkNewAchievements = (
  stats:    UserStats,
  unlocked: string[]
): Achievement[] => {
  return ACHIEVEMENTS.filter(
    ach => !unlocked.includes(ach.id) && ach.check(stats)
  )
}
```

## 8.4 Achievement UI

```
Grid 3 columns:
- Unlocked: full color icon, name colored by tier
- Locked: icon opacity-20, overlay "🔒", name text-ghost

Tier badge colors (via Badge component):
- common:      tier-common
- intermediate: tier-mid
- rare:         tier-rare
- legendary:    tier-legendary

Progress Section (below grid):
Show 2–3 achievements currently in progress with % bar.
```

## 8.5 Achievement Unlock Toast

```typescript
// When new achievement is detected:
// Show full-screen celebration overlay:
// - Achievement emoji (large, animated scale-in)
// - "Achievement Terbuka! 🎉"
// - Achievement name (font-display italic)
// - Description
// - Tier badge
// - "Bagikan" button → triggers share card
// - "Tutup" button

// Auto-dismiss after 5 seconds
```

**Phase 8 Acceptance Criteria:**
- [ ] Rank card shows correct rank based on Amal Score
- [ ] Achievement grid shows locked/unlocked states correctly
- [ ] Achievement unlock toast appears when condition is met
- [ ] Progress bars for in-progress achievements are accurate
- [ ] Edit name saves and reflects across all pages

---
---

# PHASE 9 — SHARE CARD GENERATOR

> File: `src/lib/shareCard.ts`
> UI in: `src/app/profil/page.tsx` (bottom section)

## 9.1 Three Card Types

**A. Weekly Card** — auto-generated every Monday
**B. Achievement Card** — triggered on unlock
**C. Milestone Card** — streak milestones (30/60/100 days)

## 9.2 Canvas Implementation

```typescript
// src/lib/shareCard.ts

export interface WeeklyCardData {
  userName:   string
  rank:       string
  rankEmoji:  string
  amalScore:  number
  prayerRate: number   // percentage on-time
  bestPrayer: string   // most consistent prayer name
  quote:      string
}

export const generateWeeklyCard = async (data: WeeklyCardData): Promise<Blob> => {
  const canvas  = document.createElement('canvas')
  canvas.width  = 1080
  canvas.height = 1080
  const ctx     = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = '#050E08'
  ctx.fillRect(0, 0, 1080, 1080)

  // Border
  ctx.strokeStyle = 'rgba(58, 138, 82, 0.25)'
  ctx.lineWidth   = 2
  ctx.strokeRect(48, 48, 984, 984)

  // Inner border (gold, subtle)
  ctx.strokeStyle = 'rgba(196, 136, 42, 0.1)'
  ctx.lineWidth   = 1
  ctx.strokeRect(56, 56, 968, 968)

  // App name (top left)
  ctx.font      = '500 28px Cinzel'
  ctx.fillStyle = '#3A5A44'
  ctx.fillText('MIHRAB', 96, 120)

  // Rank
  ctx.font      = '500 24px Cinzel'
  ctx.fillStyle = '#D4A040'
  ctx.fillText(`${data.rankEmoji} ${data.rank.toUpperCase()}`, 96, 165)

  // User name
  ctx.font      = 'italic 500 52px Cormorant Garamond'
  ctx.fillStyle = '#E8F0EC'
  ctx.fillText(data.userName, 96, 240)

  // Divider line
  ctx.strokeStyle = 'rgba(58, 138, 82, 0.2)'
  ctx.lineWidth   = 1
  ctx.beginPath()
  ctx.moveTo(96, 270)
  ctx.lineTo(984, 270)
  ctx.stroke()

  // Amal Score (large)
  ctx.font      = '600 200px Cormorant Garamond'
  ctx.fillStyle = '#5DC47A'
  ctx.fillText(String(data.amalScore), 96, 510)

  // Score label
  ctx.font      = '400 30px DM Sans'
  ctx.fillStyle = '#3A5A44'
  ctx.fillText('Amal Score Minggu Ini', 96, 560)

  // Prayer rate
  ctx.font      = '500 36px DM Sans'
  ctx.fillStyle = '#D4A040'
  ctx.fillText(`${data.prayerRate}% salat tepat waktu`, 96, 640)

  // Best prayer
  ctx.font      = '400 26px DM Sans'
  ctx.fillStyle = '#3A5A44'
  ctx.fillText(`Paling konsisten: ${data.bestPrayer}`, 96, 690)

  // Quote
  ctx.font      = 'italic 400 28px Cormorant Garamond'
  ctx.fillStyle = '#7A9A86'
  wrapText(ctx, `"${data.quote}"`, 96, 800, 888, 40)

  // Footer
  ctx.font      = '400 22px DM Sans'
  ctx.fillStyle = '#1E3028'
  ctx.fillText('mihrab.app', 96, 1000)

  return new Promise(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'))
}

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  maxWidth: number,
  lineHeight: number
): void => {
  const words = text.split(' ')
  let line    = ''
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, y)
      line = word + ' '
      y   += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, y)
}

export const downloadCard = (blob: Blob, filename = 'mihrab-weekly.png'): void => {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href    = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

## 9.3 Share Card UI

```
In /profil, below achievements:

Card: "Progress Minggu Ini"
- Preview thumbnail (small canvas preview 200x200)
- "Simpan ke Galeri" → triggers download
- Show only if user has ≥ 3 days of data

Achievement card auto-triggers on unlock toast:
- "Bagikan Achievement Ini" button inside toast
```

**Phase 9 Acceptance Criteria:**
- [ ] Weekly card generates with real user data
- [ ] Card downloads as PNG on Android Chrome + iOS Safari
- [ ] Achievement card triggers on unlock
- [ ] Preview shows before download
- [ ] Button hidden if < 3 days of data

---
---

# PHASE 10 — ONBOARDING

> File: `src/app/onboarding/page.tsx`
> Show only once — check `isOnboarded()` in root layout.

## 10.1 Screens

```
Screen 1 — Welcome
  Logo mark (SVG, centered)
  "Assalamu'alaikum"
  "Bukan sekadar mencatat ibadah. Tapi mengukur kualitasnya."
  [Mulai Perjalanan] → Screen 2

Screen 2 — Name
  "Siapa namamu?"
  <input> min 2 chars, large font, centered
  [Lanjut] → Screen 3

Screen 3 — Location
  "Di kota mana kamu tinggal?"
  Searchable dropdown — major Indonesian cities with lat/lng
  [Lanjut] → Screen 4

Screen 4 — Notifications
  "Boleh Mihrab ingatkan waktu salat?"
  [Izinkan Notifikasi] → request permission → Screen 5
  [Nanti Saja] → Screen 5

Screen 5 — Ready
  "Bismillah, mari mulai."
  User name + "Rank awal: Musafir 🌱"
  [Masuk ke Mihrab] → saves profile → setOnboarded() → redirect /
```

## 10.2 City List (static data)

```typescript
export const INDONESIAN_CITIES = [
  { name: 'Jakarta',    lat: -6.2088,  lng: 106.8456 },
  { name: 'Surabaya',   lat: -7.2575,  lng: 112.7521 },
  { name: 'Bandung',    lat: -6.9175,  lng: 107.6191 },
  { name: 'Medan',      lat: 3.5952,   lng: 98.6722  },
  { name: 'Semarang',   lat: -6.9932,  lng: 110.4203 },
  { name: 'Makassar',   lat: -5.1477,  lng: 119.4327 },
  { name: 'Palembang',  lat: -2.9761,  lng: 104.7754 },
  { name: 'Yogyakarta', lat: -7.7956,  lng: 110.3695 },
  { name: 'Denpasar',   lat: -8.6705,  lng: 115.2126 },
  { name: 'Bogor',      lat: -6.5971,  lng: 106.8060 },
  { name: 'Depok',      lat: -6.4025,  lng: 106.7942 },
  { name: 'Tangerang',  lat: -6.1702,  lng: 106.6402 },
  { name: 'Bekasi',     lat: -6.2349,  lng: 106.9896 },
]
```

**Phase 10 Acceptance Criteria:**
- [ ] Onboarding shows only on first open
- [ ] Name and city save to localStorage correctly
- [ ] Prayer times use saved city coordinates
- [ ] After completing onboarding, never shows again
- [ ] Skip works cleanly (goes to home with defaults)

---
---

# PHASE 11 — NOTIFICATIONS

> File: `src/lib/notifications.ts`

## 11.1 Notification Types

```typescript
export const NOTIF_TYPES = {
  PRAYER_REMINDER: 'prayer',    // 5 min before prayer
  DZIKIR_PAGI:     'dzikir-p',  // after Fajr
  DZIKIR_PETANG:   'dzikir-a',  // after Asr
  STREAK_REMINDER: 'streak',    // 21:00 if incomplete
  ACHIEVEMENT:     'achieve',   // on unlock
} as const
```

## 11.2 Implementation

```typescript
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export const sendNotification = (
  title:   string,
  body:    string,
  tag?:    string
): void => {
  if (Notification.permission !== 'granted') return
  new Notification(title, {
    body,
    icon:  '/icon-192.png',
    badge: '/icon-192.png',
    tag:   tag ?? 'mihrab',
  })
}

export const schedulePrayerReminders = (schedule: PrayerSchedule): void => {
  const prayers = [
    { key: 'fajr',    name: 'Subuh',   time: schedule.fajr    },
    { key: 'dhuhr',   name: 'Dzuhur',  time: schedule.dhuhr   },
    { key: 'asr',     name: 'Ashar',   time: schedule.asr     },
    { key: 'maghrib', name: 'Maghrib', time: schedule.maghrib },
    { key: 'isha',    name: 'Isya',    time: schedule.isha    },
  ]

  prayers.forEach(({ name, time }) => {
    const reminderTime = new Date(time.getTime() - 5 * 60 * 1000) // 5 min before
    const delay        = reminderTime.getTime() - Date.now()

    if (delay > 0) {
      setTimeout(() => {
        sendNotification(
          `🕌 ${name} 5 menit lagi`,
          'Jangan lewatkan window tepat waktu untuk XP penuh!',
          `prayer-${name}`
        )
      }, delay)
    }
  })
}
```

**Phase 11 Acceptance Criteria:**
- [ ] Permission request works on Android Chrome
- [ ] Prayer reminders fire 5 minutes before each prayer
- [ ] Streak reminder fires at 21:00 if not all prayers claimed
- [ ] Achievement notification fires immediately on unlock
- [ ] User can disable notifications in settings

---
---

# PHASE 12 — PLAY STORE SUBMISSION

## 12.1 Pre-submission Lighthouse Checklist

Run in Chrome DevTools → Lighthouse → Mobile:
```
Performance:    ≥ 80  ✓
Accessibility:  ≥ 90  ✓
Best Practices: ≥ 90  ✓
SEO:            ≥ 80  ✓
PWA:            100   ✓ (required)
```

## 12.2 Required Assets

```
App icon:        512×512 px, PNG, no transparency on bg
Maskable icon:   512×512 px, PNG (icon centered in safe zone — inner 80%)
Feature graphic: 1024×500 px, PNG or JPG
Screenshots:     Min 2, portrait 1080×1920 px
```

**Play Store Listing (copy-paste ready):**

```
App name: Mihrab

Short description (max 80 chars):
Tracker kualitas ibadah harian. Ukur ketepatan salat & raih Amal Score.

Full description:
Mihrab — bukan sekadar mencatat ibadah. Tapi mengukur kualitasnya.

Seberapa cepat kamu salat setelah azan? Apakah dzikir pagi sudah selesai sebelum syuruq? Apakah quran hari ini sudah dibaca?

Mihrab mengubah semua itu menjadi Amal Score — ukuran nyata kualitas ibadah mingguanmu.

✨ FITUR UTAMA

🕌 XP Ketepatan Waktu
Salat dalam 10 menit pertama setelah azan = 100 XP penuh. Semakin telat, semakin kecil XP-nya. Karena salat awal waktu lebih utama.

📊 Amal Score Mingguan
Skor 0–1000 yang merangkum kualitas seluruh ibadahmu dalam seminggu. Bisa dikompetisikan, bisa dibanggakan.

🏅 Rank Islami
Dari Musafir hingga Rabbani — naiki rank berdasarkan konsistensi dan kualitas, bukan hanya kuantitas.

🏆 Achievement System
Milestone perjalanan spiritual yang permanen. Fajar Setia, Ahli Malam, Pewaris Ibrahim — setiap badge punya cerita.

📤 Share Card Otomatis
Setiap minggu, Mihrab generate kartu progress cantik yang siap dishare ke story. Bukan sekadar angka — tapi cerita perjalanan spiritualmu.

📿 Hub Ibadah Lengkap
Tasbih digital, dzikir pagi/petang dengan teks lengkap, doa harian, dan Al-Quran — semua dalam satu app, tersedia offline.

🌙 Dark & Light Mode
Tampilan yang nyaman di segala kondisi — pagi yang cerah atau malam yang tenang.

Mulai perjalanan spiritualmu hari ini.
Bismillah.
```

## 12.3 TWA Setup with Bubblewrap

```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Init (run from project root)
bubblewrap init --manifest https://mihrab.app/manifest.json

# When prompted:
# Package name:   app.mihrab.android
# App name:       Mihrab
# Launcher name:  Mihrab
# Theme color:    #0C1A14
# Background:     #050E08
# Start URL:      /

# Build
bubblewrap build
# → outputs app-release-bundle.aab
```

## 12.4 Digital Asset Links

Required to remove address bar in TWA:

```json
// File: public/.well-known/assetlinks.json

[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "app.mihrab.android",
    "sha256_cert_fingerprints": ["YOUR_FINGERPRINT_FROM_BUBBLEWRAP"]
  }
}]
```

Add to `next.config.mjs`:
```javascript
async headers() {
  return [{
    source: '/.well-known/assetlinks.json',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
  }]
}
```

**Phase 12 Acceptance Criteria:**
- [ ] Lighthouse PWA score: 100
- [ ] All Play Store assets ready (icons, screenshots, feature graphic)
- [ ] Bubblewrap build succeeds → .aab file generated
- [ ] assetlinks.json live at correct URL
- [ ] Tested on real Android device from Play Store internal testing
- [ ] Address bar does NOT appear when opened from Play Store

---
---

# SUMMARY TABLE

| Phase | What to build | Key files |
|---|---|---|
| 1 | Design system, Tailwind, fonts, manifest | `tailwind.config.ts`, `globals.css`, `manifest.json`, `layout.tsx` |
| 2 | Core UI components | `src/components/ui/*`, `BottomNav.tsx` |
| 3 | Prayer engine + XP + storage | `src/lib/prayer.ts`, `xp.ts`, `storage.ts` |
| 4 | Home dashboard | `src/app/page.tsx` |
| 5 | Tab Amal | `src/app/amal/page.tsx` |
| 6 | Tab Ibadah | `src/app/ibadah/page.tsx` |
| 7 | Tab Statistik | `src/app/statistik/page.tsx` |
| 8 | Tab Profil + Achievements | `src/app/profil/page.tsx`, `src/lib/achievements.ts` |
| 9 | Share card generator | `src/lib/shareCard.ts` |
| 10 | Onboarding | `src/app/onboarding/page.tsx` |
| 11 | Notifications | `src/lib/notifications.ts` |
| 12 | Play Store submission | `public/.well-known/assetlinks.json`, TWA |

**Estimated total: 25–35 working days (solo developer)**

---

## IMPORTANT NOTES FOR KIRO

1. **Adhan.js is already installed** — use it directly, do not install or use Aladhan API
2. **All data in localStorage** — no backend, no database in v1.0
3. **All components mobile-first** — test on 375px width minimum
4. **TypeScript strict mode** — no `any` types
5. **Every phase has acceptance criteria** — complete all before moving to next phase
6. **Light mode uses `[data-theme="light"]`** — dark mode is the default base style
7. **Trust-based system** — jamaah, sedekah, etc. cannot be verified. This is intentional.
8. **Adhan.js calculation method** — use `CalculationMethod.MoonsightingCommittee()` (closest to KEMENAG Indonesia)

---

*Mihrab · PRD v2.0 · May 2026*
*"Sesungguhnya amalan itu tergantung niatnya." — HR. Bukhari*
