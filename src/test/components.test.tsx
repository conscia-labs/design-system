import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../primitives/button";
import { SearchableSelect } from "../primitives/searchable-select";
import { DataTable, type SortingState } from "../patterns/data-table";
import { ValueMeter } from "../patterns/value-meter";

describe("Button", () => {
  it("does not submit a form unless explicitly requested", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Button>Safe action</Button>
        <Button type="submit">Submit</Button>
      </form>,
    );

    expect(screen.getByRole("button", { name: "Safe action" }).getAttribute("type")).toBe(
      "button",
    );

    await user.click(screen.getByRole("button", { name: "Safe action" }));
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});

describe("ValueMeter", () => {
  it("clamps progress values and exposes a programmatic label", async () => {
    const { container } = render(
      <ValueMeter
        label={<span>Deployment health</span>}
        value={125}
        maximum={100}
      />,
    );
    const meter = screen.getByRole("progressbar", {
      name: "Deployment health",
    });

    expect(meter.getAttribute("aria-valuenow")).toBe("100");
    expect(screen.getByText("100 of 100")).toBeTruthy();
    expect((meter.firstElementChild as HTMLElement).style.width).toBe("100%");

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});

describe("DataTable", () => {
  it("announces and updates column sorting without submitting a parent form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    function Example() {
      const [sorting, setSorting] = React.useState<SortingState>([]);

      return (
        <form onSubmit={onSubmit}>
          <DataTable
            data={[{ id: "2", name: "Beta" }, { id: "1", name: "Alpha" }]}
            columns={[
              {
                id: "name",
                header: "Name",
                accessor: (item) => item.name,
                cell: (item) => item.name,
                sortable: true,
              },
            ]}
            getRowId={(item) => item.id}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </form>
      );
    }

    render(<Example />);

    const columnHeader = screen.getByRole("columnheader", { name: /Name/ });
    expect(columnHeader.getAttribute("aria-sort")).toBe("none");

    await user.click(screen.getByRole("button", { name: "Sort by Name" }));
    expect(columnHeader.getAttribute("aria-sort")).toBe("ascending");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("SearchableSelect", () => {
  it("supports keyboard selection, skips disabled options, and integrates with forms", async () => {
    const user = userEvent.setup();

    function Example() {
      const [value, setValue] = React.useState("");

      return (
        <SearchableSelect
          aria-label="Environment"
          name="environment"
          value={value}
          onValueChange={setValue}
          options={[
            { value: "dev", label: "Development" },
            { value: "stage", label: "Staging", disabled: true },
            { value: "prod", label: "Production" },
          ]}
        />
      );
    }

    const { container } = render(<Example />);
    const combobox = screen.getByRole("combobox", { name: "Environment" });

    await user.click(combobox);
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("option", { name: "Staging" }).getAttribute("aria-disabled")).toBe(
      "true",
    );

    await user.keyboard("{End}{Enter}");
    expect((combobox as HTMLInputElement).value).toBe("Production");
    expect(
      (container.querySelector('input[name="environment"]') as HTMLInputElement).value,
    ).toBe("prod");

    await user.click(combobox);
    await user.keyboard("{Escape}");
    expect(combobox.getAttribute("aria-expanded")).toBe("false");

    await user.click(combobox);
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
  });
});
