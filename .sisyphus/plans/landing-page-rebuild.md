# Landing Page Rebuild: iPod Morph → Bottom Nav Bar

## TL;DR

> **Quick Summary**: Rebuild the starting page so the iPod morphs into a wide, text-labeled bottom navigation bar as the user scrolls down. Replace the icon-only hover Dock with a simple always-visible menu bar. Content area goes full-width. Scroll back up to reverse the morph and see the iPod again.
>
> **Deliverables**:
> - New `BottomNav.svelte` component (4 labeled items + music toggle)
> - Refactored `App.svelte` (one-page scrollable layout, progressive morph animation)
> - Updated `IPod.svelte` (center button repurposed, audio pause hook)
> - Removed `Dock.svelte` and `DockIcon.svelte`
> - Full-width content area, mobile-responsive nav
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 3 waves (max 4 parallel in Wave 1, max 3 parallel in Wave 3)
> **Critical Path**: Task 1/2/3 → Task 4 → Task 5/6/7 → Task 8/9/10 → Task 11

---

## Context

### Original Request
Rebuild the starting page. Keep the iPod, but animate it to become the bottom menu bar when scrolling. Menu bar should be wider, no hover effects, simple direct text labels for each subpage (Work Experience, Projects from GitHub, Contact, etc.).

### Interview Summary
**Key Discussions**:
- **Scroll mechanism**: One long page — iPod occupies `100vh` hero at top, content sections sit below. Scrolling past the iPod triggers the morph progressively (1:1 with scroll position).
- **Animation**: Progressive scroll-linked morph using svelte-motion (already installed). Scroll down → iPod shrinks/morphs into bottom bar. Scroll back up → bar morphs back into iPod.
- **Audio**: Pause on morph, stay paused on reverse morph. Small music toggle button in the bottom bar to resume.
- **Spinning text**: Removed entirely. iPod stands alone.
- **iPod center button**: Repurposed/disabled — no longer dismisses the iPod.
- **Menu items**: About Me, Work Experience, Projects (GitHub), Contact. 4 items only. NO fun/easter-egg link.
- **Page state**: Reset to About Me on each return from iPod (no persistence across morph cycles).
- **Hover effects**: All removed from navigation.
- **Mobile**: Compact bar with icons + short labels.
- **Content area**: Full-width (removed centered frosted-glass card).
- **Test strategy**: User will QA manually and provide feedback. No automated test setup.

**Research Findings**:
- `svelte-motion` v0.12.2 supports `layoutId` + `AnimateSharedLayout` for shared element morphing
- Best practice: animate `transform` + `opacity` only (GPU-composited, 60fps)
- For extreme aspect ratio changes (iPod 415×692 → full-width 64px bar), combine `layoutId` position tracking with cross-fade for the shape change rather than pure layout morph
- Bottom nav design: 64px height, 3-5 items, 48px touch targets, active state indicator required
- Mobile: `env(safe-area-inset-bottom)` for iOS notch
- Implement hysteresis for scroll threshold to prevent oscillation at boundary

### Metis Review
**Identified Gaps** (addressed):
- **Scroll mechanism**: Resolved — one long page with 100vh iPod hero + content below
- **Morph behavior**: Resolved — progressive, scroll-linked (1:1 tracking)
- **Reverse morph audio**: Resolved — stay paused, toggle to resume
- **iPod click behavior**: Resolved — center button disabled/repurposed
- **Page state persistence**: Resolved — reset to About Me on each cycle
- **layoutId feasibility**: Addressed — use position tracking + opacity crossfade for shape change
- **Music toggle UI**: Applied default — right side of bottom bar, shows play/pause state
- **Scroll hysteresis**: Applied default — 30vh forward threshold, 10vh reverse threshold

---

## Work Objectives

### Core Objective
Transform the landing page from a two-state click-dismiss iPod overlay into a single scrollable page where the iPod progressively morphs into a text-labeled bottom navigation bar, with full-width content below.

### Concrete Deliverables
- `src/lib/components/BottomNav.svelte` — new bottom navigation bar component
- `src/lib/types.ts` — add `NavItem` type
- `src/App.svelte` — refactored one-page layout with scroll-driven morph
- `src/lib/components/IPod.svelte` — updated center button + audio pause hook
- Delete `src/lib/components/Dock.svelte`
- Delete `src/lib/components/DockIcon.svelte`

### Definition of Done
- [ ] `pnpm run build` succeeds with zero errors
- [ ] Scroll down past iPod hero → iPod progressively morphs into BottomNav
- [ ] BottomNav shows 4 text-labeled items: About Me, Work Experience, Projects, Contact
- [ ] Clicking a nav item switches content area to that page
- [ ] BottomNav has NO hover magnification effects
- [ ] Music pauses on morph, toggle button in bar resumes playback
- [ ] Scroll back to top → BottomNav morphs back into iPod, content resets to About Me
- [ ] Mobile: nav bar shows compact icons + short labels
- [ ] Content area is full-width (no centered card container)
- [ ] SpinningText overlay is gone
- [ ] Dock.svelte and DockIcon.svelte are deleted
- [ ] No build warnings or TypeScript errors

### Must Have
- Progressive scroll-driven iPod → BottomNav morph animation
- 4 text-labeled nav items (About Me, Work Experience, Projects, Contact)
- Active state indicator on current page in nav bar
- Music pause on morph with resume toggle in bar
- Full-width content area
- Mobile responsive (compact nav on small screens)
- Zero hover magnification effects on nav

### Must NOT Have (Guardrails)
- NO hover magnification, scale transforms, or spring physics on nav items
- NO fun/easter-egg link (Rick Roll) in nav
- NO SpinningText overlay
- NO Dock.svelte or DockIcon.svelte (delete both files)
- NO routing library — keep `$state`-based page switching
- NO modifications to page components (AboutMe, WorkExperience, Projects, Contact) beyond full-width layout adjustment
- NO changes to iPod CSS rendering, click-wheel controls, or audio player internals
- NO test infrastructure or test files
- NO new npm packages (use existing svelte-motion)
- NO persistent page state across morph cycles (always reset to About Me)
- NO more than 4 navigation items

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. User provides final manual QA feedback.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None — user will manually QA
- **Agent-Executed QA**: MANDATORY for every task

### QA Policy
Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, scroll, interact, assert DOM, screenshot
- **Build/Type Check**: Use Bash — `pnpm run build`, `pnpm run check`
- **File system**: Use Bash — verify file existence/deletion

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.

```
Wave 1 (Start Immediately — foundation, ALL parallel):
├── Task 1: Add NavItem type to types.ts [quick]
├── Task 2: Create BottomNav.svelte component [visual-engineering]
└── Task 3: Prep-clean App.svelte (remove Dock/DockIcon/SpinningText) [quick]

Wave 2 (After Wave 1 — core refactor, sequential within wave):
├── Task 4: Refactor App.svelte to one-page scrollable layout [deep]
├── Task 5: Implement scroll-driven progressive morph animation [deep]
└── Task 6: Update IPod.svelte — center button + audio pause hook [quick]

Wave 3 (After Wave 2 — polish, ALL parallel):
├── Task 7: Full-width content area adjustments [visual-engineering]
├── Task 8: Mobile responsive BottomNav (compact mode) [visual-engineering]
└── Task 9: Music toggle button in BottomNav [quick]

Wave FINAL (After Wave 3 — cleanup + verification):
├── Task 10: Remove dead files + unused imports + build verification [quick]
└── Task 11: Final integration QA (cross-task verification) [unspecified-high]
```

Critical Path: Task 1/2/3 → Task 4 → Task 5 → Task 8/9 → Task 11
Parallel Speedup: ~55% faster than sequential (max 4 concurrent in Wave 1, 3 in Wave 3)

### Dependency Matrix

- **1**: — - 4, 1
- **2**: — - 4, 1
- **3**: — - 4, 1
- **4**: 1, 2, 3 - 5, 6, 7, 2
- **5**: 4 - 8, 9, 3
- **6**: 4 - 8, 3
- **7**: 4 - 10, 3
- **8**: 5, 6 - 10, 3
- **9**: 5 - 10, 3
- **10**: 7, 8, 9 - 11, 4
- **11**: 10 - —, FINAL

### Agent Dispatch Summary

- **1**: **3** — T1 → `quick`, T2 → `visual-engineering`, T3 → `quick`
- **2**: **3** — T4 → `deep`, T5 → `deep`, T6 → `quick`
- **3**: **3** — T7 → `visual-engineering`, T8 → `visual-engineering`, T9 → `quick`
- **4**: **2** — T10 → `quick`, T11 → `unspecified-high`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

- [x] 1. Add NavItem type to types.ts

  **What to do**:
  - Open `src/lib/types.ts`
  - Add a `NavItem` interface with fields: `id: string` (page key), `label: string` (display text), `icon: string` (SVG import path for mobile compact mode)
  - Define the 4 nav items as a constant array: About Me (`about-me`), Work Experience (`work-experience`), Projects (`projects`), Contact (`contacts`)
  - Export both the type and the constant array
  - Keep existing `Project` type intact

  **Must NOT do**:
  - Do NOT modify or remove the existing `Project` type
  - Do NOT add more than 4 nav items

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file, simple type addition, no logic
  - **Skills**: `[]`
    - No special skills needed — straightforward TypeScript interface

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 4
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/lib/types.ts:1-10` — Existing type file structure, follow same export pattern
  - `src/App.svelte:22-26` — Current `currentPage` values (`"about-me"`, `"work-experience"`, `"projects"`, `"contacts"`) to match
  - `src/assets/icons/` — SVG icon files available for nav (Winking Face With Tongue.svg, Necktie.svg, Open File Folder.svg, Open Mailbox With Raised Flag.svg)

  **Acceptance Criteria**:
  - [ ] `NavItem` type exported from `src/lib/types.ts`
  - [ ] `navItems` constant array exported with 4 items matching current page IDs
  - [ ] `pnpm run check` passes with zero TypeScript errors

  **QA Scenarios**:

  ```
  Scenario: TypeScript compilation succeeds with new types
    Tool: Bash
    Preconditions: types.ts modified with NavItem type
    Steps:
      1. Run: pnpm run check
      2. Assert exit code 0
    Expected Result: Zero TypeScript errors, build passes
    Failure Indicators: Any TS error mentioning types.ts, missing exports, or type mismatches
    Evidence: .sisyphus/evidence/task-1-type-check.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-1-type-check.txt` — output of `pnpm run check`

  **Commit**: YES (groups with Tasks 2, 3)
  - Message: `feat(types): add NavItem type and nav items constant`
  - Files: `src/lib/types.ts`

- [x] 2. Create BottomNav.svelte component

  **What to do**:
  - Create `src/lib/components/BottomNav.svelte`
  - Accept props: `currentPage: string`, `onNavigate: (page: string) => void`, `showMusicToggle: boolean`
  - Render 4 nav items from the `navItems` constant (imported from `../types`)
  - Each item shows: label text + (mobile only) icon. Use Tailwind responsive classes (`md:flex`, etc.)
  - Active item gets distinct styling: colored text/border-top indicator (use `text-orange-500` to match iPod center button color)
  - Desktop (md+): items spread horizontally with full text labels, `justify-between` or `justify-around`, 64px height
  - Mobile (< md): compact bar height 56px, icons + short abbreviated labels
  - Use `env(safe-area-inset-bottom)` as padding-bottom for iOS safe area
  - Bar background: frosted glass effect matching current site aesthetic — `bg-[rgba(255,255,255,0.5)] backdrop-blur`
  - Bar fixed to bottom of viewport: `fixed bottom-0 left-0 right-0 z-50`
  - NO hover effects: no `hover:scale-*`, no `transition-transform`, no spring animations on items
  - Click/tap only for navigation: `on:click` handlers calling `onNavigate(item.id)`
  - Use `button` elements for accessibility
  - Reserve a slot or prop-controlled area on the right side for the music toggle (will be wired in Task 9)

  **Must NOT do**:
  - NO svelte-motion imports or spring animations
  - NO hover magnification or scale transforms
  - NO Dock.svelte or DockIcon.svelte pattern replication
  - NO more than 4 nav items
  - NO fun/easter-egg link
  - DO NOT modify App.svelte yet (that's Task 4)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: New UI component with responsive design, frosted glass aesthetic, accessibility concerns
  - **Skills**: `["frontend-ui-ux"]`
    - `frontend-ui-ux`: Crafting the visual design, responsive layout, active states
  - **Skills Evaluated but Omitted**:
    - `svelte-motion`: Explicitly NOT using — no hover animations

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 4
  - **Blocked By**: None (can start immediately, but imports from types.ts — Task 1 should complete first in practice)

  **References**:
  - `src/lib/types.ts:NavItem` — The type this component will consume (from Task 1)
  - `src/App.svelte:102-156` — Current Dock usage pattern to understand existing nav items, icons, and click handlers
  - `src/App.svelte:57` — Current frosted glass style: `bg-[rgba(255,255,255,0.5)] backdrop-blur` — replicate this
  - `src/App.svelte:120,128,136,144` — SVG icon imports to use (same icons as current Dock)
  - `src/lib/components/Dock.svelte:31-35` — Direction-based alignment pattern (note: BottomNav won't use this, fixed bottom)

  **Acceptance Criteria**:
  - [ ] File exists: `src/lib/components/BottomNav.svelte`
  - [ ] Component renders 4 labeled items on desktop (full text)
  - [ ] Active item has distinct visual indicator (orange border-top or colored text)
  - [ ] Mobile (< 768px): compact bar with icons + short labels
  - [ ] No hover scale/magnification effects (verify via grep for `hover:scale` or `hover:transform` in file)
  - [ ] `pnpm run check` passes

  **QA Scenarios**:

  ```
  Scenario: Component exists and has correct structure
    Tool: Bash (grep)
    Preconditions: BottomNav.svelte created
    Steps:
      1. Run: grep -c "onNavigate" src/lib/components/BottomNav.svelte
      2. Assert output is >= 1 (component accepts navigation callback)
      3. Run: grep -c "currentPage" src/lib/components/BottomNav.svelte
      4. Assert output is >= 1 (component accepts current page prop)
    Expected Result: Component has required props
    Failure Indicators: Missing prop declarations
    Evidence: .sisyphus/evidence/task-2-structure.txt

  Scenario: No hover effects in component
    Tool: Bash (grep)
    Preconditions: BottomNav.svelte created
    Steps:
      1. Run: grep -i "hover" src/lib/components/BottomNav.svelte
      2. Assert: no output OR only non-magnification hover (e.g., hover for color change is fine, but no scale/magnification)
      3. Run: grep -i "spring\|motion\|scale" src/lib/components/BottomNav.svelte
      4. Assert: no output (zero svelte-motion or scale transforms)
    Expected Result: No hover magnification or spring animation code
    Failure Indicators: Any svelte-motion imports, spring configs, scale transforms
    Evidence: .sisyphus/evidence/task-2-no-hover.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-2-structure.txt` — grep output showing props exist
  - [ ] `task-2-no-hover.txt` — grep output confirming no hover/spring/scale

  **Commit**: YES (groups with Tasks 1, 3)
  - Message: `feat(components): create BottomNav component with text labels and active state`
  - Files: `src/lib/components/BottomNav.svelte`

- [x] 3. Prep-clean App.svelte — remove Dock, DockIcon, and SpinningText

  **What to do**:
  - Open `src/App.svelte`
  - Remove imports: `DockIcon` (line 16), `Dock` (line 17), `SpinningText` (line 19)
  - Remove associated icon imports that are only used in Dock: `FUN_ICON` (line 5) — verify no other usage first via grep
  - Remove the SpinningText markup block (lines 46-53): the entire `{#if showIPodPlayer}` inner `<div>` with `SpinningText` component
  - Remove the entire Dock block (lines 102-156): the outer `<div in:blur>` wrapper and all Dock + DockIcon children
  - Keep the `{#if showIPodPlayer}` block structure and the `{:else}` block structure intact — Task 4 will refactor these
  - After removal, verify `pnpm run check` still passes (there may be some unreachable code warnings — that's fine for now)
  - Do NOT remove the `showIPodPlayer` state variable — it's still needed

  **Must NOT do**:
  - Do NOT remove the iPod rendering block (lines 54-60)
  - Do NOT remove the content area block (lines 61-101)
  - Do NOT change the background image div
  - Do NOT delete component files yet (Dock.svelte, DockIcon.svelte, SpinningText.svelte) — that happens in Task 10

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward removal of specific markup blocks and imports, no new logic
  - **Skills**: `[]`
    - No special skills needed — grep + edit

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 4
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/App.svelte:16-19` — Import lines to remove (DockIcon, Dock, SpinningText)
  - `src/App.svelte:5` — FUN_ICON import (verify no other usage before removing)
  - `src/App.svelte:46-53` — SpinningText markup to remove
  - `src/App.svelte:102-156` — Dock block to remove
  - `src/App.svelte:42-61` — `{#if showIPodPlayer}` block to modify (remove SpinningText, keep iPod)

  **Acceptance Criteria**:
  - [ ] DockIcon import removed from App.svelte
  - [ ] Dock import removed from App.svelte
  - [ ] SpinningText import removed from App.svelte
  - [ ] FUN_ICON import removed (after verifying no other usage)
  - [ ] SpinningText markup block removed
  - [ ] Entire Dock markup block removed (lines ~102-156)
  - [ ] `pnpm run check` passes (may have unreachable code warnings — acceptable)

  **QA Scenarios**:

  ```
  Scenario: Imports removed successfully
    Tool: Bash (grep)
    Preconditions: App.svelte cleaned
    Steps:
      1. Run: grep "DockIcon" src/App.svelte
      2. Assert: no output (zero matches)
      3. Run: grep "SpinningText" src/App.svelte
      4. Assert: no output (zero matches)
      5. Run: grep "from.*Dock" src/App.svelte
      6. Assert: no output (zero matches)
    Expected Result: All Dock/DockIcon/SpinningText references removed
    Failure Indicators: Any remaining import or usage of removed components
    Evidence: .sisyphus/evidence/task-3-removed-imports.txt

  Scenario: TypeScript check passes after cleanup
    Tool: Bash
    Preconditions: App.svelte cleaned
    Steps:
      1. Run: pnpm run check
      2. Assert exit code 0
    Expected Result: No TypeScript errors (warnings about unreachable code acceptable)
    Failure Indicators: Any TS error in App.svelte
    Evidence: .sisyphus/evidence/task-3-type-check.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-3-removed-imports.txt` — grep output confirming removals
  - [ ] `task-3-type-check.txt` — output of `pnpm run check`

  **Commit**: YES (groups with Tasks 1, 2)
  - Message: `refactor(app): remove Dock, DockIcon, SpinningText — prep for BottomNav`
  - Files: `src/App.svelte`

- [x] 4. Refactor App.svelte to one-page scrollable layout

  **What to do**:
  - The current iPod page uses `h-screen overflow-hidden` (line 41, 46-47) — this MUST change
  - Replace the two-state `{#if showIPodPlayer}...{:else}...{/if}` structure with a single scrollable page
  - New layout structure:
    1. **iPod Hero Section**: Full `100dvh` section at top of page. iPod centered within. Use `dvh` (dynamic viewport height) to avoid iOS Safari toolbar jank, fallback to `h-screen`
    2. **Content Sections Below**: After the hero, render content sections (About Me, Work Experience, Projects, Contact) in a vertical stack
  - iPod hero uses `position: sticky; top: 0` during the morph phase so it stays pinned while content scrolls over
  - Remove the `showIPodPlayer` boolean state — no longer needed (no more two-state toggle)
  - Keep `currentPage` state for page switching
  - Import BottomNav from Task 2: `import BottomNav from "./lib/components/BottomNav.svelte"`
  - BottomNav renders as `position: fixed; bottom: 0` and is always in the DOM, but visibility is controlled by scroll position (Task 5 handles the animation)
  - Content area: remove the centered frosted card wrapper (`bg-[rgba(255,255,255,0.5)] backdrop-blur p-4 rounded-md`). Pages render directly in full-width containers
  - Page switching: BottomNav's `onNavigate` handler updates `currentPage`. Content area renders the selected page using `{#if}` blocks (keep existing pattern)
  - On page switch, scroll to the content section (use `scrollIntoView` or a ref) for smooth UX
  - Remove the `<div in:blur>` transition wrappers on content — content is always visible below the hero

  **Must NOT do**:
  - Do NOT modify page components (AboutMe, WorkExperience, Projects, Contact) beyond layout — if they need full-width adjustments, defer to Task 7
  - Do NOT implement the scroll-driven morph animation — that's Task 5
  - Do NOT implement mobile responsive nav — that's Task 8
  - Do NOT implement the music toggle — that's Task 9
  - Keep the background image div intact

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex architectural refactor — changing from two-state toggle to single-page scrollable layout, involving multiple layout concerns
  - **Skills**: `[]`
    - No special skills needed — core Svelte + Tailwind work

  **Parallelization**:
  - **Can Run In Parallel**: NO — sequential within Wave 2
  - **Parallel Group**: Wave 2 (with Tasks 5, 6 — sequential)
  - **Blocks**: Tasks 5, 6, 7
  - **Blocked By**: Tasks 1, 2, 3

  **References**:
  - `src/App.svelte:41` — Current `h-screen overflow-hidden` to replace with scrollable layout
  - `src/App.svelte:42-61` — Current iPod `{#if}` block to restructure into hero section
  - `src/App.svelte:62-101` — Current content `{:else}` block to restructure into below-hero sections
  - `src/App.svelte:22-26` — `currentPage` and `handlePageChange` — keep, adapt for BottomNav
  - `src/lib/components/BottomNav.svelte` — The component to import and render (from Task 2)
  - `src/lib/types.ts:navItems` — Nav items constant (from Task 1)
  - Browser compat: Use `100dvh` with `100vh` fallback for dynamic viewport units

  **Acceptance Criteria**:
  - [ ] Page is scrollable (no `overflow-hidden` on body/main)
  - [ ] iPod renders in a `100dvh` hero section at top of page
  - [ ] Content sections render below the hero, full-width, scrollable
  - [ ] BottomNav component renders at bottom of viewport (fixed position)
  - [ ] Clicking nav items switches content in the below-hero area
  - [ ] `showIPodPlayer` state variable removed
  - [ ] No two-state `{#if}` toggle for iPod vs content (both exist simultaneously on one page)
  - [ ] `pnpm run build` succeeds
  - [ ] `pnpm run dev` starts without errors

  **QA Scenarios**:

  ```
  Scenario: Page is scrollable after refactor
    Tool: Playwright (browser)
    Preconditions: Dev server running (pnpm run dev)
    Steps:
      1. Navigate to http://localhost:5173
      2. Wait for page load
      3. Assert page is scrollable: evaluate `document.body.scrollHeight > window.innerHeight`
      4. Take screenshot of the iPod hero section
      5. Scroll down by 500px using page.evaluate('window.scrollBy(0, 500)')
      6. Wait 500ms
      7. Take screenshot — should show content sections below hero
    Expected Result: Page scrolls, content visible below iPod hero
    Failure Indicators: Page not scrollable, content not visible, overflow hidden still active
    Evidence: .sisyphus/evidence/task-4-scrollable.png, .sisyphus/evidence/task-4-content.png

  Scenario: BottomNav renders and page switching works
    Tool: Playwright (browser)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll to bottom of page to see BottomNav
      3. Assert BottomNav is visible (check for text "About Me", "Work Experience", "Projects", "Contact")
      4. Click the "Projects" button in BottomNav
      5. Wait 500ms
      6. Assert content area now shows Projects content (check for text "Projects" or "Follow me on GitHub")
    Expected Result: BottomNav visible at bottom, clicking items switches content
    Failure Indicators: BottomNav not visible, clicks don't change content, error in console
    Evidence: .sisyphus/evidence/task-4-bottomnav.png, .sisyphus/evidence/task-4-page-switch.png
  ```

  **Evidence to Capture**:
  - [ ] `task-4-scrollable.png` — screenshot of iPod hero
  - [ ] `task-4-content.png` — screenshot of content below hero
  - [ ] `task-4-bottomnav.png` — screenshot showing BottomNav
  - [ ] `task-4-page-switch.png` — screenshot after clicking Projects

  **Commit**: YES
  - Message: `refactor(app): restructure to one-page scrollable layout with BottomNav`
  - Files: `src/App.svelte`

- [x] 5. Implement scroll-driven progressive iPod → BottomNav morph animation

  **What to do**:
  - This is the core animation that ties the iPod hero and the BottomNav together
  - Use `svelte-motion` (already installed) for scroll-linked animation
  - **Animation Concept** (tied 1:1 to scroll position over hero height):
    - Scroll 0% → 100% of hero height (`100dvh`): iPod progressively fades out and scales down while BottomNav fades in
    - Use `useScroll` from svelte-motion to track scroll position
    - Use `useTransform` to map scroll progress (0–1 over hero height) to iPod opacity (1→0) and scale (1→0.3), and BottomNav opacity (0→1)
    - iPod transforms: `translateY` stays centered in hero during fade-out, `scale` reduces from 1 to 0.3, `opacity` from 1 to 0
    - BottomNav transforms: `opacity` from 0 to 1, positioned `fixed bottom-0`
    - Implement hysteresis: use different thresholds for showing/hiding to prevent oscillation at boundary
      - BottomNav becomes fully visible at scroll > 60% of hero height
      - BottomNav starts hiding only when scroll < 40% of hero height
      - This prevents rapid toggle when user scrolls near the threshold
  - **layoutId approach**: Wrap both the iPod container and the BottomNav with `<Motion>` components sharing `layoutId="main-nav"`. Motion handles the position interpolation. The shape difference (iPod rectangle → wide bar) is handled by separate opacity crossfade.
  - **AnimateSharedLayout**: Wrap the page's main content area with `<AnimateSharedLayout>` from svelte-motion so layoutId works across the two components
  - iPod should become `pointer-events: none` when opacity < 0.1 so users can interact with content behind it
  - On reverse scroll (back to top): BottomNav fades out, iPod fades back in, content resets to About Me
  - On page reset (returning to About Me): use `scrollTo({ top: 0, behavior: 'smooth' })` to bring user back to iPod hero

  **Must NOT do**:
  - Do NOT animate `width` or `height` properties — use `transform: scale()` and `opacity` only
  - Do NOT use GSAP or any new animation library — use existing `svelte-motion`
  - Do NOT remove the iPod's internal CSS or audio logic
  - Do NOT add scroll jacking (intercepting normal scroll behavior)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex scroll-linked animation with svelte-motion, requires understanding of useScroll, useTransform, layoutId, and hysteresis logic
  - **Skills**: `[]`
    - No special skills needed — core Svelte + svelte-motion API work

  **Parallelization**:
  - **Can Run In Parallel**: NO — sequential within Wave 2
  - **Parallel Group**: Wave 2 (with Tasks 4, 6 — sequential)
  - **Blocks**: Tasks 8, 9
  - **Blocked By**: Task 4

  **References**:
  - `src/App.svelte` — The refactored layout from Task 4 where the animation is wired
  - `src/lib/components/BottomNav.svelte` — The BottomNav component from Task 2 to animate
  - `src/lib/components/Dock.svelte:38-51` — Existing `Motion` + `use:motion` pattern from svelte-motion
  - `src/lib/components/DockIcon.svelte:3-8,21-36` — `useMotionValue`, `useSpring`, `useTransform` usage patterns
  - svelte-motion API: `AnimateSharedLayout`, `layoutId`, `useScroll`, `useTransform`, `useSpring`
  - Scroll hysteresis pattern: track `scrollProgress` with `useMotionValue`, derive visibility with two thresholds

  **Acceptance Criteria**:
  - [ ] Scrolling down from iPod hero progressively fades out iPod, fades in BottomNav
  - [ ] Animation tracks 1:1 with scroll position (scroll 50% = 50% transitioned)
  - [ ] iPod uses `transform: scale()` and `opacity` (no width/height animation) — verify via grep: no `width` or `height` in transition/animation properties
  - [ ] Hysteresis prevents oscillation: rapid up/down scroll near threshold doesn't cause flicker
  - [ ] Scrolling all the way back to top restores iPod fully, resets content to About Me
  - [ ] `pnpm run build` succeeds
  - [ ] No runtime errors in console during scroll

  **QA Scenarios**:

  ```
  Scenario: Scroll down triggers progressive morph
    Tool: Playwright (browser)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:5173
      2. Wait for iPod to render
      3. Take screenshot (evidence: iPod at 0% scroll)
      4. Scroll down by 30% of viewport height: page.evaluate('window.scrollTo({ top: window.innerHeight * 0.3, behavior: "instant" })')
      5. Wait 300ms
      6. Take screenshot (should show iPod partially faded, BottomNav partially visible)
      7. Scroll down by 80% of viewport height
      8. Wait 300ms
      9. Take screenshot (should show BottomNav fully visible, iPod nearly gone)
      10. Scroll down to fully past hero (window.innerHeight * 1.1)
      11. Wait 300ms
      12. Assert BottomNav opacity > 0.9 (fully visible)
      13. Assert iPod container opacity < 0.1 (fully hidden) or not intercepting clicks
    Expected Result: Smooth progressive transition from iPod to BottomNav
    Failure Indicators: No visual change on scroll, jarring snap transition, errors in console
    Evidence: .sisyphus/evidence/task-5-scroll-0.png, .sisyphus/evidence/task-5-scroll-30.png, .sisyphus/evidence/task-5-scroll-80.png

  Scenario: Scroll back to top restores iPod
    Tool: Playwright (browser)
    Preconditions: Scrolled past hero (BottomNav visible)
    Steps:
      1. After being scrolled past hero, execute: page.evaluate('window.scrollTo({ top: 0, behavior: "instant" })')
      2. Wait 500ms
      3. Take screenshot
      4. Assert iPod is visible (opacity > 0.8)
      5. Assert BottomNav is hidden or very low opacity
      6. Assert content area shows "About Me" (or intro state)
    Expected Result: iPod fully visible, BottomNav hidden, content reset
    Failure Indicators: iPod not visible, BottomNav still showing, wrong page content
    Evidence: .sisyphus/evidence/task-5-scroll-back.png

  Scenario: No oscillation at threshold boundary
    Tool: Playwright (browser)
    Preconditions: Dev server running
    Steps:
      1. Navigate to page
      2. Scroll to exactly 60% of hero height (threshold area)
      3. Scroll up 5%, then down 5%, up 5%, down 5% rapidly
      4. Wait 500ms
      5. Assert BottomNav visibility state is stable (not rapidly toggling)
      6. Check console for errors
    Expected Result: Stable state despite rapid small scrolls near threshold
    Failure Indicators: Flickering BottomNav, rapid toggle, console errors
    Evidence: .sisyphus/evidence/task-5-no-oscillation.png
  ```

  **Evidence to Capture**:
  - [ ] `task-5-scroll-0.png` — iPod at 0% scroll
  - [ ] `task-5-scroll-30.png` — 30% scrolled, partial morph
  - [ ] `task-5-scroll-80.png` — 80% scrolled, BottomNav visible
  - [ ] `task-5-scroll-back.png` — scrolled back to top
  - [ ] `task-5-no-oscillation.png` — stable state near threshold

  **Commit**: YES
  - Message: `feat(animation): implement scroll-driven iPod → BottomNav progressive morph`
  - Files: `src/App.svelte`

- [x] 6. Update IPod.svelte — repurpose center button + add audio pause hook

  **What to do**:
  - Open `src/lib/components/IPod.svelte`
  - **Center button repurpose**: Remove the `onHomeBtnClick()` call from the center button `onclick` handler (line 67). The center button should no longer dismiss the iPod
  - Replace the onclick with either: (a) nothing (button becomes decorative), or (b) toggle play/pause (same as the play-pause button at the bottom of the wheel)
  - Default choice: make center button toggle play/pause (matches iPod's "click to interact" feel). This means calling `togglePlay()` instead of `onHomeBtnClick()` + `isPlaying = false`
  - **Audio pause hook**: Add an exported function or prop that allows the parent (App.svelte) to signal "pause audio". This can be:
    - An exported `pauseAudio()` function: `export function pauseAudio() { isPlaying = false; }`
    - Or accept a `shouldPause` prop that when set to `true`, sets `isPlaying = false`
  - The parent (App.svelte) will call this when scroll triggers the morph (Task 5 will wire this)
  - Keep the `onHomeBtnClick` prop for backward compatibility but it's no longer called by center button — mark as deprecated with a comment
  - Keep ALL existing iPod CSS, audio player logic, click wheel controls, and visual appearance intact

  **Must NOT do**:
  - Do NOT change any iPod CSS styles
  - Do NOT change the audio element or its `loop`, `preload`, `bind:paused`, `bind:volume` bindings
  - Do NOT remove the click wheel buttons (skip forward, skip back, play-pause)
  - Do NOT remove the `onHomeBtnClick` prop declaration (keep for compatibility)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small targeted change — repurpose one click handler, add one export function
  - **Skills**: `[]`
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO — sequential within Wave 2
  - **Parallel Group**: Wave 2 (with Tasks 4, 5 — sequential)
  - **Blocks**: Task 8
  - **Blocked By**: Task 4

  **References**:
  - `src/lib/components/IPod.svelte:2` — `onHomeBtnClick` prop declaration
  - `src/lib/components/IPod.svelte:65-69` — Center button onclick handler to modify
  - `src/lib/components/IPod.svelte:8-10` — `togglePlay()` function to reuse
  - `src/lib/components/IPod.svelte:4-6` — State variables (`isPlaying`, `isAudioReady`, `volume`)
  - `src/lib/components/IPod.svelte:76-90` — Audio element (do NOT modify)

  **Acceptance Criteria**:
  - [ ] Center button no longer calls `onHomeBtnClick()` (no iPod dismissal)
  - [ ] Center button toggles play/pause instead
  - [ ] `pauseAudio()` function exported and callable from parent
  - [ ] All existing iPod functionality preserved (play/pause button, skip buttons, volume, screen display)
  - [ ] `pnpm run check` passes

  **QA Scenarios**:

  ```
  Scenario: Center button toggles play/pause (not dismiss)
    Tool: Playwright (browser)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:5173
      2. Wait for iPod to render
      3. Click the center orange button
      4. Wait 500ms
      5. Assert: iPod screen shows "PLAYING" (audio started)
      6. Click center orange button again
      7. Wait 500ms
      8. Assert: iPod screen shows "PAUSED" (audio paused)
      9. Assert: iPod is still visible (not dismissed)
    Expected Result: Center button toggles audio, does NOT dismiss iPod
    Failure Indicators: iPod disappears, audio doesn't play, error in console
    Evidence: .sisyphus/evidence/task-6-center-play.png, .sisyphus/evidence/task-6-center-pause.png

  Scenario: pauseAudio() export works
    Tool: Bash (grep)
    Preconditions: IPod.svelte updated
    Steps:
      1. Run: grep "export function pauseAudio" src/lib/components/IPod.svelte
      2. Assert: found match (function is exported)
    Expected Result: pauseAudio function is exported
    Failure Indicators: No export found
    Evidence: .sisyphus/evidence/task-6-pause-export.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-6-center-play.png` — screenshot after center click (playing)
  - [ ] `task-6-center-pause.png` — screenshot after second click (paused)
  - [ ] `task-6-pause-export.txt` — grep output confirming export

  **Commit**: YES
  - Message: `refactor(ipod): repurpose center button to toggle play/pause, add pauseAudio export`
  - Files: `src/lib/components/IPod.svelte`

- [ ] 7. Full-width content area adjustments

  **What to do**:
  - In App.svelte's content area (below the iPod hero), remove any remaining centered card wrappers, `max-w-*` constraints, or frosted-glass containers from the content rendering area
  - Content sections should span full viewport width with reasonable horizontal padding (use `px-4 md:px-8 lg:px-12`)
  - Remove the `bg-[rgba(255,255,255,0.5)] backdrop-blur` from the content area (keep it only on BottomNav)
  - Remove `rounded-md` or `rounded-4xl` from content container
  - Adjust page components (AboutMe, WorkExperience, Projects, Contact) if they have internal `max-w` constraints or centered layouts that conflict with full-width
    - Check each page for hardcoded width constraints
    - Pages should fill available width with consistent text max-width (~75ch) for readability
  - The overall content area should feel open — no card border, no background blur box
  - Keep the background image visible behind content (transparent content area)

  **Must NOT do**:
  - Do NOT change page content text or structure
  - Do NOT remove content entirely — just adjust layout props
  - Do NOT affect the iPod hero section styling

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Layout and styling adjustments across multiple files, visual consistency
  - **Skills**: `["frontend-ui-ux"]`
    - `frontend-ui-ux`: Ensuring clean full-width layout with proper readability

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: Task 10
  - **Blocked By**: Task 4

  **References**:
  - `src/App.svelte:62-101` — Current content area with centered card wrappers (post-refactor from Task 4)
  - `src/lib/pages/AboutMe.svelte:15` — Page wrapper with potential width constraints
  - `src/lib/pages/WorkExperience.svelte:1` — Page wrapper with potential width constraints
  - `src/lib/pages/Projects.svelte:29` — Page wrapper with potential width constraints
  - `src/lib/pages/Contact.svelte:1` — Page wrapper with potential width constraints

  **Acceptance Criteria**:
  - [ ] Content area has no `max-w-*` constraints preventing full-width
  - [ ] Content area has no frosted-glass background (`bg-[rgba(255,255,255,0.5)]` or `backdrop-blur`)
  - [ ] Content area has no rounded corners (`rounded-*`)
  - [ ] Pages have consistent horizontal padding
  - [ ] Text content has reasonable max-width (~75ch) for readability while container is full-width
  - [ ] Background image visible behind content
  - [ ] `pnpm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: Content is full-width with no card wrapper
    Tool: Playwright (browser)
    Preconditions: Dev server running, scrolled past hero to content
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll past hero to content area
      3. Take screenshot
      4. Evaluate: document.querySelector('[class*="bg-[rgba(255,255,255,0.5)]"]') in content area — should be null
      5. Evaluate: document.querySelector('[class*="backdrop-blur"]') in content area — should be null
      6. Assert content container width ≈ viewport width (within padding)
    Expected Result: Content spans full width, no card background blur, no rounded corners
    Failure Indicators: Card container still present, backdrop-blur on content, rounded corners visible
    Evidence: .sisyphus/evidence/task-7-full-width.png
  ```

  **Evidence to Capture**:
  - [ ] `task-7-full-width.png` — screenshot of full-width content area

  **Commit**: YES (groups with Tasks 8, 9)
  - Message: `style(content): full-width content area, remove centered card wrapper`
  - Files: `src/App.svelte`, `src/lib/pages/*.svelte` (if modified)

- [ ] 8. Mobile responsive BottomNav (compact mode)

  **What to do**:
  - In `BottomNav.svelte`, implement responsive behavior using Tailwind breakpoints
  - **Desktop (md+, ≥768px)**: Already implemented in Task 2 — full text labels, spread horizontally, 64px height
  - **Mobile (< md, <768px)**: 
    - Compact bar height: 56px
    - Show icons + short abbreviated labels (e.g., "About", "Work", "Projects", "Contact" instead of full labels)
    - Use `flex-col` or stacked icon-above-label layout per item
    - Smaller font size (`text-xs`)
    - Icons from SVG files (same ones used in current Dock)
  - Add `padding-bottom: env(safe-area-inset-bottom)` to the bar for iOS devices with home indicator
  - Ensure touch targets are at least 44×44px (WCAG) — each nav item button should be at least 44px tall and wide
  - Test that the bar doesn't overlap content at the bottom (add bottom padding to the page content equal to bar height)
  - Active state indicator scales down for mobile (smaller border-top or dot indicator)

  **Must NOT do**:
  - Do NOT add hover effects on mobile
  - Do NOT add scroll-based show/hide behavior (bar is always visible)
  - Do NOT use a hamburger menu or drawer — bar is always visible

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Responsive design with mobile-specific constraints, touch targets, safe areas
  - **Skills**: `["frontend-ui-ux"]`
    - `frontend-ui-ux`: Mobile responsive design, touch target sizing, iOS safe area handling

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 9)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 5, 6

  **References**:
  - `src/lib/components/BottomNav.svelte` — The component from Task 2 to add responsive styles to
  - `src/App.svelte:120,128,136,144` — SVG icon imports used in current Dock (reuse for mobile icons)
  - `src/assets/icons/Winking Face With Tongue.svg` — About Me icon
  - `src/assets/icons/Necktie.svg` — Work Experience icon
  - `src/assets/icons/Open File Folder.svg` — Projects icon
  - `src/assets/icons/Open Mailbox With Raised Flag.svg` — Contact icon

  **Acceptance Criteria**:
  - [ ] Mobile viewport (< 768px): bar height is 56px, shows icons + short labels
  - [ ] Desktop viewport (≥ 768px): bar height is 64px, shows full text labels
  - [ ] Each nav button has minimum 44×44px touch target
  - [ ] `env(safe-area-inset-bottom)` padding applied for iOS
  - [ ] Active state visible on both mobile and desktop
  - [ ] Bottom bar does not overlap page content (page has bottom padding = bar height)
  - [ ] `pnpm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: Mobile viewport shows compact nav
    Tool: Playwright (browser)
    Preconditions: Dev server running, scrolled past hero
    Steps:
      1. Navigate to http://localhost:5173
      2. Set viewport to iPhone size: page.setViewportSize({ width: 375, height: 812 })
      3. Scroll past hero to see BottomNav
      4. Take screenshot
      5. Assert bar height is approximately 56px (within 50-65px)
      6. Assert icons are visible in the bar
      7. Assert labels are short (not full text like "Work Experience")
    Expected Result: Compact nav bar with icons + short labels on mobile
    Failure Indicators: Full text labels on mobile, bar too tall, icons missing
    Evidence: .sisyphus/evidence/task-8-mobile.png

  Scenario: Desktop viewport shows full labels
    Tool: Playwright (browser)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:5173
      2. Set viewport to desktop size: page.setViewportSize({ width: 1280, height: 800 })
      3. Scroll past hero
      4. Take screenshot
      5. Assert text "Work Experience" is visible (not abbreviated)
      6. Assert text "Projects" is visible
    Expected Result: Full text labels on desktop bar
    Failure Indicators: Abbreviated labels on desktop, missing labels
    Evidence: .sisyphus/evidence/task-8-desktop.png
  ```

  **Evidence to Capture**:
  - [ ] `task-8-mobile.png` — screenshot at 375×812 viewport
  - [ ] `task-8-desktop.png` — screenshot at 1280×800 viewport

  **Commit**: YES (groups with Tasks 7, 9)
  - Message: `style(nav): mobile responsive BottomNav with compact icons + short labels`
  - Files: `src/lib/components/BottomNav.svelte`

- [ ] 9. Music toggle button in BottomNav

  **What to do**:
  - In `BottomNav.svelte`, add a music toggle button on the right side of the bar
  - Accept a prop: `isMusicPlaying: boolean` (from parent)
  - Accept a callback prop: `onMusicToggle: () => void`
  - Show a play/pause icon based on `isMusicPlaying` state:
    - If playing: show pause icon (⏸) or use CSS pseudo-elements for a pause icon
    - If paused: show play icon (▶) or use CSS pseudo-elements for a play icon
  - The button should be visually distinct from nav items — use a subtle separator (vertical line) between nav items and the music button
  - Use `button` element with `aria-label="Toggle music"` for accessibility
  - Styling: match the bar's aesthetic, subtle, doesn't draw too much attention
  - In App.svelte (or via Task 5's wiring), connect the toggle to the iPod's `pauseAudio()` export:
    - When morph triggers (scrolling down), call `iPodRef.pauseAudio()`
    - The toggle button in BottomNav calls a function that resumes iPod audio
    - Track `isMusicPlaying` state in App.svelte to pass to BottomNav

  **Must NOT do**:
  - Do NOT play audio directly from BottomNav — always delegate to the iPod component
  - Do NOT make the music button larger/more prominent than nav items
  - Do NOT use emoji in production — use CSS shapes or SVG icons

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small UI addition to existing component + simple state wiring
  - **Skills**: `[]`
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Task 10
  - **Blocked By**: Task 5

  **References**:
  - `src/lib/components/BottomNav.svelte` — Component to add toggle button to
  - `src/lib/components/IPod.svelte:8-10` — `togglePlay()` function (music control reference)
  - `src/lib/components/IPod.svelte:356-383` — CSS play-pause icon styles (reuse pattern)
  - `src/App.svelte:28` — `showIPodPlayer` state (will be adapted for music toggle tracking)

  **Acceptance Criteria**:
  - [ ] Music toggle button visible on right side of BottomNav
  - [ ] Button shows play icon when music is paused, pause icon when playing
  - [ ] Clicking toggle calls `onMusicToggle` callback
  - [ ] Visual separator between nav items and music button
  - [ ] Button has `aria-label` for accessibility
  - [ ] `pnpm run check` passes

  **QA Scenarios**:

  ```
  Scenario: Music toggle button exists and toggles state
    Tool: Playwright (browser)
    Preconditions: Dev server running, scrolled past hero (BottomNav visible)
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll past hero
      3. Wait for BottomNav to be fully visible
      4. Assert: music toggle button exists in BottomNav (query for aria-label "Toggle music")
      5. Take screenshot showing button state
      6. Click the music toggle button
      7. Wait 300ms
      8. Take screenshot — button icon should change (play ↔ pause)
    Expected Result: Toggle button exists, icon changes on click
    Failure Indicators: No toggle button, button doesn't respond, icon doesn't change
    Evidence: .sisyphus/evidence/task-9-toggle-before.png, .sisyphus/evidence/task-9-toggle-after.png
  ```

  **Evidence to Capture**:
  - [ ] `task-9-toggle-before.png` — toggle button initial state
  - [ ] `task-9-toggle-after.png` — toggle button after click

  **Commit**: YES (groups with Tasks 7, 8)
  - Message: `feat(nav): add music toggle button to BottomNav`
  - Files: `src/lib/components/BottomNav.svelte`, `src/App.svelte`

- [ ] 10. Remove dead files and unused imports — final cleanup

  **What to do**:
  - Delete `src/lib/components/Dock.svelte` — no longer used
  - Delete `src/lib/components/DockIcon.svelte` — no longer used
  - Verify `SpinningText.svelte` is no longer imported anywhere — if not, delete `src/lib/components/SpinningText.svelte`
  - In `App.svelte`, remove any remaining unused imports:
    - `FUN_ICON` (line 5) — verify no usage via grep
    - `fade` from `svelte/transition` (line 20) — may still be used in page transitions, verify first
    - `blur` from `svelte/transition` (line 20) — may still be used, verify first
  - In `IPod.svelte`, verify `onHomeBtnClick` prop is still declared but no longer called — add a comment marking it as deprecated
  - Run `pnpm run check` to catch any remaining unused imports
  - Run `pnpm run build` to verify production build succeeds
  - Update any stale comments or documentation in modified files

  **Must NOT do**:
  - Do NOT delete files that are still imported elsewhere (verify via grep first)
  - Do NOT remove `SpinningText.svelte` if `WordRotate.svelte` imports from it (they are separate files)
  - Do NOT remove `fade` or `blur` if still used in page transitions

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: File deletion, import cleanup, build verification — mechanical work
  - **Skills**: `[]`
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO — sequential (depends on all previous tasks)
  - **Parallel Group**: Wave FINAL (sequential with Task 11)
  - **Blocks**: Task 11
  - **Blocked By**: Tasks 7, 8, 9

  **References**:
  - `src/lib/components/Dock.svelte` — File to delete
  - `src/lib/components/DockIcon.svelte` — File to delete
  - `src/lib/components/SpinningText.svelte` — File to potentially delete
  - `src/App.svelte` — Source of unused imports

  **Acceptance Criteria**:
  - [ ] `src/lib/components/Dock.svelte` deleted
  - [ ] `src/lib/components/DockIcon.svelte` deleted
  - [ ] `SpinningText.svelte` deleted (if no other imports exist)
  - [ ] Zero unused imports in App.svelte (verified via `pnpm run check`)
  - [ ] `pnpm run build` succeeds with zero errors
  - [ ] `pnpm run check` passes with zero errors

  **QA Scenarios**:

  ```
  Scenario: Dead files removed
    Tool: Bash
    Preconditions: Cleanup completed
    Steps:
      1. Run: ls src/lib/components/Dock.svelte 2>&1
      2. Assert: "No such file or directory" (file deleted)
      3. Run: ls src/lib/components/DockIcon.svelte 2>&1
      4. Assert: "No such file or directory" (file deleted)
    Expected Result: Dock.svelte and DockIcon.svelte no longer exist
    Failure Indicators: Files still present
    Evidence: .sisyphus/evidence/task-10-deleted.txt

  Scenario: Build succeeds after cleanup
    Tool: Bash
    Preconditions: All files cleaned up
    Steps:
      1. Run: pnpm run build
      2. Assert exit code 0
      3. Assert: output contains no errors
    Expected Result: Clean production build
    Failure Indicators: Build errors, missing imports
    Evidence: .sisyphus/evidence/task-10-build.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-10-deleted.txt` — file existence check results
  - [ ] `task-10-build.txt` — `pnpm run build` output

  **Commit**: YES
  - Message: `chore: remove dead files (Dock, DockIcon, SpinningText), clean imports`
  - Files: Deleted: `src/lib/components/Dock.svelte`, `src/lib/components/DockIcon.svelte`, possibly `src/lib/components/SpinningText.svelte`; Modified: `src/App.svelte`

- [ ] 11. Final integration QA — cross-task verification

  **What to do**:
  - Start from a clean dev server (`pnpm run dev`)
  - Verify the complete user flow end-to-end:
    1. Page loads → iPod visible in hero section (no spinning text)
    2. Scroll down → progressive morph (iPod fades, BottomNav appears)
    3. BottomNav fully visible → click each nav item, verify content switches
    4. Music plays when clicking iPod center button → scroll down → music pauses → click toggle in bar → music resumes
    5. Scroll back to top → iPod fully restored, BottomNav hidden, content reset to About Me
  - Check console for errors throughout the flow
  - Verify mobile viewport behavior (compact nav)
  - Verify build output (`pnpm run build`) has no errors
  - Check that all guardrails are met:
    - No hover magnification on nav (grep for `hover:scale`, `spring`, `useSpring` in BottomNav + App.svelte)
    - No more than 4 nav items (verify BottomNav renders exactly 4)
    - No SpinningText (verify not in App.svelte)
    - No Dock/DockIcon (verify files deleted)
    - No test files created
    - No new npm packages in package.json

  **Must NOT do**:
  - Do NOT make code changes during this task — only verify
  - If issues found, report them in the task output (do NOT fix)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: End-to-end verification, multi-step flow, guardrail compliance check
  - **Skills**: `["playwright"]`
    - `playwright`: Full browser automation for the complete user flow

  **Parallelization**:
  - **Can Run In Parallel**: NO — final sequential task
  - **Parallel Group**: Wave FINAL (after Task 10)
  - **Blocks**: None (final task)
  - **Blocked By**: Task 10

  **References**:
  - Entire plan above — verification against all requirements
  - `src/App.svelte` — Final version to verify
  - `src/lib/components/BottomNav.svelte` — Final version to verify
  - `src/lib/components/IPod.svelte` — Final version to verify

  **Acceptance Criteria**:
  - [ ] Complete user flow verified end-to-end (Playwright script)
  - [ ] Zero console errors during full flow
  - [ ] All 4 nav items present and functional
  - [ ] Music toggle works (play → pause on scroll → resume via toggle)
  - [ ] Scroll reverse restores iPod + resets to About Me
  - [ ] Mobile responsive nav verified
  - [ ] `pnpm run build` succeeds
  - [ ] All Must NOT Have guardrails verified

  **QA Scenarios**:

  ```
  Scenario: Complete end-to-end flow
    Tool: Playwright (browser)
    Preconditions: Clean dev server, fresh page load
    Steps:
      1. Navigate to http://localhost:5173
      2. Wait for page load (iPod visible)
      3. Take screenshot: task-11-1-ipod-hero.png
      4. Click iPod center button — assert audio starts playing (screen shows "PLAYING")
      5. Scroll down past hero: page.evaluate('window.scrollTo({ top: window.innerHeight * 1.5, behavior: "instant" })')
      6. Wait 500ms
      7. Take screenshot: task-11-2-bottomnav-visible.png
      8. Assert: BottomNav is visible (opacity > 0.8)
      9. Assert: iPod is faded (opacity < 0.2 or not intercepting clicks)
      10. Click "Projects" in BottomNav
      11. Wait 500ms
      12. Assert: content shows projects page (text "Follow me on GitHub" visible)
      13. Click music toggle in BottomNav
      14. Wait 300ms
      15. Assert: audio resumes (toggle icon changes)
      16. Scroll to top: page.evaluate('window.scrollTo({ top: 0, behavior: "instant" })')
      17. Wait 500ms
      18. Take screenshot: task-11-3-ipod-restored.png
      19. Assert: iPod is visible again
      20. Assert: content reset to About Me ("Who is Gabe?" or intro visible)
    Expected Result: Complete flow works without errors
    Failure Indicators: Any step fails, console errors, visual mismatch
    Evidence: .sisyphus/evidence/task-11-1-ipod-hero.png, .sisyphus/evidence/task-11-2-bottomnav-visible.png, .sisyphus/evidence/task-11-3-ipod-restored.png

  Scenario: Guardrail compliance check
    Tool: Bash (grep)
    Preconditions: All tasks complete
    Steps:
      1. Run: grep -ri "hover:scale\|useSpring\|spring(" src/lib/components/BottomNav.svelte src/App.svelte
      2. Assert: no output (no hover magnifications or spring animations)
      3. Run: grep -c "DockIcon\|Dock" src/App.svelte
      4. Assert: output is 0 (no Dock references)
      5. Run: grep -c "SpinningText" src/App.svelte
      6. Assert: output is 0 (no SpinningText references)
      7. Run: ls src/lib/components/Dock.svelte src/lib/components/DockIcon.svelte 2>&1
      8. Assert: "No such file or directory" for both
      9. Run: pnpm run build
      10. Assert: exit code 0
    Expected Result: All guardrails enforced
    Failure Indicators: Any grep match, files still exist, build fails
    Evidence: .sisyphus/evidence/task-11-guardrails.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-11-1-ipod-hero.png` — iPod at page load
  - [ ] `task-11-2-bottomnav-visible.png` — BottomNav after scroll
  - [ ] `task-11-3-ipod-restored.png` — iPod restored after scroll back
  - [ ] `task-11-guardrails.txt` — grep verification results

  **Commit**: YES
  - Message: `qa: final integration verification — all guardrails passed`
  - Files: Evidence files only, no code changes

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
>
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run dev server, check DOM). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm run check` + `pnpm run build`. Review all changed files for: `console.log` in non-debug code, commented-out code, unused imports, AI slop patterns (excessive comments, over-abstraction, generic names). Check that svelte-motion usage is correct (no missing AnimateSharedLayout wrappers, proper cleanup).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state (`pnpm run dev`). Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration: scroll morph + page switching + music toggle + reverse morph. Test edge cases: rapid scroll, mobile viewport, scroll to exact threshold, click nav items rapidly. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes. Verify page components were NOT modified beyond full-width layout.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Wave | Tasks | Commit Message | Files |
|------|-------|---------------|-------|
| 1 | 1, 2, 3 | `feat(landing): add NavItem type, create BottomNav, prep-clean App.svelte` | `src/lib/types.ts`, `src/lib/components/BottomNav.svelte`, `src/App.svelte` |
| 2 | 4, 5, 6 | `feat(landing): one-page scroll layout, iPod morph animation, repurpose center button` | `src/App.svelte`, `src/lib/components/IPod.svelte` |
| 3 | 7, 8, 9 | `style(landing): full-width content, mobile responsive nav, music toggle` | `src/App.svelte`, `src/lib/components/BottomNav.svelte`, `src/lib/pages/*.svelte` |
| 4 | 10, 11 | `chore(landing): remove dead files, final QA verification` | Deleted: `Dock.svelte`, `DockIcon.svelte`, `SpinningText.svelte`; Modified: `src/App.svelte` |

---

## Success Criteria

### Verification Commands
```bash
pnpm run build          # Expected: zero errors, dist/ output created
pnpm run check          # Expected: zero TypeScript errors
pnpm run dev            # Expected: dev server starts on localhost:5173
```

### Final Checklist
- [ ] All "Must Have" present (11 items — see Work Objectives section)
- [ ] All "Must NOT Have" absent (11 guardrails)
- [ ] `pnpm run build` succeeds
- [ ] `pnpm run check` passes
- [ ] Dock.svelte and DockIcon.svelte deleted
- [ ] SpinningText.svelte deleted (or confirmed unused)
- [ ] BottomNav has 4 text-labeled items
- [ ] Scroll-driven morph works progressively
- [ ] Music pauses on morph, toggle resumes
- [ ] Reverse scroll restores iPod, resets to About Me
- [ ] Mobile responsive nav works
- [ ] Content is full-width
- [ ] No hover effects on navigation
- [ ] No console errors during full user flow

