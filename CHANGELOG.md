# Changelog

## Unreleased

## 1.0.3 - 2026-08-31

- Fix nested Select, FormSelect, SearchableSelect, Popover, and DropdownMenu
  overlays inside Dialog and Sheet surfaces by forwarding nested-safe modal
  behavior and applying the shared overlay hierarchy to portal Positioners.
- Add browser and unit regression coverage for nested modal composition,
  keyboard and pointer selection, focus restoration, form submission, portal
  placement, and popup layering.

## 1.0.2 - 2026-08-31

- Improve labeled switch spacing by widening the text track and insetting the
  ON/OFF or ENABLED/DISABLED labels away from the outer edges.

## 1.0.1 - 2026-08-31

- Add the path-free, theme-aware `BrandWordmark` primitive using the canonical
  no-tagline Conscia vector geometry, with shared exports, documentation,
  playground coverage, and accessible naming behavior.
- Add the opt-in `LabeledSwitch` variant for text-in-track ON/OFF or
  ENABLED/DISABLED states while preserving the compact default switch.
- Add the `LoadingButton` primitive for pending async actions, including stable
  button content, a small spinner, disabled state, and `aria-busy` semantics.

## 0.4.0 - 2026-08-15

- Add an opt-in `operational` density preset for admin, chat, catalog,
  connector, and workspace-like interfaces, with compact typography and
  spacing tokens that leave the comfortable default unchanged.
- Expose token-backed `ds-type-*` typography utilities for display, page,
  section, body, metadata, navigation, controls, labels, cards, and tables.
- Align shared buttons, inputs, menus, fields, cards, tables, page headers,
  navigation, and resource patterns with the operational hierarchy while
  preserving existing component APIs and semantic color roles.
- Add reusable Workbench shell, rail, section, resource-row, and inspector
  primitives for multi-surface operational layouts, including responsive
  mobile behavior and shared surface/focus semantics.
- Expand documentation, playground fixtures, tests, and packaged CSS coverage
  for the new typography and Workbench patterns.

## 0.3.5 - 2026-08-14

- Soften the dark canvas and rebalance shared text roles for more comfortable
  long-form reading without changing the light theme or Conscia brand colors.
- Clarify the dark surface ladder across cards, raised controls, floating
  surfaces, and overlays, including calmer borders, shadows, and selection
  treatment.
- Preserve the existing sidebar identity while allowing inputs and shared
  controls to inherit the revised dark surface hierarchy.
- Add dark foundation contrast and hierarchy assertions plus a playground
  reading-surface fixture.

## 0.3.4 - 2026-08-14

- Replace the shared Inter variable font with Source Sans 3 and normalize the
  global type weight ladder to 400 / 500 / 600.
- Refine sidebar section labels to be smaller, more weighted, and less tracked
  while preserving existing sidebar APIs and semantic colors.
- Audit button variant foregrounds across themes and use the existing dark
  danger surface/foreground pair for destructive actions.
- Add the theme-aware `BrandIcon` primitive using the supplied Conscia symbol
  mark, with accessible naming support and a published-package-safe inline SVG.

## 0.3.3 - 2026-08-14

- Add shared display typography, TopBar padding, and sidebar rhythm tokens while
  preserving the existing font family, color roles, and component APIs.
- Refine sidebar section labels to use a restrained shared size, line-height,
  weight, tracking, and group/list spacing.
- Normalize normal input and textarea text/placeholder typography and document
  the intended shared hierarchy for display, page, section, body, metadata, and
  menu labels.
- Expand tests and playground coverage for topbar actions, sidebar states,
  primary button foregrounds, input typography, focus visibility, and the
  light/dark responsive shell.

## 0.3.2 - 2026-08-13

- Add the theme-aware `surface-control` and `surface-control-hover` semantic
  surfaces for form controls and outline buttons. Light mode uses the existing
  muted and raised surfaces; dark mode uses the existing raised and muted
  surfaces to improve control separation and interaction feedback.
- Update `Input`, `Textarea`, `SelectTrigger`, and `Button variant="outline"`
  to use the shared control-surface hierarchy instead of blending into the
  surrounding card or canvas surface.
- Audit both light and dark themes to preserve the existing palette while
  improving visual contrast, focus visibility, and control affordance clarity.
- Document the new semantic control surfaces and add regression coverage for
  theme resolution, primitive mappings, packaged CSS, and the production
  consumer build.

## 0.3.1 - 2026-08-13

- Replace the unloaded proprietary `Saans` reference with the open-source
  Inter variable font dependency under the SIL Open Font License 1.1. The
  shared CSS entry now loads the variable family with weights 100–900.
- Align sidebar section labels to the shared field-label size token for
  improved readability and cross-system consistency.
- Add a shared `--ds-topbar-height` chrome contract and alias the historical
  sidebar header height to it so topbar and sidebar header geometry stays
  aligned at 56px.
- Clarify that `SidebarTrigger` belongs in `TopBar`, keeping the collapse
  control available when the sidebar is collapsed or opened as a mobile
  drawer.
- Keep the collapse trigger visible in light mode by using the shared topbar
  surface and foreground semantics rather than dark-sidebar-only tokens.
- Expand documentation and regression coverage for typography loading, topbar
  alignment, sidebar labels, focus states, and the shared shell APIs.

## 0.3.0

- Add semantic sidebar surface, text, icon, group, search, footer, and focus
  aliases while preserving the legacy `sidebar-*` variables.
- Add backwards-compatible `AppSidebar` `variant="light" | "dark" | "auto"`
  support. The default remains `dark`; `auto` follows the active light/dark
  appearance.
- Refresh shared sidebar geometry and interaction states, including mobile
  sizing, collapsed navigation focus, active indicators, and footer/header
  surface separation.
- Add the reusable `SidebarSearch` composition and `NavigationGroup` counts.
- Add behavioral coverage for sidebar variants, navigation states, keyboard
  expansion, search focus, mobile drawers, and the auto-variant playground
  fixture.

### Beacon migration

Beacon can remove the light-only variable block from
`apps/web/src/app/globals.css` and opt its shared shells into
`<AppSidebar variant="auto">`. Its routing, conversation filtering, account
menu, and row action code should remain application-owned. The existing
chat/admin descendant opacity and surface classes can then be simplified to
the shared `sidebar-*` semantic utilities as those shells are migrated.
Status-colored Beacon product surfaces should be migrated separately to the
shared `success-*`, `warning-*`, and `danger-*` roles; the Microsoft sign-in
mark and assistant identity accents are brand/identity artwork rather than
operational status and should remain product-owned.
