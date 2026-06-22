import { cleanup, render } from "@testing-library/svelte";
import { afterEach, expect, test } from "vitest";
import AboutSection from "../sections/AboutSection.svelte";

afterEach(() => cleanup());

test("AboutSection has id='about' and uses section token class", () => {
  const { container } = render(AboutSection);
  const section = container.querySelector("section");
  expect(section).not.toBeNull();
  expect(section?.id).toBe("about");
  expect(section?.className).toContain("section");
});

test("AboutSection renders greeting with waving hand icon", () => {
  const { container } = render(AboutSection);
  expect(container.textContent).toContain("Hello, I'm Gabe");
  const img = container.querySelector('img[alt="waving hand"]');
  expect(img).not.toBeNull();
});

test("AboutSection renders alias subtitle as pill or inline text", () => {
  const { container } = render(AboutSection);
  expect(container.textContent).toContain("Guuzzeji Online");
  expect(container.textContent).toContain("full-stack developer");
  expect(container.textContent).toContain("backend developer");
});

test("AboutSection renders all three body paragraphs verbatim", () => {
  const { container } = render(AboutSection);
  // Paragraph 1 – education and passion
  expect(container.textContent).toContain("Pacific Lutheran University");
  expect(container.textContent).toContain("complex technical");
  // Paragraph 2 – Microsoft / Xbox Live experience
  expect(container.textContent).toContain("Xbox Live Services");
  expect(container.textContent).toContain("leaderboard and ranking systems");
  // Paragraph 3 – hobbies and personal details
  expect(container.textContent).toContain("World of Warcraft");
  expect(container.textContent).toContain("big fan of Tyler");
});

test("AboutSection uses WebCRACK token primitives (card + pill)", () => {
  const { container } = render(AboutSection);
  const cards = container.querySelectorAll(".card, .card-accent");
  expect(cards.length).toBeGreaterThanOrEqual(1);
  const pills = container.querySelectorAll(".pill");
  expect(pills.length).toBeGreaterThanOrEqual(1);
});

test("AboutSection uses light canvas treatment, not dark", () => {
  const { container } = render(AboutSection);
  const section = container.querySelector("section");
  expect(section?.className).toContain("bg-canvas");
  expect(section?.className).not.toContain("bg-black");
});

test("AboutSection has no click-to-reveal — all content visible immediately", () => {
  const { container } = render(AboutSection);
  // No button for toggling content
  const buttons = container.querySelectorAll("button");
  expect(buttons.length).toBe(0);
  // All three paragraphs visible (paragraph 1 has "Pacific Lutheran")
  expect(container.textContent).toContain("Pacific Lutheran University");
});
