# Shell and navigation

The preferred Conscia shell uses `headerLayout="integrated"`. `AppHeader`
spans the viewport, and the sidebar starts below it. Compose global identity
and context in `AppHeaderStart`, global search in `AppHeaderSearch`, and utility
or account actions in `AppHeaderActions`. Search requires a mobile trigger so
the capability remains available when the desktop field is hidden.

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
      <TopBar variant="plain">{/* SidebarTrigger, search, account */}</TopBar>
      <PageFrame>{/* page */}</PageFrame>
    </MainRegion>
  </AppShell>
```

`TopBar variant="plain"` drops the border and blur and lines up with the page
frame. Without any header, keep a `TopBar variant="plain"` with a
`SidebarTrigger` below the `lg` breakpoint so the mobile drawer stays
reachable, and put the desktop trigger beside the page title. The playground
shows all three header options at `/examples/floating-workspace`.

Existing split shells (`TopBar` plus `AppSidebarHeader`) and untyped collapsible
sections remain supported in v1. Migrate by introducing the integrated header,
then converting ordinary sections to explicit groups. The
`--sidebar-active-indicator` token remains defined for compatibility but is no
longer consumed by shared navigation.

Applications continue to own routes, permissions, active-route calculation,
search behavior, context switching, account menus, and destination content.
