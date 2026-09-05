import { componentInventory } from "@/components/component-inventory";

export type ComponentOption = {
  name: string;
  values: string;
  guidance: string;
};

type ComponentGuidance = {
  whenToUse: string;
  accessibility: string;
  options: readonly ComponentOption[];
};

const guidance: Record<string, ComponentGuidance> = {
  alert: {
    whenToUse: "Use for persistent information that belongs in the page flow and should remain visible until its context changes.",
    accessibility: "Choose a semantic tone, provide a concise title, and reserve live-region behavior for messages that appear after user action.",
    options: [{ name: "variant", values: "information · success · warning · danger · neutral", guidance: "Match the meaning of the message, not its visual prominence." }],
  },
  "alert-dialog": {
    whenToUse: "Use when a consequential action requires an explicit decision before it can continue.",
    accessibility: "Give the dialog a title and description, move focus into it, and use a specific action label such as “Disconnect”.",
    options: [{ name: "open", values: "controlled · uncontrolled", guidance: "Use controlled state when the application must coordinate the outcome." }],
  },
  avatar: {
    whenToUse: "Use to represent a person, team, or service in identity-rich interfaces.",
    accessibility: "Use meaningful image alt text when the image adds information; decorative group avatars can be hidden and labeled as a group.",
    options: [{ name: "group", values: "single · stacked · overflow count", guidance: "Use AvatarGroup when space is constrained and total membership matters." }],
  },
  badge: {
    whenToUse: "Use for short status, category, or count labels that support nearby content.",
    accessibility: "Badge text must state the meaning directly; color is supporting information only.",
    options: [{ name: "variant", values: "accent · outline · information · success · warning · danger · neutral", guidance: "Use semantic variants for states and neutral/outline for taxonomy." }],
  },
  brand: {
    whenToUse: "Use the icon where horizontal space is limited and the wordmark when the full Conscia identity should be visible.",
    accessibility: "Add an accessible name when the mark is a link; otherwise hide decorative marks from assistive technology.",
    options: [{ name: "mark", values: "BrandIcon · BrandWordmark", guidance: "Both inherit currentColor and adapt to the active theme." }],
  },
  button: {
    whenToUse: "Use buttons for actions. Use link composition for navigation that should retain button styling.",
    accessibility: "Icon-only buttons require an accessible name. Pending actions should expose a stable pending label and prevent duplicate submission.",
    options: [
      { name: "variant", values: "default · secondary · outline · ghost · link · destructive", guidance: "Use one primary action per local decision area." },
      { name: "size", values: "sm · default · lg · icon", guidance: "Match the surrounding density; use IconButton for icon-only actions." },
    ],
  },
  card: {
    whenToUse: "Use for a bounded content unit that benefits from a title, supporting copy, and optional actions.",
    accessibility: "Cards do not add semantics by themselves; choose a heading level and landmark appropriate to the surrounding page.",
    options: [{ name: "variant", values: "default · muted · elevated", guidance: "Prefer default. Use elevation only where layering is meaningful." }],
  },
  "form-controls": {
    whenToUse: "Use the Field anatomy to keep labels, descriptions, errors, and controls in a consistent reading order.",
    accessibility: "Every control needs a visible label or equivalent accessible name. Connect errors and help text to the relevant control.",
    options: [
      { name: "control", values: "Input · Textarea · Select · SearchableSelect · Checkbox · Switch", guidance: "Choose from the type and number of values users must provide." },
      { name: "state", values: "default · disabled · invalid · required", guidance: "Expose state through native attributes as well as styling." },
    ],
  },
  disclosure: {
    whenToUse: "Use Collapsible for optional detail, Tabs for layered content, and NavigationTabs for routed peer pages.",
    accessibility: "Triggers must remain keyboard reachable and expose expanded or selected state. Tab panels need clear labels.",
    options: [{ name: "pattern", values: "collapsible · tabs · segmented tabs · navigation tabs", guidance: "Do not use tabs merely to shorten a page." }],
  },
  "menus-and-overlays": {
    whenToUse: "Use menus for action lists, popovers for lightweight supporting content, dialogs for focused tasks, and sheets for edge-aligned workflows.",
    accessibility: "Use a titled dialog or sheet, restore focus on close, and ensure every trigger has an accessible name.",
    options: [{ name: "surface", values: "dropdown · popover · tooltip · dialog · sheet", guidance: "Choose the least disruptive overlay that supports the task." }],
  },
  table: {
    whenToUse: "Use for a bounded dataset where users need to compare values across columns.",
    accessibility: "Provide a caption or nearby heading, use header cells, and expose sort direction with aria-sort when sorting is interactive.",
    options: [{ name: "row state", values: "default · selected · disabled", guidance: "State remains available through data attributes without changing table semantics." }],
  },
  "supporting-primitives": {
    whenToUse: "Use these focused helpers for progress, loading placeholders, applied filters, keyboard hints, separators, and transient feedback.",
    accessibility: "Loading feedback needs a textual status. Toasts must be dismissible and should not be the only record of a critical outcome.",
    options: [{ name: "feedback", values: "Skeleton · Spinner · Toast · FilterChip · ShortcutHint", guidance: "Select the helper that matches the duration and importance of the state." }],
  },
  "application-shell": {
    whenToUse: "Use as the shared geometry for authenticated product surfaces with a header, sidebar, main region, and optional inspector.",
    accessibility: "Preserve landmark order, label navigation, and provide a mobile search trigger and named sidebar toggle.",
    options: [{ name: "headerLayout", values: "integrated · split", guidance: "Integrated is canonical; split remains available for compatibility." }],
  },
  "sidebar-navigation": {
    whenToUse: "Use static labeled groups for most application navigation and explicit submenus only for genuine hierarchy.",
    accessibility: "Groups are section-labeled, active leaves expose the current route, and collapsed items require an icon or collapsedLabel.",
    options: [{ name: "entry type", values: "group · submenu · legacy section", guidance: "Prefer group. Reserve submenu for deliberate disclosure." }],
  },
  "page-composition": {
    whenToUse: "Use to establish predictable page titles, actions, toolbars, detail sections, and key-value summaries.",
    accessibility: "Keep one page-level heading, preserve heading order, and label toolbars when more than one appears.",
    options: [{ name: "composition", values: "PageHeader · PageToolbar · DetailSections · ResourceSummary", guidance: "Compose only the regions the page needs." }],
  },
  "inventory-and-tables": {
    whenToUse: "Use for sortable, filterable, selectable datasets and responsive resource inventories.",
    accessibility: "Keep selection status announced, label bulk actions, and provide a meaningful mobile row rather than forcing horizontal table scrolling.",
    options: [{ name: "presentation", values: "DataTable · EntityTable · InventorySurface", guidance: "DataTable owns interaction; InventorySurface owns responsive presentation." }],
  },
  "metrics-and-data-panels": {
    whenToUse: "Use for operational metrics, chart-adjacent summaries, divided data regions, and compact trend communication.",
    accessibility: "Every visualization slot needs a textual summary. Direction and sentiment must be expressed in text, not color alone.",
    options: [{ name: "emphasis", values: "primary · supporting", guidance: "Give primary metrics more visual weight without changing their semantic meaning." }],
  },
  "activity-and-attention": {
    whenToUse: "Use ActivityList for chronological records and AttentionList for persistent operational findings that require review.",
    accessibility: "Attention tone needs an icon or severity label. These lists are not live alerts unless the application explicitly makes them so.",
    options: [{ name: "layout", values: "default · compact", guidance: "Compact activity rows suit dense operational panels." }],
  },
  "state-and-feedback": {
    whenToUse: "Use for empty, loading, error, confirmation, and command-oriented states that interrupt or replace normal content.",
    accessibility: "Name the state, explain the recovery path, and move or announce focus only when the state appears dynamically.",
    options: [{ name: "state", values: "empty · loading · error · confirmation · command", guidance: "Choose the narrowest pattern for the user’s current task." }],
  },
  "filters-and-preferences": {
    whenToUse: "Use FilterBar for removable applied criteria and preference controls for design-system-wide appearance and density.",
    accessibility: "Filter removal actions must identify the filter. Preference labels should communicate the resulting mode.",
    options: [{ name: "preference", values: "appearance · density", guidance: "Preferences persist at the root so overlays and portals inherit them." }],
  },
  workbench: {
    whenToUse: "Use for dense tools with stable global and secondary rails, a primary work area, and optional contextual inspection.",
    accessibility: "Maintain landmark order on desktop and a logical content order when rails become mobile overlays.",
    options: [{ name: "rail", values: "global · secondary · inspector", guidance: "Each rail should have a distinct navigation or context responsibility." }],
  },
  "content-helpers": {
    whenToUse: "Use ProviderMark for compact provider identity and CodeBlock for copyable implementation examples.",
    accessibility: "Provider abbreviations must have adjacent names; copy actions need a named success state.",
    options: [{ name: "helper", values: "ProviderMark · CodeBlock", guidance: "Use these to improve documentation and resource identity, not as generic layout wrappers." }],
  },
  "conscia-aliases": {
    whenToUse: "Use only while migrating pre-v1 consumers. New code should import the canonical component names.",
    accessibility: "Aliases preserve the behavior of their canonical components; follow the canonical component guidance.",
    options: [{ name: "status", values: "deprecated compatibility alias", guidance: "Replace each Conscia-prefixed name before the next major release." }],
  },
};

export const componentDocs = componentInventory
  .filter((entry) => entry.category !== "Foundation")
  .map((entry) => {
    const details = guidance[entry.slug];
    if (!details) throw new Error(`Missing component documentation for ${entry.slug}`);

    return {
      ...entry,
      ...details,
      importCode: `import { ${entry.exports.filter((name) => !name.toLowerCase().endsWith("variants") && name !== "useToast" && name !== "useAppShell" && name !== "useConsciaPreferences").slice(0, 5).join(", ")} } from "@conscia-labs/design-system";`,
    };
  });

export type ComponentDoc = (typeof componentDocs)[number];

export function getComponentDoc(slug: string) {
  return componentDocs.find((entry) => entry.slug === slug);
}
