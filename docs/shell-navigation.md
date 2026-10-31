# Shell and navigation

The preferred Conscia shell uses `headerLayout="integrated"`. `AppHeader`
spans the viewport, and the sidebar starts below it. Compose global identity
and context in `AppHeaderStart`, global search in `AppHeaderSearch`, and utility
or account actions in `AppHeaderActions`. Search requires a mobile trigger so
the capability remains available when the desktop field is hidden.

## A header that follows the mood

`headerLayout="auto"` is integrated without a mood and split under balanced
or airy: the sidebar runs the full height of the window with the brand at its
top, and the header becomes a transparent row in the content column for
breadcrumbs, search, notifications, help, and the account menu. One
composition serves both, so put the brand in two places and let each show
where it belongs:

```tsx
<AppShell headerLayout="auto">
  <AppSidebar>
    <AppSidebarHeader>{/* brand, workspace switcher */}</AppSidebarHeader>
    <AppSidebarContent>{/* SidebarNavigation */}</AppSidebarContent>
    <AppSidebarFooter>{/* settings */}</AppSidebarFooter>
  </AppSidebar>
  <MainRegion>
    <AppHeader>
      <AppHeaderStart>
        <SidebarTrigger />
        <AppHeaderBrand>{/* brand */}</AppHeaderBrand>
        <AppHeaderTitle title="Sources">{/* breadcrumbs */}</AppHeaderTitle>
      </AppHeaderStart>
      <AppHeaderSearch mobileTrigger={/* search icon */}>{/* search */}</AppHeaderSearch>
      <AppHeaderActions>{/* help, notifications, account */}</AppHeaderActions>
    </AppHeader>
    <PageFrame>{/* page */}</PageFrame>
  </MainRegion>
</AppShell>
```

| Part | Integrated (no mood) | Split (balanced, airy) |
| --- | --- | --- |
| `AppHeader` | Fixed across the window, bordered bar | Sticky in the content column, transparent until the page scrolls |
| `AppSidebarHeader` | Hidden on desktop; shown in the drawer | Top of the full-height sidebar, lined up with the header |
| `AppHeaderBrand` | Shown | Shown only below `lg`, while the sidebar is a drawer |
| `AppHeaderTitle` | Shows its children | Shows its children, then the page title once the page heading scrolls under the header |

The mood decides how the scrolled header looks: a frosted band in current and
balanced, a floating pill in airy. `AppHeader variant` is `auto` by default
(a bar where integrated, transparent where split); set `bar` or
`transparent` to fix it. Inside a split shell the header lines up with
`--ds-frame-padding-x`; set that variable on the header if your pages use
different padding. `AppHeader` must sit directly inside `MainRegion` for the
split placement.

`headerLayout="integrated"` and `"split"` hold in every mood, for products
that want one shell everywhere. Without a mood, `auto` renders the same as
`integrated`, so moving to it changes nothing until a mood is set.

Use `SidebarNavigationGroup` (`type: "group"`) for ordinary navigation. Its
label is a quiet, non-interactive section heading and its destinations remain
visible. Only the active leaf receives the active background and stronger
foreground; focus remains a separate ring.

Use `SidebarNavigationSubmenu` (`type: "submenu"`) only for genuine nested
hierarchy or unusually long groups. Submenus own disclosure, optional default
open state, persisted expansion, and collapsed flyouts. Their triggers never
look like the active destination.

## Floating workspace

For overview-led products, pair a mood's floating sidebar with a split shell
so the sidebar runs the full height of the window. The brand moves into the
sidebar header, and the page either has no header or a borderless one:

```tsx
<html data-mood="airy">
  <AppShell headerLayout="split" sidebarLayout="floating">
    <AppSidebar>
      <AppSidebarHeader>
        <ProductIdentity icon={<BrandIcon />} label="Conscia" description="Production" />
      </AppSidebarHeader>
      <AppSidebarContent>{/* SidebarNavigation */}</AppSidebarContent>
      <AppSidebarFooter>{/* account */}</AppSidebarFooter>
    </AppSidebar>
    <MainRegion>
      <AppHeader variant="transparent">{/* SidebarTrigger, AppHeaderBrand, search, account */}</AppHeader>
      <PageFrame>{/* page */}</PageFrame>
    </MainRegion>
  </AppShell>
```

A transparent `AppHeader` has no border or blur at rest and lines up with the
page frame; `TopBar variant="plain"` still works but has no scrolled state.
Without any header, keep an `AppHeader variant="transparent"
className="lg:hidden"` with a `SidebarTrigger` and `AppHeaderBrand` so the
mobile drawer stays reachable, and put the desktop trigger beside the page
title. The playground shows all three header options at
`/examples/floating-workspace`.

Existing split shells (`TopBar` plus `AppSidebarHeader`) and untyped collapsible
sections remain supported in v1. Migrate by introducing the integrated header,
then converting ordinary sections to explicit groups. The
`--sidebar-active-indicator` token remains defined for compatibility but is no
longer consumed by shared navigation.

Applications continue to own routes, permissions, active-route calculation,
search behavior, context switching, account menus, and destination content.
