import { render } from "@testing-library/svelte";
import { expect, test } from "vitest";
import App from "../../../App.svelte";

const SECTION_IDS = [
  "hero",
  "about",
  "work",
  "projects",
  "contact",
  "footer",
] as const;

test("App renders all six section IDs in DOM order", () => {
  const { container } = render(App);

  for (const id of SECTION_IDS) {
    expect(
      container.querySelector(`#${id}`),
      `Section #${id} should exist`
    ).not.toBeNull();
  }

  const sections = container.querySelectorAll("section[id], footer[id]");
  const actualIds = [...sections]
    .map((el) => el.id)
    .filter(Boolean) as string[];

  expect(actualIds).toEqual([...SECTION_IDS]);
});
