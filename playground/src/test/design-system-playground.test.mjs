import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("appearance and density are controlled through root attributes", () => {
  const preferences = read("../components/design-preferences.tsx");
  const sharedControls = read("../../../src/patterns/preference-controls.tsx");
  const sharedPreferences = read("../../../src/foundation/preferences.ts");
  const themeScript = read("../components/theme-script.tsx");
  const styles = read("../../../src/foundation/styles.css");

  assert.match(styles, /@import "@fontsource-variable\/source-sans-3\/index\.css";/);
  assert.match(styles, /--font-sans: "Source Sans 3 Variable"/);
  assert.match(preferences, /DesignPreferenceControls/);
  assert.match(sharedControls, /document\.documentElement/);
  assert.match(sharedPreferences, /dataset/);
  assert.match(themeScript, /dataset\.appearance/);
  assert.match(themeScript, /dataset\.density/);
  assert.match(styles, /:root\[data-density="compact"\]/);
  assert.match(sharedControls, /DENSITY_KEY,\s*"comfortable"/);
  assert.match(themeScript, /\|\| "comfortable"/);
  assert.match(styles, /:root\[data-appearance="dark"\]/);
  assert.match(styles, /--ds-control-height/);
  assert.match(styles, /--ds-row-height/);
  assert.match(styles, /--ds-sidebar-width-mobile: 18rem;/);
  assert.match(styles, /--ds-topbar-height: 3\.5rem;/);
  assert.match(styles, /--ds-topbar-padding-x: 0\.75rem;/);
  assert.match(styles, /--ds-topbar-padding-x-wide: 1rem;/);
  assert.match(styles, /--ds-sidebar-header-height: var\(--ds-topbar-height\);/);
  assert.match(styles, /--ds-sidebar-group-label-size: 0\.75rem;/);
  assert.match(styles, /--ds-sidebar-group-label-line-height: 1rem;/);
  assert.match(styles, /--ds-display-title: clamp\(2rem, 4vw, 3\.5rem\);/);
});

test("playground footer controls do not clip in the collapsed desktop rail", () => {
  const shell = read("../components/app-shell.tsx");

  assert.match(
    shell,
    /DesignPreferenceControls className="group-data-\[sidebar-state=collapsed\]\/shell:hidden"/,
  );
});

test("page titles use comfortable defaults with an explicit compact option", () => {
  const styles = read("../../../src/foundation/styles.css");
  const pageHeader = read("../../../src/patterns/page-header.tsx");

  assert.match(styles, /--ds-page-title: 1\.75rem;/);
  assert.match(
    styles,
    /:root\[data-density="compact"\][\s\S]*--ds-page-title: 1\.5rem;/,
  );
  assert.match(pageHeader, /text-\[length:var\(--ds-page-title\)\]/);
});

test("Conscia green separates secondary brand expression from operational success", () => {
  const styles = read("../../../src/foundation/styles.css");
  const foundation = read("../app/foundation/page.tsx");

  for (const token of [
    "--brand-secondary:",
    "--brand-secondary-background:",
    "--brand-secondary-border:",
    "--success:",
    "--success-background:",
  ]) {
    assert.match(styles, new RegExp(token));
  }

  assert.match(foundation, /Secondary brand · restrained supporting expression/);
});

test("appearance preference supports light, dark, system, persistence, and system sync", () => {
  const sharedControls = read("../../../src/patterns/preference-controls.tsx");
  const sharedPreferences = read("../../../src/foundation/preferences.ts");

  assert.match(sharedPreferences, /appearanceOptions: ConsciaAppearance\[\] = \["light", "dark", "system"\]/);
  assert.match(sharedControls, /values=\{appearanceOptions\}/);

  assert.match(sharedControls, /APPEARANCE_KEY = "conscia-appearance:v1"/);
  assert.match(sharedControls, /allowedValues\.includes/);
  assert.match(sharedControls, /localStorage\.getItem\(key\)/);
  assert.match(sharedControls, /localStorage\.setItem\(key, value\)/);
  assert.match(sharedControls, /matchMedia\("\(prefers-color-scheme: dark\)"\)/);
  assert.match(sharedPreferences, /root\.classList\.toggle\("dark"/);
  assert.match(sharedControls, /PREFERENCE_EVENT = "conscia-preferences"/);
  assert.match(sharedControls, /window\.addEventListener\(PREFERENCE_EVENT/);
});

test("AI Models reference pattern renders required gateway terminology", () => {
  const pattern = read("../components/ai-models-resource-list.tsx");

  for (const term of ["AI Model", "Available Through", "Preferred Provider", "Capabilities", "Availability"]) {
    assert.match(pattern, new RegExp(term));
  }

  assert.doesNotMatch(pattern, /provider-native/i);
});

test("AI Models reference pattern keeps selection controls in the toolbar footprint", () => {
  const pattern = read("../components/ai-models-resource-list.tsx");

  assert.match(pattern, /bulkActions=\{/);
  assert.match(pattern, /aria-hidden=\{selectedIds\.size === 0\}/);
  assert.match(pattern, /"invisible flex items-center gap-2/);
  assert.match(pattern, /0 selected/);
  assert.match(pattern, /tabIndex=\{-1\}/);
});

test("playground consumes shared design-system exports", () => {
  const pattern = read("../components/ai-models-resource-list.tsx");
  const primitives = read("../app/primitives/page.tsx");
  const shell = read("../components/app-shell.tsx");

  assert.match(pattern, /from "@conscia-labs\/design-system"/);
  assert.match(primitives, /from "@conscia-labs\/design-system"/);
  assert.match(shell, /from "@conscia-labs\/design-system"/);
  assert.doesNotMatch(primitives, /function Button/);
});

test("semantic badge variants are available", () => {
  const badge = read("../../../src/primitives/badge.tsx");

  for (const variant of ["neutral", "information", "success", "warning", "danger", "accent"]) {
    assert.match(badge, new RegExp(`${variant}:`));
  }
});

test("button variants and sizes preserve ShadCN-style variant architecture", () => {
  const button = read("../../../src/primitives/button.tsx");

  for (const variant of ["default", "secondary", "outline", "ghost", "destructive", "link"]) {
    assert.match(button, new RegExp(`${variant}:`));
  }
  for (const size of ["sm", "default", "lg", "icon"]) {
    assert.match(button, new RegExp(`${size}:`));
  }
  assert.match(button, /@radix-ui\/react-slot/);
  assert.match(button, /default:[\s\S]*text-primary-foreground/);
  assert.match(button, /outline:[\s\S]*bg-surface-control/);
  assert.match(button, /hover:bg-surface-control-hover/);
});

test("brand icon uses the published Conscia symbol and shared exports", () => {
  const brandIcon = read("../../../src/primitives/brand-icon.tsx");
  const primitives = read("../../../src/primitives/index.ts");
  const foundationPage = read("../app/foundation/page.tsx");

  assert.match(primitives, /\.\/brand-icon/);
  assert.match(brandIcon, /viewBox="0 0 240 240"/);
  assert.match(brandIcon, /fill=\"currentColor\"/);
  assert.match(brandIcon, /dark:text-white/);
  assert.match(foundationPage, /BrandIcon/);
});

test("field pattern owns help, error, disabled-compatible rhythm", () => {
  const field = read("../../../src/primitives/field.tsx");
  const input = read("../../../src/primitives/input.tsx");
  const select = read("../../../src/primitives/select.tsx");
  const textarea = read("../../../src/primitives/textarea.tsx");
  const foundation = read("../../../src/foundation/styles.css");
  const primitives = read("../app/primitives/page.tsx");

  assert.match(field, /FieldGroup/);
  assert.match(field, /FieldError/);
  assert.match(field, /--ds-field-gap/);
  assert.match(foundation, /--ds-field-control-height: 2\.75rem/);
  assert.match(input, /--ds-field-control-height/);
  assert.match(input, /bg-surface-control/);
  assert.match(input, /text-sm leading-5/);
  assert.match(input, /placeholder:text-sm placeholder:leading-5/);
  assert.match(select, /--ds-field-control-height/);
  assert.match(select, /bg-surface-control/);
  assert.match(select, /text-sm leading-5/);
  assert.match(textarea, /--ds-field-control-radius/);
  assert.match(textarea, /bg-surface-control/);
  assert.match(textarea, /text-sm leading-5/);
  assert.match(primitives, /aria-invalid/);
  assert.match(primitives, /disabled defaultValue/);
});

test("control surfaces preserve separation across light and dark themes", () => {
  const styles = read("../../../src/foundation/styles.css");

  assert.match(styles, /--surface-control: var\(--surface-muted\);/);
  assert.match(styles, /--surface-control-hover: var\(--surface-raised\);/);
  assert.match(
    styles,
    /:root\.dark,[\s\S]*--surface-control: var\(--surface-raised\);[\s\S]*--surface-control-hover: var\(--surface-muted\);/,
  );
  assert.match(styles, /--color-surface-control: var\(--surface-control\);/);
  assert.match(
    styles,
    /--color-surface-control-hover: var\(--surface-control-hover\);/,
  );
});

test("tabs separate routed navigation from layered content and mode switching", () => {
  const tabs = read("../../../src/primitives/tabs.tsx");
  const foundation = read("../../../src/foundation/styles.css");
  const primitives = read("../app/primitives/page.tsx");

  assert.match(tabs, /underline/);
  assert.match(tabs, /segmented/);
  assert.match(tabs, /NavigationTabs/);
  assert.match(tabs, /aria-current=\{active \? "page" : undefined\}/);
  assert.match(tabs, /px-\[var\(--ds-tab-padding-x\)\]/);
  assert.match(tabs, /hover:bg-surface-muted/);
  assert.match(tabs, /after:bg-selection-indicator/);
  assert.match(tabs, /ResizeObserver/);
  assert.match(tabs, /scrollIntoView/);
  assert.match(tabs, /data-scroll-position/);
  assert.match(foundation, /--ds-tab-rail-height: 2\.75rem/);
  assert.match(foundation, /--ds-tab-padding-x: 0\.875rem/);
  assert.match(foundation, /mask-image: linear-gradient/);
  assert.match(primitives, /NavigationTabs aria-label="Resource sections"/);
  assert.match(primitives, /variant="segmented"/);
});

test("table states are stable for selected and hover rows", () => {
  const table = read("../../../src/primitives/table.tsx");
  const dataTable = read("../../../src/patterns/data-table.tsx");
  const entityTable = read("../../../src/patterns/entity-table.tsx");
  const primitives = read("../app/primitives/page.tsx");

  assert.match(table, /hover:bg-surface-muted/);
  assert.match(table, /data-\[state=selected\]:bg-accent-background/);
  assert.match(dataTable, /Checkbox/);
  assert.match(dataTable, /aria-label/);
  assert.match(entityTable, /DataTable/);
  assert.match(entityTable, /onRowClick/);
  assert.match(primitives, /data-state="selected"/);
});

test("page toolbar reserves a stable shared footprint for bulk actions", () => {
  const toolbar = read("../../../src/patterns/page-toolbar.tsx");

  assert.match(toolbar, /lg:grid-cols-\[minmax\(0,1fr\)_auto\]/);
  assert.match(toolbar, /min-h-\[var\(--ds-control-height\)\]/);
  assert.match(toolbar, /data-slot="page-toolbar-bulk-actions"/);
});

test("resource detail pattern exposes summary, sections, and key-value helpers", () => {
  const resourceDetail = read("../../../src/patterns/resource-detail.tsx");
  const patternIndex = read("../../../src/patterns/index.ts");

  for (const exportName of [
    "ResourceSummary",
    "DetailSections",
    "DetailSection",
    "KeyValueList",
    "KeyValueItem",
  ]) {
    assert.match(resourceDetail, new RegExp(exportName));
  }

  assert.match(resourceDetail, /--ds-space-section/);
  assert.match(resourceDetail, /border-border-subtle/);
  assert.match(resourceDetail, /variant\?: "plain" \| "surface"/);
  assert.match(resourceDetail, /variant\?: "surface" \| "open"/);
  assert.match(patternIndex, /\.\/resource-detail/);
});

test("dialog keeps Radix structure and exposes body and footer helpers", () => {
  const dialog = read("../../../src/primitives/dialog.tsx");
  const sheet = read("../../../src/primitives/sheet.tsx");
  const primitives = read("../app/primitives/page.tsx");

  for (const exportName of ["DialogPortal", "DialogOverlay", "DialogBody", "DialogFooter", "DialogClose"]) {
    assert.match(dialog, new RegExp(exportName));
  }
  assert.match(dialog, /@radix-ui\/react-dialog/);
  assert.match(sheet, /SheetBody/);
  assert.match(sheet, /SheetFooter/);
  assert.match(primitives, /<DialogBody>/);
  assert.match(primitives, /<DialogFooter>/);
});

test("dropdown menu exports group composition for accessible action clusters", () => {
  const dropdown = read("../../../src/primitives/dropdown-menu.tsx");
  const primitiveIndex = read("../../../src/primitives/index.ts");

  assert.match(dropdown, /function DropdownMenuGroup/);
  assert.match(dropdown, /DropdownMenuPrimitive\.Group/);
  assert.match(dropdown, /DropdownMenuGroup,/);
  assert.match(primitiveIndex, /\.\/dropdown-menu/);
});

test("select and menu typography use compact shared defaults", () => {
  const styles = read("../../../src/foundation/styles.css");
  const select = read("../../../src/primitives/select.tsx");
  const dropdown = read("../../../src/primitives/dropdown-menu.tsx");
  const searchableSelect = read("../../../src/primitives/searchable-select.tsx");

  assert.match(styles, /--ds-menu-item-size: 0\.75rem;/);
  assert.match(styles, /--ds-menu-label-size: 0\.6875rem;/);

  for (const primitive of [select, dropdown, searchableSelect]) {
    assert.match(primitive, /text-\[length:var\(--ds-menu-item-size\)\]/);
  }

  for (const primitive of [select, dropdown, searchableSelect]) {
    assert.match(primitive, /text-\[length:var\(--ds-menu-label-size\)\]/);
  }
});

test("package public exports include primitives and patterns", () => {
  const index = read("../../../src/index.ts");
  const primitiveIndex = read("../../../src/primitives/index.ts");
  const patternIndex = read("../../../src/patterns/index.ts");

  assert.match(index, /export \* from "\.\/foundation"/);
  assert.match(index, /export \* from "\.\/patterns"/);
  assert.match(index, /export \* from "\.\/primitives"/);
  assert.match(primitiveIndex, /\.\/field/);
  assert.match(primitiveIndex, /\.\/dialog/);
  for (const primitive of ["avatar", "collapsible", "label", "separator", "sheet", "skeleton", "switch"]) {
    assert.match(primitiveIndex, new RegExp(`\\.\\/${primitive}`));
  }
  assert.match(patternIndex, /\.\/entity-table/);
  assert.match(patternIndex, /\.\/app-shell/);
  assert.match(patternIndex, /\.\/preference-controls/);
  assert.match(patternIndex, /\.\/sidebar-navigation/);
  assert.match(patternIndex, /\.\/code-block/);
  assert.match(patternIndex, /\.\/value-meter/);
});

test("shared code and value patterns remain domain agnostic", () => {
  const codeBlock = read("../../../src/patterns/code-block.tsx");
  const valueMeter = read("../../../src/patterns/value-meter.tsx");

  assert.match(codeBlock, /CodeBlockSnippet/);
  assert.match(codeBlock, /navigator\.clipboard\.writeText/);
  assert.match(valueMeter, /role="progressbar"/);
  assert.doesNotMatch(`${codeBlock}\n${valueMeter}`, /Gateway|API key|AI Model|Conscia/);
});

test("shared shell patterns expose structure without gateway-specific behavior", () => {
  const shell = read("../../../src/patterns/app-shell.tsx");
  const styles = read("../../../src/foundation/styles.css");

  for (const exportName of [
    "AppShell",
    "AppSidebar",
    "NavigationGroup",
    "NavigationItem",
    "SidebarTrigger",
    "TopBar",
    "PageFrame",
    "InspectorRegion"
  ]) {
    assert.match(shell, new RegExp(exportName));
  }
  assert.match(shell, /Sheet/);
  assert.match(shell, /data-sidebar-state/);
  assert.match(shell, /readPersistedSidebarOpen/);
  assert.match(shell, /localStorage\.setItem/);
  assert.match(shell, /subscribeToSidebarOpen/);
  assert.match(shell, /data-\[sidebar-state=collapsed\]:\[--ds-app-sidebar-width:3\.5rem\]/);
  assert.match(shell, /--ds-app-sidebar-width-mobile/);
  assert.doesNotMatch(shell, /\[&>button\]:hidden/);
  assert.match(shell, /--ds-sidebar-item-height-touch/);
  assert.match(shell, /bg-sidebar-active/);
  assert.match(shell, /text-sidebar-active-foreground/);
  assert.match(shell, /--sidebar-active-indicator/);
  assert.doesNotMatch(shell, /bg-accent-background text-sidebar-foreground/);
  assert.match(styles, /--sidebar-active:/);
  assert.match(styles, /--color-sidebar-active:/);
  assert.match(styles, /ds-sidebar-expand/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(shell, /organizationSlug/);
  assert.doesNotMatch(shell, /usePathname/);
});

test("sidebar semantics resolve through light and dark scopes without a new palette", () => {
  const styles = read("../../../src/foundation/styles.css");
  const shell = read("../../../src/patterns/app-shell.tsx");
  const navigation = read("../../../src/patterns/sidebar-navigation.tsx");

  for (const token of [
    "--sidebar-canvas",
    "--sidebar-header",
    "--sidebar-content",
    "--sidebar-hover",
    "--sidebar-primary-text",
    "--sidebar-secondary-text",
    "--sidebar-metadata-text",
    "--sidebar-icon",
    "--sidebar-search",
    "--sidebar-footer",
    "--sidebar-group-label",
    "--sidebar-group-count",
    "--sidebar-focus-ring",
  ]) {
    assert.match(styles, new RegExp(`${token}:`));
    assert.match(styles, new RegExp(`--color-${token.slice(2)}:`));
  }

  assert.match(styles, /\[data-sidebar-variant="light"\]/);
  assert.match(styles, /data-sidebar-variant="auto"/);
  assert.match(styles, /--sidebar-active: var\(--accent-background\)/);
  assert.match(styles, /--sidebar-active-indicator: var\(--selection-indicator\)/);
  assert.match(shell, /variant\?: "light" \| "dark" \| "auto"/);
  assert.match(shell, /data-sidebar-variant=\{variant\}/);
  assert.match(shell, /function SidebarSearch/);
  assert.match(shell, /min-h-\[var\(--ds-topbar-height\)\]/);
  assert.match(shell, /h-\[var\(--ds-topbar-height\)\]/);
  assert.match(shell, /px-\[var\(--ds-topbar-padding-x\)\]/);
  assert.match(shell, /gap-\[var\(--ds-sidebar-item-gap\)\]/);
  assert.match(shell, /leading-\[var\(--ds-sidebar-group-label-line-height\)\]/);
  assert.match(shell, /font-semibold uppercase leading-\[var\(--ds-sidebar-group-label-line-height\)\] tracking-\[0\.04em\]/);
  assert.match(navigation, /gap-\[var\(--ds-sidebar-group-gap\)\]/);
  assert.match(shell, /Place this control inside TopBar/);
  assert.match(
    shell,
    /text-\[length:var\(--ds-sidebar-group-label-size\)\]/,
  );
});

test("shared sidebar navigation supports collapsed flyouts without owning routes", () => {
  const navigation = read("../../../src/patterns/sidebar-navigation.tsx");
  const playgroundShell = read("../components/app-shell.tsx");

  assert.match(navigation, /sidebarState === "collapsed" && !isMobile/);
  assert.match(navigation, /<DropdownMenu/);
  assert.match(navigation, /side=\{sidebarSide === "left" \? "right" : "left"\}/);
  assert.match(navigation, /sideOffset=\{8\}/);
  assert.match(navigation, /<Collapsible/);
  assert.match(navigation, /localStorage\.setItem/);
  assert.match(navigation, /renderLink/);
  assert.doesNotMatch(navigation, /next\/link/);
  assert.doesNotMatch(navigation, /usePathname/);
  assert.match(playgroundShell, /<SidebarNavigation/);
  assert.match(playgroundShell, /<SidebarSearch shortcut="⌘K" \/>/);
  assert.match(playgroundShell, /label: "Library"/);
  assert.match(playgroundShell, /<AppSidebar variant="auto">/);
});

test("shared package keeps canonical primitives clean and quarantines compatibility aliases", () => {
  const primitiveFiles = [
    "badge.tsx",
    "button.tsx",
    "card.tsx",
    "checkbox.tsx",
    "input.tsx",
    "select.tsx",
    "switch.tsx",
    "table.tsx",
    "tabs.tsx",
    "textarea.tsx"
  ];

  for (const file of primitiveFiles) {
    assert.doesNotMatch(
      read(`../../../src/primitives/${file}`),
      /Conscia[A-Z]/,
      `${file} should not export Conscia-prefixed aliases`,
    );
  }

  const compat = read("../../../src/primitives/compat.tsx");
  const primitiveIndex = read("../../../src/primitives/index.ts");
  const readme = read("../../../README.md");

  assert.match(compat, /Temporary Admin UI migration aliases/);
  assert.match(compat, /ConsciaButton/);
  assert.match(primitiveIndex, /\.\/compat/);
  assert.doesNotMatch(readme, /ConsciaButton|ConsciaCard|ConsciaFormSelect/);
});
