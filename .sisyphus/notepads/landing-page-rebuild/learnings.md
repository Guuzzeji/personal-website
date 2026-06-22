# Learnings: landing-page-rebuild

## Project Conventions
- Svelte 5 with runes (`$state`, `$props`)
- TailwindCSS v4 (CSS-first, no config file)
- `svelte-motion` v0.12.2 is the animation library (Svelte port of framer-motion 4.x)
- `cn()` utility in `src/lib/utils.ts` combines clsx + tailwind-merge
- Frosted glass pattern: `bg-[rgba(255,255,255,0.5)] backdrop-blur`
- Black background, Times New Roman font family globally

## Key Decisions
- One-page scrollable layout: 100dvh iPod hero + content sections below
- Progressive scroll-linked morph (1:1 with scroll position)
- BottomNav: 4 text-labeled items on desktop, icons + short labels on mobile
- Music pauses on morph, toggle in bar to resume
- Page state resets to About Me on reverse scroll
- No hover effects on navigation
- Full-width content area (no centered card)

## Animation Approach
- Use `svelte-motion` `AnimateSharedLayout` + `layoutId` for position interpolation
- Use opacity/scale crossfade for extreme shape change (iPod → wide bar)
- Animate only `transform` and `opacity` (GPU-composited)
- Hysteresis: 60% forward threshold, 40% reverse threshold

## Guardrails
- No new npm packages
- No test infrastructure
- No routing library
- No hover magnification
- No modifications to page content (only layout)

## Task 1: NavItem type and navItems
- `src/lib/types.ts` now exports `NavItem` type and `navItems` constant
- Icon paths point to existing SVGs in `src/assets/icons/`
- `pnpm run check` passes with 0 errors; the 4 pre-existing warnings in IPod.svelte are unrelated (a11y button labels)
- navItems IDs match App.svelte currentPage values: "about-me", "work-experience", "projects", "contacts"

## Task 3: Prep-clean App.svelte (remove Dock/SpinningText)
- Removed imports: `FUN_ICON`, `DockIcon`, `Dock`, `SpinningText` from `src/App.svelte`
- Removed SpinningText markup block inside `{#if showIPodPlayer}` (kept the wrapper and iPod div)
- Removed entire Dock block at bottom of the `{:else}` branch
- Kept `showIPodPlayer` state, iPod rendering, content area, and background intact
- `FUN_ICON` only used in App.svelte (verified via grep), safe to remove
- `pnpm run check` passes with 0 errors (4 pre-existing a11y warnings in IPod.svelte unchanged)

## Task 2: BottomNav.svelte
- Created `src/lib/components/BottomNav.svelte` using Svelte 5 `$props` rune
- Props: `currentPage`, `onNavigate`, `showMusicToggle`, `isMusicPlaying`, `onMusicToggle`
- Icon imports use direct `import X from "../assets/icons/<name>.svg"` then mapped via `iconMap` Record (icon paths in navItems are unused strings)
- Layout: `h-14 md:h-16`, mobile shows icon + label stacked (`flex-col`), desktop shows label only (`md:flex-row`)
- Active state: `border-t-2 border-orange-500 text-orange-500`; inactive: `border-t-2 border-transparent text-black`
- Frosted glass: `bg-[rgba(255,255,255,0.5)] backdrop-blur`; iOS safe area: `pb-[env(safe-area-inset-bottom)]`
- Music toggle area reserved with separator `<div class="mx-2 h-6 w-px bg-white/30">` + placeholder button (Task 9 implements real UI)
- `pnpm run check`: 0 errors (4 pre-existing IPod warnings)
- No hover/spring/scale/svelte-motion patterns in file

## Task 4: Refactor App.svelte (scrollable layout with iPod hero + content + BottomNav)
- Removed `showIPodPlayer` state, `fade`/`blur` svelte/transition imports, unused icon imports (ABOUT_ME_ICON etc.)
- Imported `BottomNav` from `./lib/components/BottomNav.svelte`
- New layout: fixed fullscreen background (`-z-10`), sticky iPod hero (`h-screen h-[100dvh] sticky top-0`), content section (`min-h-screen bg-black/80 relative z-10 px-4 pb-24`), BottomNav (`fixed bottom-0 z-50`)
- Content sections render without frosted-glass card wrapper or svelte transitions
- `handlePageChange` scrolls content section into view with `scrollIntoView({ behavior: "smooth" })` via `bind:this`
- iPod's `onHomeBtnClick` prop removed from binding (defaults to no-op in IPod.svelte)
- `pnpm run check`: 0 errors (4 pre-existing IPod warnings unchanged)
- `pnpm run build`: succeeds (171 modules, 115KB JS, 18.9KB CSS)
- **Bug found & fixed**: BottomNav.svelte had wrong relative asset paths (`../assets/icons/` should be `../../assets/icons/` since it's at `src/lib/components/`). Only caught at build-time (vite resolves), not check-time (svelte-check skips). Fixed by correcting to `../../assets/icons/`.
- Playwright verification: page scrollable (bodyHeight=2182 > viewportHeight=900), iPod renders in hero (class `ipod small`), content section has dark bg, BottomNav shows 4 buttons, nav switching works (About Me → Projects)
- Page components (AboutMe, WorkExperience, Projects, Contact) not modified

## Task 6: IPod.svelte — center button toggles play/pause
- Center button `onclick` changed from `onHomeBtnClick(); isPlaying = false` to `togglePlay()`
- `onHomeBtnClick` prop kept for backward compatibility with `@deprecated` JSDoc
- Exported `pauseAudio()` function added (`isPlaying = false`)
- `pnpm run check`: 0 errors, 4 pre-existing warnings unchanged
- Playwright verification: center button toggles "PLAYING" ↔ "PAUSED" without dismissing iPod
- Center button is visually hidden behind `.touch-wheel` but clickable via JS (`.center-button` -> `closest('button')` -> `.click()`)
- Evidence at `.sisyphus/evidence/task-6-type-check.txt`, `task-6-center-play.png`, `task-6-center-pause.png`
