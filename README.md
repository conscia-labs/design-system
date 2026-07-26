# Conscia Design System

The shared React component library for building clear, consistent, and accessible Conscia product experiences.

`@conscia-code/design-system` brings Conscia’s visual foundation, reusable interface primitives, and common product patterns together in one package. It is designed for operational applications where information density, predictable interaction, and accessibility matter.

> **Package:** available publicly as [`@conscia-code/design-system`](https://www.npmjs.com/package/@conscia-code/design-system).

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

## What is included

### Foundation

Semantic CSS variables for:

- Light and dark appearance.
- Comfortable and compact density.
- Typography, spacing, radius, and elevation.
- Canvas, surface, border, and text roles.
- Brand, selection, information, success, warning, and danger semantics.

### Primitives

Reusable interface building blocks composed from React, Radix UI, and ShadCN conventions:

- Alert
- Avatar
- Badge
- Button
- Card
- Checkbox
- Collapsible
- Dialog
- Dropdown menu
- Field and form controls
- Input and textarea
- Select and searchable select
- Sheet
- Skeleton
- Switch
- Table
- Tabs and navigation tabs
- Tooltip

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

## Quick start

### 1. Install the package

Using pnpm:

```bash
pnpm add @conscia-code/design-system
```

Using npm:

```bash
npm install @conscia-code/design-system
```

The package targets React 19 and ships as modern ESM with TypeScript
declarations. Component styles are precompiled, so consuming applications do
not need Tailwind CSS.

### 2. Load the design-system styles

Import the styles once in your application’s global stylesheet:

```css
@import "@conscia-code/design-system/styles.css";
```

The stylesheet includes the semantic tokens and every utility required by the
published components. Import it after your reset or application base styles if
you want the design system’s defaults to take precedence.

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
| `data-density` | `comfortable`, `compact` |

Comfortable density is the default for general product interfaces. Compact density is intended for high-volume operational workflows such as inventories and data-heavy administration.

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
} from "@conscia-code/design-system";

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

## Building an application shell

The shared shell owns presentation and responsive behavior. The host application supplies routes, links, user context, and actions.

```tsx
import {
  AppShell,
  AppSidebar,
  AppSidebarContent,
  AppSidebarHeader,
  MainRegion,
  PageContent,
  PageFrame,
  PageHeader,
  ProductIdentity,
  SidebarTrigger,
  TopBar,
} from "@conscia-code/design-system";

export function ProductShell({
  navigation,
  children,
}: {
  navigation: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <AppSidebar>
        <AppSidebarHeader>
          <ProductIdentity
            label="Conscia"
            description="Administration"
          />
        </AppSidebarHeader>
        <AppSidebarContent>{navigation}</AppSidebarContent>
      </AppSidebar>

      <MainRegion>
        <TopBar>
          <SidebarTrigger />
        </TopBar>

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

## Semantic color

Color communicates meaning rather than palette choice:

| Role | Purpose |
| --- | --- |
| `brand` | Conscia identity and signature moments |
| `brand-secondary` | Supporting brand expression |
| `primary` | The primary next action |
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
@import "@conscia-code/design-system/styles.css";

:root {
  --ds-space-page: 3rem;
  --ds-radius-surface: 0.625rem;
}
```

Prefer semantic variables over component-specific descendant selectors. This keeps appearance and density behavior consistent across primitives and patterns.

## Accessibility

Accessibility is part of the component contract:

- Radix-backed components provide keyboard interaction and focus management.
- Route-backed navigation uses semantic links and `aria-current`.
- Dialogs and sheets provide labelled modal structure.
- Form controls expose native labelling and validation attributes.
- Motion is reduced when the user requests `prefers-reduced-motion`.
- Semantic status colors are designed to be accompanied by text, icons, or labels.

Applications are still responsible for meaningful labels, heading order, form error relationships, alternative text, and accessible business workflows.

## Framework notes

### Next.js

Import the global stylesheet from the root layout:

```tsx
import "@conscia-code/design-system/styles.css";
```

The published package preserves its React client boundaries and does not need
`transpilePackages`. You can import components into either server or client
modules; Next.js will establish a client boundary for interactive exports.

### Other React applications

The primitives are router-independent and can be used with Vite or other
ESM-capable React build systems. Route-backed patterns accept
application-supplied links rather than depending on Next.js navigation.

### Focused imports

The root package is the simplest import path. Public subpath exports are also
available when an application wants a more explicit dependency boundary:

```tsx
import { Button } from "@conscia-code/design-system/primitives";
import { DataTable } from "@conscia-code/design-system/patterns";
import {
  applyConsciaPreferences,
} from "@conscia-code/design-system/foundation";
```

All public entry points are ESM-only.

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
```

`pnpm test:package` creates the production artifacts, validates the package
manifest, and imports the package through its public export map. The npm
`prepack` hook runs the same gate before a tarball can be produced.

Reusable foundation, primitive, and pattern code belongs in `src`. Fixtures and visual documentation belong in `playground`.

## Releasing

Releases are published from GitHub Actions through npm trusted publishing. The
release tag must exactly match the version in `package.json`.

For example, to publish the next patch:

```bash
pnpm version patch --no-git-tag-version
git add package.json
git commit -m "Release v0.1.1"
git tag v0.1.1
git push origin main --follow-tags
```

Pushing the tag starts the `npm-production` release workflow. The
workflow verifies the tag, runs the package tests, builds the publishable
artifacts, and publishes without a long-lived npm token.

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
