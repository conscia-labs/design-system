import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ConfirmationDialog } from "../patterns/confirmation-dialog";
import { DataTable } from "../patterns/data-table";
import { Avatar, AvatarFallback } from "../primitives/avatar";
import { AvatarGroup } from "../primitives/avatar-group";
import { Badge } from "../primitives/badge";
import { Button } from "../primitives/button";
import { FormSelect } from "../primitives/form-select";

const rows = [{ id: "1", name: "Beta" }, { id: "2", name: "Alpha" }];

describe("audit regressions", () => {
  it("keeps the metadata font size on Badge", () => {
    render(<Badge>Ready</Badge>);
    expect(screen.getByText("Ready").className).toContain("text-[length:var(--ds-metadata)]");
  });

  it("submits the real FormSelect value, never the empty-option sentinel", () => {
    const { container } = render(
      <form>
        <FormSelect name="fallback" value="" options={[{ value: "", label: "None" }, { value: "a", label: "A" }]} />
      </form>,
    );
    expect([...new FormData(container.querySelector("form")!).entries()]).toEqual([["fallback", ""]]);
  });

  it("sizes the AvatarGroup overflow chip", () => {
    const { container } = render(
      <AvatarGroup max={1} size="sm">
        <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
      </AvatarGroup>,
    );
    expect(container.querySelector("[data-slot=avatar-group-overflow]")?.getAttribute("data-size")).toBe("sm");
  });

  it("sorts a DataTable without controlled sorting state", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={rows}
        columns={[{ id: "name", header: "Name", sortable: true, accessor: (item) => item.name, cell: (item) => item.name }]}
        getRowId={(item) => item.id}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Sort by Name" }));
    expect(screen.getByRole("columnheader").getAttribute("aria-sort")).toBe("ascending");
    expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["Alpha", "Beta"]);
  });

  it("leaves keys pressed on a row's checkbox to the checkbox", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        data={rows}
        columns={[{ id: "name", header: "Name", cell: (item) => item.name }]}
        getRowId={(item) => item.id}
        selectedIds={new Set()}
        onSelectionChange={onSelectionChange}
        onRowClick={onRowClick}
      />,
    );
    screen.getByRole("checkbox", { name: "Select 1" }).focus();
    await user.keyboard(" ");
    expect(onRowClick).not.toHaveBeenCalled();
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it("keeps ConfirmationDialog open when the confirmation fails", async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    render(
      <ConfirmationDialog
        trigger={<Button>Delete</Button>}
        title="Delete?"
        description="This cannot be undone."
        onConfirm={() => Promise.reject(new Error("offline"))}
        onError={onError}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(onError).toHaveBeenCalledOnce());
    expect(screen.getByRole("alertdialog")).toBeTruthy();
  });

  it("keeps selection and pagination itself when they are not controlled", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        data={rows}
        columns={[{ id: "name", header: "Name", cell: (item) => item.name }, { id: "id", header: "Id", hidden: true, cell: (item) => item.id }]}
        getRowId={(item) => item.id}
        onSelectionChange={onSelectionChange}
        defaultPagination={{ pageIndex: 0, pageSize: 1 }}
      />,
    );
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["", "Beta"]);

    await user.click(screen.getByRole("checkbox", { name: "Select 1" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(["1"]));
    expect(screen.getByRole("checkbox", { name: "Select 1" }).getAttribute("aria-checked")).toBe("true");

    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["", "Alpha"]);
  });

  it("shows loading rows and an error in the DataTable body, under the header", () => {
    const props = { data: rows, columns: [{ id: "name", header: "Name", cell: (item: (typeof rows)[number]) => item.name }], getRowId: (item: (typeof rows)[number]) => item.id };
    const { container, rerender } = render(<DataTable {...props} loading loadingRows={3} />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeTruthy();
    expect(container.querySelectorAll('[data-slot="data-table-loading-row"]')).toHaveLength(3);
    expect(screen.queryByText("Beta")).toBeNull();

    rerender(<DataTable {...props} error="Could not load models." />);
    expect(screen.getByRole("cell", { name: "Could not load models." })).toBeTruthy();
  });
});
