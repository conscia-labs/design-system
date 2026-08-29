import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { Avatar, AvatarFallback } from "../primitives/avatar";
import { AvatarGroup } from "../primitives/avatar-group";
import { FilterChip } from "../primitives/filter-chip";
import { ShortcutHint } from "../primitives/shortcut-hint";
import { Spinner } from "../primitives/spinner";
import { ToastProvider, ToastViewport, useToast } from "../primitives/toast";
import { CommandPalette } from "../patterns/command-palette";
import { FilterBar } from "../patterns/filter-bar";

describe("supporting primitives", () => {
  it("keeps shortcut hints and decorative spinners quiet by default", () => {
    render(
      <>
        <ShortcutHint>⌘K</ShortcutHint>
        <Spinner />
        <Spinner label="Loading models" />
      </>,
    );

    expect(screen.getByText("⌘K").getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("status", { name: "Loading models" })).toBeTruthy();
    expect(screen.getByRole("status", { name: "Loading models" }).getAttribute("aria-hidden")).toBeNull();
  });

  it("renders composed avatars with a deterministic overflow count", async () => {
    const { container } = render(
      <AvatarGroup max={2} total={5} aria-label="Workspace members">
        <Avatar><AvatarFallback>AL</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>BK</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>CM</AvatarFallback></Avatar>
      </AvatarGroup>,
    );

    expect(screen.getByRole("group", { name: "Workspace members" })).toBeTruthy();
    expect(container.querySelectorAll('[data-slot="avatar"]')).toHaveLength(2);
    expect(screen.getByLabelText("3 more avatars")).toBeTruthy();

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("removes a filter chip and supports clearing the active-filter bar", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onClearAll = vi.fn();

    render(
      <FilterBar onClearAll={onClearAll}>
        <FilterChip label="Provider" value="OpenAI" onRemove={onRemove} />
      </FilterBar>,
    );

    await user.click(screen.getByRole("button", { name: "Remove Provider filter" }));
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onClearAll).toHaveBeenCalledOnce();
  });
});

describe("CommandPalette", () => {
  const items = [
    { id: "models", label: "Open AI Models", description: "Browse models", group: "Navigate" },
    { id: "settings", label: "Open settings", keywords: ["preferences"], group: "Navigate" },
    { id: "disabled", label: "Disabled command", disabled: true, group: "Actions" },
  ];

  it("filters by keywords, selects with the keyboard, and restores the trigger focus", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <CommandPalette
        items={items}
        onSelect={onSelect}
        trigger={<button type="button">Open commands</button>}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Open commands" });
    await user.click(trigger);
    const input = screen.getByRole("combobox", { name: "Search commands" });
    await user.type(input, "preferences");
    expect(screen.getByText("Open settings")).toBeTruthy();
    expect(screen.queryByText("Open AI Models")).toBeNull();
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onSelect).toHaveBeenCalledWith(items[1]);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("supports controlled open state and exposes accessible dialog content", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender, container } = render(
      <CommandPalette
        open={false}
        items={items}
        onOpenChange={onOpenChange}
        onSelect={() => undefined}
        trigger={<button type="button">Open controlled commands</button>}
        title="Workspace commands"
        description="Choose an action"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Open controlled commands" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).toBeNull();

    rerender(
      <CommandPalette
        open
        items={items}
        onOpenChange={onOpenChange}
        onSelect={() => undefined}
        title="Workspace commands"
        description="Choose an action"
      />,
    );
    expect(screen.getByRole("dialog", { name: "Workspace commands" })).toBeTruthy();
    expect(screen.getByText("Choose an action")).toBeTruthy();

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});

function ToastProbe() {
  const { add, close } = useToast();

  return (
    <>
      <button type="button" onClick={() => close()}>Dismiss all</button>
      <button type="button" onClick={() => add({ title: "Saved", description: "The model is ready.", variant: "success" })}>
        Show toast
      </button>
    </>
  );
}

describe("Toast", () => {
  it("adds and dismisses managed notifications through the Conscia hook", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider timeout={0}>
        <ToastProbe />
        <ToastViewport />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByRole("region", { name: "Notifications" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Saved" })).toBeTruthy();
    expect(screen.getByText("The model is ready.")).toBeTruthy();
    expect(document.querySelector('[data-slot="toast-close"]')).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Dismiss all" }));
    expect(screen.queryByRole("heading", { name: "Saved" })).toBeNull();
  });
});
