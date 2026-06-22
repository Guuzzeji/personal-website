import { render } from "@testing-library/svelte";
import { expect, test } from "vitest";
import "../../test-setup";
import TokenDemo from "../TokenDemo.svelte";

test("TokenDemo renders the WebCRACK token primitives", () => {
  const { container, getByText } = render(TokenDemo);

  const heading = getByText("Design Tokens");
  expect(heading.className).toContain("font-display");
  expect(heading.className).toContain("text-ink");

  const cards = container.querySelectorAll(".card, .card-accent");
  expect(cards.length).toBeGreaterThanOrEqual(2);

  const pills = container.querySelectorAll(".pill");
  expect(pills.length).toBeGreaterThanOrEqual(1);
});

test("TokenDemo surfaces all three accent variants", () => {
  const { container } = render(TokenDemo);
  const pills = container.querySelectorAll(".pill");
  const texts = [...pills].map((el) => el.textContent?.trim());
  expect(texts).toContain("accent");
  expect(texts).toContain("cobalt");
  expect(texts).toContain("maroon");
});
