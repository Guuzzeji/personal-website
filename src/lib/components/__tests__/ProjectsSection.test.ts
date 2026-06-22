import { cleanup, render } from "@testing-library/svelte";
import { afterEach, expect, test } from "vitest";
import ProjectsSection from "../sections/ProjectsSection.svelte";

afterEach(() => cleanup());

test("ProjectsSection renders with id=projects and uses section token class", () => {
  const { container } = render(ProjectsSection);
  const section = container.querySelector("section");
  expect(section).not.toBeNull();
  expect(section?.id).toBe("projects");
  expect(section?.className).toContain("section");
  expect(section?.className).toContain("bg-canvas");
  expect(section?.className).not.toContain("bg-black");
});

test("ProjectsSection renders the section heading", () => {
  const { container } = render(ProjectsSection);
  const h2 = container.querySelector("h2");
  expect(h2).not.toBeNull();
  expect(h2?.textContent).toBe("Projects");
  expect(h2?.className).toContain("font-display");
  expect(h2?.className).toContain("text-ink");
});

test("ProjectsSection renders at least 4 curated project cards", () => {
  const { container } = render(ProjectsSection);
  const cards = container.querySelectorAll(".card, .card-accent");
  expect(cards.length).toBeGreaterThanOrEqual(4);
});

test("ProjectsSection uses card-accent for the hero project (Personal Website)", () => {
  const { container } = render(ProjectsSection);
  const accentCards = container.querySelectorAll(".card-accent");
  expect(accentCards.length).toBe(1);
  const heroCard = accentCards[0];
  expect(heroCard.textContent).toContain("Personal Website");
});

test("ProjectsSection renders project names inside each card", () => {
  const { container } = render(ProjectsSection);
  const cards = container.querySelectorAll(".card, .card-accent");
  const names = [...cards].map((c) => c.querySelector("h3")?.textContent);
  expect(names).toContain("Personal Website");
  expect(names).toContain("Go Minesweeper Multiplayer");
  expect(names).toContain("Knowledge Compiler Agents");
  expect(names).toContain("AutoLeARn Backend");
  expect(names).toContain("Mini Napster");
});

test("ProjectsSection renders tags as pill tokens", () => {
  const { container } = render(ProjectsSection);
  const pills = container.querySelectorAll(".pill");
  expect(pills.length).toBeGreaterThanOrEqual(5);
  const pillTexts = [...pills].map((el) => el.textContent?.trim());
  expect(pillTexts).toContain("Svelte");
  expect(pillTexts).toContain("Go");
  expect(pillTexts).toContain("Python");
});

test("ProjectsSection cards link to correct GitHub URLs", () => {
  const { container } = render(ProjectsSection);
  const links = container.querySelectorAll(".card a, .card-accent a, a[href*='github.com/Guuzzeji/']");
  const hrefs = [...links].map((a) => a.getAttribute("href"));
  expect(hrefs).toContain("https://github.com/Guuzzeji/personal-website");
  expect(hrefs).toContain("https://github.com/Guuzzeji/go-minesweeper-multiplayer");
  expect(hrefs).toContain("https://github.com/Guuzzeji/knowledge-compiler-agents");
  expect(hrefs).toContain("https://github.com/Guuzzeji/AutoLeARn-backend");
  expect(hrefs).toContain("https://github.com/Guuzzeji/mini-napster");
});

test("ProjectsSection preserves GitHub follow CTA", () => {
  const { container } = render(ProjectsSection);
  const followLink = container.querySelector('a[href="https://github.com/Guuzzeji"]');
  expect(followLink).not.toBeNull();
  expect(followLink?.textContent).toContain("Follow me on");
  expect(followLink?.textContent).toContain("GitHub @Guuzzeji");
});

test("ProjectsSection card links open in new tabs", () => {
  const { container } = render(ProjectsSection);
  const cards = container.querySelectorAll(".card, .card-accent");
  for (const card of cards) {
    const anchor = card.closest("a");
    if (anchor) {
      expect(anchor.getAttribute("target")).toBe("_blank");
      expect(anchor.getAttribute("rel")).toContain("noopener");
    }
  }
});

test("ProjectsSection curated cards have summaries", () => {
  const { container } = render(ProjectsSection);
  const cards = container.querySelectorAll(".card, .card-accent");
  let summaryCount = 0;
  for (const card of cards) {
    const paragraphs = card.querySelectorAll("p");
    for (const p of paragraphs) {
      const text = p.textContent?.trim() ?? "";
      if (text.length > 20) summaryCount++;
    }
  }
  expect(summaryCount).toBeGreaterThanOrEqual(4);
});
