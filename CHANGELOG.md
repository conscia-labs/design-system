# Changelog

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
