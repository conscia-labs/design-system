# Conscia Design System: Agent Guide

This file is the compact, version-matched contract for coding agents working in
an application that has `@conscia-labs/design-system` installed. Read the
installed copy before changing application UI. The installed package version is
authoritative when this guide differs from documentation on `main`.

## Start here

1. Inspect the application's existing shell, global stylesheet, routing, and
   nearby design-system usage before editing.
2. Reuse a public Conscia pattern when one matches the workflow. Use primitives
   when the application genuinely needs a composition the package does not own.
3. Import only public exports. Do not reach into `dist` or package internals.
4. Preserve the application's routing, authentication, permissions, data,
   mutations, validation, and business behavior.
5. Verify the affected UI at desktop and mobile sizes, including keyboard and
   visible focus behavior for interactive changes.

Live examples and component guidance:
<https://conscia-labs.github.io/design-system/>

Machine-readable component inventory:
<https://conscia-labs.github.io/design-system/agent-manifest.json>

## Installation contract

Tailwind CSS v4 applications import these styles once from their global CSS:

```css
@import "tailwindcss";
@import "@conscia-labs/design-system/tailwind.css";
```

Do not add another `@source` for the package. The published stylesheet already
contains the package-relative source declaration.

Applications that do not run Tailwind use the complete precompiled bundle:

```css
@import "@conscia-labs/design-system/standalone.css";
```

Never import `standalone.css` in a Tailwind application. Its preflight and
utilities would compete with the application's generated CSS.

Set shared preferences on the document root:

```tsx
<html
  lang="en"
  data-appearance="system"
  data-density="comfortable"
  suppressHydrationWarning
>
```

Supported appearance values are `light`, `dark`, and `system`. Supported
density values are `comfortable`, `compact`, and `operational`.

## Non-negotiable boundaries

- Do not copy design-system components into the application.
- Do not install `@base-ui/react`, `@radix-ui/*`, or copied shadcn components
  when the design system already provides the behavior.
- Do not use the removed `asChild` API. Use the documented `render` prop for
  custom-host composition.
- Do not use legacy utilities such as `bg-primary`, `bg-muted`, `border-input`,
  or their associated legacy variables. Use Conscia semantic roles.
- Do not reach into package implementation files or depend on Base UI details.
- Do not add application z-index workarounds for supported overlays before
  checking the documented `modal` behavior.
- Do not encode status using color alone. Retain meaningful text, labels, or
  icons.

## Choose the highest useful level

### Patterns

Prefer patterns for recurring product workflows:

- Application chrome: `AppShell`, `AppHeader`, `AppSidebar`, `MainRegion`,
  `PageFrame`, and `SidebarNavigation`.
- Page composition: `PageHeader`, `PageToolbar`, `ResourceSummary`, and
  `DetailSection`.
- Data-heavy collections: `DataTable`, `EntityTable`, `InventorySurface`, and
  `PaginationControls`.
- Operational dashboards: `MetricCard`, `MetricBand`, `DataPanel`,
  `AttentionList`, and `ActivityList`.
- States and feedback: `StateView`, `ErrorState`, `LoadingRows`,
  `ConfirmationDialog`, `CommandPalette`, and `FilterBar`.
- Multi-rail workspaces: the `Workbench*` family.

### Primitives

Use primitives for application-specific compositions: `Button`, `Card`,
`Field`, `Input`, `Select`, `SearchableSelect`, `Dialog`, `Sheet`, `Popover`,
`Tabs`, `Table`, `Badge`, `Alert`, `Toast`, and related anatomy exports.

Consult `agent-manifest.json` for the complete public runtime inventory and the
playground route for each family.

## Frequent decisions

- Use `Table` for semantic table anatomy. Use `DataTable` for sorting,
  selection, column definitions, responsive rows, or pagination.
- Use `Tabs` for layered content or mode switching. Use `NavigationTabs` for
  route-backed destinations.
- Use `Select` for a short, familiar list. Use `SearchableSelect` for longer
  lists that users need to filter.
- Use `LoadingButton` for asynchronous actions so layout, disabled state, and
  `aria-busy` remain consistent.
- Use `ConfirmationDialog` or `AlertDialog` only for consequential decisions.
- Use `operational` density for information-heavy administration, inventory,
  and workspace surfaces. Keep `comfortable` for general-purpose product UI.

## Composition examples

Use fields as the unit of form layout and accessible help/error content:

```tsx
import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
} from "@conscia-labs/design-system";

<form className="grid gap-5">
  <Field>
    <FieldLabel htmlFor="connection-name">Name</FieldLabel>
    <Input id="connection-name" name="name" />
    <FieldDescription>Use a name operators will recognize.</FieldDescription>
  </Field>
  <Button type="submit">Create connection</Button>
</form>;
```

Keep popup controls non-modal when nested inside a modal surface:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogBody>
      <FormSelect modal={false} name="vendor" options={vendorOptions} />
      <SearchableSelect
        modal={false}
        name="model"
        options={modelOptions}
        onValueChange={setModel}
      />
    </DialogBody>
  </DialogContent>
</Dialog>
```

Prefer the integrated global header for new application shells:

```tsx
<AppShell headerLayout="integrated">
  <AppHeader>
    <AppHeaderStart>
      <SidebarTrigger />
      {productIdentity}
    </AppHeaderStart>
    <AppHeaderSearch>{globalSearch}</AppHeaderSearch>
    <AppHeaderActions>{accountActions}</AppHeaderActions>
  </AppHeader>
  <AppSidebar variant="auto">
    <AppSidebarContent>{navigation}</AppSidebarContent>
  </AppSidebar>
  <MainRegion>{children}</MainRegion>
</AppShell>
```

## Styling

Use semantic tokens and utilities rather than palette colors:

- Surfaces: `canvas`, `surface`, `surface-raised`, `surface-muted`, and
  `surface-floating`.
- Text: `text-primary`, `text-secondary`, `text-supporting`, and `text-muted`.
- Actions and selection: `action-*` and `selection-*`.
- Status: `information-*`, `success-*`, `warning-*`, and `danger-*`.
- Neutral structure: `border-subtle`, `control-border`, and shared radius,
  spacing, type, elevation, and focus tokens.

Use `className` for layout and local composition. Override semantic variables
only when the product intentionally changes a system-level decision. Avoid
component descendant selectors.

## Accessibility ownership

The package provides component-level keyboard behavior, focus management, and
semantic structure. The application remains responsible for:

- Meaningful labels and accessible names.
- Heading order and page landmarks.
- Form validation messages and their relationships.
- Alternative text.
- Route state such as `aria-current`.
- Complete keyboard-accessible business workflows.

## Verification

Use the consuming application's own commands. At minimum, run its typecheck and
tests for behavior changes, then inspect the affected route in light and dark
appearance at desktop and mobile sizes. For interactive changes, exercise the
keyboard path, focus return, disabled or pending state, and any nested overlay.

For migration work, use the versioned migration guide linked from the package
README. Do not infer compatibility from old shadcn or Radix usage.
