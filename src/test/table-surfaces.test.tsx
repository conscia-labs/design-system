import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DataTable } from "../patterns/data-table";
import { PageToolbar } from "../patterns/page-toolbar";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../primitives/table";

const pagination = { pageIndex: 0, pageSize: 10 };

function Example({ showCaption }: { showCaption?: boolean }) {
  return (
    <DataTable
      data={[{ id: "1", name: "Alpha" }]}
      columns={[{ id: "name", header: "Name", cell: (item) => item.name, sortable: true, accessor: (item) => item.name }]}
      getRowId={(item) => item.id}
      pagination={pagination}
      onPaginationChange={() => undefined}
      caption="Provider connections"
      showCaption={showCaption}
    />
  );
}

describe("Table surfaces", () => {
  it("puts column headers and footers on the table-header band", () => {
    const { container } = render(
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>Alpha</TableCell></TableRow></TableBody>
        <TableFooter><TableRow><TableCell>Total</TableCell></TableRow></TableFooter>
      </Table>,
    );
    const header = container.querySelector('[data-slot="table-header"]')!;
    expect(header.className).toContain("bg-surface-table-header");
    expect(header.className).toContain("[&_tr]:border-border-default");
    const footer = container.querySelector('[data-slot="table-footer"]')!;
    expect(footer.className).toContain("bg-surface-table-header");
    expect(footer.className).toContain("border-border-default");
  });

  it("separates the DataTable pagination footer from the last row", () => {
    const { container } = render(<Example />);
    const footer = container.querySelector('[data-slot="pagination-controls"]')!;
    expect(footer.className).toContain("bg-surface-table-header");
    expect(footer.className).toContain("border-border-default");
  });

  it("takes the card surface inside cards and the canvas on the page", () => {
    const { container } = render(
      <>
        <Example />
        <PageToolbar search={<input aria-label="Search" />} />
      </>,
    );
    for (const slot of ["data-table", "page-toolbar"]) {
      const className = container.querySelector(`[data-slot="${slot}"]`)!.className;
      expect(className).toContain("bg-canvas");
      expect(className).toContain("in-data-[slot=card]:bg-transparent");
      expect(className).toContain("in-data-[slot=inventory-surface]:bg-transparent");
    }
  });

  it("keeps captions screen-reader-only unless asked to show them above the table", () => {
    const { container, rerender } = render(<Example />);
    const caption = () => container.querySelector('[data-slot="table-caption"]')!;
    expect(screen.getByRole("table", { name: "Provider connections" })).toBeTruthy();
    expect(caption().className).toContain("sr-only");
    expect(caption().getAttribute("data-visible")).toBe("false");
    expect(container.querySelector('[data-slot="table"]')!.className).toContain("caption-top");

    rerender(<Example showCaption />);
    expect(caption().className).not.toContain("sr-only");
    expect(caption().getAttribute("data-visible")).toBe("true");

    const { container: primitive } = render(
      <Table><TableCaption visible>Environments</TableCaption><TableBody><TableRow><TableCell>Prod</TableCell></TableRow></TableBody></Table>,
    );
    expect(primitive.querySelector("caption")!.className).not.toContain("sr-only");
  });

  it("sizes sortable headers with the small control height", () => {
    render(<Example />);
    const sort = screen.getByRole("button", { name: "Sort by Name" });
    expect(sort.className).toContain("h-[var(--ds-control-height-sm)]");
    expect(sort.className).not.toMatch(/(^|\s)h-8(\s|$)/);
  });
});
