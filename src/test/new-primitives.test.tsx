import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Avatar, AvatarFallback } from "../primitives/avatar";
import { Badge } from "../primitives/badge";
import { Sheet, SheetContent, SheetTitle } from "../primitives/sheet";
import { ChartContainer } from "../charts/chart-container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../primitives/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "../primitives/breadcrumb";
import { DetailBackLink } from "../patterns/detail-back-link";
import { AppShell, SidebarTrigger } from "../patterns/app-shell";
import { DataPanelHeader } from "../patterns/data-panel";
import { MetricCard } from "../patterns/metric-card";
import { MetricCountUp } from "../patterns/metric-count-up";
import { StateView } from "../patterns/state-views";
import { Button, buttonVariants } from "../primitives/button";
import { DatePicker, DateRangePicker } from "../primitives/date-picker";
import { Field, FieldDescription, FieldError, FieldLabel } from "../primitives/field";
import { Label } from "../primitives/label";
import { Input } from "../primitives/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../primitives/input-group";
import { MultiSelect } from "../primitives/multi-select";
import { NumberField } from "../primitives/number-field";
import { Progress } from "../primitives/progress";
import { RadioGroup, RadioGroupItem } from "../primitives/radio-group";
import { SegmentedControl, SegmentedControlItem } from "../primitives/segmented-control";
import { NavigationTab } from "../primitives/tabs";
import { Textarea } from "../primitives/textarea";

describe("Field wiring", () => {
  it("connects label, description, error and invalid state without ids", () => {
    render(
      <Field invalid>
        <FieldLabel>Alias</FieldLabel>
        <Input />
        <FieldDescription>Shown to developers.</FieldDescription>
        <FieldError>Alias is taken.</FieldError>
      </Field>,
    );
    const input = screen.getByLabelText("Alias");
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(describedBy).toContain(screen.getByText("Shown to developers.").id);
    expect(describedBy).toContain(screen.getByText("Alias is taken.").id);
  });

  it("wires Textarea, InputGroup and NumberField the same way", () => {
    render(
      <>
        <Field><FieldLabel>Notes</FieldLabel><Textarea /></Field>
        <Field><FieldLabel>Budget</FieldLabel><InputGroup><InputGroupAddon>EUR</InputGroupAddon><InputGroupInput /></InputGroup></Field>
        <Field><FieldLabel>Replicas</FieldLabel><NumberField defaultValue={2} /></Field>
      </>,
    );
    expect(screen.getByLabelText("Notes").tagName).toBe("TEXTAREA");
    expect(screen.getByLabelText("Budget").getAttribute("data-slot")).toBe("input-group-input");
    expect((screen.getByLabelText("Replicas") as HTMLInputElement).value).toBe("2");
  });

  it("keeps explicit ids and standalone inputs working", () => {
    render(<><label htmlFor="plain">Plain</label><Input id="plain" /></>);
    expect(screen.getByLabelText("Plain").id).toBe("plain");
  });

  it("renders Field parts as plain elements outside a Field", () => {
    render(
      <>
        <FieldLabel htmlFor="solo">Solo</FieldLabel>
        <Input id="solo" />
        <FieldDescription>Help</FieldDescription>
        <FieldError>Problem</FieldError>
      </>,
    );
    expect(screen.getByLabelText("Solo").id).toBe("solo");
    expect(screen.getByText("Help").tagName).toBe("P");
    expect(screen.getByText("Problem").tagName).toBe("P");
  });

  it("connects Label inside a Field, like FieldLabel", () => {
    render(<Field><Label>Owner</Label><Input /></Field>);
    expect(screen.getByLabelText("Owner").tagName).toBe("INPUT");
  });

  it("keeps an explicit NumberField id in server-rendered HTML", () => {
    const html = renderToString(<Field><FieldLabel htmlFor="replicas">Replicas</FieldLabel><NumberField id="replicas" /></Field>);
    expect(html).toMatch(/<input[^>]* id="replicas"/);
  });

  it("server-renders matching label and control ids, explicit or generated", () => {
    const explicit = renderToString(
      <>
        <Field><FieldLabel htmlFor="name">Name</FieldLabel><Input id="name" /></Field>
        <Field><FieldLabel htmlFor="notes">Notes</FieldLabel><Textarea id="notes" /></Field>
        <Field><FieldLabel htmlFor="budget">Budget</FieldLabel><InputGroup><InputGroupInput id="budget" /></InputGroup></Field>
      </>,
    );
    for (const id of ["name", "notes", "budget"]) {
      expect(explicit).toContain(`for="${id}"`);
      expect(explicit).toMatch(new RegExp(`<(input|textarea)[^>]* id="${id}"`));
    }

    const generated = renderToString(<Field><FieldLabel>Alias</FieldLabel><Input /></Field>);
    const labelFor = generated.match(/<label[^>]* for="([^"]+)"/)?.[1];
    expect(labelFor).toBeTruthy();
    expect(generated).toMatch(new RegExp(`<input[^>]* id="${labelFor}"`));
  });
});

describe("new primitives", () => {
  it("RadioGroup selects one value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Plan" defaultValue="free" onValueChange={onValueChange}>
        <label><RadioGroupItem value="free" /> Free</label>
        <label><RadioGroupItem value="team" /> Team</label>
      </RadioGroup>,
    );
    await user.click(screen.getByRole("radio", { name: "Team" }));
    expect(onValueChange.mock.calls[0]?.[0]).toBe("team");
    expect(screen.getByRole("radio", { name: "Team" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Free" }).getAttribute("aria-checked")).toBe("false");
  });

  it("SegmentedControl always keeps one segment selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl aria-label="View" defaultValue="table" onValueChange={onValueChange}>
        <SegmentedControlItem value="table">Table</SegmentedControlItem>
        <SegmentedControlItem value="list">List</SegmentedControlItem>
      </SegmentedControl>,
    );
    const table = screen.getByRole("button", { name: "Table" });
    await user.click(table);
    expect(table.getAttribute("aria-pressed")).toBe("true");
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "List" }));
    expect(onValueChange).toHaveBeenCalledWith("list");
    expect(table.getAttribute("aria-pressed")).toBe("false");
  });

  it("Progress reports a value, and no value while indeterminate", () => {
    const { rerender } = render(<Progress label="Importing" value={40} showValue />);
    const bar = screen.getByRole("progressbar", { name: "Importing" });
    expect(bar.getAttribute("aria-valuenow")).toBe("40");
    expect(screen.getByText("40%")).toBeTruthy();

    rerender(<Progress label="Importing" />);
    expect(screen.getByRole("progressbar", { name: "Importing" }).hasAttribute("aria-valuenow")).toBe(false);
  });

  it("Accordion expands a section from its trigger", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem value="limits">
          <AccordionTrigger>Rate limits</AccordionTrigger>
          <AccordionContent>600 requests per minute.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: "Rate limits" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await waitFor(() => expect(screen.getByText("600 requests per minute.")).toBeTruthy());
  });

  it("Breadcrumb names the trail and marks the current page", () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="/models">Models</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbItem><BreadcrumbPage>Claude</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Models" }).getAttribute("href")).toBe("/models");
    expect(screen.getByText("Claude").getAttribute("aria-current")).toBe("page");
  });

  it("NumberField steps and clamps", async () => {
    const user = userEvent.setup();
    render(<NumberField aria-label="Replicas" defaultValue={2} max={3} />);
    const input = screen.getByRole("textbox", { name: "Replicas" }) as HTMLInputElement;
    await user.click(screen.getByRole("button", { name: "Increase" }));
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(input.value).toBe("3");
  });

  it("Button blocks clicks and reports busy while pending", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button pending pendingLabel="Saving…" onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Saving…" });
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("Button keeps its label, hidden under the spinner, when pending without a pending label", () => {
    render(<Button pending>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.querySelector('[data-slot="spinner"]')).toBeTruthy();
    expect(button.textContent).toBe("Save");
  });
});

describe("naming aliases and link rendering", () => {
  it("accepts danger on Button and sm/lg sizes alongside the old names", () => {
    expect(buttonVariants({ variant: "danger" })).toBe(buttonVariants({ variant: "destructive" }));
    const { container } = render(<StateView size="sm" title="Nothing here" />);
    expect(container.querySelector('[data-slot="state-view"]')?.getAttribute("data-size")).toBe("compact");
  });

  it("renders NavigationTab and DetailBackLink through a custom link", () => {
    render(
      <>
        <NavigationTab active render={<a data-router="tab" href="/usage" />}>Usage</NavigationTab>
        <DetailBackLink label="Models" render={<a data-router="back" href="/models" />} />
      </>,
    );
    const tab = screen.getByRole("link", { name: "Usage" });
    expect(tab.getAttribute("data-router")).toBe("tab");
    expect(tab.getAttribute("aria-current")).toBe("page");
    expect(tab.getAttribute("data-slot")).toBe("navigation-tab");
    expect(screen.getByRole("link", { name: "Models" }).getAttribute("data-router")).toBe("back");
  });

  it("MetricCountUp starts its digits at 0 and always exposes the final value", () => {
    const html = renderToString(<MetricCountUp value={42} />);
    expect(html).toMatch(/aria-hidden="true">0</);
    expect(html).toMatch(/sr-only">42</);
  });
});

describe("MultiSelect", () => {
  const options = [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }, { value: "c", label: "Gamma" }];

  it("adds a choice from the list and removes one from its chip", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Field><FieldLabel>Providers</FieldLabel><MultiSelect defaultValue={["a"]} options={options} onValueChange={onValueChange} /></Field>);

    const input = screen.getByLabelText("Providers");
    await user.click(input);
    await user.type(input, "Bet");
    await user.click(await screen.findByRole("option", { name: "Beta" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);

    await user.click(screen.getByRole("button", { name: "Remove Alpha" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["b"]);
  });

  it("submits every selected value under its name", () => {
    const { container } = render(<form><MultiSelect name="providers" defaultValue={["a", "c"]} options={options} aria-label="Providers" /></form>);
    expect(new FormData(container.querySelector("form")!).getAll("providers")).toEqual(["a", "c"]);
  });
});

describe("DatePicker", () => {
  it("picks a day from the calendar, shows it, and submits it as yyyy-mm-dd", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<form><DatePicker name="renewal" aria-label="Renewal" defaultValue={new Date(2026, 10, 10)} onValueChange={onValueChange} /></form>);

    const trigger = screen.getByRole("button", { name: "Renewal" });
    expect(trigger.textContent).toContain("Nov 10, 2026");
    await user.click(trigger);
    await user.click(await screen.findByRole("button", { name: /November 20th, 2026/ }));

    expect(onValueChange.mock.calls[0]?.[0]).toEqual(new Date(2026, 10, 20));
    expect(new FormData(container.querySelector("form")!).get("renewal")).toBe("2026-11-20");
    expect(trigger.textContent).toContain("Nov 20, 2026");
  });

  it("disables days outside min and max", async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Renewal" defaultValue={new Date(2026, 10, 10)} min={new Date(2026, 10, 5)} />);
    await user.click(screen.getByRole("button", { name: "Renewal" }));
    expect((await screen.findByRole("button", { name: /November 4th, 2026/ })).hasAttribute("disabled")).toBe(true);
  });

  it("shows and submits both ends of a range", () => {
    const { container } = render(<form><DateRangePicker name="period" aria-label="Period" defaultValue={{ from: new Date(2026, 10, 2), to: new Date(2026, 10, 15) }} /></form>);
    expect(screen.getByRole("button", { name: "Period" }).textContent).toContain("Nov 2, 2026 – Nov 15, 2026");
    const data = new FormData(container.querySelector("form")!);
    expect([data.get("period-from"), data.get("period-to")]).toEqual(["2026-11-02", "2026-11-15"]);
  });
});

describe("small additions", () => {
  it("Avatar takes a size and an announced status dot", () => {
    const { container } = render(<Avatar size="lg" status="online" statusLabel="Online"><AvatarFallback>KH</AvatarFallback></Avatar>);
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute("data-size")).toBe("lg");
    expect(container.querySelector('[data-slot="avatar-status"]')?.textContent).toBe("Online");
  });

  it("Badge renders a decorative dot before its label", () => {
    render(<Badge variant="success" dot>Healthy</Badge>);
    const badge = screen.getByText("Healthy");
    expect(badge.firstElementChild?.getAttribute("data-slot")).toBe("badge-dot");
    expect(badge.textContent).toBe("Healthy");
  });

  it("SheetContent sizes a side sheet", async () => {
    render(<Sheet defaultOpen><SheetContent size="lg"><SheetTitle>Details</SheetTitle></SheetContent></Sheet>);
    expect((await screen.findByRole("dialog")).className).toContain("max-w-2xl");
  });

  it("ChartContainer swaps the plot for loading and empty states", () => {
    const chart = (state: object) => (
      <ChartContainer title="Requests" summary="Requests per day" config={{ requests: { label: "Requests" } }} {...state}><svg /></ChartContainer>
    );
    const { container, rerender } = render(chart({ loading: true }));
    expect(container.querySelector('[data-slot="chart-plot"]')?.getAttribute("aria-busy")).toBe("true");
    rerender(chart({ empty: true }));
    expect(screen.getByText("No data for this period.")).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
  });
});

describe("refactors", () => {
  it("lets a surface title take its place in the page outline", () => {
    render(<><DataPanelHeader title="Deployments" headingLevel={3} /><MetricCard label="Requests" value={12} headingLevel={4} /></>);
    expect(screen.getByRole("heading", { level: 3, name: "Deployments" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 4, name: "Requests" })).toBeTruthy();
  });

  it("MetricCard marks a null value as unavailable and still renders 0 for an omitted one", () => {
    const { rerender } = render(<MetricCard label="Requests" value={null} unit="rps" />);
    expect(screen.getByLabelText("Unavailable")).toBeTruthy();
    expect(screen.queryByText("rps")).toBeNull();
    rerender(<MetricCard label="Requests" />);
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("AppShell follows a controlled sidebarOpen and reports toggles without persisting", async () => {
    const user = userEvent.setup();
    const onSidebarOpenChange = vi.fn();
    const { container } = render(<AppShell sidebarOpen={false} onSidebarOpenChange={onSidebarOpenChange}><SidebarTrigger /></AppShell>);
    expect(container.querySelector("[data-sidebar-state]")?.getAttribute("data-sidebar-state")).toBe("collapsed");
    await user.click(screen.getByRole("button"));
    expect(onSidebarOpenChange).toHaveBeenCalledWith(true);
    expect(container.querySelector("[data-sidebar-state]")?.getAttribute("data-sidebar-state")).toBe("collapsed");
  });
});
