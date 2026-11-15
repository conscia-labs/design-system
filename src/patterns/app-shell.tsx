/**
 * The application shell. The parts live in the app-shell-* files beside this
 * one: state, sidebar, navigation, header, and page frame.
 */
export {
  AppShell,
  useAppShell,
  type AppShellProps,
} from "./app-shell-state";
export {
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
  BrandLockup,
  ProductIdentity,
  SidebarSeparator,
  SidebarSearch,
  SidebarTrigger,
  type BrandLockupProps,
} from "./app-shell-sidebar";
export {
  NavigationGroup,
  NavigationItem,
  NavigationSubItem,
  NavigationSubList,
  type NavigationItemProps,
  type NavigationSubItemProps,
} from "./app-shell-navigation";
export {
  AppHeader,
  AppHeaderActions,
  AppHeaderBrand,
  AppHeaderSearch,
  AppHeaderStart,
  AppHeaderTitle,
  MainRegion,
  TopBar,
  type AppHeaderProps,
  type AppHeaderSearchProps,
  type AppHeaderTitleProps,
  type TopBarProps,
} from "./app-shell-header";
export {
  InspectorRegion,
  PageBoundary,
  PageContent,
  PageFrame,
} from "./app-shell-frame";
