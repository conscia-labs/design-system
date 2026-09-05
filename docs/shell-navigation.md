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

Existing split shells (`TopBar` plus `AppSidebarHeader`) and untyped collapsible
sections remain supported in v1. Migrate by introducing the integrated header,
then converting ordinary sections to explicit groups. The
`--sidebar-active-indicator` token remains defined for compatibility but is no
longer consumed by shared navigation.

Applications continue to own routes, permissions, active-route calculation,
search behavior, context switching, account menus, and destination content.
