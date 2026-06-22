import { vi } from "vitest";

// Polyfill `scrollIntoView` for jsdom (used by App.svelte navigation)
if (typeof window !== "undefined" && !window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}
