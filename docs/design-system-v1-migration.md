# Design System v1 Migration Guide

Status: **Published with @conscia-labs/design-system@1.0.0**

Package: <code>@conscia-labs/design-system</code>

Target: <code>1.0.0</code>

This guide is for application owners and coding agents upgrading an existing
Conscia application from the pre-v1 design system to the Base UI-backed,
Conscia-owned v1 design system. It is intentionally procedural: an agent
should be able to follow it in order, record evidence, and stop at a defined
boundary when an application-specific decision is required.

The published release is <code>1.0.0</code>. This guide is the release-track
contract for application owners and coding agents. Update it if a future
release changes a public prop, export, CSS entrypoint, or package requirement.

## 1. Migration contract

v1 is a clean API and implementation break.

- Public component names and concepts remain recognizable where practical.
- Radix and shadcn implementation details are not part of the v1 contract.
- <code>asChild</code> is removed. Use <code>render</code> only on components
  that explicitly support custom-host composition.
- Base UI is an internal runtime implementation dependency. It is bundled in
  the package distribution; applications should not import Base UI to use
  Conscia components.
- React and React DOM remain peer dependencies. The current package targets
  React 19 and Node 20 or newer.
- No shadcn CLI, registry, <code>components.json</code>, copied component
  source, or package-level Radix dependency is required by v1.
- Existing tokens, typography, spacing, density modes, dark mode, and visual
  language are preserved unless a release decision records an intentional
  change.
- Existing <code>data-slot</code> markers may be present for internal anatomy.
  They are not guaranteed public styling hooks.

Do not solve this migration by adding a new compatibility layer that restores
Radix names, shadcn source, legacy token aliases, or <code>asChild</code>. If
an application needs a compatibility decision that is not covered here, stop
and record it for the design-system maintainers.

## 2. What is stable and what changes

| Area | v1 position |
| --- | --- |
| Component concepts | Existing concepts such as Button, Dialog, Select, Tabs, Sheet, and DataTable remain available. |
| Implementation | Conscia-owned components with Base UI behavior internally for complex interactions. |
| Composition | <code>render</code> is the supported composition mechanism where documented; <code>asChild</code> is removed. |
| CSS entrypoints | <code>tailwind.css</code>, <code>standalone.css</code>, <code>foundation.css</code>, and the historical <code>styles.css</code> path remain package exports. |
| Styling vocabulary | Canonical Conscia semantic roles only; legacy shadcn-style aliases are removed. |
| State selectors | Use Base UI attributes such as <code>data-open</code>, <code>data-closed</code>, <code>data-active</code>, <code>data-checked</code>, and <code>data-highlighted</code> where the component emits them. |
| Base UI imports | Not part of the application integration contract. Do not import raw Base UI modules for ordinary Conscia usage. |
| Compatibility aliases | <code>Conscia*</code> aliases may still compile during the migration window, but new code should use canonical names and the aliases are not the long-term v1 API. |

## 3. Agent operating rules

An agent performing this migration must follow these rules:

1. Work in a dedicated application branch and keep the worktree clean before
   starting.
2. Read this guide and the application’s current design-system usage before
   editing code.
3. Inventory first; do not mass-replace <code>data-state</code>,
   <code>--radix-*</code>, or token names without reviewing intent.
4. Migrate one bounded area at a time: package integration, composition,
   tokens, behavior-heavy components, then application patterns.
5. Run the application’s type, lint, unit, accessibility, build, and browser
   checks after each bounded area.
6. Compare screenshots or an equivalent visual baseline before and after each
   component family.
7. Do not edit generated <code>dist</code> files or patch
   <code>node_modules</code>.
8. Do not remove a Radix dependency until the application no longer imports it
   directly and the application’s own package graph has been checked.
9. Preserve business behavior, routing, permissions, data fetching, and form
   validation. This is a design-system integration migration, not a product
   rewrite.
10. If a required behavior is not represented in this guide, stop at the
    nearest safe boundary and record the file, decision, and failing check.

## 4. Preflight and inventory

### 4.1 Record the starting state

From the application repository, record:

~~~bash
git branch --show-current
git status --short
node --version
pnpm --version
pnpm list @conscia-labs/design-system react react-dom --depth 0
~~~

The design system currently declares <code>pnpm@10.18.3</code>, requires Node
<code>&gt;=20</code>, targets React 19, and declares Tailwind CSS v4 as an
optional peer. Use the application’s package manager if it does not use pnpm,
but keep the equivalent version evidence.

### 4.2 Locate integration points

Find the application’s package, CSS, provider, and shell integration:

~~~bash
rg -n \
  --glob '!node_modules/**' \
  --glob '!dist/**' \
  --glob '!build/**' \
  '@conscia-labs/design-system|tailwind\.css|standalone\.css|foundation\.css|styles\.css' \
  .
~~~

Record:

- The package manager and lockfile.
- The current design-system version.
- The global CSS file that imports the design system.
- Whether the app uses Tailwind or the standalone stylesheet.
- The root element that sets <code>data-appearance</code> and
  <code>data-density</code>.
- Any appearance or density bootstrap script.
- Any use of <code>AppShell</code>, <code>AppSidebar</code>,
  <code>SidebarNavigation</code>, <code>DataTable</code>,
  <code>ConfirmationDialog</code>, <code>CommandPalette</code>, or
  <code>ToastProvider</code>.
- The app’s unit, integration, browser, accessibility, and visual commands.
- Any direct imports from <code>@radix-ui/*</code>,
  <code>@base-ui/react</code>, or local copied component files.

### 4.3 Search for migration-sensitive code

Run these searches against application source and tests. Exclude this guide,
the design-system repository, generated output, and dependencies from the
results.

~~~bash
rg -n \
  --glob '!node_modules/**' \
  --glob '!dist/**' \
  --glob '!build/**' \
  --glob '!docs/**' \
  '@radix-ui/|@base-ui/react|asChild|\bSlot\b|forceMount|--radix-|data-state|data-selected|data-sidebar-state' \
  .

rg -n \
  --glob '!node_modules/**' \
  --glob '!dist/**' \
  --glob '!build/**' \
  --glob '!docs/**' \
  '(?:bg-(?:background|card|popover|primary|secondary|muted|accent|accent-hover|accent-active|accent-background|accent-foreground|destructive|border|input|ring|sidebar)|text-(?:foreground|primary-foreground|secondary-foreground|muted-foreground|sidebar|sidebar-foreground|sidebar-accent|sidebar-active)|border-(?:input|ring|destructive)|ring-(?:ring|destructive))(?!-[[:alnum:]_-])' \
  .
~~~

Classify each result as one of:

- Direct design-system usage that must migrate.
- An application-owned semantic state that must remain.
- A local component copied from an older design-system or shadcn source that
  should be replaced with a package component.
- A test that asserts old implementation details and must be rewritten as a
  behavior or accessibility assertion.
- Generated output that should be regenerated, not hand-edited.

Do not delete every <code>data-state</code> or <code>data-selected</code> result.
Some selectors belong to application state or a non-migrated component. Inspect
the owner and the expected behavior first.

## 5. Upgrade the package and stylesheet

When the v1 package is released, update the application dependency:

~~~bash
pnpm add @conscia-labs/design-system@^1.0.0
~~~

With npm, use the equivalent <code>npm install</code> command. Keep React and
React DOM on a supported React 19 version. Do not add <code>@base-ui/react</code>
merely because the design system uses it internally.

### Tailwind applications

Keep one global import of each required stylesheet:

~~~css
@import "tailwindcss";
@import "@conscia-labs/design-system/tailwind.css";
~~~

The package-relative source path inside <code>tailwind.css</code> discovers the
published design-system JavaScript. Do not add a second
<code>node_modules</code> source path and do not also import
<code>standalone.css</code> in a Tailwind application.

### Non-Tailwind applications

Use the complete precompiled bundle:

~~~css
@import "@conscia-labs/design-system/standalone.css";
~~~

The <code>styles.css</code> export is a foundation-only historical
compatibility path; new applications should use <code>tailwind.css</code> or
<code>standalone.css</code> according to their integration model.

### Root appearance and density

Keep the root attributes explicit and deterministic:

~~~tsx
<html
  lang="en"
  data-appearance="system"
  data-density="comfortable"
  suppressHydrationWarning
>
  <body>{children}</body>
</html>
~~~

Supported values are:

- <code>data-appearance</code>: <code>light</code>, <code>dark</code>,
  <code>system</code>
- <code>data-density</code>: <code>comfortable</code>, <code>compact</code>,
  <code>operational</code>

The preference storage keys currently used by Conscia controls are
<code>conscia-appearance:v1</code> and <code>conscia-density:v1</code>. The
older keys <code>conscia-appearance</code> and
<code>conscia-density</code> may be present in an existing app or test fixture;
preserve them only if the app still has an explicit legacy bootstrap or
synchronization path. Do not invent a third key during this migration.

## 6. Component API migration

### 6.1 Composition: asChild to render

Before:

~~~tsx
<Button asChild>
  <a href="/settings">Settings</a>
</Button>
~~~

After:

~~~tsx
<Button render={<a href="/settings" />}>Settings</Button>
~~~

For an icon-only action:

~~~tsx
<IconButton
  aria-label="Open settings"
  render={<a href="/settings" />}
>
  <SettingsIcon aria-hidden="true" />
</IconButton>
~~~

Use <code>render</code> only where a custom host is needed. A normal button
should remain a normal <code>&lt;Button&gt;</code>. A custom render target must
be a single element that can accept the component’s props and forward its ref.
If the target is a custom component, verify that it spreads received props and
forwards the correct DOM ref before using it.

Do not pass <code>asChild</code> to any v1 component. Do not expose a local
<code>Slot</code> wrapper to recreate it.

### 6.2 Simple primitives

| Component | Migration action |
| --- | --- |
| <code>Button</code> | Keep <code>variant</code>, <code>size</code>, native button props, and <code>buttonVariants</code>. It defaults to <code>type="button"</code>. Use <code>render</code> for a link or custom host. <code>size="icon"</code> remains available during migration. |
| <code>IconButton</code> | Prefer this for new icon-only actions. It requires <code>aria-label</code> or <code>aria-labelledby</code>, supports <code>sm</code>, <code>default</code>, and <code>lg</code>, and also supports narrow <code>render</code> composition. |
| <code>ConsciaButton</code> / <code>ConsciaIconButton</code> | Existing aliases may compile, but migrate new and touched code to <code>Button</code> and <code>IconButton</code>. Keep the accessible name requirement for icon buttons. |
| <code>Avatar</code>, <code>AvatarImage</code>, <code>AvatarFallback</code> | Keep the compound structure. The image is shown only after successful loading; preserve an informative <code>alt</code> or use an empty alt for decorative images. |
| <code>Label</code>, <code>Input</code>, <code>Textarea</code> | Use native labeling and native form props. Ensure every control has a visible or programmatic label. Use <code>aria-invalid</code> for invalid styling and semantics. |
| <code>Field</code>, <code>FieldGroup</code>, <code>FieldLabel</code>, <code>FieldDescription</code>, <code>FieldError</code> | Keep these lightweight layout and labeling helpers. Do not assume they perform validation or form state management. |
| <code>Separator</code> | Decorative separators remain presentation. Use <code>decorative={false}</code> when the separator is meaningful and needs <code>role="separator"</code>. |
| <code>Alert</code>, <code>Badge</code>, <code>Skeleton</code>, <code>BrandIcon</code>, <code>BrandWordmark</code> | Keep the existing semantic variants and accessible labeling. Do not turn informational <code>Alert</code> into a live region unless the application explicitly needs announcement behavior. |
| <code>Card</code>, <code>CardHeader</code>, <code>CardTitle</code>, <code>CardDescription</code>, <code>CardContent</code>, <code>CardFooter</code> | Use one Card with <code>default</code>, <code>muted</code>, or <code>elevated</code> variants. Put header actions in <code>CardHeader action={...}</code>. Do not replace application navigation with an implicitly interactive card. |
| <code>Table</code>, <code>TableCaption</code>, <code>TableHeader</code>, <code>TableBody</code>, <code>TableFooter</code>, <code>TableRow</code>, <code>TableHead</code>, <code>TableCell</code> | Keep semantic table markup. Use <code>Table</code> for bounded relationships; use <code>DataTable</code> for operational sorting, selection, pagination, or row actions. |

The following v1 additions are opt-in and do not require an existing
component migration: <code>ShortcutHint</code>, <code>Spinner</code>,
<code>AvatarGroup</code>, <code>FilterChip</code>, <code>FilterBar</code>,
<code>CommandPalette</code>, and the Toast provider/viewport. Adopt them when
they replace an application-local implementation, and apply the same
accessible-name, keyboard, and visual checks as the rest of the package.

### 6.3 Dialogs, drawers, menus, and anchored surfaces

The compound names remain, but props and state selectors are now Base UI
backed. Keep the Conscia compound structure rather than importing raw Base UI
parts.

| Component family | Migration action |
| --- | --- |
| <code>Dialog</code> | Keep <code>Dialog</code>, <code>DialogTrigger</code>, <code>DialogContent</code>, <code>DialogTitle</code>, <code>DialogDescription</code>, <code>DialogBody</code>, <code>DialogFooter</code>, and <code>DialogClose</code>. Use <code>render</code> on a trigger or close action only when a custom host is required. Do not use Radix sizing variables or <code>forceMount</code>. |
| <code>AlertDialog</code> | Use for destructive or consequential confirmations. <code>AlertDialogCancel</code> and <code>AlertDialogAction</code> are the semantic response controls. The existing <code>ConfirmationDialog</code> pattern already owns async pending/error behavior. |
| <code>Sheet</code> | Keep <code>side="top" | "right" | "bottom" | "left"</code>. It is implemented with Base UI Drawer and supports mobile swipe dismissal. Keep content scrollable through <code>SheetBody</code>; do not recreate the drawer focus or dismissal logic. |
| <code>DropdownMenu</code> | Keep item, label, group, separator, submenu, and link-item concepts. Replace trigger/item <code>asChild</code> usage with <code>render</code>. Do not replace menu links with click handlers that manually navigate unless the app has a documented routing requirement. |
| <code>Popover</code> | Use for anchored filters, inspectors, and contextual actions. It is not a replacement for Dialog or DropdownMenu. Use <code>PopoverTitle</code> and <code>PopoverDescription</code> when the surface needs an accessible name or description. |
| <code>Tooltip</code> | Keep tooltip text supplementary. The trigger must have its own accessible name; tooltip text must not be the only label for an icon-only action. Do not use tooltips as the mobile interaction path. |

### 6.4 Selects, comboboxes, and tabs

| Component | Migration action |
| --- | --- |
| <code>Select</code> | Keep the compound exports and <code>SelectTrigger size="sm" | "default"</code>. Preserve controlled or uncontrolled usage, but remove Radix-only props and sizing variables. |
| <code>FormSelect</code> | Its public value remains a string. Preserve <code>name</code>, <code>required</code>, <code>disabled</code>, empty value handling, <code>options</code>, and <code>onValueChange</code>. Do not pass Base UI item objects to the public API. |
| <code>SearchableSelect</code> | Its public API remains string-based: <code>value</code>, <code>options</code>, and <code>onValueChange</code>. Preserve <code>description</code>, <code>keywords</code>, <code>disabled</code>, <code>clearable</code>, <code>emptyMessage</code>, and form <code>name</code>. Do not replace it with an app-local listbox. |
| <code>Tabs</code> | Keep controlled/uncontrolled values, <code>underline</code> and <code>segmented</code> variants, and <code>default</code>/<code>compact</code> sizes. Use <code>Tabs</code> for in-place panels. |
| <code>NavigationTabs</code> | Keep route-backed navigation separate from behavior tabs. Use <code>aria-current="page"</code> for the active route and do not force route links into a panel tab model. |

A controlled <code>SearchableSelect</code> remains conceptually the same:

~~~tsx
<SearchableSelect
  name="provider"
  value={provider}
  options={[
    { value: "aws", label: "Amazon Web Services", keywords: ["cloud"] },
    { value: "gcp", label: "Google Cloud", disabled: false },
  ]}
  onValueChange={setProvider}
  clearable
  aria-label="Provider"
/>
~~~

### 6.5 Checkbox, switch, collapsible, and toast

| Component | Migration action |
| --- | --- |
| <code>Checkbox</code> | Preserve controlled/uncontrolled state, <code>name</code>, <code>value</code>, <code>required</code>, <code>disabled</code>, and keyboard behavior. Keep an explicit label or <code>aria-label</code>. |
| <code>Switch</code> | Preserve controlled/uncontrolled state and form integration. Use the component’s <code>size</code> rather than styling the thumb position manually. |
| <code>Collapsible</code> | Preserve <code>open</code>, <code>defaultOpen</code>, and <code>onOpenChange</code>. The trigger uses Base UI state attributes; do not depend on a manually emitted <code>data-state</code>. |
| <code>ToastProvider</code>, <code>ToastViewport</code>, <code>useToast</code> | Toast is opt-in. Mount one provider and viewport in the desired application boundary, then call <code>useToast</code> from descendants. Do not assume the design system mounts a global toast queue. |

## 7. Semantic token migration

Phase 6 removed the old token aliases from published CSS. Update application
classes and custom CSS to use the canonical vocabulary.

| Old role or utility | v1 role or utility |
| --- | --- |
| <code>background</code>, <code>bg-background</code> | <code>canvas</code>, <code>bg-canvas</code> |
| <code>foreground</code>, <code>text-foreground</code> | <code>text-primary</code>, <code>text-text-primary</code> |
| <code>card</code>, <code>bg-card</code> | <code>surface</code>, <code>bg-surface</code> |
| <code>popover</code>, <code>bg-popover</code> | <code>surface-floating</code>, <code>bg-surface-floating</code> |
| <code>primary</code>, <code>bg-primary</code> | <code>action</code>, <code>bg-action</code> |
| <code>primary-foreground</code>, <code>text-primary-foreground</code> | <code>action-foreground</code>, <code>text-action-foreground</code> |
| <code>secondary</code>, <code>bg-secondary</code> | <code>surface-inverse</code>, <code>bg-surface-inverse</code> |
| <code>secondary-foreground</code>, <code>text-secondary-foreground</code> | <code>text-inverse</code>, <code>text-text-inverse</code> |
| <code>muted</code>, <code>bg-muted</code> | <code>surface-muted</code>, <code>bg-surface-muted</code> |
| <code>muted-foreground</code>, <code>text-muted-foreground</code> | <code>text-supporting</code>, <code>text-text-supporting</code> |
| <code>accent</code> | <code>action</code> |
| <code>accent-hover</code> | <code>action-hover</code> |
| <code>accent-active</code> | <code>action-active</code> |
| <code>accent-background</code> | <code>action-background</code>, or <code>selection-background</code> for selection states |
| <code>accent-foreground</code> | <code>action-foreground</code> |
| <code>destructive</code> | <code>danger</code> |
| <code>border</code>, <code>border-border</code> | <code>border-default</code>, <code>border-border-default</code> |
| <code>input</code>, <code>border-input</code> | <code>control-border</code>, <code>border-control-border</code> |
| <code>ring</code>, <code>ring-ring</code> | <code>focus</code>, <code>ring-focus</code> |
| <code>sidebar</code>, <code>bg-sidebar</code> | <code>sidebar-canvas</code>, <code>bg-sidebar-canvas</code> |
| <code>sidebar-foreground</code>, <code>text-sidebar-foreground</code> | <code>sidebar-primary-text</code>, <code>text-sidebar-primary-text</code> |
| <code>sidebar-accent</code>, <code>bg-sidebar-accent</code> | <code>sidebar-hover</code>, <code>bg-sidebar-hover</code> |
| <code>sidebar-active</code>, <code>bg-sidebar-active</code> | <code>sidebar-active-background</code>, <code>bg-sidebar-active-background</code> |

Use intent when migrating selection, status, inverse, and sidebar styling. For
example, an active table row should use
<code>bg-selection-background</code>, not a generic action background. A
sidebar hover should use <code>bg-sidebar-hover</code>, not
<code>bg-action-background</code>.

Canonical roles include:

- Actions: <code>action</code>, <code>action-foreground</code>,
  <code>action-hover</code>, <code>action-active</code>, and
  <code>action-background</code>.
- Surfaces: <code>surface</code>, <code>surface-muted</code>,
  <code>surface-raised</code>, <code>surface-floating</code>,
  <code>surface-overlay</code>, <code>surface-control</code>, and
  <code>surface-inverse</code>.
- Text: <code>text-primary</code>, <code>text-secondary</code>,
  <code>text-supporting</code>, <code>text-muted</code>,
  <code>text-inverse</code>, and <code>text-link</code>.
- Controls: <code>control-border</code> and <code>focus</code>.
- Selection: <code>selection-background</code>, <code>selection-border</code>,
  <code>selection-indicator</code>, and <code>selection-foreground</code>.
- Sidebar: <code>sidebar-canvas</code>, <code>sidebar-header</code>,
  <code>sidebar-content</code>, <code>sidebar-hover</code>,
  <code>sidebar-active-background</code>,
  <code>sidebar-active-foreground</code>,
  <code>sidebar-active-indicator</code>, <code>sidebar-primary-text</code>,
  <code>sidebar-secondary-text</code>, <code>sidebar-metadata-text</code>,
  <code>sidebar-icon</code>, <code>sidebar-search</code>,
  <code>sidebar-footer</code>, <code>sidebar-group-label</code>,
  <code>sidebar-group-count</code>, <code>sidebar-border</code>, and
  <code>sidebar-focus-ring</code>.

Do not add aliases in the application to hide an incomplete migration. An app
may have product-specific tokens, but shared design-system roles should remain
semantic and should not reintroduce the removed names.

## 8. State selectors and positioning variables

Use the state attributes emitted by the actual component. The common migration
directions are:

| Pre-v1 assumption | v1 direction |
| --- | --- |
| <code>data-state="open"</code> | <code>data-open</code> |
| <code>data-state="closed"</code> | <code>data-closed</code> |
| <code>data-state="active"</code> | <code>data-active</code> or <code>data-selected</code>, depending on the component |
| <code>data-state="checked"</code> | <code>data-checked</code> |
| Manual Collapsible trigger <code>data-state</code> | Base UI <code>data-panel-open</code> |
| Table row selected marker from older implementation | <code>data-selected="true"</code> plus <code>aria-selected</code> |

These are not safe global substitutions. Inspect the rendered element and the
owning wrapper. Application-owned markers such as
<code>data-sidebar-state</code>, route <code>data-active</code>, and
workbench-specific <code>data-selected</code> may remain valid.

Likewise, keep valid Base UI positioning and animation variables when custom
CSS needs them:

- <code>--anchor-width</code>
- <code>--anchor-height</code>
- <code>--available-height</code>
- <code>--transform-origin</code>
- <code>--collapsible-panel-height</code>
- <code>--collapsible-panel-width</code>

Remove <code>--radix-*</code> variables that came from the old implementation,
but do not rename Base UI variables simply because they contain a positioning
concept.

## 9. Native shell and sidebar migration

The shared shell owns layout, responsive behavior, sidebar appearance, focus
styles, and the mobile drawer. The application still owns route data,
permissions, labels, link rendering, active-route calculation, and business
actions.

Prefer the integrated structure for new and migrated shells:

~~~tsx
<AppShell headerLayout="integrated">
  <AppHeader>
    <AppHeaderStart><SidebarTrigger />{/* identity */}</AppHeaderStart>
    <AppHeaderSearch mobileTrigger={mobileSearch}>{search}</AppHeaderSearch>
    <AppHeaderActions>{accountActions}</AppHeaderActions>
  </AppHeader>
  <AppSidebar variant="auto">
    <AppSidebarContent>
      <SidebarNavigation entries={entries} renderLink={renderLink} />
    </AppSidebarContent>
    <AppSidebarFooter>{accountMenu}</AppSidebarFooter>
  </AppSidebar>

  <MainRegion><PageFrame>{children}</PageFrame></MainRegion>
</AppShell>
~~~

Migration rules:

- Prefer <code>variant="auto"</code> when the sidebar should follow light/dark
  application appearance. Use <code>variant="dark"</code> only for a
  deliberately dark navigation identity and <code>variant="light"</code> for a
  deliberately light one.
- Keep <code>SidebarTrigger</code> inside <code>AppHeader</code> or
  <code>TopBar</code>; it must remain
  available when the rail is collapsed or represented as a mobile drawer.
- Replace local light-only <code>--sidebar-*</code> overrides with the canonical
  sidebar utilities or the <code>AppSidebar</code> variant before retaining a
  custom selector.
- Keep app-specific persistence keys separate from the shell’s built-in
  <code>conscia-sidebar-open:v1</code> state unless the application
  intentionally needs to coordinate them.
- Keep <code>renderLink</code> responsible for routing. Do not turn sidebar
  links into buttons just to reproduce an old slot-based composition pattern.
- Convert ordinary navigation sections to explicit
  <code>type: "group"</code> entries. Use <code>type: "submenu"</code> only for
  genuine hierarchy; untyped sections retain their v1 collapsible behavior.
- Keep submenu expansion persistence in the application’s chosen
  <code>SidebarNavigation</code> <code>storageKey</code>; it is distinct from
  the shell’s open state.

## 10. Tests and validation

Run the application’s equivalent of every check below. The design-system
repository uses these commands as its package-level reference:

~~~bash
pnpm test
pnpm typecheck
pnpm typecheck:playground
pnpm lint
pnpm lint:playground
pnpm test:package
pnpm test:consumer
pnpm build:playground
pnpm test:visual
~~~

For an application, replace <code>typecheck:playground</code>,
<code>lint:playground</code>, and <code>build:playground</code> with its own app
build and browser commands. A consumer test that cannot reach the npm registry
is an environment failure, not evidence that the migration passed; record it
separately and validate the packed artifact locally.

### Required behavior checks

At minimum, exercise:

- Button and IconButton keyboard activation, disabled state, accessible name,
  and link composition.
- Dialog and AlertDialog Escape dismissal, outside behavior where applicable,
  focus restoration, title/description semantics, and pending confirmation
  behavior.
- Sheet on desktop and mobile, including swipe dismissal if the app uses touch
  drawers.
- Dropdown menu keyboard navigation, typeahead, disabled items, submenus,
  links, and selection dismissal.
- Select and SearchableSelect controlled values, keyboard selection, disabled
  options, empty state, clear behavior, and form submission.
- Tabs keyboard movement, selected panel association, routed navigation, and
  horizontal overflow.
- Tooltip hover/focus behavior and an independently accessible trigger name.
- Checkbox, Switch, and Collapsible keyboard and controlled/uncontrolled state.
- Toast mounting, timeout, dismissal, and action behavior if the app opts in.
- Sidebar collapse, mobile open/close, focus restoration, appearance variant,
  and no unintended horizontal overflow.
- DataTable selection, sorting, pagination, empty/loading/error states, and
  row-action routing.

### Accessibility checks

Run the app’s accessibility test tool, including representative closed and open
states. At minimum verify:

- Every icon-only action has <code>aria-label</code> or
  <code>aria-labelledby</code>.
- Every form control has an associated label or intentional accessible name.
- Dialog-like surfaces have a title and description when required by the
  component contract.
- Focus is visible and is restored after overlays close.
- Menus, selects, comboboxes, tabs, and disclosures remain keyboard usable.
- Decorative icons, separators, skeletons, and brand marks do not add noisy
  names to the accessibility tree.

### Visual checks

Capture the same key routes before and after the upgrade at desktop and mobile
widths in light, dark, comfortable, compact, and operational density where
used by the application. Compare:

- Surface and text hierarchy.
- Sidebar width, active indicator, hover, and mobile drawer.
- Button, field, popup, dialog, and tooltip spacing.
- Focus rings and invalid states.
- Table row height, selection, overflow, and empty states.
- Typography wrapping and density.

Do not approve a visual difference merely because the old screenshot used a
legacy token. The rendered result should remain equivalent unless the change is
intentional and recorded.

## 11. Agent runbook

Use this sequence for an automated or assisted application migration.

### Step 0 — Prepare

- Create a migration branch.
- Record package, Node, React, and package-manager versions.
- Confirm a clean worktree.
- Save the application’s visual and validation baseline.

**Evidence:** starting commit, dependency output, baseline command output, and
baseline screenshot location.

### Step 1 — Inventory

- Run the searches in Section 4.
- Build a file-by-file migration list.
- Identify direct Radix usage that belongs to the application rather than the
  design system.
- Identify local copied primitives and tests that assert implementation
  details.

**Stop if:** the app’s CSS integration or package owner cannot be identified.

**Evidence:** inventory table with owner, category, intended action, and test.

### Step 2 — Upgrade package integration

- Upgrade the package to the v1 release candidate or <code>1.0.0</code>.
- Keep the correct stylesheet import.
- Confirm the root appearance and density attributes render in the first
  document response or are handled by the existing bootstrap strategy.
- Run install, typecheck, and the smallest app build.

**Evidence:** lockfile diff, CSS entrypoint, and build output.

### Step 3 — Migrate composition

- Replace <code>asChild</code> with documented <code>render</code> usage.
- Remove local <code>Slot</code> wrappers when they only existed for
  <code>asChild</code>.
- Convert icon-only actions to <code>IconButton</code> and add accessible
  names.
- Verify custom render hosts forward refs and received props.

**Stop if:** a custom host does not support ref/property forwarding. Use a
normal native host or implement the application-owned host correctly before
continuing.

**Evidence:** changed call sites and keyboard/focus test results.

### Step 4 — Migrate styling

- Replace legacy utility names with canonical roles using the table in Section
  7.
- Replace raw legacy token references in CSS and tests.
- Replace sidebar aliases with canonical sidebar roles or
  <code>AppSidebar</code> variants.
- Review each selection, status, inverse, and sidebar use for intent.

**Evidence:** source search showing no legacy application utilities and visual
comparison for the affected routes.

### Step 5 — Migrate behavior-heavy call sites

In dependency order, update:

1. Dialog, AlertDialog, Sheet, and confirmation flows.
2. Dropdown menus and navigation menus.
3. Select, FormSelect, and SearchableSelect.
4. Tabs and routed NavigationTabs.
5. Tooltip.
6. Checkbox, Switch, and Collapsible.
7. Toast if the application opts in.

After each family, run focused behavior and accessibility checks. Do not
rewrite the app’s business state management unless the old code depended on a
Radix-only implementation detail.

**Evidence:** family checklist, focused tests, and screenshots.

### Step 6 — Migrate composed patterns

- Update <code>AppShell</code>, <code>AppSidebar</code>, and
  <code>SidebarNavigation</code> call sites.
- Update <code>DataTable</code> and <code>EntityTable</code> composition.
- Update <code>ConfirmationDialog</code>, <code>CommandPalette</code>,
  <code>FilterBar</code>, and other shared patterns as used.
- Remove local copies only after the package replacement is tested.

**Evidence:** route-level tests, keyboard checks, and responsive screenshots.

### Step 7 — Clean dependencies and assertions

- Remove direct Radix packages only when no app source or package-owned module
  imports them.
- Remove stale <code>@base-ui/react</code> direct imports unless the app
  deliberately has an independent Base UI use case.
- Rewrite source-regex tests that expected old Radix/shadcn code as behavior,
  accessibility, or package-contract tests.
- Do not delete tests just because their assertions fail after migration.

**Evidence:** dependency graph, source search, and test diff.

### Step 8 — Final validation and handoff

- Run all commands in Section 10.
- Run two consecutive clean visual suites.
- Review the final diff for generated files, token aliases, copied component
  source, and unrelated product changes.
- Record known environment limitations separately from code failures.
- Commit the migration with a clear message and link the evidence in the app’s
  migration record.

**Definition of done:** package integration, composition, styling, behavior,
accessibility, responsive layout, visual comparison, and dependency cleanup are
all evidenced; no required migration item is left as an unexplained failure.

## 12. Troubleshooting

### TypeScript errors around render

<code>render</code> targets must satisfy the Base UI composition contract. Check
that the target is a single React element, accepts the received props, and
forwards the ref to the actual interactive DOM element. If it is just a link,
use <code>render={&lt;a href="..." /&gt;}</code> directly.

### A class stopped applying after the upgrade

The old alias may no longer be generated. Search for the old utility in the
application source, replace it with the canonical role, and verify that the
application imports <code>tailwind.css</code> in the expected global stylesheet.
Do not add the old class back as a local alias.

### A popup has the wrong width or max height

Do not restore <code>--radix-*</code> variables. Use the component’s current
Conscia classes and valid Base UI variables such as <code>--anchor-width</code>
and <code>--available-height</code>. Check the popup’s
<code>Positioner</code>/<code>Popup</code> owner before adding a local rule.

### A custom selector stopped matching an open component

Inspect the rendered element. Base UI state attributes are not universally
identical across families. Use <code>data-open</code>,
<code>data-closed</code>, <code>data-active</code>, <code>data-selected</code>,
<code>data-checked</code>, <code>data-highlighted</code>, or
<code>data-panel-open</code> only where the owning component emits that
attribute.

### A tooltip is the only accessible name

Add an accessible name to the trigger itself. For icon-only controls, use
<code>IconButton aria-label="..."</code>; keep the tooltip as supplementary
guidance.

### Consumer verification cannot reach npm

Record the registry/DNS failure separately. First validate the packed artifact
locally with the design-system package’s package verification command, then
rerun the isolated consumer test when registry access is restored. Do not mark
the code migration complete solely because the command was interrupted.

## 13. Migration record template

Copy this section into the application’s engineering record or pull request:

~~~md
## Design-system v1 migration evidence

- Package before:
- Package after:
- Migration branch:
- Starting commit:
- Completion commit:
- CSS integration:
- Root appearance/density integration:
- Direct Radix usage remaining (with reason):
- Direct Base UI usage remaining (with reason):
- asChild usage remaining:
- Legacy token utilities remaining:
- Components migrated:
- Patterns migrated:
- Accessibility checks:
- Visual routes and states:
- Validation commands:
- Known environment limitations:
- Follow-up decisions:
~~~

## 14. Final release checklist

Before upgrading production applications to <code>1.0.0</code>, confirm:

- [ ] The application uses the correct v1 package and stylesheet entrypoint.
- [ ] No <code>asChild</code> or copied shadcn component source remains in
      migrated app code.
- [ ] All custom render hosts forward refs and received props.
- [ ] Legacy token utilities and raw legacy variables are gone from app-owned
      source and CSS.
- [ ] Sidebar overrides use canonical roles or an explicit sidebar variant.
- [ ] Dialogs, menus, selects, comboboxes, tabs, tooltips, checkboxes,
      switches, collapsibles, sheets, and toasts used by the app pass behavior
      and keyboard checks.
- [ ] Forms submit expected values, including string-based Select and
      SearchableSelect fields.
- [ ] Focus restoration and accessible names are verified for overlays and
      icon-only actions.
- [ ] Desktop/mobile light/dark/density visual comparisons pass.
- [ ] The application’s full test, lint, typecheck, build, accessibility, and
      browser suites pass.
- [ ] Any environment limitation is documented separately from code results.
- [ ] The application owner has reviewed product-specific visual exceptions.
