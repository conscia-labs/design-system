import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Checkbox } from "@base-ui/react/checkbox";
import { Collapsible } from "@base-ui/react/collapsible";
import { Combobox } from "@base-ui/react/combobox";
import { Dialog } from "@base-ui/react/dialog";
import { Menu } from "@base-ui/react/menu";
import { Select } from "@base-ui/react/select";
import { Switch } from "@base-ui/react/switch";
import { Tabs } from "@base-ui/react/tabs";
import { Tooltip } from "@base-ui/react/tooltip";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

function RenderProbe({ render, ...props }: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">({}, props),
  });
}

describe("Base UI Phase 2 proof harness", () => {
  it("resolves the component-path modules required by the migration", () => {
    expect(Checkbox.Root).toBeTruthy();
    expect(Collapsible.Root).toBeTruthy();
    expect(Combobox.Root).toBeTruthy();
    expect(Dialog.Root).toBeTruthy();
    expect(Menu.Root).toBeTruthy();
    expect(Select.Root).toBeTruthy();
    expect(Switch.Root).toBeTruthy();
    expect(Tabs.Root).toBeTruthy();
    expect(Tooltip.Root).toBeTruthy();
  });

  it("supports render composition with merged props and refs", async () => {
    const user = userEvent.setup();
    let clicks = 0;
    const ref = React.createRef<HTMLAnchorElement>();

    render(
      <RenderProbe
        ref={ref}
        aria-label="Open workspace"
        data-testid="render-probe"
        onClick={() => {
          clicks += 1;
        }}
        render={<a href="/workspace" />}
      >
        Workspace
      </RenderProbe>,
    );

    const link = screen.getByRole("link", { name: "Open workspace" });
    expect(link.getAttribute("data-testid")).toBe("render-probe");
    expect(ref.current).toBe(link);

    await user.click(link);
    expect(clicks).toBe(1);
  });

  it("provides popup dismissal, state attributes, and focusable controls", async () => {
    const user = userEvent.setup();

    function BehaviorProbe() {
      return (
        <>
          <Dialog.Root>
            <Dialog.Trigger>Open proof dialog</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Popup>
                <Dialog.Title>Proof dialog</Dialog.Title>
                <Dialog.Close>Close dialog</Dialog.Close>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
          <Checkbox.Root aria-label="Proof checkbox" />
          <Switch.Root aria-label="Proof switch" />
          <Collapsible.Root>
            <Collapsible.Trigger>Toggle proof panel</Collapsible.Trigger>
            <Collapsible.Panel>Proof panel</Collapsible.Panel>
          </Collapsible.Root>
        </>
      );
    }

    render(<BehaviorProbe />);

    await user.click(screen.getByRole("button", { name: "Open proof dialog" }));
    expect(screen.getByRole("dialog", { name: "Proof dialog" })).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Proof dialog" })).toBeNull();

    const checkbox = screen.getByRole("checkbox", { name: "Proof checkbox" });
    await user.click(checkbox);
    expect(checkbox.getAttribute("data-checked")).toBe("");

    const switchControl = screen.getByRole("switch", { name: "Proof switch" });
    await user.click(switchControl);
    expect(switchControl.getAttribute("data-checked")).toBe("");

    const collapsibleTrigger = screen.getByRole("button", { name: "Toggle proof panel" });
    expect(collapsibleTrigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(collapsibleTrigger);
    expect(collapsibleTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Proof panel")).toBeTruthy();
  });

  it("can render a closed root on the server without a client-only import failure", () => {
    const html = renderToString(
      <Dialog.Root>
        <Dialog.Trigger>Server-safe trigger</Dialog.Trigger>
      </Dialog.Root>,
    );

    expect(html).toContain("Server-safe trigger");
  });
});
