import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "../primitives/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../primitives/avatar";
import { Badge } from "../primitives/badge";
import { Button, IconButton } from "../primitives/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../primitives/card";
import { Input } from "../primitives/input";
import { Label } from "../primitives/label";
import { Separator } from "../primitives/separator";
import { Sheet, SheetContent, SheetTitle } from "../primitives/sheet";
import { Skeleton } from "../primitives/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../primitives/table";
import { Textarea } from "../primitives/textarea";

describe("Conscia simple primitives", () => {
  it("keeps Button native by default and supports render composition", async () => {
    const user = userEvent.setup();
    let clicked = false;

    render(
      <>
        <Button>Save</Button>
        <Button render={<a href="/workspace" />} onClick={() => { clicked = true; }}>
          Workspace
        </Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Save" }).getAttribute("type")).toBe("button");
    const link = screen.getByRole("link", { name: "Workspace" });
    await user.click(link);
    expect(clicked).toBe(true);
  });

  it("composes IconButton through a custom host and forwards refs", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLAnchorElement>();
    let clicked = false;

    render(
      <IconButton
        aria-label="Open workspace"
        render={<a href="#workspace" ref={ref} />}
        onClick={() => { clicked = true; }}
      >
        W
      </IconButton>,
    );

    const link = screen.getByRole("link", { name: "Open workspace" });
    expect(ref.current).toBe(link);
    await user.click(link);
    expect(clicked).toBe(true);
  });

  it("provides an explicit, accessible IconButton without removing icon-sized Button", () => {
    render(
      <>
        <IconButton aria-label="Open notifications">N</IconButton>
        <Button size="icon" aria-label="Open settings">S</Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Open notifications" }).getAttribute("data-slot")).toBe("button");
    expect(screen.getByRole("button", { name: "Open settings" }).getAttribute("data-slot")).toBe("button");
  });

  it("switches between avatar image and fallback states", () => {
    render(
      <Avatar>
        <AvatarImage src="/provider.png" alt="Provider" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>,
    );

    const image = screen.getByRole("img", { name: "Provider" });
    const fallback = screen.getByText("AI");
    expect(fallback.className).not.toContain("hidden");

    fireEvent.load(image);
    expect(image.className).not.toContain("hidden");
    expect(fallback.className).toContain("hidden");

    fireEvent.error(image);
    expect(image.className).toContain("hidden");
    expect(fallback.className).not.toContain("hidden");
  });

  it("resets an avatar before displaying a replacement source", () => {
    const { rerender } = render(
      <Avatar>
        <AvatarImage src="/first.png" alt="Provider" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>,
    );
    const firstImage = screen.getByRole("img", { name: "Provider" });
    fireEvent.load(firstImage);
    rerender(
      <Avatar>
        <AvatarImage src="/second.png" alt="Provider" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByRole("img", { name: "Provider" }).className).toContain("hidden");
    expect(screen.getByText("AI").className).not.toContain("hidden");
  });

  it("keeps native labels and control state styling aligned", () => {
    render(
      <>
        <Label htmlFor="name">Name</Label>
        <Input id="name" aria-invalid />
        <Textarea aria-invalid aria-label="Notes" />
        <Separator orientation="vertical" decorative={false} />
      </>,
    );

    expect(screen.getByLabelText("Name").tagName).toBe("INPUT");
    expect(screen.getByLabelText("Name").className).toContain("aria-invalid:border-danger");
    expect(screen.getByRole("textbox", { name: "Notes" }).className).toContain("aria-invalid:border-danger");
    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical");
  });

  it("renders focused Card anatomy and semantic Table anatomy", async () => {
    const { container } = render(
      <>
        <Alert variant="success">
          <AlertTitle>Ready</AlertTitle>
          <AlertDescription>Everything is connected.</AlertDescription>
        </Alert>
        <Badge variant="information">Informational</Badge>
        <Card variant="elevated">
          <CardHeader action={<IconButton aria-label="Card actions">…</IconButton>}>
            <CardTitle>Connection</CardTitle>
          </CardHeader>
          <CardContent>Connected</CardContent>
          <CardFooter>Updated just now</CardFooter>
        </Card>
        <Table>
          <TableCaption>Available model connections</TableCaption>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>Conscia Gateway</TableCell></TableRow>
          </TableBody>
          <TableFooter><TableRow><TableCell>Total: 1</TableCell></TableRow></TableFooter>
        </Table>
        <Skeleton data-testid="loading-connection" />
      </>,
    );

    expect(screen.getByText("Connection")).toBeTruthy();
    expect(screen.getByRole("group").getAttribute("aria-labelledby")).toBeTruthy();
    expect(screen.getByRole("group").getAttribute("aria-describedby")).toBeTruthy();
    expect(screen.getByText("Available model connections")).toBeTruthy();
    expect(screen.getByText("Total: 1")).toBeTruthy();
    expect(container.querySelector('[data-slot="table-container"]')?.getAttribute("tabindex")).toBe("0");
    expect(screen.getByTestId("loading-connection").getAttribute("aria-hidden")).toBe("true");

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("keeps explicit Alert IDs connected without creating a live region", () => {
    render(
      <Alert>
        <AlertTitle id="custom-alert-title">Connection status</AlertTitle>
        <AlertDescription id="custom-alert-description">The connection is ready.</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole("group");
    expect(alert.getAttribute("aria-labelledby")).toBe("custom-alert-title");
    expect(alert.getAttribute("aria-describedby")).toBe("custom-alert-description");
    expect(alert.getAttribute("aria-live")).toBeNull();
  });

  it("keeps Sheet positioning and swipe direction aligned", () => {
    const sides = [
      ["top", "top-0", "up"],
      ["right", "right-0", "right"],
      ["bottom", "bottom-0", "down"],
      ["left", "left-0", "left"],
    ] as const;
    const { rerender } = render(
      <Sheet side="top" open>
        <SheetContent>
          <SheetTitle>Side-aware sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    for (const [side, positionClass, swipeDirection] of sides) {
      rerender(
        <Sheet side={side} open>
          <SheetContent>
            <SheetTitle>Side-aware sheet</SheetTitle>
          </SheetContent>
        </Sheet>,
      );
      const content = document.querySelector('[data-slot="sheet-content"]');
      expect(content?.className).toContain(positionClass);
      expect(content?.getAttribute("data-swipe-direction")).toBe(swipeDirection);
    }
  });
});
