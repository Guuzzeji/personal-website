# Floating Pill Navigation + Text Readability + AI Chat

## TL;DR

> **Quick Summary**: Redesign the bottom nav into a floating black pill with white text, fix text readability (white/centered) across all 4 pages, add an AI chat page toggled by an orange button, and remove the music toggle from the nav.
> 
> **Deliverables**:
> - Redesigned `BottomNav.svelte` — floating pill, neon yellow Menu toggle, page links, orange AI chat button
> - New `AIChat.svelte` — mock chat interface with pre-written messages
> - Updated `App.svelte` — AI chat toggle state, music toggle cleanup, bottom padding adjustment
> - Whitened + centered text on `AboutMe.svelte`, `WorkExperience.svelte`, `Projects.svelte`, `Contact.svelte`
> - Fixed invalid Tailwind classes (`font-weight-500` → `font-medium`, `font-weight-800` → `font-extrabold`)
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 2 waves
> **Critical Path**: Task 1 → Task 2 → Task 5 → Task 7

---

## Context

### Original Request
Redesign the menu bar into a floating bottom pill navigation (black, full border-radius, white text, backdrop blur + drop shadow). Left group: Menu toggle with neon yellow dot + hamburger, page links. Right group: orange button toggling an AI chat page. Make all page text white and center-aligned for readability.

### Interview Summary
**Key Discussions**:
- **Menu toggle**: Shows/hides nav link labels on mobile; on desktop (≥md), links always visible
- **AI chat**: Replaces content area (conditional render in App.svelte); orange button toggles open/close; mock data only
- **Music toggle**: Removed from nav entirely; auto-pause on scroll already exists in App.svelte
- **Page links**: Adapted to 4 existing pages (About Me, Work Experience, Projects, Contact)
- **Test strategy**: No automated tests; Agent-Executed QA via Playwright only

**Research Findings**:
- Svelte 5 runes (`$state`, `$effect`, `$props`) + Tailwind CSS v4 (no config file, CSS-first)
- Non-standard Tailwind classes used: `font-weight-500`, `font-weight-800` (invalid, silently failing)
- Current nav icons are imported SVGs; default text color is dark/black on `bg-black/80`
- Scroll morph animation (iPod→content) must be preserved; `navOpacity` Motion wrapper remains

### Metis Review
**Identified Gaps** (addressed):
- **AI chat model**: Resolved — replaces content area via conditional render, not overlay
- **Orange button placement**: Resolved — inside the floating pill (right group), owned by BottomNav
- **Music toggle cleanup**: Resolved — remove nav UI only; keep `isMusicPlaying`/`handlePlayStateChange` for iPod; remove `handleMusicToggle` from App.svelte
- **Menu toggle on desktop**: Resolved — `md:hidden`, mobile-only
- **Chat + scroll morph**: When chat is open and user scrolls up past morph-back threshold, close chat and morph iPod back
- **Bottom padding**: Adjust content section `pb-24` → dynamic padding to account for floating pill height + offset + safe area
- **SVG icon colors**: Imported SVGs use `currentColor` — `text-white` class propagates correctly; verify each icon renders white
- **Link visibility**: Links on dark bg get `text-orange-400` for contrast; underline preserved
- **Text centering**: Prose paragraphs left-aligned within centered `max-w-prose` container; headings center-aligned

---

## Work Objectives

### Core Objective
Transform the bottom navigation into a modern floating pill design, improve all page text for readability, and add a mock AI chat page as a toggleable content section.

### Concrete Deliverables
- `src/lib/components/BottomNav.svelte` — rewritten with floating pill design
- `src/lib/pages/AIChat.svelte` — new mock chat page
- `src/App.svelte` — AI chat toggle state, music prop cleanup, bottom padding
- `src/lib/pages/AboutMe.svelte` — white text + centered layout
- `src/lib/pages/WorkExperience.svelte` — white text + centered layout
- `src/lib/pages/Projects.svelte` — white text + centered layout
- `src/lib/pages/Contact.svelte` — white text + centered layout

### Definition of Done
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run check` passes (Svelte type checking + tsc)
- [ ] All 4 pages display white readable text on dark background
- [ ] Floating pill nav renders at bottom-center on all viewport sizes
- [ ] Menu toggle shows/hides nav labels on mobile (<768px)
- [ ] Orange button toggles AI chat page (open/close)
- [ ] AI chat closes when navigating to another page
- [ ] Scroll morph animation still works (iPod → content → nav fade-in)

### Must Have
- Floating pill: black, `rounded-full`, white text, `backdrop-blur-xl`, `shadow-lg`
- Neon yellow dot accent on Menu toggle: small circle with glow effect
- Menu toggle: hamburger icon animates to X when expanded
- Active nav item: `text-orange-500` + subtle indicator
- AI chat: 5 mock message bubbles, toggleable via orange button
- All page text: `text-white`, centered container
- Content bottom clearance: no text hidden behind floating pill

### Must NOT Have (Guardrails)
- **DO NOT** alter `NavItem` type or `navItems` array structure in `types.ts`
- **DO NOT** remove or alter `Motion` wrapping around BottomNav in `App.svelte`
- **DO NOT** touch `IPod.svelte`, `WordRotate.svelte`, or any non-spec component
- **DO NOT** change the content section wrapper (`bg-black/80`) except bottom padding
- **DO NOT** alter `scrollProgress`, `useViewportScroll`, or any motion values
- **DO NOT** create a `tailwind.config.*` file (Tailwind v4 is CSS-first)
- **DO NOT** add URL routing, backend, real AI integration, login, or search
- **DO NOT** add an input field or send button to the AI chat (static mock only)
- **DO NOT** remove `handlePlayStateChange` or `isMusicPlaying` (needed by iPod interface)
- **DO NOT** make any non-essential changes to `IPod.svelte` (only the minimal `onPlayStateChange` prop addition is permitted to keep `App.svelte` compatible)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: N/A
- **QA**: Agent-Executed only — Playwright for browser UI verification

### QA Policy
Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **TUI/CLI**: Use interactive_bash (tmux) — Run commands, validate output
- **API/Backend**: Use Bash (curl) — Only if needed (not expected for this frontend-only work)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — text fixes + AI chat page):
├── Task 1: Fix text readability on AboutMe.svelte [quick]
├── Task 2: Fix text readability on WorkExperience.svelte [quick]
├── Task 3: Fix text readability on Projects.svelte [quick]
├── Task 4: Fix text readability on Contact.svelte [quick]
└── Task 5: Create AIChat.svelte mock page [quick]

Wave 2 (After Wave 1 — nav redesign + App integration):
├── Task 6: Redesign BottomNav.svelte — floating pill [visual-engineering]
└── Task 7: Update App.svelte — AI chat toggle + music cleanup + padding [quick]

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
→ Present results → Get explicit user okay

Critical Path: Task 5 (AI Chat) → Task 7 (App.svelte integration)
Parallel Speedup: ~50% faster than sequential (Wave 1 tasks all parallel)
Max Concurrent: 5 (Wave 1)
```

### Dependency Matrix

- **1**: - - 7
- **2**: - - 7
- **3**: - - 7
- **4**: - - 7
- **5**: - - 7
- **6**: - - 7
- **7**: 1,2,3,4,5,6 - FINAL

### Agent Dispatch Summary

- **Wave 1**: 5 — T1-T5 all `quick`
- **Wave 2**: 2 — T6 `visual-engineering`, T7 `quick`
- **FINAL**: 4 — F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high`, F4 `deep`

---

## TODOs

- [x] 1. Fix text readability on AboutMe.svelte

  **What to do**:
  - Replace `font-weight-500` → `font-medium`, `font-weight-800` → `font-extrabold`
  - Add `text-white` to all text elements (title, subtitle, body paragraphs)
  - Add `text-orange-400` to the "Click to learn" prompt for visibility
  - Center the content container using `text-center` on the wrapper, keep prose `text-left` on paragraphs for readability
  - Verify both initial WordRotate state AND expanded content state show readable text
  - Ensure the hero "Who is Gabe?" WordRotate text is centered and visible
  - Remove the commented-out `// console.log(showAboutMeInfo)` line

  **Must NOT do**:
  - Do NOT change the two-state (WordRotate → bio) interaction pattern
  - Do NOT alter `fade` transitions or animation timing
  - Do NOT change the WordRotate component or its props

  **Recommended Agent Profile**:
  > Quick text styling fix — no visual engineering needed.
  - **Category**: `quick`
    - Reason: Single-file, straightforward text styling changes with clear Tailwind class replacements
  - **Skills**: []
  - **Skills Evaluated but Omitted**: None needed — pure CSS class changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: Task 7 (App.svelte integration coordinates with all pages)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/lib/pages/AboutMe.svelte` — Target file: current text classes, two-state structure, WordRotate usage
  - `src/lib/utils.ts:cn()` — Utility for conditional classes if needed
  - `src/app.css:1-6` — Global styles to understand current defaults and font

  **Acceptance Criteria**:
  - [ ] `npm run check` passes with 0 errors
  - [ ] All text in both states (initial + expanded) uses `text-white`
  - [ ] No remaining `font-weight-500` or `font-weight-800` classes in file
  - [ ] Commented-out `console.log` removed

  **QA Scenarios**:

  ```
  Scenario: Initial WordRotate state shows white centered text
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:5173; viewport 1280×800
    Steps:
      1. Navigate to http://localhost:5173
      2. Wait for page load (timeout: 5s)
      3. Assert the WordRotate text container is visible with class containing "text-center"
      4. Verify text color is white (check computed CSS color on the element)
      5. Take screenshot: .sisyphus/evidence/task-1-wordrotate.png
    Expected Result: "Who is Gabe?" rotating text is centered and white, readable on dark background
    Failure Indicators: Text is black/gray (not white), text is off-center, no text visible
    Evidence: .sisyphus/evidence/task-1-wordrotate.png

  Scenario: Expanded bio content shows white readable text
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 1280×800
    Steps:
      1. Navigate to http://localhost:5173
      2. Click the "Click to learn" prompt area
      3. Wait for fade transition to complete (timeout: 2s)
      4. Assert text "Hello, I'm Gabe" is visible with white color
      5. Assert the three bio paragraphs are visible with white color
      6. Verify paragraphs are left-aligned within centered container
      7. Take screenshot: .sisyphus/evidence/task-1-bio.png
    Expected Result: Bio text white, readable, centered container with left-aligned prose
    Evidence: .sisyphus/evidence/task-1-bio.png

  Scenario: Build check passes after changes
    Tool: Bash
    Preconditions: Changes saved to AboutMe.svelte
    Steps:
      1. Run: npm run check
      2. Assert exit code 0
      3. Assert no "font-weight-500" or "font-weight-800" errors in output
    Expected Result: Type checking + Svelte check pass with 0 errors
    Evidence: .sisyphus/evidence/task-1-check.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-1-wordrotate.png` — screenshot of initial state
  - [ ] `.sisyphus/evidence/task-1-bio.png` — screenshot of expanded content
  - [ ] `.sisyphus/evidence/task-1-check.txt` — output of `npm run check`

  **Commit**: YES (groups with all tasks in single commit)
  - Message: `feat(nav): floating pill nav + AI chat + text readability`
  - Files: `src/lib/pages/AboutMe.svelte`

- [x] 2. Fix text readability on WorkExperience.svelte

  **What to do**:
  - Replace `font-weight-500` → `font-medium`, `font-weight-800` → `font-extrabold`
  - Add `text-white` to all text elements (heading, company names, roles, descriptions)
  - Add `text-center` to the outer wrapper, keep descriptions `text-left` for readability
  - Add `text-orange-400` to the heading "Work Experience" for visual hierarchy
  - Verify the `<hr>` separators are visible against the dark background (add `border-white/20` if not)
  - Fix typo: "Augest" → "August" in all 4 date strings

  **Must NOT do**:
  - Do NOT change the content or structure of work entries
  - Do NOT alter the `max-w-prose` container width

  **Recommended Agent Profile**:
  > Quick text styling fix.
  - **Category**: `quick`
    - Reason: Single-file text styling with clear Tailwind class replacements
  - **Skills**: []
  - **Skills Evaluated but Omitted**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5)
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:
  - `src/lib/pages/WorkExperience.svelte` — Target file with 4 work entries, `<hr>` separators
  - `src/lib/types.ts:navItems` — Understand active nav style for consistency

  **Acceptance Criteria**:
  - [ ] `npm run check` passes with 0 errors
  - [ ] All text uses `text-white` (heading uses `text-orange-400`)
  - [ ] No `font-weight-500` or `font-weight-800` in file
  - [ ] All "Augest" typos fixed to "August"
  - [ ] `<hr>` separators visible on dark background

  **QA Scenarios**:

  ```
  Scenario: Work Experience page shows white readable text
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 1280×800
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll down past the iPod hero (or use Browser evaluate to scroll)
      3. Click the "Work Experience" nav item
      4. Wait for content to render (timeout: 2s)
      5. Assert "Work Experience" heading is visible with orange color
      6. Assert all 4 work entries have white text
      7. Assert "August" not "Augest" appears in dates
      8. Verify the 3 `<hr>` separators are visible
      9. Take screenshot: .sisyphus/evidence/task-2-work.png
    Expected Result: All text white and readable; heading orange; dates correct; dividers visible
    Evidence: .sisyphus/evidence/task-2-work.png

  Scenario: Build check passes
    Tool: Bash
    Preconditions: Changes saved
    Steps:
      1. Run: npm run check
    Expected Result: 0 errors
    Evidence: .sisyphus/evidence/task-2-check.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-2-work.png` — screenshot of full page
  - [ ] `.sisyphus/evidence/task-2-check.txt` — check output

  **Commit**: YES (groups with all tasks)
  - Files: `src/lib/pages/WorkExperience.svelte`

- [x] 3. Fix text readability on Projects.svelte

  **What to do**:
  - Replace `font-weight-500` → `font-medium`, `font-weight-800` → `font-extrabold`
  - Add `text-white` to all text elements (heading, GitHub link, project names, descriptions)
  - Add `text-center` to the outer wrapper
  - Add `text-orange-400` to the heading "Projects" for hierarchy
  - Add `text-orange-400` to project name links for visibility (keep underline)
  - Ensure loading state text ("Loading content...") and error state text are also white
  - Make `<hr>` separators between projects visible (`border-white/20`)

  **Must NOT do**:
  - Do NOT change the axios fetch logic or GitHub API endpoint
  - Do NOT alter the project data structure or rendering loop

  **Recommended Agent Profile**:
  > Quick text styling fix.
  - **Category**: `quick`
    - Reason: Single-file text styling with clear Tailwind class replacements
  - **Skills**: []
  - **Skills Evaluated but Omitted**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5)
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:
  - `src/lib/pages/Projects.svelte` — Target file with axios fetch, loading/error/success states
  - `src/lib/types.ts:Project` — Type for project data

  **Acceptance Criteria**:
  - [ ] `npm run check` passes with 0 errors
  - [ ] All text white (headings orange, links orange-400)
  - [ ] No `font-weight-500` or `font-weight-800`
  - [ ] Loading + error state text also white
  - [ ] `<hr>` separators visible

  **QA Scenarios**:

  ```
  Scenario: Projects page shows white readable text with orange links
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 1280×800
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll down past the iPod hero
      3. Click the "Projects" nav item
      4. Wait for GitHub data to load (timeout: 10s, or assert "Loading content..." appears first)
      5. Assert "Projects" heading is visible with orange color
      6. Assert project names are visible as orange links
      7. Assert project descriptions are white
      8. Take screenshot: .sisyphus/evidence/task-3-projects.png
    Expected Result: Projects list with white descriptions, orange links, visible dividers
    Evidence: .sisyphus/evidence/task-3-projects.png

  Scenario: Loading state text is visible
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; clear browser cache; network throttled or offline
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll down and click "Projects"
      3. Immediately check for "Loading content..." text
      4. Assert it is white/visible on dark background
      5. Take screenshot: .sisyphus/evidence/task-3-loading.png
    Expected Result: Loading text visible in white
    Evidence: .sisyphus/evidence/task-3-loading.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-3-projects.png` — loaded projects
  - [ ] `.sisyphus/evidence/task-3-loading.png` — loading state
  - [ ] `.sisyphus/evidence/task-3-check.txt` — check output

  **Commit**: YES (groups with all tasks)
  - Files: `src/lib/pages/Projects.svelte`

- [x] 4. Fix text readability on Contact.svelte

  **What to do**:
  - Replace `font-weight-500` → `font-medium`, `font-weight-800` → `font-extrabold`
  - Add `text-white` to all text elements
  - Add `text-orange-400` to the heading "Contacts & Socials" for hierarchy
  - Add `text-orange-400` to social links while keeping underline for distinction
  - Page already uses `text-center` — keep it
  - Ensure links are keyboard-focusable with visible focus ring (`focus:ring-2 focus:ring-orange-500`)

  **Must NOT do**:
  - Do NOT change any link URLs
  - Do NOT remove or add social links

  **Recommended Agent Profile**:
  > Quick text styling fix.
  - **Category**: `quick`
    - Reason: Single-file text styling, straightforward class replacements
  - **Skills**: []
  - **Skills Evaluated but Omitted**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5)
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:
  - `src/lib/pages/Contact.svelte` — Target file with social links
  - `src/lib/types.ts:navItems` — Understand active nav style

  **Acceptance Criteria**:
  - [ ] `npm run check` passes with 0 errors
  - [ ] All text white, heading orange, links orange-400
  - [ ] No `font-weight-500` or `font-weight-800`
  - [ ] Links have visible focus rings

  **QA Scenarios**:

  ```
  Scenario: Contact page shows white text with orange links
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 1280×800
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll down and click "Contact" nav item
      3. Assert "Contacts & Socials" heading is visible in orange
      4. Assert all 6 social links are visible in orange-400
      5. Verify each link has underline decoration
      6. Tab through links to verify focus rings appear
      7. Take screenshot: .sisyphus/evidence/task-4-contact.png
    Expected Result: All links visible, orange, underlined, focusable
    Evidence: .sisyphus/evidence/task-4-contact.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-4-contact.png` — screenshot
  - [ ] `.sisyphus/evidence/task-4-check.txt` — check output

  **Commit**: YES (groups with all tasks)
  - Files: `src/lib/pages/Contact.svelte`

- [x] 5. Create AIChat.svelte mock page

  **What to do**:
  - Create `src/lib/pages/AIChat.svelte` — a static mock chat interface
  - Layout: centered container (`max-w-prose mx-auto py-8`), white text
  - Heading: "AI Chat" in `text-orange-400 text-3xl font-extrabold text-center`
  - Render 5 alternating message bubbles (user right-aligned, AI left-aligned)
  - User bubbles: `bg-orange-500/20 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[75%] ml-auto`
  - AI bubbles: `bg-white/10 text-white rounded-2xl rounded-bl-sm px-4 py-2 max-w-[75%] mr-auto`
  - Mock conversation content:
    1. User: "Hey! What can you help me with?"
    2. AI: "I can answer questions about Gabe's experience, projects, and skills. What would you like to know?"
    3. User: "Tell me about his work at Microsoft."
    4. AI: "Gabe completed 4 internships at Microsoft on the Xbox Live (PlayFab) team, working on leaderboard systems, AI agent integrations, and customer engagement features."
    5. AI: "He specialized in building scalable backend services using C#, Azure, and Kubernetes. Want more details on any specific internship?"
  - Add a subtle disclaimer at bottom: "Mock AI chat — for demonstration only" in `text-white/50 text-xs text-center`
  - No input field, no send button, no dynamic behavior (static mock only)

  **Must NOT do**:
  - Do NOT add an input field or send button
  - Do NOT add any API calls, fetch logic, or dynamic message rendering
  - Do NOT add typing indicators, timestamps, or animations
  - Do NOT import or use any AI library

  **Recommended Agent Profile**:
  > Simple new component with pre-written content and basic Tailwind layout.
  - **Category**: `quick`
    - Reason: New file but straightforward — static markup, no logic, no interactivity, just Tailwind classes
  - **Skills**: []
  - **Skills Evaluated but Omitted**: None needed — pure static HTML-like layout

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4)
  - **Blocks**: Task 7 (App.svelte needs this component to import)
  - **Blocked By**: None

  **References**:
  - `src/lib/pages/AboutMe.svelte` — Pattern reference for page structure: `max-w-prose mx-auto py-8`, container layout
  - `src/lib/pages/Contact.svelte` — Pattern reference for centered content with text-center
  - `src/App.svelte:128-136` — How pages are imported and conditionally rendered

  **Acceptance Criteria**:
  - [ ] `npm run check` passes with 0 errors (no TS errors in new file)
  - [ ] Component renders 5 message bubbles when imported
  - [ ] User messages right-aligned with orange tint, AI messages left-aligned with white tint
  - [ ] No input field, no send button present in DOM

  **QA Scenarios**:

  ```
  Scenario: AI Chat page renders mock messages correctly
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; AIChat.svelte temporarily wired as visible (or import directly in App.svelte and set currentPage to test)
    Steps:
      1. Navigate to http://localhost:5173
      2. Click the orange AI chat button in the nav (after Task 7 is done)
      3. Wait for content to render (timeout: 2s)
      4. Assert "AI Chat" heading is visible in orange
      5. Assert 5 message bubbles are visible
      6. Verify user messages are right-aligned (check for ml-auto class on user bubbles)
      7. Verify AI messages are left-aligned (check for mr-auto class on AI bubbles)
      8. Assert no input field exists (absence of <input> or <textarea>)
      9. Assert disclaimer "Mock AI chat — for demonstration only" is visible
      10. Take screenshot: .sisyphus/evidence/task-5-chat.png
    Expected Result: 5 styled message bubbles, no input, disclaimer visible
    Evidence: .sisyphus/evidence/task-5-chat.png

  Scenario: Build check passes
    Tool: Bash
    Preconditions: File created
    Steps:
      1. Run: npm run check
    Expected Result: 0 errors
    Evidence: .sisyphus/evidence/task-5-check.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-5-chat.png` — screenshot
  - [ ] `.sisyphus/evidence/task-5-check.txt` — check output

  **Commit**: YES (groups with all tasks)
  - Files: `src/lib/pages/AIChat.svelte`

- [x] 6. Redesign BottomNav.svelte — floating pill navigation

  **What to do**:
  - Complete rewrite of `BottomNav.svelte` with the floating pill design
  - **Outer container**: `fixed bottom-4 left-1/2 -translate-x-1/2 z-50` — centers the pill
  - **Pill body**: `flex items-center gap-3 px-4 h-12 bg-black/90 backdrop-blur-xl rounded-full shadow-lg shadow-black/50 border border-white/10 text-white text-sm`
  - **Left group** (flex row, gap-2):
    - **Menu toggle** (mobile-only: `md:hidden`):
      - Neon yellow dot: `w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_6px_#fde047]` (glow effect)
      - "Menu" text in `text-xs text-white/70`
      - 2-line hamburger icon: inline SVG, transitions to X icon when `menuExpanded` is true
      - On click: toggle `menuExpanded` state → shows/hides nav link labels on mobile
    - **Nav link buttons** (one per navItem):
      - Desktop: always visible with icon + label
      - Mobile: label hidden by default; shown when `menuExpanded` is true
      - Icon (imported SVG) + text label, flex row, gap-1
      - Active state: `text-orange-500` + subtle bottom indicator (2px orange dot or underline)
      - Inactive state: `text-white/60 hover:text-white transition-colors`
  - **Right group** (ml-auto, flex, gap-2):
    - **Orange AI Chat button**: `flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-full text-black text-xs font-medium transition-colors`
    - Sparkle/chat icon (inline SVG) + "AI" label
    - On click: emit `onAIChatToggle` event to App.svelte
  - **Accessibility**: `aria-label` on all buttons, `aria-current="page"` on active nav item, `role="navigation"`
  - **Mobile labels show/hide**: Use `$state` for `menuExpanded`, conditionally show `md:inline` on labels, `inline` when expanded
  - **Auto-collapse on navigate**: When a nav link is clicked, set `menuExpanded = false`
  - **Viewport resize**: `$effect` that sets `menuExpanded = true` when viewport ≥ 768px
  - Remove all music toggle related code (props `showMusicToggle`, `isMusicPlaying`, `onMusicToggle` and their DOM)

  **Must NOT do**:
  - Do NOT change the icon map or import structure for SVG icons
  - Do NOT alter the `navItems` array or `NavItem` type in `types.ts`
  - Do NOT remove `aria-label="Primary"` from the nav element
  - Do NOT change the component's export/import interface beyond removing music props

  **Recommended Agent Profile**:
  > Visual design component with animations and responsive behavior.
  - **Category**: `visual-engineering`
    - Reason: Complex visual component with custom pill design, animations (hamburger→X), glow effects, responsive show/hide behavior, and accessibility
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Needed for the floating pill aesthetic, glow effects, transition animations, and overall visual polish
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed during implementation — QA runs separately in final wave

  **Parallelization**:
  - **Can Run In Parallel**: NO (runs in Wave 2, but independent of Task 5 — can technically run parallel with it in wave)
  - **Parallel Group**: Wave 2 (with Task 7) — but Task 7 depends on BottomNav's new interface, so run sequentially after Task 6 is complete OR run in parallel with clear interface contract
  - **Blocks**: Task 7
  - **Blocked By**: None (can start immediately, but grouped in Wave 2 for interface coordination with Task 7)

  **References**:
  - `src/lib/components/BottomNav.svelte` — Current implementation to understand icon imports, navItems usage, prop interface
  - `src/lib/types.ts:12-44` — `NavItem` type and `navItems` array with their ids/labels/shortLabels
  - `src/assets/icons/` — SVG icons (Winking Face, Necktie, Open File Folder, Open Mailbox) — use `currentColor`
  - `src/App.svelte:140-149` — How BottomNav is currently rendered (Motion wrapper, props passed)
  - `src/App.svelte:30-33` — `handlePageChange` function signature for `onNavigate`

  **Acceptance Criteria**:
  - [ ] `npm run check` passes with 0 errors
  - [ ] Pill renders centered at bottom of viewport
  - [ ] All 4 nav items visible with icons on desktop (≥768px)
  - [ ] On mobile (<768px), hamburger toggle shows/hides labels
  - [ ] Hamburger animates to X when expanded
  - [ ] Active nav item has `text-orange-500`
  - [ ] Orange "AI" button visible in right group
  - [ ] No music toggle code remains in component
  - [ ] `aria-current="page"` set correctly on active item

  **QA Scenarios**:

  ```
  Scenario: Desktop — floating pill renders with all links visible
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 1280×800
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll down past 60% to reveal the nav
      3. Wait for nav opacity transition (timeout: 3s)
      4. Assert floating pill is visible at bottom center
      5. Assert all 4 nav items have visible text labels
      6. Assert Menu toggle button is NOT visible (md:hidden)
      7. Assert orange "AI" button is visible on the right
      8. Assert "About Me" is the active item (text-orange-500)
      9. Take screenshot: .sisyphus/evidence/task-6-desktop.png
    Expected Result: Pill nav visible, all labels shown, no hamburger, AI button present, correct active state
    Evidence: .sisyphus/evidence/task-6-desktop.png

  Scenario: Mobile — hamburger toggle shows/hides labels
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 375×812 (iPhone)
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll down to reveal nav
      3. Assert nav pill is visible
      4. Assert nav item labels are HIDDEN (only icons visible)
      5. Assert Menu toggle with neon yellow dot is visible
      6. Assert hamburger icon is a 2-line icon (not X)
      7. Click the Menu toggle
      8. Assert hamburger icon animates to X
      9. Assert nav item labels are now VISIBLE
      10. Click "Work Experience" nav item
      11. Assert labels collapse (hide again)
      12. Assert hamburger returns to 2-line icon
      13. Assert "Work Experience" is now the active item
      14. Take screenshots: .sisyphus/evidence/task-6-mobile-closed.png, task-6-mobile-open.png
    Expected Result: Smooth show/hide behavior, hamburger animation, auto-collapse on navigation
    Evidence: .sisyphus/evidence/task-6-mobile-closed.png, task-6-mobile-open.png, task-6-mobile-after-nav.png

  Scenario: Neon yellow dot has glow effect
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 375×812
    Steps:
      1. Navigate and scroll to reveal nav
      2. Locate the Menu toggle button
      3. Assert the neon yellow dot element exists (w-2 h-2 rounded-full)
      4. Verify it has a box-shadow or drop-shadow glow effect
      5. Take close-up screenshot: .sisyphus/evidence/task-6-neon-dot.png
    Expected Result: Yellow dot with visible glow/shadow
    Evidence: .sisyphus/evidence/task-6-neon-dot.png

  Scenario: Accessibility — keyboard navigation works
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 1280×800
    Steps:
      1. Navigate and scroll to reveal nav
      2. Press Tab to focus first nav item
      3. Assert focus ring is visible
      4. Press Tab again to move to next item
      5. Assert aria-current="page" updates correctly when Enter is pressed
      6. Tab to AI button and press Enter
      7. Verify AI chat opens
      8. Take screenshot: .sisyphus/evidence/task-6-keyboard.png
    Expected Result: All buttons focusable, focus rings visible, aria-current correct
    Evidence: .sisyphus/evidence/task-6-keyboard.png

  Scenario: Build check passes
    Tool: Bash
    Preconditions: Component rewritten
    Steps:
      1. Run: npm run check
    Expected Result: 0 errors
    Evidence: .sisyphus/evidence/task-6-check.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-6-desktop.png` — desktop pill nav
  - [ ] `.sisyphus/evidence/task-6-mobile-closed.png` — mobile collapsed
  - [ ] `.sisyphus/evidence/task-6-mobile-open.png` — mobile expanded
  - [ ] `.sisyphus/evidence/task-6-mobile-after-nav.png` — after navigation
  - [ ] `.sisyphus/evidence/task-6-neon-dot.png` — neon dot close-up
  - [ ] `.sisyphus/evidence/task-6-keyboard.png` — keyboard focus
  - [ ] `.sisyphus/evidence/task-6-check.txt` — check output

  **Commit**: YES (groups with all tasks)
  - Files: `src/lib/components/BottomNav.svelte`

- [x] 7. Update App.svelte — AI chat toggle, music cleanup, bottom padding

  **What to do**:
  - Import `AIChat` component: `import AIChat from "./lib/pages/AIChat.svelte";`
  - Add `aiChatOpen` state: `let aiChatOpen = $state(false);`
  - Add `handleAIChatToggle` function: toggles `aiChatOpen`, and when opening, also sets `currentPage` to a sentinel or handles the conditional logic
  - Update content section conditional rendering:
    ```svelte
    {#if aiChatOpen}
      <AIChat />
    {:else if currentPage === "about-me"}
      <AboutMe />
    {:else if currentPage === "work-experience"}
      <WorkExperience />
    {:else if currentPage === "projects"}
      <Projects />
    {:else if currentPage === "contacts"}
      <Contact />
    {/if}
    ```
  - When a nav link is clicked while AI chat is open: close chat and navigate
  - **Remove music toggle props** from BottomNav:
    - Remove `showMusicToggle={true}`, `isMusicPlaying={isMusicPlaying}`, `onMusicToggle={handleMusicToggle}`
    - Keep `handlePageChange` and add `onAIChatToggle={handleAIChatToggle}`
    - Remove `handleMusicToggle` function from App.svelte (but keep `handlePlayStateChange` and `isMusicPlaying` for iPod)
  - **AI Chat + scroll morph**: In the `$effect` that watches `scrollProgressVal`, add guard: when `aiChatOpen` is true and scrollProgress < 0.4, close chat and morph back
  - **Bottom padding**: Update content section `pb-24` → `pb-24` is actually fine with `bottom-4` floating pill; verify no content is hidden. Add `safe-area-inset-bottom` awareness: `pb-[calc(6rem+env(safe-area-inset-bottom))]` if needed
  - Pass `onAIChatToggle` to BottomNav component

  **Must NOT do**:
  - Do NOT remove `isMusicPlaying`, `handlePlayStateChange`, or the iPod ref/binding
  - Do NOT alter `useViewportScroll`, `scrollProgress`, `scrollY`, or any motion values
  - Do NOT change the `Motion` wrapper around BottomNav
  - Do NOT change the hero section or iPod component

  **Recommended Agent Profile**:
  > State management and integration coordination.
  - **Category**: `quick`
    - Reason: Focused state additions and prop cleanup in a single file with clear interface contracts from other tasks
  - **Skills**: []
  - **Skills Evaluated but Omitted**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 1-6 all being complete)
  - **Parallel Group**: Wave 2 (sequential after Task 6)
  - **Blocks**: FINAL verification wave
  - **Blocked By**: Tasks 1, 2, 3, 4, 5, 6

  **References**:
  - `src/App.svelte` — Target file: current page routing, props passed to BottomNav, scroll morph effect
  - `src/lib/components/BottomNav.svelte` (after Task 6) — New prop interface with `onAIChatToggle`
  - `src/lib/pages/AIChat.svelte` (after Task 5) — Component to import

  **Acceptance Criteria**:
  - [ ] `npm run check` passes with 0 errors
  - [ ] `npm run build` completes without errors
  - [ ] AI chat opens when orange button is clicked
  - [ ] AI chat closes when orange button is clicked again
  - [ ] Navigating to a different page closes AI chat
  - [ ] Music toggle code removed from App.svelte's BottomNav usage
  - [ ] Scroll morph still works (iPod → content → nav fade-in)
  - [ ] Content not hidden behind floating pill

  **QA Scenarios**:

  ```
  Scenario: AI chat toggles open and closed via orange button
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 1280×800
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll down to reveal nav
      3. Click the orange "AI" button in the nav
      4. Assert AI Chat page content appears (heading "AI Chat" visible)
      5. Assert previous page content is NOT visible
      6. Click the orange "AI" button again
      7. Assert AI Chat content disappears
      8. Assert previous page content (About Me) is visible again
      9. Take screenshots: .sisyphus/evidence/task-7-chat-open.png, task-7-chat-closed.png
    Expected Result: Smooth open/close toggle behavior
    Evidence: .sisyphus/evidence/task-7-chat-open.png, task-7-chat-closed.png

  Scenario: Navigating closes AI chat
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 1280×800
    Steps:
      1. Open AI chat via orange button
      2. Click "Work Experience" nav link
      3. Assert AI chat closes
      4. Assert Work Experience page content is now visible
      5. Take screenshot: .sisyphus/evidence/task-7-nav-closes-chat.png
    Expected Result: Chat dismissed, navigation works normally
    Evidence: .sisyphus/evidence/task-7-nav-closes-chat.png

  Scenario: Build completes successfully
    Tool: Bash
    Preconditions: All changes applied
    Steps:
      1. Run: npm run build
      2. Assert exit code 0
      3. Assert dist/ directory contains output files
    Expected Result: Production build succeeds
    Evidence: .sisyphus/evidence/task-7-build.txt

  Scenario: No content hidden behind floating pill
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running; viewport 1280×800
    Steps:
      1. Navigate to http://localhost:5173
      2. Scroll all the way to bottom of Work Experience page
      3. Assert the last work entry text is fully visible above the floating pill
      4. Verify no text is clipped or overlapped by the nav
      5. Take screenshot: .sisyphus/evidence/task-7-bottom-clearance.png
    Expected Result: All content visible, pill floats above content
    Evidence: .sisyphus/evidence/task-7-bottom-clearance.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-7-chat-open.png`
  - [ ] `.sisyphus/evidence/task-7-chat-closed.png`
  - [ ] `.sisyphus/evidence/task-7-nav-closes-chat.png`
  - [ ] `.sisyphus/evidence/task-7-bottom-clearance.png`
  - [ ] `.sisyphus/evidence/task-7-build.txt`

  **Commit**: YES (groups with all tasks)
  - Files: `src/App.svelte`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
>
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run dev server, check DOM). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run check` + `npm run build`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp). Verify no `font-weight-500` or `font-weight-800` remain in any page file.
  Output: `Build [PASS/FAIL] | Check [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
  Start from clean state (`npm run dev`). Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration: AI chat + navigation, scroll morph + chat close, mobile responsive behavior. Test edge cases: empty state, rapid AI chat toggle, resize during menu expansion. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance per task. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes (e.g., any file modified outside the 7 files listed).
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Wave 1+2**: Single commit with all changes
  - Message: `feat(nav): floating pill nav + AI chat + text readability`
  - Files: `src/lib/components/BottomNav.svelte`, `src/lib/pages/AIChat.svelte`, `src/App.svelte`, `src/lib/pages/AboutMe.svelte`, `src/lib/pages/WorkExperience.svelte`, `src/lib/pages/Projects.svelte`, `src/lib/pages/Contact.svelte`
  - Pre-commit: `npm run check`

---

## Success Criteria

### Verification Commands
```bash
npm run dev    # Expected: dev server starts on localhost:5173, no errors
npm run build  # Expected: successful build output in dist/
npm run check  # Expected: svelte-check + tsc pass with 0 errors
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] `npm run check` passes
- [ ] `npm run build` passes
