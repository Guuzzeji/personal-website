import { render } from "@testing-library/svelte";
import { expect, test } from "vitest";
import "../../test-setup";
import SpinningText from "../SpinningText.svelte";

test("SpinningText component renders without crashing", () => {
  const { container } = render(SpinningText, {
    props: { children: "Hello Jest" },
  });
  expect(container).toBeTruthy();
  expect(container.textContent).toContain("Hello Jest");
});
