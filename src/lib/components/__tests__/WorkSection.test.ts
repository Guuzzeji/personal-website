import { cleanup, render } from "@testing-library/svelte";
import { afterEach, expect, test } from "vitest";
import WorkSection from "../sections/WorkSection.svelte";

afterEach(() => cleanup());

const ROLES = [
  "Software Engineer Intern",
  "Explore Intern",
  "Discovery Program Intern",
] as const;

const DATE_RANGES = [
  "June 2025 – August 2025",
  "June 2024 – August 2024",
  "May 2023 – August 2023",
  "July 2022 – August 2022",
] as const;

test("WorkSection has section id=work with .section class", () => {
  const { container } = render(WorkSection);
  const section = container.querySelector("section");
  expect(section).not.toBeNull();
  expect(section?.id).toBe("work");
  expect(section?.className).toContain("section");
});

test("WorkSection uses light canvas treatment, not dark", () => {
  const { container } = render(WorkSection);
  const section = container.querySelector("section");
  expect(section?.className).toContain("bg-canvas");
  expect(section?.className).not.toContain("bg-black");
});

test("WorkSection renders heading 'Work Experience'", () => {
  const { container } = render(WorkSection);
  expect(container.textContent).toContain("Work Experience");
});

test("WorkSection renders all four role titles", () => {
  const { container } = render(WorkSection);
  // Software Engineer Intern appears twice (2025 and 2024)
  expect(container.textContent).toContain("Software Engineer Intern");
  expect(container.textContent).toContain("Explore Intern");
  expect(container.textContent).toContain("Discovery Program Intern");
});

test("WorkSection renders all four date ranges", () => {
  const { container } = render(WorkSection);
  for (const range of DATE_RANGES) {
    expect(
      container.textContent,
      `Missing date range: ${range}`
    ).toContain(range);
  }
});

test("WorkSection renders company name 'Microsoft' for each entry", () => {
  const { container } = render(WorkSection);
  const microsoftCount = (container.textContent?.match(/Microsoft/g) ?? [])
    .length;
  expect(microsoftCount).toBeGreaterThanOrEqual(4);
});

test("WorkSection uses .card token for each role card", () => {
  const { container } = render(WorkSection);
  const cards = container.querySelectorAll(".card");
  expect(cards.length).toBeGreaterThanOrEqual(4);
});

test("WorkSection uses .pill tokens for tags/chips", () => {
  const { container } = render(WorkSection);
  const pills = container.querySelectorAll(".pill");
  expect(pills.length).toBeGreaterThanOrEqual(1);
});

test("WorkSection renders entries in reverse chronological order", () => {
  const { container } = render(WorkSection);
  const text = container.textContent ?? "";

  const idx2025 = text.indexOf("2025");
  const idx2024 = text.indexOf("2024");
  const idx2023 = text.indexOf("2023");
  const idx2022 = text.indexOf("2022");

  // 2025 should appear before 2024, which should appear before 2023, etc.
  expect(idx2025).toBeGreaterThan(-1);
  expect(idx2024).toBeGreaterThan(-1);
  expect(idx2023).toBeGreaterThan(-1);
  expect(idx2022).toBeGreaterThan(-1);

  expect(idx2025).toBeLessThan(idx2024);
  expect(idx2024).toBeLessThan(idx2023);
  expect(idx2023).toBeLessThan(idx2022);
});
