import { cleanup, render } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import TopTabs from "../TopTabs.svelte";

// IntersectionObserver is not implemented in jsdom — install a minimal mock
// that records the callback so tests can simulate intersection events.
type IOCallback = (entries: IntersectionObserverEntry[]) => void;
let ioCallback: IOCallback | null = null;
let ioObserve = vi.fn();
let ioUnobserve = vi.fn();
let ioDisconnect = vi.fn();

class MockIntersectionObserver {
  constructor(cb: IOCallback) {
    ioCallback = cb;
  }
  observe = ioObserve;
  unobserve = ioUnobserve;
  disconnect = ioDisconnect;
  takeRecords() {
    return [];
  }
}

beforeEach(() => {
  ioCallback = null;
  ioObserve = vi.fn();
  ioUnobserve = vi.fn();
  ioDisconnect = vi.fn();
  // @ts-expect-error: installing on global for test env
  globalThis.IntersectionObserver = MockIntersectionObserver;

  for (const tab of TABS) {
    const el = document.createElement("section");
    el.id = tab.id;
    document.body.appendChild(el);
  }
});

afterEach(() => {
  cleanup();
  for (const tab of TABS) {
    document.getElementById(tab.id)?.remove();
  }
});

const TABS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

test("TopTabs renders a nav with aria-label='Section tabs'", () => {
  const { container } = render(TopTabs);
  const nav = container.querySelector('nav[aria-label="Section tabs"]');
  expect(nav).not.toBeNull();
});

test("TopTabs renders exactly four tabs for About/Work/Projects/Contact", () => {
  const { container } = render(TopTabs);
  const nav = container.querySelector('nav[aria-label="Section tabs"]');
  const links = nav!.querySelectorAll("a");
  expect(links.length).toBe(4);

  const labels = [...links].map((a) => a.textContent?.trim());
  expect(labels).toEqual(["About", "Work", "Projects", "Contact"]);
});

test("Each tab is an anchor linking to its section id", () => {
  const { container } = render(TopTabs);
  const nav = container.querySelector('nav[aria-label="Section tabs"]');
  const links = nav!.querySelectorAll("a");

  for (const tab of TABS) {
    const link = [...links].find((a) => a.getAttribute("href") === `#${tab.id}`);
    expect(link, `tab linking to #${tab.id} should exist`).not.toBeUndefined();
  }
});

test("No tab is active on initial render (before any scroll observation)", () => {
  const { container } = render(TopTabs);
  const nav = container.querySelector('nav[aria-label="Section tabs"]');
  const active = nav!.querySelectorAll('[aria-current="true"]');
  expect(active.length).toBe(0);
});

test("Active tab updates when IntersectionObserver reports a section intersecting", async () => {
  const { container } = render(TopTabs);
  const nav = container.querySelector('nav[aria-label="Section tabs"]');

  expect(ioCallback).not.toBeNull();
  ioCallback!([
    {
      target: { id: "work" } as Element,
      isIntersecting: true,
      intersectionRatio: 0.6,
    } as unknown as IntersectionObserverEntry,
  ]);
  await tick();

  const active = nav!.querySelector('[aria-current="true"]');
  expect(active).not.toBeNull();
  expect(active?.textContent?.trim()).toBe("Work");
});

test("Active tab clears when the previously intersecting section leaves", async () => {
  const { container } = render(TopTabs);
  const nav = container.querySelector('nav[aria-label="Section tabs"]');

  ioCallback!([
    {
      target: { id: "projects" } as Element,
      isIntersecting: true,
      intersectionRatio: 0.7,
    } as unknown as IntersectionObserverEntry,
  ]);
  await tick();
  expect(
    nav!.querySelector('[aria-current="true"]')?.textContent?.trim()
  ).toBe("Projects");

  ioCallback!([
    {
      target: { id: "projects" } as Element,
      isIntersecting: false,
      intersectionRatio: 0,
    } as unknown as IntersectionObserverEntry,
  ]);
  await tick();
  expect(nav!.querySelector('[aria-current="true"]')).toBeNull();
});

test("TopTabs uses WebCRACK token classes (border-ink + rounded pill container)", () => {
  const { container } = render(TopTabs);
  const nav = container.querySelector('nav[aria-label="Section tabs"]');
  expect(nav?.className).toContain("border-ink");
  expect(nav?.className).toContain("rounded-pill");
});