import { cleanup, render } from "@testing-library/svelte";
import { afterEach, expect, test, vi } from "vitest";
import BottomNav from "../BottomNav.svelte";

afterEach(() => cleanup());

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

test("BottomNav renders a primary nav landmark", () => {
  const { container } = render(BottomNav);
  const nav = container.querySelector('nav[aria-label="Primary"]');
  expect(nav).not.toBeNull();
});

test("BottomNav renders a shortcut button for each section", () => {
  const { container } = render(BottomNav);

  for (const s of SECTIONS) {
    const btn = container.querySelector(
      `button[aria-label="${s.label}"]`
    ) as HTMLButtonElement | null;
    expect(btn).not.toBeNull();
    expect(btn?.dataset.section).toBe(s.id);
  }
});

test("BottomNav marks the first section active by default", () => {
  const { container } = render(BottomNav);
  const about = container.querySelector(
    'button[aria-label="About"]'
  ) as HTMLButtonElement | null;
  expect(about?.getAttribute("aria-current")).toBe("true");

  const work = container.querySelector(
    'button[aria-label="Work"]'
  ) as HTMLButtonElement | null;
  expect(work?.getAttribute("aria-current")).toBeNull();
});

test("BottomNav shortcut click scrolls to the section", () => {
  const { container } = render(BottomNav);

  const fakeAbout = document.createElement("section");
  fakeAbout.id = "about";
  const scrollSpy = vi.fn();
  fakeAbout.scrollIntoView = scrollSpy;
  document.body.appendChild(fakeAbout);

  try {
    const aboutBtn = container.querySelector(
      'button[aria-label="About"]'
    ) as HTMLButtonElement;
    aboutBtn.click();
    expect(scrollSpy).toHaveBeenCalledTimes(1);
    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth", block: "start" })
    );
  } finally {
    fakeAbout.remove();
  }
});

test("BottomNav renders a mailto CTA", () => {
  const { container } = render(BottomNav);
  const mailto = container.querySelector(
    'a[href^="mailto:"]'
  ) as HTMLAnchorElement | null;
  expect(mailto).not.toBeNull();
  expect(mailto?.getAttribute("href")).toContain("mailto:");
  expect((mailto?.textContent ?? "").trim().length).toBeGreaterThan(0);
});

test("BottomNav tap targets are at least 44px tall", () => {
  const { container } = render(BottomNav);
  const targets = container.querySelectorAll("button, a");
  expect(targets.length).toBeGreaterThan(0);
  for (const t of [...targets]) {
    // min-h-11 (Tailwind) = min-height: 2.75rem = 44px
    expect(t.className).toMatch(/min-h-11/);
  }
});

test("BottomNav has no AI chat control", () => {
  const { container, queryByText } = render(BottomNav);
  expect(container.querySelector('[aria-label="Toggle AI chat"]')).toBeNull();
  expect(container.querySelector('[aria-label="Toggle menu"]')).toBeNull();
  expect(queryByText("AI")).toBeNull();
  expect(container.querySelectorAll("nav svg").length).toBe(0);
});