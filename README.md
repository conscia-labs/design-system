# Conscia Design System

The shared React component library for clear, consistent, and accessible Conscia
product experiences.

`@conscia-labs/design-system` provides semantic design tokens, reusable
primitives, and product patterns for operational applications.

> **Package:** available publicly as [`@conscia-labs/design-system`](https://www.npmjs.com/package/@conscia-labs/design-system).
>
> **Current release:** `1.1.2` is the latest stable v1 release.
>
> **Documentation:** browse the [live design system](https://conscia-labs.github.io/design-system/)
> for the complete component reference, examples, and usage guidance.

## Install

```bash
pnpm add @conscia-labs/design-system
```

The package requires React 19 and React DOM 19. Tailwind CSS 4 is optional for
consumers that use the Tailwind integration.

## Quick start

Import public components from the package root:

```tsx
import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
} from "@conscia-labs/design-system";

export function ConnectionForm() {
  return (
    <form className="grid gap-5">
      <Field>
        <FieldLabel htmlFor="connection-name">Name</FieldLabel>
        <Input id="connection-name" name="name" />
        <FieldDescription>Use a name operators will recognize.</FieldDescription>
      </Field>
      <Button type="submit">Create connection</Button>
    </form>
  );
}
```

Use the [component reference](https://conscia-labs.github.io/design-system/components/)
for complete anatomy, options, states, and examples.

## Styles and preferences

Tailwind CSS 4 applications import the integration once from their global
stylesheet:

```css
@import "tailwindcss";
@import "@conscia-labs/design-system/tailwind.css";
```

Applications that do not run Tailwind should use the precompiled bundle instead:

```css
@import "@conscia-labs/design-system/standalone.css";
```

Do not import `standalone.css` in a Tailwind application. Its preflight and
utilities would compete with the application's generated CSS.

Set shared appearance and density preferences on the document root:

```tsx
<html
  lang="en"
  data-appearance="system"
  data-density="comfortable"
  suppressHydrationWarning
>
```

Appearance values are `light`, `dark`, and `system`. Density values are
`comfortable`, `compact`, and `operational`.

Use semantic Conscia tokens and utilities rather than copying palette values
into an application. See the [foundation documentation](https://conscia-labs.github.io/design-system/foundation/)
for the token contract.

## Choose the right level

- Use **patterns** for recurring product workflows such as application shells,
  page composition, data tables, dashboards, resource details, and workbenches.
- Use **primitives** for application-specific compositions such as buttons,
  fields, inputs, selects, dialogs, sheets, tabs, tables, badges, and states.
- Keep routing, authentication, permissions, data fetching, mutations, and
  business-specific validation in the product application.

The [pattern catalog](https://conscia-labs.github.io/design-system/patterns/),
[component catalog](https://conscia-labs.github.io/design-system/components/),
and [machine-readable inventory](https://conscia-labs.github.io/design-system/agent-manifest.json)
cover the complete public surface.

## Public entrypoints

```text
@conscia-labs/design-system            Components and public composition
@conscia-labs/design-system/foundation Semantic tokens and foundation exports
@conscia-labs/design-system/patterns   Reusable product patterns
@conscia-labs/design-system/primitives Primitive components and anatomy
@conscia-labs/design-system/utils       Shared utilities
```

The package also exports `tailwind.css`, `standalone.css`, `foundation.css`,
`styles.css` (compatibility), `agent-guide.md`, `agent-manifest.json`, and
`package.json`.

## Accessibility and composition

Interactive controls require an accessible name, visible focus, and keyboard
behavior appropriate to their role. Use the documented field anatomy for labels,
descriptions, and errors. When a popup is nested inside a modal surface, use the
documented `modal={false}` option where supported.

The library uses Base UI internally for behavior-heavy components. Consumers
should import the design-system API and should not install Base UI, Radix, or
copied shadcn component source to reproduce its internals.

## Upgrading to v1

Version 1 is a clean API and implementation break. Component concepts and public
names remain recognizable, but old Radix/shadcn implementation details are not
part of the contract:

- Use the documented `render` prop instead of the removed `asChild` API.
- Use Conscia semantic token roles instead of legacy utilities such as
  `bg-primary`, `bg-muted`, and `border-input`.
- Do not add `@base-ui/react`, `@radix-ui/*`, or copied shadcn components to the
  application.
- Recheck dialogs, sheets, menus, selects, forms, tables, and icon-only actions
  against the application's keyboard and accessibility tests.

Read the complete [v1 migration guide](https://github.com/conscia-labs/design-system/blob/main/docs/design-system-v1-migration.md)
for the API and application-owner runbook.

## Agent support

Install the package-local guidance into an application's `AGENTS.md`:

```bash
pnpm exec conscia-design-system init-agents
```

Preview the managed block without writing a file:

```bash
pnpm exec conscia-design-system init-agents --dry-run
```

The installed [`AGENT_GUIDE.md`](https://conscia-labs.github.io/design-system/agent-guide.md)
is version-matched to the package. The live playground also publishes
[`llms.txt`](https://conscia-labs.github.io/design-system/llms.txt) and the
[agent manifest](https://conscia-labs.github.io/design-system/agent-manifest.json).

## Documentation and maintenance

- [Live design system](https://conscia-labs.github.io/design-system/)
- [Foundation and tokens](https://conscia-labs.github.io/design-system/foundation/)
- [Component catalog](https://conscia-labs.github.io/design-system/components/)
- [Pattern catalog](https://conscia-labs.github.io/design-system/patterns/)
- [Migration guide](https://github.com/conscia-labs/design-system/blob/main/docs/design-system-v1-migration.md)
- [Changelog](https://github.com/conscia-labs/design-system/blob/main/CHANGELOG.md)
- [Contributing and releases](./CONTRIBUTING.md)

The repository's `playground` contains the executable documentation site. Run it
locally with `pnpm dev:playground`; the static site is published to GitHub Pages
by the version-tag release workflow.

## License

MIT
