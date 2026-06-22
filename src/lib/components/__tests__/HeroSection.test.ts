import { cleanup, render } from "@testing-library/svelte";
import { afterEach, expect, test } from "vitest";
import HeroSection from "../sections/HeroSection.svelte";

afterEach(() => cleanup());

test("HeroSection renders the name headline in an h1", () => {
  const { container } = render(HeroSection);
  const h1 = container.querySelector("h1");
  expect(h1).not.toBeNull();
  expect(h1?.textContent).toContain("Gabe");
});

test("HeroSection renders the role line", () => {
  const { container } = render(HeroSection);
  expect(container.textContent).toContain("Software Engineer");
  expect(container.textContent).toContain("Backend Specialist");
});

test("HeroSection renders the value subline", () => {
  const { container } = render(HeroSection);
  expect(container.textContent).toContain("scalable systems");
  expect(container.textContent).toContain("feel alive");
});

test("HeroSection has a CTA link to #projects", () => {
  const { container } = render(HeroSection);
  const cta = container.querySelector('a[href="#projects"]');
  expect(cta).not.toBeNull();
  expect(cta?.textContent?.trim().length).toBeGreaterThan(0);
});

test("HeroSection uses WebCRACK token primitives (card + pill)", () => {
  const { container } = render(HeroSection);
  const cards = container.querySelectorAll(".card, .card-accent");
  expect(cards.length).toBeGreaterThanOrEqual(1);
  const pills = container.querySelectorAll(".pill");
  expect(pills.length).toBeGreaterThanOrEqual(1);
});

test("HeroSection uses light canvas treatment, not dark", () => {
  const { container } = render(HeroSection);
  const section = container.querySelector("section");
  expect(section).not.toBeNull();
  expect(section?.id).toBe("hero");
  expect(section?.className).toContain("bg-canvas");
  expect(section?.className).not.toContain("bg-black");
});
