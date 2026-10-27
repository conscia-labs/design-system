import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Eyebrow } from "../patterns/eyebrow";
import { Badge } from "../primitives/badge";
import { Card } from "../primitives/card";

describe("brand components", () => {
  it("gives brand and supporting cards the light-on-dark chrome scope", () => {
    const { container, rerender } = render(<Card tone="brand">Cybersecurity</Card>);
    const card = () => container.querySelector('[data-slot="card"]')!;
    expect(card().getAttribute("data-tone")).toBe("brand");
    expect(card().getAttribute("data-chrome")).toBe("brand");
    expect(card().className).toContain("bg-[var(--palette-burgundy)]");
    expect(card().className).not.toContain("bg-surface ");

    rerender(<Card tone="supporting">Hybrid cloud</Card>);
    expect(card().getAttribute("data-chrome")).toBe("brand");
    expect(card().className).toContain("bg-[var(--palette-green)]");

    rerender(<Card tone="highlight">Case</Card>);
    expect(card().hasAttribute("data-chrome")).toBe(false);
    expect(card().className).toContain("bg-highlight-background");
    expect(card().className).toContain("text-highlight-foreground");
  });

  it("keeps the default card untouched", () => {
    const { container } = render(<Card>Plain</Card>);
    const card = container.querySelector('[data-slot="card"]')!;
    expect(card.getAttribute("data-tone")).toBe("default");
    expect(card.hasAttribute("data-chrome")).toBe(false);
    expect(card.className).toContain("bg-surface");
  });

  it("renders pill category tags while status badges stay rounded", () => {
    render(
      <>
        <Badge shape="pill">Cybersecurity</Badge>
        <Badge variant="success">Healthy</Badge>
      </>,
    );
    const pill = screen.getByText("Cybersecurity");
    expect(pill.getAttribute("data-shape")).toBe("pill");
    expect(pill.className).toContain("rounded-full");
    expect(pill.className).not.toMatch(/(^|\s)rounded-md(\s|$)/);
    const status = screen.getByText("Healthy");
    expect(status.getAttribute("data-shape")).toBe("rounded");
    expect(status.className).toContain("rounded-md");
  });

  it("renders the eyebrow line with a machine-readable date", () => {
    const { container } = render(<Eyebrow category="Press release" meta="October 8, 2026" dateTime="2026-10-08" />);
    const eyebrow = container.querySelector('[data-slot="eyebrow"]')!;
    expect(eyebrow.className).toContain("uppercase");
    expect(eyebrow.textContent).toBe("Press release — October 8, 2026");
    expect(container.querySelector("time")?.getAttribute("dateTime")).toBe("2026-10-08");
  });
});
