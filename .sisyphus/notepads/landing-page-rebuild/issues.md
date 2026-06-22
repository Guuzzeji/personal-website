# Issues: landing-page-rebuild

## Open Issues
None yet.

## Resolved Issues
- Scroll mechanism: current page has `h-screen overflow-hidden` — resolved by creating one long scrollable page
- Morph approach: extreme aspect ratio change — resolved by using position layoutId + opacity crossfade
- Audio behavior: pause on morph, stay paused on reverse — resolved

## Gotchas
- svelte-motion v0.12.2 uses older framer-motion 4.x API (`AnimateSharedLayout` not `LayoutGroup`)
- iPod CSS is extensive and must not be modified
- Current `font-weight-*` classes in pages may be invalid Tailwind (should be `font-*`)
