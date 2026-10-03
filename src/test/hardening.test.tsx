import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ConfirmationDialog } from "../patterns/confirmation-dialog";
import { AppShell, AppSidebar, AppSidebarContent } from "../patterns/app-shell";
import {
  DesignSystemPreferenceScript,
  useConsciaPreferences,
} from "../patterns/preference-controls";
import {
  appearanceStorageKey,
  densityStorageKey,
  getConsciaPreferenceBootstrapScript,
} from "../foundation/preferences";
import { Button } from "../primitives/button";
import { Table, TableBody, TableCell, TableRow } from "../primitives/table";

describe("production hardening", () => {
  it("keeps legacy preference keys consistent through hydration", () => {
    window.localStorage.setItem("conscia-appearance", "dark");
    window.localStorage.setItem("conscia-density", "compact");

    function PreferenceProbe() {
      const { appearance, density } = useConsciaPreferences();
      return <output>{appearance}:{density}</output>;
    }

    render(<PreferenceProbe />);
    expect(screen.getByText("dark:compact")).toBeTruthy();
  });

  it("keeps ConfirmationDialog triggers valid and closes after confirmation", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);

    render(
      <ConfirmationDialog
        trigger={<Button>Delete connection</Button>}
        title="Delete connection?"
        description="This cannot be undone."
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete connection" }));
    expect(screen.getByRole("alertdialog")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce());
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });

  it("names an AppSidebar even when the consumer does not add a label", () => {
    render(
      <AppShell>
        <AppSidebar>
          <AppSidebarContent>Navigation</AppSidebarContent>
        </AppSidebar>
      </AppShell>,
    );

    expect(screen.getByRole("complementary", { name: "Application navigation" })).toBeTruthy();
  });

  it("only focuses a table wrapper after horizontal overflow is detected", async () => {
    const { container, rerender } = render(
      <Table>
        <TableBody><TableRow><TableCell>Connection</TableCell></TableRow></TableBody>
      </Table>,
    );

    const wrapper = container.querySelector('[data-slot="table-container"]') as HTMLDivElement;
    expect(wrapper.getAttribute("tabindex")).toBeNull();

    Object.defineProperties(wrapper, {
      clientWidth: { configurable: true, value: 240 },
      scrollWidth: { configurable: true, value: 640 },
    });
    rerender(
      <Table>
        <TableBody><TableRow><TableCell>Connection with a changed label</TableCell></TableRow></TableBody>
      </Table>,
    );

    await waitFor(() => expect(wrapper.getAttribute("tabindex")).toBe("0"));
    expect(wrapper.getAttribute("role")).toBe("region");
    expect(wrapper.getAttribute("aria-label")).toBe("Scrollable table");
  });

  it("ships a pre-paint preference bootstrap with validated fallbacks", () => {
    const script = getConsciaPreferenceBootstrapScript();

    expect(script).toContain(appearanceStorageKey);
    expect(script).toContain(densityStorageKey);
    expect(script).toContain('appearance="system"');
    expect(script).toContain('density="comfortable"');

    const { container } = render(<DesignSystemPreferenceScript nonce="nonce-value" />);
    expect(container.querySelector("script")?.getAttribute("nonce")).toBe("nonce-value");
    expect(container.querySelector("script")?.textContent).toContain(appearanceStorageKey);
  });
});
