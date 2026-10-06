import * as React from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock } from "../patterns/code-block";

const snippets = [{ value: "react", label: "React", code: "const example = true;" }];

describe("CodeBlock keyboard access at overflow boundaries", () => {
  it("keeps the server-rendered rail focusable before hydration measures it", () => {
    const html = renderToString(<CodeBlock snippets={snippets} selectorLabel="Example format" />);
    const document = new DOMParser().parseFromString(html, "text/html");
    expect(document.querySelector('[role="tablist"]')?.getAttribute("tabindex")).toBe("0");
  });

  it.each([
    { width: 200, height: 36, focusable: false, name: "no overflow" },
    { width: 201, height: 36, focusable: true, name: "one-pixel horizontal overflow" },
    { width: 200, height: 37, focusable: true, name: "one-pixel vertical overflow" },
  ])("handles $name without losing keyboard access", ({ width, height, focusable }) => {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(36);
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(width);
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(height);
    render(<CodeBlock snippets={snippets} selectorLabel="Example format" />);
    expect(screen.getByRole("tablist", { name: "Example format" }).getAttribute("tabindex")).toBe(focusable ? "0" : null);
  });
});
