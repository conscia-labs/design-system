import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Dialog, DialogBody, DialogContent, DialogTitle } from "../primitives/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../primitives/dropdown-menu";
import { FormSelect } from "../primitives/form-select";
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover";
import { SearchableSelect } from "../primitives/searchable-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../primitives/select";
import { Sheet, SheetBody, SheetContent, SheetTitle } from "../primitives/sheet";

const options = [
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready" },
  { value: "archived", label: "Archived" },
];

afterEach(async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
});

function DialogHarness({ children }: { children: React.ReactNode }) {
  return (
    <Dialog open>
      <DialogContent showCloseButton={false}>
        <DialogTitle>Parent dialog</DialogTitle>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}

function SheetHarness({ children }: { children: React.ReactNode }) {
  return (
    <Sheet open>
      <SheetContent>
        <SheetTitle>Parent sheet</SheetTitle>
        <SheetBody>{children}</SheetBody>
      </SheetContent>
    </Sheet>
  );
}

function SelectFixture({ onValueChange, modal = false }: { onValueChange: (value: string) => void; modal?: boolean }) {
  return (
    <Select defaultValue="draft" onValueChange={onValueChange} modal={modal}>
      <SelectTrigger data-testid="select-trigger" aria-label="Status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

describe("nested overlay behavior", () => {
  it("forwards FormSelect modal=false inside a Dialog and preserves form values", async () => {
    const user = userEvent.setup();
    function FormFixture() {
      return <form><FormSelect name="status" aria-label="Form status" modal={false} defaultValue="draft" options={options} /></form>;
    }

    render(<DialogHarness><FormFixture /></DialogHarness>);
    const formTrigger = screen.getByRole("combobox", { name: "Form status" });
    await user.click(formTrigger);
    const formSelectPositioner = document.querySelector('[data-slot="select-positioner"]');
    expect(formSelectPositioner?.parentElement?.querySelector('[data-base-ui-inert=""]')).toBeNull();
    await waitFor(() => expect(formTrigger.getAttribute("aria-expanded")).toBe("true"));
    expect((document.querySelector('input[name="status"]') as HTMLInputElement).value).toBe("draft");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(formTrigger.getAttribute("aria-expanded")).toBe("false"));
  });

  it("keeps a Select inside a Dialog interactive with no nested modal backdrop", async () => {
    const user = userEvent.setup();
    let selected = "draft";
    render(<DialogHarness><SelectFixture onValueChange={(value) => { selected = value; }} /></DialogHarness>);

    const trigger = screen.getByTestId("select-trigger");
    await user.click(trigger);
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("true"));

    const selectPositioner = document.querySelector('[data-slot="select-positioner"]');
    const selectPortal = selectPositioner?.parentElement;
    expect(selectPortal?.getAttribute("data-base-ui-portal")).toBe("");
    expect(selectPortal?.closest('[data-slot="dialog-content"]')).toBeNull();
    expect(selectPortal?.closest("body")).toBe(document.body);
    expect(selectPortal?.querySelector('[data-base-ui-inert=""]')).toBeNull();

    await user.click(await screen.findByRole("option", { name: "Ready" }));
    expect(selected).toBe("ready");
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"));
  });

  it("keeps SearchableSelect keyboard and mouse selection available inside a Dialog", async () => {
    const user = userEvent.setup();
    function SearchFixture() {
      const [value, setValue] = React.useState("");
      return <SearchableSelect aria-label="Search status" modal={false} value={value} onValueChange={setValue} options={options} />;
    }

    render(<DialogHarness><SearchFixture /></DialogHarness>);
    const input = screen.getByRole("combobox", { name: "Search status" });
    await user.click(input);
    const searchablePositioner = document.querySelector('[data-slot="searchable-select-positioner"]');
    expect(searchablePositioner?.parentElement?.querySelector('[data-base-ui-inert=""]')).toBeNull();

    await user.keyboard("{ArrowDown}{Enter}");
    expect((input as HTMLInputElement).value).toBe("Draft");

    await user.click(input);
    await user.click(screen.getByRole("option", { name: "Ready" }));
    expect((input as HTMLInputElement).value).toBe("Ready");
  });

  it("keeps a Select inside a Sheet interactive and restores focus after escape", async () => {
    const user = userEvent.setup();
    render(<SheetHarness><SelectFixture onValueChange={() => undefined} /></SheetHarness>);
    const trigger = screen.getByTestId("select-trigger");

    await user.click(trigger);
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("true"));
    const positioner = document.querySelector('[data-slot="select-positioner"]');
    expect(positioner?.className).toContain("z-50");
    await waitFor(() => expect(positioner?.hasAttribute("hidden")).toBe(false));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"));
    expect(document.activeElement).toBe(trigger);
  });

  it("does not add a third modal layer to nested Dialog and Sheet surfaces", async () => {
    const user = userEvent.setup();
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Outer dialog</DialogTitle>
          <DialogBody>
            <Sheet open>
              <SheetContent>
                <SheetTitle>Nested sheet</SheetTitle>
                <SheetBody><SelectFixture onValueChange={() => undefined} /></SheetBody>
              </SheetContent>
            </Sheet>
          </DialogBody>
        </DialogContent>
      </Dialog>,
    );

    expect(document.querySelector('[data-slot="sheet-content"]')).toBeTruthy();
    await user.click(screen.getByTestId("select-trigger"));
    expect(document.querySelectorAll('[data-slot="dialog-overlay"]').length).toBe(1);
    expect(document.querySelector('[data-slot="sheet-content"]')).toBeTruthy();
    const nestedSelectPositioner = document.querySelector('[data-slot="select-positioner"]');
    expect(nestedSelectPositioner?.parentElement?.querySelector('[data-base-ui-inert=""]')).toBeNull();
  });

  it("uses the popup layer on Popover and DropdownMenu Positioners", () => {
    render(
      <>
        <Popover open>
          <PopoverTrigger>Open popover</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
        <DropdownMenu open>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent><DropdownMenuItem>Menu item</DropdownMenuItem></DropdownMenuContent>
        </DropdownMenu>
      </>,
    );

    expect(document.querySelector('[data-slot="popover-positioner"]')?.className).toContain("z-50");
    expect(document.querySelector('[data-slot="dropdown-menu-positioner"]')?.className).toContain("z-50");
  });

});
