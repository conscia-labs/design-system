# Conscia Design System

The shared React component library for building clear, consistent, and accessible Conscia product experiences.

`@conscia-labs/design-system` brings Conscia’s visual foundation, reusable interface primitives, and common product patterns together in one package. It is designed for operational applications where information density, predictable interaction, and accessibility matter.

> **Package:** available publicly as [`@conscia-labs/design-system`](https://www.npmjs.com/package/@conscia-labs/design-system).
>
> **Current release:** `1.1.0` is the latest stable v1 release.
>
> **Migration:** upgrading an application to v1? Follow the [Design System v1 Migration Guide](https://github.com/conscia-labs/design-system/blob/main/docs/design-system-v1-migration.md).

## Why this package exists

Conscia products share more than colors and buttons. They share expectations about how navigation works, how data is presented, how status is communicated, and how users move through operational workflows.

This package provides one executable source of truth for those decisions:

```text
Foundation tokens
      ↓
Conscia primitives
      ↓
Reusable product patterns
      ↓
Conscia applications
```

Use the design system to:

- Build new Conscia product interfaces.
- Keep existing products visually and behaviorally consistent.
- Reuse accessible controls instead of recreating them per application.
- Compose common shells, resource lists, detail views, tables, and state views.
- Apply light, dark, and density preferences through shared semantic tokens.

Product applications remain responsible for routing, authentication, permissions, data fetching, mutations, validation, and business-specific behavior.

## Migrating to v1.0.0

Version `1.0.0` is a clean API and implementation break. Component concepts and
public names remain recognizable, but Radix and shadcn implementation details
are no longer part of the contract. In particular:

- Replace `asChild` with the documented `render` prop where custom-host composition is required.
- Replace legacy token utilities such as `bg-primary`, `bg-muted`, and `border-input` with the canonical Conscia semantic roles documented in the migration guide.
- Do not add `@base-ui/react`, `@radix-ui/*`, or copied shadcn components to the application; Base UI is bundled and used internally by the design system.
- Recheck dialogs, sheets, menus, selects, comboboxes, tabs, tooltips, forms, tables, and icon-only actions against the application’s keyboard and accessibility tests.

The complete, agent-readable upgrade runbook is [`docs/design-system-v1-migration.md`](./docs/design-system-v1-migration.md) in this repository. You can also open the [migration guide on GitHub](https://github.com/conscia-labs/design-system/blob/main/docs/design-system-v1-migration.md). The guide is intentionally kept in the repository’s `docs/` directory rather than the npm tarball, so the GitHub link is the durable location for app owners and coding agents.

## What is included

### Foundation

Semantic CSS variables for:

- Light and dark appearance.
- Comfortable and compact density.
- Typography, spacing, radius, and elevation.
- Canvas, surface, border, and text roles.
- Brand, selection, information, success, warning, and danger semantics.

### Primitives

Reusable Conscia-owned interface building blocks composed from native React
markup and Base UI behavior where interaction complexity requires it:

- Alert
- AlertDialog
- Avatar
- Badge
- Button
- LoadingButton
- IconButton
- Card
- Checkbox
- Collapsible
- Dialog
- Dropdown menu
- Field and form controls
- Input and textarea
- Select, FormSelect, and searchable select
- Sheet
- Skeleton
- Switch
- Table
- Tabs and navigation tabs
- Tooltip
- Popover
- Shortcut hint
- Spinner
- Avatar group
- Filter chip
- Toast provider and viewport

### Patterns

Higher-level compositions for recurring product workflows:

- Application shell and sidebar
- Sidebar navigation
- Page frame, header, and toolbar
- Data table and pagination
- Resource summaries and detail sections
- Confirmation dialogs
- Empty, loading, and error states
- Activity lists and metric bands
- Code blocks and value meters
- Command palette
- Filter bar

### Supporting interaction patterns

#### Command palette

`CommandPalette` accepts an explicit list of commands, filters labels and
keywords, and supports keyboard navigation without a global command registry:

```tsx
import { Button, CommandPalette } from "@conscia-labs/design-system";

<CommandPalette
  items={[{ id: "settings", label: "Open settings", keywords: ["preferences"] }]}
  onSelect={(item) => openCommand(item.id)}
  trigger={<Button variant="outline">Open commands</Button>}
/>
```

#### Toasts

Toasts are opt-in. Mount one provider and viewport, then use `useToast` from a
descendant component:

```tsx
import {
  Button,
  ToastProvider,
  ToastViewport,
  useToast,
} from "@conscia-labs/design-system";

function SaveButton() {
  const { add } = useToast();
  return (
    <Button onClick={() => add({ title: "Saved", variant: "success" })}>
      Save
    </Button>
  );
}

function App() {
  return (
    <ToastProvider>
      <SaveButton />
      <ToastViewport />
    </ToastProvider>
  );
}
```

## Quick start

### 1. Install the package

For v1, install the explicit `1.0.0` range:

Using pnpm:

```bash
pnpm add @conscia-labs/design-system@^1.0.0
```

Using npm:

```bash
npm install @conscia-labs/design-system@^1.0.0
```

The package targets React 19 and ships as modern ESM with TypeScript
declarations. The supported application integration requires Tailwind CSS v4.
The package declares Tailwind v4 as an optional peer so non-Tailwind consumers
can use the separate standalone stylesheet without installing Tailwind.

### 2. Load Tailwind and the design-system integration

Import both once in your application’s global stylesheet:

```css
@import "tailwindcss";
@import "@conscia-labs/design-system/tailwind.css";
```

`tailwind.css` imports the design tokens, theme registration, variants,
keyframes, base rules, and bespoke component CSS. It also contains a
package-relative `@source` for the published JavaScript, so the application’s
Tailwind compiler generates the utilities used by both the application and the
design system in one cascade. Do not add a separate `node_modules` source path.

The deprecated `styles.css` export remains as a foundation-only compatibility
alias. It does not contain preflight or generated utilities.

### Non-Tailwind applications

Applications that do not run Tailwind can opt into the complete precompiled
bundle:

```css
@import "@conscia-labs/design-system/standalone.css";
```

Tailwind applications must not import `standalone.css`, because its preflight
and generic utilities would compete with the application’s generated CSS.

### 3. Set the root appearance and density

Apply the default preferences to the root document element:

```tsx
export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-appearance="system"
      data-density="comfortable"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
```

Supported values:

| Preference | Values |
| --- | --- |
| `data-appearance` | `light`, `dark`, `system` |
| `data-density` | `comfortable`, `compact`, `operational` |

Comfortable density is the default for general product interfaces. Compact density is intended for high-volume operational workflows such as inventories and data-heavy administration.

Operational density is an explicit opt-in preset for interfaces that prioritize
information throughput and deliberate hierarchy: admin pages, chat shells,
connectors, catalogs, and Workspace-like surfaces. It tightens the shared type
scale to approximately 13px body/UI text, 12px metadata, 15–16px section titles,
and a 26px page title with a 650 weight, `-0.04em` tracking, and `1.08` line
height. It also tightens reusable spacing and control rhythm while preserving
the existing touch-target, focus-ring, color, radius, and shadow contracts.

```tsx
<html data-appearance="system" data-density="operational">
  {/* admin, chat, catalog, connector, or workspace-like application */}
</html>
```

Use comfortable density for general product reading and mixed-purpose pages.
Use compact density when an existing consumer already depends on its smaller
layout preset. Use operational density when the interface needs Workspace-like
hierarchy across shared components. Do not make 13px the global default: that
would make narrative, setup, and accessibility-critical product surfaces feel
compressed.

### 4. Use a component

```tsx
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
} from "@conscia-labs/design-system";

export function CreateConnectionCard() {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Create connection</CardTitle>
        <CardDescription>
          Connect a provider to make its resources available to Conscia.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="grid gap-5">
          <Field>
            <FieldLabel htmlFor="connection-name">Name</FieldLabel>
            <Input
              id="connection-name"
              name="name"
              placeholder="Production connection"
            />
            <FieldDescription>
              Use a name that helps operators identify this connection.
            </FieldDescription>
          </Field>

          <Button type="submit">Create connection</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Text-in-track switches

Use `LabeledSwitch` when the switch state should be visible inside the control.
It keeps Base UI’s switch behavior and accepts any React node for either label:

```tsx
import { LabeledSwitch } from "@conscia-labs/design-system";

<LabeledSwitch
  aria-label="Deployment status"
  defaultChecked
  onLabel="ENABLED"
  offLabel="DISABLED"
/>
```

`Switch` also accepts `onLabel` and `offLabel` when a single API needs to support
both the compact unlabeled style and the text-in-track style. If a label is
provided without its pair, the missing label defaults to `ON` or `OFF`.

### Loading buttons

Use `LoadingButton` for async actions that need stable button layout while a
mutation is pending. It disables the button, sets `aria-busy`, and replaces the
normal content with a small spinner and `pendingLabel`:

```tsx
import { LoadingButton } from "@conscia-labs/design-system";

<LoadingButton pending={saveMutation.isPending} pendingLabel="Saving…">
  Save changes
</LoadingButton>
```

## Building an application shell

The shared shell owns presentation and responsive behavior. The host application supplies routes, links, user context, and actions.

```tsx
import {
  AppHeader,
  AppHeaderActions,
  AppHeaderSearch,
  AppHeaderStart,
  AppShell,
  AppSidebar,
  AppSidebarContent,
  MainRegion,
  PageContent,
  PageFrame,
  PageHeader,
  SidebarNavigation,
  SidebarTrigger,
} from "@conscia-labs/design-system";

export function ProductShell({
  navigation,
  children,
}: {
  navigation: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AppShell headerLayout="integrated">
      <AppHeader>
        <AppHeaderStart>
          <SidebarTrigger />
          {/* Brand and product/workspace context */}
        </AppHeaderStart>
        <AppHeaderSearch mobileTrigger={mobileSearchTrigger}>
          {globalSearch}
        </AppHeaderSearch>
        <AppHeaderActions>{accountActions}</AppHeaderActions>
      </AppHeader>

      <AppSidebar>
        <AppSidebarContent>{navigation}</AppSidebarContent>
      </AppSidebar>

      <MainRegion>
        <PageFrame width="wide">
          <PageContent>
            <PageHeader
              title="Connections"
              description="Manage provider connections and their availability."
            />
            {children}
          </PageContent>
        </PageFrame>
      </MainRegion>
    </AppShell>
  );
}
```

`AppHeader` is the preferred global chrome: it spans the viewport while the
sidebar begins below it. The historical `TopBar` plus `AppSidebarHeader`
composition remains supported through the default `headerLayout="split"` for
existing v1 consumers.

Use static groups for normal application navigation:

```tsx
const entries = [
  {
    type: "group",
    id: "delivery",
    label: "Delivery metrics",
    items: [
      { id: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
      { id: "/reporting", label: "Reporting", icon: <FileText /> },
    ],
  },
] satisfies SidebarNavigationEntry[];

<SidebarNavigation entries={entries} renderLink={renderLink} />;
```

Static labels organize the information architecture without becoming controls.
Only use `type: "submenu"` when destinations form a genuine nested hierarchy
or the section is unusually long. Untyped sections retain their historical
collapsible behavior for compatibility, but new code should always choose an
explicit type.

## Building an operational dashboard

Use `MetricCard` for a metric with direction, sentiment, benchmark, and optional
visualization. Direction and sentiment are deliberately independent: lower
lead time is a downward but positive change.

```tsx
<MetricCard
  label="Lead time for changes"
  description="First commit to production"
  value="18.6"
  unit="hours"
  trend={
    <MetricTrend
      direction="down"
      sentiment="positive"
      value="22%"
      accessibleLabel="Down 22 percent, a positive change"
    />
  }
  visualization={<ProductChart />}
  visualizationSummary="Lead time is lower at the end of the period."
/>
```

`DataPanel` provides flush panel anatomy for charts and divided rows;
`AttentionList` represents persistent operational findings without announcing
them as live alerts. `ActivityItem` accepts `leading` and `trailing` slots for
status markers and structured metadata. The package supplies chart and trend
tokens but intentionally does not bundle a charting library or dashboard grid.

## Building a workbench surface

Workbench patterns provide a reusable composition for applications that need
global navigation, a contextual rail, a primary work area, and an inspector.
They own the shell geometry, responsive rail behavior, resource-row rhythm,
and inspector hierarchy; the host application supplies its routes, data, and
actions.

```tsx
import {
  ResourceRow,
  ResourceRowContent,
  ResourceRowIcon,
  ResourceRowMeta,
  ResourceRowTitle,
  WorkbenchInspector,
  WorkbenchInspectorSection,
  WorkbenchMain,
  WorkbenchRail,
  WorkbenchSection,
  WorkbenchSectionHeader,
  WorkbenchShell,
} from "@conscia-labs/design-system";

export function WorkspaceSurface({ children }: { children: React.ReactNode }) {
  return (
    <WorkbenchShell data-density="operational">
      <WorkbenchRail variant="global">Global navigation</WorkbenchRail>
      <WorkbenchRail variant="secondary">Contextual navigation</WorkbenchRail>
      <WorkbenchMain>
        <WorkbenchSection>
          <WorkbenchSectionHeader title="Recent conversations" metadata="12" />
          <ResourceRow as="a" href="/conversations/1">
            <ResourceRowIcon aria-hidden="true" />
            <ResourceRowContent>
              <ResourceRowTitle>Project brief</ResourceRowTitle>
              <ResourceRowMeta>Updated just now</ResourceRowMeta>
            </ResourceRowContent>
          </ResourceRow>
        </WorkbenchSection>
        {children}
      </WorkbenchMain>
      <WorkbenchInspector>
        <WorkbenchInspectorSection label="Details">
          {/* Product-owned metadata and actions */}
        </WorkbenchInspectorSection>
      </WorkbenchInspector>
    </WorkbenchShell>
  );
}
```

Use `WorkbenchMobileToolbar` and `WorkbenchBackdrop` when a contextual rail
needs an explicit mobile drawer trigger. Keep product-specific content styles
local, but use the shared workbench tokens and row primitives instead of
recreating shell widths, inspector padding, focus states, or resource-list
typography.

### Typography and font loading

The design system declares the open-source Source Sans 3 variable font as a
runtime dependency and loads it through its CSS entry points. Consumers should
import the published `tailwind.css` or `styles.css` entry and should not add a
separate font download. The shared hierarchy uses a deliberate `400 / 500 /
600` weight ladder; applications should avoid replacing it with arbitrary
fractional weights.
Applications may override `--font-sans` only when a deliberate product-specific
type decision has been made.

### Typography hierarchy

Use the shared type scale by role:

- `--ds-display-title` is the responsive display or welcome scale for
  high-level entry points.
- `--ds-page-title` is for page-level headings and `PageHeader` titles.
- `--ds-section-title` is for sections within a page or resource detail.
- `--ds-body` is the default application body size.
- `--ds-metadata` is for supporting context such as descriptions, timestamps,
  counts, and secondary organization text.
- `--ds-menu-label-size` is intentionally compact and is reserved for menu
  labels and compact option descriptions, not normal body copy.

Prefer these tokens over local `clamp()`, pixel, or one-off font-size values.
Product-specific layout styles may still control wrapping, maximum width, or
composition when the content requires it.

Operational consumers can use the token-backed `ds-type-*` utilities without
creating a parallel styling system:

| Role | Utility | Comfortable baseline | Operational intent |
| --- | --- | --- | --- |
| Page/display title | `ds-type-page-title`, `ds-type-display-title` | 28px / 56px | 26px / responsive display, 650 weight, tight tracking |
| Section title | `ds-type-section-title` | 17px | 16px, 650 weight, tighter line-height |
| Body/UI | `ds-type-body`, `ds-type-ui` | 15px / 14px | 13px with a 1.4–1.5 rhythm |
| Metadata | `ds-type-metadata` | 13px | 12px supporting context |
| Menu/eyebrow | `ds-type-menu-item`, `ds-type-menu-label`, `ds-type-eyebrow` | existing compact roles | compact labels with deliberate tracking |
| Controls | `ds-type-control`, `ds-type-button` | 14px | 13px, with stronger button weight |

The utilities resolve through CSS custom properties, so light and dark themes
retain the same semantic colors and focus behavior. Applications should use
the preset and shared utilities for type/rhythm, while keeping product-specific
composition, data, and layout ownership local.

Sidebar section labels are intentionally smaller than navigation rows and
slightly more weighted: comfortable density uses a `12px / 600 / 16px`
contract with restrained tracking, while compact density reduces the size
without changing the role. Keep navigation labels at the shared row size and
weight them only when active.

### BrandIcon

`BrandIcon` is the shared symbol-only Conscia mark. It embeds the supplied
240×240 symbol geometry so published consumers do not need to manage an asset
path. The default treatment uses the existing foreground role in light mode
and the existing white brand treatment in dark mode. Use it for symbol-only
lockups, collapsed navigation identity, and other shared brand placements.

The icon is decorative by default. Add an `aria-label` when the mark conveys
meaning without adjacent text, and use `className` to control its size.

### BrandWordmark

`BrandWordmark` is the shared no-tagline Conscia lockup. It embeds the supplied
496×113 vector geometry and uses `currentColor`, so applications do not need
separate black and white assets or runtime asset paths. The default treatment
matches `BrandIcon`: foreground in light mode and white in dark mode.

The wordmark is decorative by default. Add an `aria-label` when it is the only
accessible naming content, and use `className` to control its width.

```tsx
<BrandWordmark aria-label="Conscia" className="w-36" />
```

### Sidebar variants and semantic surfaces

`AppSidebar` follows application appearance by default through `variant="auto"`.
`variant="dark"` and `variant="light"` remain available when a product needs an
explicitly fixed treatment.

```tsx
<AppShell headerLayout="integrated">
  <AppHeader>{/* global identity, search, and actions */}</AppHeader>
  <AppSidebar variant="auto">
    <AppSidebarContent>{navigation}</AppSidebarContent>
    <AppSidebarFooter>{accountMenu}</AppSidebarFooter>
  </AppSidebar>
</AppShell>
```

The sidebar scope exposes reusable semantic roles for its canvas, header,
content, hover, active, search, footer, text, icon, group label, count,
border, and focus-ring roles.
Use the generated utilities such as `bg-sidebar-canvas`,
`bg-sidebar-hover`, `text-sidebar-primary-text`, and
`text-sidebar-metadata-text` in shared or application-owned compositions.

Form controls and outline buttons use `bg-surface-control`, with
`bg-surface-control-hover` for the outline hover state. These semantic surfaces
are intentionally theme-aware: the base uses the muted surface in light mode
and the raised surface in dark mode; hover reverses that relationship so the
control remains visibly interactive without introducing a new color palette.

Button variants provide their foreground role explicitly: primary, secondary,
destructive, outline, ghost, and link content do not depend on an ancestor's
text color. The destructive variant uses the existing dark danger background
and foreground pair in dark mode because the bright danger role is not suitable
for white text there. Consumer classes remain the final override when a
product-specific treatment is intentional.

Dark mode uses a calm charcoal surface ladder rather than a pure-black canvas:

| Role | Token | Dark value |
| --- | --- | --- |
| Application canvas | `--canvas` | `#17191c` |
| Standard surface | `--surface` | `#1d2024` |
| Raised surface and control | `--surface-raised` / `--surface-control` | `#24272c` |
| Muted and control-hover surface | `--surface-muted` / `--surface-control-hover` | `#282b31` |
| Floating surface | `--surface-floating` | `#2c2f36` |
| Overlay surface | `--surface-overlay` | `#31343a` |

The adjacent steps are intentionally close enough for a calm reading
environment while remaining distinguishable through luminance, borders, and
elevation. `--text-primary` is a soft high-priority text role (`#eff1f4`), while
`--text-secondary`, `--text-supporting`, and `--text-muted` step down to
`#d4d8df`, `#b3bac5`, and `#929aa7`. Use the semantic `bg-surface-*` and
`text-*` utilities instead of copying these values into an application. The
dark sidebar remains its established Conscia identity surface; inputs use the
shared control surface and popovers/drawers use the floating or overlay roles.

`SidebarSearch` owns only the trigger, expanded field, Escape handling, and
focus handoff. Applications provide the query value and filtering behavior.
`NavigationGroup` accepts an optional `count`; application-owned group labels
can still be supplied as arbitrary React nodes. Routing, conversation rows,
row actions, account menus, permissions, and appearance controls remain
application-owned.

The shell uses `--ds-topbar-height` as the shared chrome-height contract.
`AppHeader` and the compatibility `TopBar` both use the responsive
`--ds-topbar-padding-x` tokens. Keep `SidebarTrigger` in either header—not
inside `AppSidebar`—so it remains available in collapsed and mobile states.

Sidebar section labels use the field-label size with a restrained medium weight
and tracking. Navigation rows retain the shared comfortable/touch heights,
while `--ds-sidebar-item-gap`, `--ds-sidebar-label-gap`, and
`--ds-sidebar-group-gap` control list, label, and group rhythm. Use the shared
sidebar semantic utilities for surfaces, text, icons, borders, and focus rings;
keep conversation data, organization names, and product-specific row actions
application-owned.

For migration, replace a consuming application's light-only `--sidebar-*`
root override with `variant="auto"` on its shared `AppSidebar`. Remove
descendant opacity and background overrides as each shell adopts the semantic
aliases. Keep product-specific selectors only where they encode behavior or
content rather than shared sidebar presentation.

The ownership boundary is:

| Shared design system | Application-owned |
| --- | --- |
| Sidebar variant tokens, surface hierarchy, geometry, responsive drawer, focus states, active/hover/disabled styling, tooltips, and search affordance behavior | Routes, permissions, navigation data, query/filter state, conversation or inventory data, row actions, account/profile menus, sign-out, and product-specific persistence keys |
| Static group structure, explicit submenu expansion, collapsed flyouts, and active/hover/focus styling | Group labels/content, link destinations, active-route calculation, and business-specific empty states |

## Choosing the right component

### Table or DataTable?

Use `Table` for small, bounded, read-only relationships.

Use `DataTable` when an operational inventory needs one or more of:

- Sorting
- Pagination
- Row selection
- Row actions
- Clickable rows
- Dedicated mobile rendering

Applications own filters, URL state, API requests, and permissions. When data is paginated by a server, enable manual sorting and manual pagination together so a single downloaded page is never presented as a completely sorted dataset.

### Tabs or NavigationTabs?

Use `Tabs` when content panels change in place without navigation.

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="activity">...</TabsContent>
</Tabs>
```

Use `NavigationTabs` for route-backed sections. The active destination is represented with `aria-current="page"`.

```tsx
<NavigationTabs aria-label="Connection sections">
  <NavigationTabsList>
    <NavigationTab href="/connections/123" active>
      Overview
    </NavigationTab>
    <NavigationTab href="/connections/123/activity">
      Activity
    </NavigationTab>
  </NavigationTabsList>
</NavigationTabs>
```

### Select or SearchableSelect?

Use `Select` for short, familiar option lists.

Use `SearchableSelect` when users need to find an item in a longer list by label, description, or keywords.

Both `FormSelect` and `SearchableSelect` contribute a named value to a native
HTML form when their `name` prop is provided.

### Nested overlays

Portaled controls can be used inside `Dialog` and `Sheet` without clipping
their popup. The popup Positioner is mounted in a Base UI portal and uses the
shared overlay layer hierarchy:

| Layer | Components | z-index |
| --- | --- | ---: |
| Modal | `Dialog`, `Sheet`, `AlertDialog` | 40 |
| Popup | `Select`, `Popover`, `SearchableSelect`, `DropdownMenu` | 50 |
| Transient | `Toast`, `Tooltip` | 100 |

Base UI `Select` is modal by default, so `FormSelect` preserves that default
for backwards compatibility. Set `modal={false}` when a `Select` or
`FormSelect` is nested in a modal surface so it does not add a second backdrop,
focus boundary, or inert page state. `SearchableSelect` also exposes `modal`
and preserves Combobox's current non-modal default:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogBody className="overflow-y-auto">
      <FormSelect modal={false} name="vendor" options={vendorOptions} />
      <SearchableSelect modal={false} name="model" options={modelOptions} onValueChange={setModel} />
    </DialogBody>
  </DialogContent>
</Dialog>
```

`Select`, `Popover`, and `DropdownMenu` already forward their Base UI root
props, including `modal`. Use the same `modal={false}` setting for those
controls when they are nested. No consuming-app z-index override or portal
adapter is required.

## Semantic color

Color communicates meaning rather than palette choice:

| Role | Purpose |
| --- | --- |
| `brand` | Conscia identity and signature moments |
| `brand-secondary` | Supporting brand expression |
| `action-*` | Primary actions and their hover, active, foreground, and tinted-background roles |
| `selection-*` | Current selection or active destination |
| `information-*` | Informational messages and evidence |
| `success-*` | Healthy, verified, approved, or completed states |
| `warning-*` | Conditions requiring attention |
| `danger-*` | Destructive actions, failures, and critical states |
| `neutral-*` | Decoration and non-semantic surfaces |

Do not use success styling merely because something is enabled or active. Success should communicate positive operational evidence.

## Customizing tokens

Override semantic variables after importing the package stylesheet:

```css
@import "tailwindcss";
@import "@conscia-labs/design-system/tailwind.css";

:root {
  --ds-space-page: 3rem;
  --ds-radius-surface: 0.625rem;
}
```

Prefer semantic variables over component-specific descendant selectors. This keeps appearance and density behavior consistent across primitives and patterns.

## Accessibility

Accessibility is part of the component contract:

- Base UI-backed components provide keyboard interaction and focus management.
- Route-backed navigation uses semantic links and `aria-current`.
- Dialogs and sheets provide labelled modal structure.
- Form controls expose native labelling and validation attributes.
- Motion is reduced when the user requests `prefers-reduced-motion`.
- Semantic status colors are designed to be accompanied by text, icons, or labels.

Applications are still responsible for meaningful labels, heading order, form error relationships, alternative text, and accessible business workflows.

## Framework notes

### Next.js

Import the application global stylesheet from the root layout:

```tsx
import "./globals.css";
```

The component entries are explicit client-only boundaries, while server-safe
code is published separately. For example, React Server Components should
import `cn` from `@conscia-labs/design-system/utils`. The package does not need
`transpilePackages`; Next.js will establish a client boundary for component
exports.

### Other React applications

The primitives are router-independent and can be used with Vite or other
ESM-capable React build systems. Route-backed patterns accept
application-supplied links rather than depending on Next.js navigation.

### Focused imports

The root package is the simplest import path. Public subpath exports are also
available when an application wants a more explicit dependency boundary:

```tsx
import { Button } from "@conscia-labs/design-system/primitives";
import { DataTable } from "@conscia-labs/design-system/patterns";
import {
  applyConsciaPreferences,
} from "@conscia-labs/design-system/foundation";
import { cn } from "@conscia-labs/design-system/utils";
```

All public entry points are ESM-only.

## Agent integration

The package ships a concise [`AGENT_GUIDE.md`](./AGENT_GUIDE.md) and generated
[`agent-manifest.json`](./agent-manifest.json) alongside its runtime files. The
guide records the integration contract, component-selection rules, important
boundaries, and verification expectations for the exact installed version. The
manifest maps every public component family to its exports and live playground
route.

Add or update a managed Conscia section in a consuming repository's
`AGENTS.md` after installing the package:

```bash
pnpm exec conscia-design-system init-agents
```

Preview the instructions without writing a file:

```bash
pnpm exec conscia-design-system init-agents --dry-run
```

The initializer preserves all instructions outside its marker-delimited block,
so applications can safely rerun it when upgrading. The block tells coding
agents to read the package-local guide before UI work. Agents and developers can
also use the [live playground](https://conscia-labs.github.io/design-system/),
[`llms.txt`](https://conscia-labs.github.io/design-system/llms.txt), and the
[public machine-readable inventory](https://conscia-labs.github.io/design-system/agent-manifest.json).

## Local development

Install dependencies:

```bash
pnpm install
```

Run the playground:

```bash
pnpm dev:playground
```

The playground is available at [http://localhost:3020](http://localhost:3020).

Run the project checks:

```bash
pnpm lint
pnpm lint:playground
pnpm typecheck
pnpm typecheck:playground
pnpm test
pnpm test:package
pnpm build:playground
pnpm build:playground:static
```

`pnpm test:package` creates the production artifacts, validates the package
manifest, and imports the package through its public export map. The npm
`prepack` hook runs the same gate before a tarball can be produced.

Reusable foundation, primitive, and pattern code belongs in `src`. Fixtures and visual documentation belong in `playground`.

## Releasing

Development is integrated through `dev`; `main` contains released source only.
Feature and fix branches target `dev`, and a release pull request is opened from
`dev` to `main`. The CI workflow rejects pull requests to `main` from any other
branch. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the complete branch model
and recommended GitHub branch rules.

Merging the release pull request runs CI but does not publish. Run `pnpm release`
from the reviewed `main` commit to create and push the version tag. That single
tag workflow validates the release, deploys the playground to GitHub Pages, and
publishes the npm package. The tag must match the version in `package.json`
exactly and point to a commit on `main`. npm’s trusted-publishing flow provides
short-lived CI authentication and provenance for the published package.

Before creating a release tag, complete the release checklist in the
[migration ledger](./docs/base-ui-migration.md), finalize the
[app-owner migration guide](./docs/design-system-v1-migration.md), and run the
full local validation suite:

```bash
pnpm lint
pnpm lint:playground
pnpm typecheck
pnpm typecheck:playground
pnpm test
pnpm test:package
pnpm test:consumer
pnpm build:playground:static
pnpm test:visual
```

Prepare the version change on a branch from `dev`, merge it into `dev`, then
open and merge the release pull request from `dev` to `main`. Replace `VERSION`
with the package version you are releasing:

```bash
git switch dev
git pull --ff-only origin dev
git switch -c release/vVERSION
pnpm version VERSION --no-git-tag-version
# Update CHANGELOG.md and any release notes for VERSION.
# Review the generated metadata, then stage the complete release change.
git add -A
git commit -m "Release vVERSION"
git push -u origin release/vVERSION
# Open release/vVERSION -> dev, then dev -> main pull requests.

git switch main
git pull --ff-only origin main
pnpm release
```

The merge to `main` runs CI. `pnpm release` pushes the version tag and starts
the release workflow, which verifies the version and branch ancestry, runs the
release validation, deploys Pages, and publishes the package to npm without a
long-lived npm token. Because this is a scoped public package, the release
configuration must retain public access; see npm’s [scoped-package publishing guidance](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/).

The `pnpm version` lifecycle hook refreshes the README release marker and
generated agent metadata, including `agent-manifest.json` and `playground/public/llms.txt`.

## Design-system boundaries

Add something to this package when it:

- Is shared by multiple Conscia products or workflows.
- Encodes a reusable visual or interaction convention.
- Can remain independent of product permissions, APIs, and domain state.
- Has a stable, accessible public interface.

Keep something in the product application when it:

- Fetches or mutates product data.
- Depends on route definitions or authorization rules.
- Contains product-specific validation or secret handling.
- Represents a one-off business workflow.

This boundary keeps the design system reusable without turning it into a second application framework.

## License

Released under the [MIT License](./LICENSE).
