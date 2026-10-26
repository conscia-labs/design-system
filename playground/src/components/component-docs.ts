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
    options: [
      { name: "variant", values: "neutral · success · information · warning · danger · accent · outline", guidance: "Neutral is for lifecycle states (Active, Enabled, Published); success only for positive evidence (Healthy, Ready, Verified); information for pending work; warning for problems that need action; danger for failures. Accent and outline are for taxonomy." },
      { name: "width", values: "content-sized", guidance: "Badges size to their text, even inside grid cells and stretched flex columns." },
    ],
  },
  brand: {
    whenToUse: "Use the icon where horizontal space is limited and the wordmark when the full Conscia identity should be visible.",
    accessibility: "Add an accessible name when the mark is a link; otherwise hide decorative marks from assistive technology.",
    options: [{ name: "mark", values: "BrandIcon · BrandWordmark", guidance: "Both inherit currentColor. Use burgundy on light identity surfaces and white on dark identity surfaces." }],
  },
  button: {
    whenToUse: "Use buttons for actions. Use link composition for navigation that should retain button styling.",
    accessibility: "Icon-only buttons require an accessible name. Pending actions should expose a stable pending label and prevent duplicate submission.",
    options: [
      { name: "variant", values: "default · secondary · outline · ghost · link · destructive", guidance: "Use one primary action per local decision area." },
      { name: "size", values: "sm · default · lg · icon", guidance: "Match the surrounding density; use IconButton for icon-only actions." },
      { name: "disabled", values: "readable primary", guidance: "A disabled primary button keeps a tinted action surface with readable text; a pending LoadingButton keeps its filled style." },
    ],
  },
  card: {
    whenToUse: "Use for a bounded content unit that benefits from a title, supporting copy, and optional actions.",
    accessibility: "Cards do not add semantics by themselves; choose a heading level and landmark appropriate to the surrounding page.",
    options: [
      { name: "variant", values: "default · muted · elevated", guidance: "Prefer default. Use elevation only where layering is meaningful." },
      { name: "interactive", values: "false (default) · true", guidance: "Set when the whole card is a link or entry point. The card lifts on hover and focus; static cards never move." },
    ],
  },
  "form-controls": {
    whenToUse: "Use the Field anatomy to keep labels, descriptions, errors, and controls in a consistent reading order.",
    accessibility: "Every control needs a visible label or equivalent accessible name. Connect errors and help text to the relevant control.",
    options: [
      { name: "control", values: "Input · Textarea · Select · SearchableSelect · DateTimeField · Checkbox · Switch", guidance: "Choose from the type and number of values users must provide. Use DateTimeField instead of a native datetime-local input so the time zone is stated." },
      { name: "FormSelect empty value", values: "placeholder · nothing", guidance: "An empty value with no matching option is no selection: the placeholder shows, or nothing. Do not add a disabled prompt option." },
      { name: "state", values: "default · disabled · invalid · required", guidance: "Expose state through native attributes as well as styling." },
    ],
  },
  disclosure: {
    whenToUse: "Use Disclosure for optional detail behind a summary row, Tabs for layered content, and NavigationTabs for routed peer pages. Use Collapsible only when you need a custom trigger.",
    accessibility: "Triggers must remain keyboard reachable and expose expanded or selected state. Tab panels need clear labels.",
    options: [
      { name: "pattern", values: "underline (default) · divider · pills · segmented · nested", guidance: "Underline keeps the rail quiet; divider adds structural separation; pills suit small peer views; segmented is for mode switching. NavigationTabs also supports underline, divider, and pills; use NavigationTabsList variant=\"pills\" for pill-styled routed pages." },
      { name: "nesting", values: "page tabs · nested", guidance: "Page-level tabs use NavigationTabs or the default Tabs. A tab group inside a section or another tab panel uses variant=\"nested\" so the hierarchy is visible. Avoid nesting where a single tab level or separate sections will do. When nested tabs are unavoidable, the active one takes the Conscia green indicator so it never competes with page tabs." },
      { name: "Disclosure count", values: "omitted · number", guidance: "Show a count when the summary hides a list, such as the rows of a daily data table." },
    ],
  },
  "menus-and-overlays": {
    whenToUse: "Use menus for action lists, popovers for lightweight supporting content, dialogs for focused tasks, and sheets for edge-aligned workflows.",
    accessibility: "Use a titled dialog or sheet, restore focus on close, and ensure every trigger has an accessible name.",
    options: [{ name: "surface", values: "dropdown · popover · tooltip · dialog · sheet", guidance: "Choose the least disruptive overlay that supports the task." }],
  },
  table: {
    whenToUse: "Use for a bounded dataset where users need to compare values across columns.",
    accessibility: "Name every table with TableCaption (screen-reader-only by default) or a nearby heading, use header cells, and expose sort direction with aria-sort when sorting is interactive.",
    options: [
      { name: "row state", values: "default · selected · disabled", guidance: "State remains available through data attributes without changing table semantics." },
      { name: "TableRow interactive", values: "false (default) · true", guidance: "Clickable rows show a pointer and an action-colored edge rail on hover and focus. DataTable sets it for rows that accept onRowClick." },
      { name: "scrollable", values: "true (default) · false", guidance: "Wide tables scroll horizontally and fade the edge that has more columns. Pass false only when you render a stacked layout at narrow widths." },
      { name: "headers", values: "uppercase table-head style", guidance: "Table and DataTable share one header style, including sortable headers. Column headers and TableFooter sit on the surface-table-header band above a border-default divider. Do not restyle header cells per page." },
      { name: "TableCaption visible", values: "false (default) · true", guidance: "A caption names the table for assistive technology and stays hidden by default. Set visible to show it as metadata text above the table; it never renders between the rows and pagination." },
    ],
  },
  stepper: {
    whenToUse: "Use to show progress through a wizard or multi-step dialog, such as creating an API key or editing pricing.",
    accessibility: "Label the list with aria-label. The current step exposes aria-current=\"step\", and every step announces whether it is completed, current, or upcoming.",
    options: [
      { name: "orientation", values: "horizontal (default) · vertical", guidance: "Horizontal suits dialogs and short flows; on narrow screens only the current label stays visible. Use vertical for longer flows with descriptions." },
      { name: "currentStep", values: "0 … steps.length", guidance: "Zero-based. Pass steps.length once every step is complete." },
    ],
  },
  "supporting-primitives": {
    whenToUse: "Use these focused helpers for progress, loading placeholders, applied filters, keyboard hints, separators, and transient feedback.",
    accessibility: "Loading feedback needs a textual status. Toasts must be dismissible and should not be the only record of a critical outcome.",
    options: [{ name: "feedback", values: "Skeleton · Spinner · Toast · FilterChip · ShortcutHint", guidance: "Select the helper that matches the duration and importance of the state." }],
  },
  "application-shell": {
    whenToUse: "Use as the shared geometry for authenticated product surfaces with a header, sidebar, main region, and optional inspector.",
    accessibility: "Preserve landmark order, label navigation, and provide a mobile search trigger and named sidebar toggle.",
    options: [
      { name: "headerLayout", values: "integrated · split", guidance: "Integrated is canonical; split remains available for compatibility." },
      { name: "AppSidebar treatment", values: "omitted (default) · quiet", guidance: "Quiet maps existing sidebar variables to semantic surfaces and selection roles while variant continues to control appearance." },
    ],
  },
  "sidebar-navigation": {
    whenToUse: "Use static labeled groups for most application navigation and explicit submenus only for genuine hierarchy.",
    accessibility: "Groups are section-labeled, active leaves expose the current route, and collapsed items require an icon or collapsedLabel.",
    options: [{ name: "entry type", values: "group · submenu · legacy section", guidance: "Prefer group. Reserve submenu for deliberate disclosure." }],
  },
  "page-composition": {
    whenToUse: "Use to establish predictable page titles, actions, toolbars, detail sections, and key-value summaries.",
    accessibility: "Keep one page-level heading, preserve heading order, and label toolbars when more than one appears.",
    options: [
      { name: "composition", values: "PageHeader · PageToolbar · DetailSections · ResourceSummary", guidance: "Compose only the regions the page needs. Empty PageToolbar slots collapse, and a toolbar with no content renders nothing." },
      { name: "inset", values: "--ds-frame-padding-x · --ds-frame-content-inset", guidance: "PageFrame, PageHeader, PageToolbar, and DetailBackLink share one left edge at every breakpoint. Inside PageFrame the header adds no inset of its own; a surface can set --ds-frame-content-inset for headers it contains." },
    ],
  },
  "inventory-and-tables": {
    whenToUse: "Use for sortable, filterable, selectable datasets and responsive resource inventories.",
    accessibility: "Keep selection status announced, label bulk actions, and provide a meaningful mobile row rather than forcing horizontal table scrolling.",
    options: [
      { name: "presentation", values: "DataTable · EntityTable · InventorySurface", guidance: "DataTable owns interaction; InventorySurface owns responsive presentation." },
      { name: "page size", values: "paginationPageSizes.inventory (25) · paginationPageSizes.detail (10)", guidance: "Use 25 rows for full-page inventories and 10 for tables inside detail pages. The Rows control and page buttons share the small control height." },
      { name: "DataTable showCaption", values: "false (default) · true", guidance: "caption names the table for screen readers. Pass showCaption to render it as visible text above the header." },
      { name: "surfaces", values: "canvas page · Card / InventorySurface", guidance: "On the page canvas, DataTable rows and PageToolbar paint the canvas. Inside a Card or InventorySurface they take the card surface. The column header and pagination footer always sit on the darker table-header band." },
      { name: "touch sizing", values: "pointer: coarse", guidance: "On touch devices every control height, including pagination, the Rows control and sort headers, rises to 44px in all densities. Do not add min-height overrides on cards or tables." },
    ],
  },
  "metrics-and-data-panels": {
    whenToUse: "Use for operational metrics, chart-adjacent summaries, divided data regions, and compact trend communication.",
    accessibility: "Every visualization slot needs a textual summary. Direction and sentiment must be expressed in text, not color alone.",
    options: [
      { name: "MetricBand presentation", values: "default · compact", guidance: "Compact uses one full-width row per item below desktop and the configured number of columns on desktop; details and values wrap without individual card backgrounds." },
      { name: "MetricBandItem value", values: "React node · loading skeleton · emptyValue", guidance: "Values can contain links. A missing value (null, or omitted in compact presentation) renders quietly as an em dash or as emptyValue, such as \"Never\". Detail lines are reserved so values share a baseline." },
      { name: "DailyVolumeChart", values: "total · stacked not-successful segment · successfulTone / unsuccessfulTone: success (default) · danger (default for the segment) · warning · information · accent", guidance: "Use for every per-day measure: calendar-true days, a stated scale, first, middle, and last date labels, and an exact-values table. The successful series takes the success token so it matches outcome colours nearby; pass successfulTone=\"accent\" for a measure with no outcome, such as plain volume." },
      { name: "emphasis", values: "primary · supporting", guidance: "Give primary metrics more visual weight without changing their semantic meaning. The primary card carries the burgundy emphasis edge." },
      { name: "MetricCard countUp", values: "false (default) · true · { format, locale, durationMs }", guidance: "Counts a numeric value up on load and between updates. Screen readers hear only the final value, and reduced motion shows it immediately. Pass a pre-formatted node instead when the value is not a plain number." },
      { name: "MetricTrend sentiment", values: "positive · negative · neutral", guidance: "Trends render as tinted badges: Conscia green for positive, danger tint for negative. Always pair with an accessible label that states the direction and meaning." },
      { name: "ValueMeter tone", values: "brand (default) · neutral · success · warning · danger", guidance: "Brand fills plain quantities with the blue-to-burgundy blend. Use a status tone only when the level itself means good, at risk, or bad." },
    ],
  },
  "activity-and-attention": {
    whenToUse: "Use ActivityList for chronological records and AttentionList for persistent operational findings that require review.",
    accessibility: "Use a real anchor in an ActivityItem title for direct navigation; do not make the whole row a link around other controls. Attention tone needs an icon or severity label. These lists are not live alerts unless the application explicitly makes them so.",
    options: [
      { name: "ActivityItem content", values: "React-node title · description · metadata · trailing/status", guidance: "Use an anchor in title for direct destinations, metadata for timestamps, description for optional counts, and trailing/status for the outcome badge." },
      { name: "layout", values: "default · compact", guidance: "Compact activity rows suit dense operational panels." },
    ],
  },
  "state-and-feedback": {
    whenToUse: "Use for empty, loading, error, confirmation, and command-oriented states that interrupt or replace normal content.",
    accessibility: "Name the state, explain the recovery path, and move or announce focus only when the state appears dynamically.",
    options: [
      { name: "state", values: "empty · loading · error · confirmation · command", guidance: "Choose the narrowest pattern for the user’s current task." },
      { name: "StateView tone", values: "brand (default) · neutral · success · danger", guidance: "Colors the duotone icon spot. Brand suits empty and first-run states, success a completed flow, and neutral a quiet inline state. ErrorState uses danger." },
      { name: "StateView size", values: "default · compact", guidance: "Default replaces a page's primary content; compact fits inside sections, panels, and tabs." },
      { name: "divider", values: "false (default) · true", guidance: "Add the bottom divider only when the state replaces rows inside a table body." },
    ],
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
    accessibility: "Provider abbreviations must have adjacent names. Give a CodeBlock selector a contextual accessible label when its choices are not code languages; the code body stays keyboard-scrollable and copy feedback is announced.",
    options: [
      { name: "CodeBlock", values: "snippets · defaultValue · selectorLabel (default: Code language) · copyLabel", guidance: "Use selectorLabel when the choices represent steps, examples, or formats rather than programming languages." },
      { name: "ProviderMark", values: "name · shortName · description", guidance: "Show the provider name next to its short mark and use the description for current context." },
    ],
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
