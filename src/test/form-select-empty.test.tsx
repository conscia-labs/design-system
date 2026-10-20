import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormSelect } from "../primitives/form-select";

const models = [
  { value: "gpt-4.1", label: "GPT-4.1" },
  { value: "claude", label: "Claude" },
];

describe("FormSelect empty value", () => {
  it("shows the placeholder instead of the internal sentinel", () => {
    render(<FormSelect aria-label="Target model" value="" placeholder="Select a model" options={models} />);
    const trigger = screen.getByRole("combobox", { name: "Target model" });
    expect(trigger.textContent).toContain("Select a model");
    expect(document.body.textContent).not.toContain("__conscia_empty_select_value__");
  });

  it("renders nothing rather than the sentinel when no placeholder is given", () => {
    render(<FormSelect aria-label="Target model" name="model" options={models} />);
    const trigger = screen.getByRole("combobox", { name: "Target model" });
    expect(trigger.textContent).not.toContain("__conscia_empty_select_value__");
    expect(trigger.textContent?.trim()).toBe("");
    expect(document.body.textContent).not.toContain("__conscia_empty_select_value__");
  });

  it("still selects an explicit empty option", () => {
    render(<FormSelect aria-label="Fallback" value="" options={[{ value: "", label: "No fallback" }, ...models]} />);
    expect(screen.getByRole("combobox", { name: "Fallback" }).textContent).toContain("No fallback");
  });
});
