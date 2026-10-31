# Changelog

## 1.7.2 - 2026-10-31

A header that follows the mood. Under balanced or airy, the sidebar can run
the full height of the window with the brand at its top, and the header
becomes a transparent row in the content column that holds search,
notifications, help, and the account menu. Everything is opt-in: products
that keep their current `headerLayout` render as in 1.7.1, apart from one
sizing change under "Upgrading from 1.7.1".

### Upgrading from 1.7.1

No code changes are required.

- Under balanced or airy, the `AppSidebarHeader` of a `split` shell is now
  as tall as the header beside it (`--ds-app-header-height` minus the sidebar
  inset), so the brand lines up with the header row. Without a mood nothing
  changes.

### Adopting the mood-following header

1. Set `headerLayout="auto"` on `AppShell`. Without a mood it renders the
   same as `integrated`, so nothing moves until a mood is set.
2. Move `AppHeader` inside `MainRegion`, as its first child. In an
   integrated shell it stays fixed across the window; in a split one it
   becomes sticky in the content column.
3. Put the brand in both places: in `AppSidebarHeader`, and wrapped in the
   new `AppHeaderBrand` inside `AppHeaderStart`. Each shows only where it
   belongs.
4. Optionally wrap breadcrumbs in the new `AppHeaderTitle title="…"`.

```tsx
<AppShell headerLayout="auto">
  <AppSidebar>
    <AppSidebarHeader>{/* brand, workspace switcher */}</AppSidebarHeader>
    <AppSidebarContent>{/* SidebarNavigation */}</AppSidebarContent>
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

What each part does in each layout:

| Part | Integrated (no mood) | Split (balanced, airy) |
| --- | --- | --- |
| `AppHeader` | Fixed across the window, bordered bar | Sticky in the content column, transparent until the page scrolls |
| `AppSidebarHeader` | Hidden on desktop; shown in the mobile drawer | Top of the full-height sidebar |
| `AppHeaderBrand` | Shown | Shown only below `lg`, while the sidebar is a drawer |
| `AppHeaderTitle` | Shows its children | Shows its children, then the page title once the page heading scrolls under the header |

`auto` resolves in CSS from the nearest `data-mood`, so the layout is right on
first paint and never flashes on hydration. Put the mood on the root so the
whole shell follows it.

### Scrolled header

A transparent header draws a band once the window scrolls, and
`AppHeader` sets `data-scrolled="true"` while it does. The mood decides the
look:

- **Current and balanced:** a frosted band across the content column with a
  hairline below it.
- **Airy:** a floating pill, inset from the column edges and the header's top
  and bottom, with a soft shadow.

The band is drawn behind the controls, so it never moves the page. Inside a
split shell the header lines up with `--ds-frame-padding-x`; set that variable
on the header if your pages use different padding:

```tsx
<AppHeader className="[--ds-frame-padding-x:1.5rem]">
```

### New API

- `AppShell headerLayout` adds `"auto"` (integrated without a mood, split
  under balanced or airy). `"split"` stays the default, and `"integrated"`
  and `"split"` hold in every mood.
- `AppHeader variant`: `"auto" | "bar" | "transparent"`, rendered as
  `data-variant`. `auto` (the default) is a bar where integrated and
  transparent inside `MainRegion` of a split shell. `tone="brand"` still
  applies to the bar.
- `AppHeader` sets `data-scrolled="true"` while the window is scrolled.
- `AppHeader` placed directly inside `MainRegion` of a split shell (`split`,
  or `auto` under a mood) is sticky, `--ds-app-header-height` tall, and
  padded by `--ds-frame-padding-x`.
- `AppHeaderBrand`: the brand in the header, hidden on desktop wherever the
  sidebar runs full height.
- `AppHeaderTitle` (`title` prop, plus children): shows its children while
  the page heading is in view, then the title. The page heading is the first
  heading in a `PageHeader` inside `MainRegion`, or the first `h1`. Hidden
  children are made inert, so breadcrumb links leave the tab order.
- `TopBar` is unchanged. For new split shells, prefer `AppHeader` inside
  `MainRegion`, which adds the scrolled state.

### New tokens

| Token | Default | Balanced | Airy |
| --- | --- | --- | --- |
| `--ds-app-header-height` | `var(--ds-topbar-height)` (3.5rem) | 4rem | 4.5rem |
| `--ds-app-header-scrolled-gutter` | `100vw` (band reaches both edges) | | 1rem |
| `--ds-app-header-scrolled-inset-y` | `0px` | | 0.5rem |
| `--ds-app-header-scrolled-radius` | `0px` | | `999px` |
| `--ds-app-header-scrolled-background` | unset (canvas at 88%) | | surface at 92% |
| `--ds-app-header-scrolled-shadow` | unset (hairline) | | soft shadow |

### Playground

- The playground shell uses `headerLayout="auto"`: every page looks as
  before, and the Moods page switches it to split. The Moods page's
  "Shell options" now include `AppShell headerLayout`.
- The Floating workspace example uses `AppHeader` inside `MainRegion` with
  `AppHeaderBrand` and `AppHeaderTitle`. Its header option is now none,
  transparent, or bar.

## 1.7.1 - 2026-10-31

First published release with moods. 1.7.0 was tagged but never published:
its release validation failed, so the package and playground were not
deployed. 1.7.1 contains everything in 1.7.0 below; read those notes to
upgrade from 1.6.

- The release accessibility scan waits for the playground's Moods page and
  Floating workspace example to apply their mood before it runs. Both pages
  set `data-mood` after hydration, and the scan could read the sidebar text
  color before the mood and the background after it. Package code is
  unchanged from 1.7.0.

## 1.7.0 - 2026-10-31

Moods: an opt-in, more open look for the same components, plus sidebar
options that let each application choose its own sidebar. Without a
`data-mood` attribute and with default props, products render as in 1.6.1,
apart from the two changes under "Upgrading from 1.6".

### Upgrading from 1.6

No code changes are required. Two changes reach products that do not adopt a
mood:

- `ds-supergraphic` now draws its dotted rings from the element's right edge,
  as documented. Its three-value `mask-position` was invalid in Chromium, so
  the rings were drawing from the top-left corner. Review screens that use
  the utility, such as brand cards, sign-in, and empty states.
- The light and quiet `AppSidebar` color rules wrap their root condition in
  `:where()`. They match the same elements and produce the same colors, but
  with lower specificity. If your application overrides `--sidebar-*`
  variables in its own CSS, those overrides now win more easily; check that
  the sidebar still looks as intended.

### Choosing a mood

Density sets how much fits on a screen; mood sets how open it feels. There
are three moods:

| Mood | Attribute | Use it for |
| --- | --- | --- |
| Current | none | Dense, operational screens: the workbench, logs, long tables. |
| Balanced | `data-mood="balanced"` | An app-wide default for products that should feel less boxed in. |
| Airy | `data-mood="airy"` | Overview and home pages, onboarding, empty states, short settings pages. |

- **Balanced** drops card, metric card, and data panel borders and shadows;
  rounds surfaces to 14px and controls to 10px; makes badges and trends
  pills; sets eyebrows and table headings in sentence case; removes the table
  header band; and enlarges page titles (2.375rem), section titles
  (1.125rem), and metric values (2.25rem, regular weight). Rows grow to
  3.25rem.
- **Airy** goes further: 24px surfaces, pill buttons and nav items, filled
  fields with no border until focus, a peach pill eyebrow, 2.875rem page
  titles and metric values, 3.625rem rows, and 3.5rem between sections.
- Both moods use a lighter canvas in light mode (dark mode keeps the dark
  canvas) and add a small overshoot to button and interactive card hover,
  which reduced motion turns off.

### Adopting a mood

Set the mood app-wide on the document root, next to appearance and density.
Put it on the root rather than a wrapper so the sidebar and the mobile
navigation drawer, which renders in a portal, follow it:

```tsx
<html
  lang="en"
  data-appearance="system"
  data-density="comfortable"
  data-mood="balanced"
  suppressHydrationWarning
>
```

To use a different mood on one part of a page, set it on a wrapper that also
paints the canvas, so the mood's background applies there:

```tsx
<section data-mood="airy" className="bg-canvas">
  {/* onboarding, an overview, an empty state */}
</section>
```

`moodProps(mood)` returns the attribute for a `ConsciaMood` value
(`"current" | "balanced" | "airy"`) and returns nothing for `current`;
`moodOptions` lists the values:

```tsx
import { moodProps, type ConsciaMood } from "@conscia-labs/design-system";

<main {...moodProps(mood)} className="bg-canvas">
```

Unlike appearance and density, a mood is a product decision per surface, not
a user preference, so it is not stored or exposed in `DesignPreferenceControls`.

Things to know when adopting a mood:

- A mood sets spacing and type sizes, so it wins over a density preset on the
  same element. Keep `operational` density without a mood on dense screens.
- Mood styles reach components through their `data-slot` attributes. The
  rules that remove borders or uppercase are unlayered CSS, so inside a mood
  they take precedence over a `className` that sets the same property on
  `Card`, `MetricCard`, `DataPanel`, `Badge`, `Eyebrow`, `TableHead`,
  `Button`, `Input`, `Textarea`, `SelectTrigger`, or `DateTimeField`.
- Without borders, focus rings and hover fills show what is interactive.
  Do not remove them in product CSS.
- Airy's filled fields cover `Input`, `Textarea`, `SelectTrigger`, and
  `DateTimeField`. The search input inside `SearchableSelect` keeps its
  border.

### Sidebar options

Under a mood the shell sidebar changes too, through three independent
options. Each follows the mood while it is `auto`; set one explicitly and it
holds in every mood. Different applications can therefore build different
sidebars on the same mood.

| Option | Prop | Values | `auto` without a mood | `auto` under balanced | `auto` under airy |
| --- | --- | --- | --- | --- | --- |
| Layout | `AppShell sidebarLayout` | `auto`, `flush`, `floating` | Flush | Floating, 8px in, 16px corners | Floating, 12px in, 22px corners |
| Color | `AppSidebar variant` | `auto`, `light`, `dark`, `brand` | Appearance-aware | Burgundy | Burgundy |
| Active item | `AppSidebar activeStyle` (new) | `auto`, `tint`, `solid` | Variant fill | Brighter fill | Solid pill |

```tsx
// Airy page content with a flush, light sidebar and a solid active item.
<AppShell sidebarLayout="flush">
  <AppSidebar variant="light" activeStyle="solid">…</AppSidebar>
  <MainRegion>…</MainRegion>
</AppShell>
```

- `variant="auto"` turns burgundy under a mood even with `treatment="quiet"`.
  Pass `light` or `dark` to keep those colors.
- `activeStyle="solid"` inverts the sidebar: its text color becomes the pill
  and its canvas the pill's text, so it reads in every variant and mood.
  `tint` keeps the variant's soft fill.
- `floating` works without a mood too. `data-sidebar-layout="flush"` or
  `"floating"` on the root does the same as the prop.
- Navigation group labels drop uppercase under a mood.

### Floating workspace

A floating sidebar looks best when nothing spans the top of the window. Use
the split shell: the brand moves into `AppSidebarHeader`, and the page has
no header or a borderless one with the new `TopBar variant="plain"`:

```tsx
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

`TopBar variant="plain"` has no border or blur and lines up with the page
frame; `bar`, the default, is unchanged. With no header at all, keep a
`<TopBar variant="plain" className="lg:hidden">` holding a `SidebarTrigger` so
the mobile drawer stays reachable, and put the desktop trigger beside the
page title. `docs/shell-navigation.md` covers the pattern, and the playground
example at `/examples/floating-workspace` switches between no header, a plain
header, and the bar.

### Toned metric tiles

`MetricCard` takes a new `tone` prop for headline tiles on overview pages:
`highlight` (brand peach), `supporting` (pale green), `accent` (pale electric
blue), and `muted`. Toned tiles drop their border and shadow, and the prop
works with or without a mood. Use at most one row of toned tiles, keep status
in badges and trends, and never put charts or tables on a tint.

```tsx
<MetricCard tone="highlight" label="Requests this week" value="3.1" unit="M" />
```

### New API and tokens

- Types and helpers: `ConsciaMood`, `moodOptions`, `moodProps`, `TopBarProps`.
- Props: `AppShell sidebarLayout`, `AppSidebar activeStyle`,
  `TopBar variant`, `MetricCard tone`. Every default keeps 1.6.1 behavior.
- Attributes: `data-mood`, `data-sidebar-layout`; components also render
  `data-sidebar-layout`, `data-sidebar-active`, `data-variant` (TopBar), and
  `data-tone` (MetricCard).
- Tokens: `--tint-accent` (with the `bg-tint-accent` utility),
  `--ds-ease-playful`, `--ds-app-sidebar-inset`, `--ds-app-sidebar-radius`,
  `--ds-sidebar-float-inset`, and `--ds-sidebar-float-radius`. The inset and
  radius are 0 unless a mood or floating layout sets them.

### Playground

- A Moods page switches the whole playground between moods and sidebar
  options and shows the same screen under each.
- A full-screen Floating workspace reference example. Routes under
  `/examples/` render without the playground shell so they can show complete
  applications.

## 1.6.1 - 2026-10-27

Page header fixes.

- Fix the `PageHeader` brand wash drawing a visible box when the header is
  inset by `PageFrame`. The wash now starts from the workspace corner, where
  the top bar and sidebar meet: `MainRegion` paints it from its content box,
  a `PageFrame` outside an app shell paints it from its own corner, and a
  header outside both gets a contained wash that fades out before every edge.
  It works with any `PageFrame` width and with a `DetailBackLink` above the
  header.
- Add `PageHeader texture={false}` to turn the wash off. The header keeps an
  opaque canvas background when the wash is off.
- A `PageHeader` inside a `Card` or `InventorySurface` takes the surface inset
  and the card surface without the wash, matching the toolbar below it, and
  never starts the page wash. Page headers on the canvas are unchanged.
- `ds-texture-wash` is documented as suitable only for elements whose
  top-left corner touches the workspace edges.

## 1.6.0 - 2026-10-27

Brand alignment with conscia.com: the brand palette, cool greys, electric
blue actions, Saans-first type, burgundy chrome, the dotted supergraphic, and
brand card tones. Token values change across the board, so review screenshots
of consuming products. `brand-emphasis` is deprecated.

Brand alignment, part 1: palette and roles.

- The full Conscia palette ships as `--palette-*` primitives: black,
  burgundy and burgundy-raised, electric blue with dark and pale steps, green
  with pale and palest steps, peach with dark and darkest steps, and the
  brand's cool greys. Roles reference these primitives.
- Light neutrals follow the brand's cool greys instead of the 1.5.0 burgundy
  cast. Canvas is `grey-200` (`#f3f4f5`), and surface, border, track, and
  table-header greys shift to match. Muted and supporting text stay darker
  than the brand's `grey-500`, keeping at least 4.5:1 on canvas.
- Actions use the brand electric blue `#4962ff` (4.69:1 with white text),
  hovering to the brand's dark step. Links, focus, and selection derive from
  the same hue in both themes.
- Supporting green backgrounds and borders use the brand's palest and pale
  greens.
- `brand-emphasis` is deprecated. Its plum values are gone; the tokens now
  alias the electric-blue accent roles and will be removed in 2.0. The
  primary `MetricCard` edge uses `brand-accent`, the brand `ValueMeter` runs
  from electric blue to green, and the brand state-view spot is a burgundy
  disc with an electric-blue icon. Textures tint with burgundy in light mode
  and electric blue in dark mode.
- Danger moves to an orange-red hue so it never reads as the brand peach.
  A new `highlight` role (`bg-highlight-background`, `border-highlight-border`,
  `text-highlight-foreground`, `text-highlight-accent`) carries the peach for
  case cards and callouts.
- Chart series are rebuilt from brand hues: electric blue, teal, rose, green,
  and slate blue. The light set passes the colorblind and normal-vision
  separation checks across all pairs; the dark set passes on adjacent pairs.

Brand alignment, part 2: typography.

- `--font-sans` starts with `"Saans"`, the Conscia brand typeface. The
  package does not bundle it because it is licensed; products with a licence
  self-host it and it takes over. Everyone else keeps Source Sans 3.
- Type uses the brand's three weights: regular 380, medium 570 and semibold
  670, exposed as `--ds-font-weight-*`. Tailwind's `font-normal`,
  `font-medium`, `font-semibold` and `font-bold` map to them, and no
  hard-coded weights remain.
- Heading tracking follows the brand: `-0.0137em` for display, page titles
  and metric values, and `-0.0096em` for section titles, in every density.

Brand alignment, part 3: burgundy chrome and the supergraphic.

- `AppSidebar variant="brand"` and the new `AppHeader tone="brand"` paint the
  app chrome Conscia burgundy in both appearances. Both set a
  `data-chrome="brand"` scope that re-points surface, text, border, focus,
  and control roles, so buttons, badges, and search inside read
  light-on-burgundy without extra classes. Defaults are unchanged.
- New `ds-supergraphic` utility draws the brand's dotted rings behind an
  element's content: electric blue in brand chrome, faint burgundy on light
  surfaces, and a softer blue in dark mode. It pairs with `ds-texture-brand`.
- The playground shell page demonstrates both. `BrandIcon` and
  `BrandWordmark` remain the logo components.

Brand alignment, part 4: brand components.

- `Card tone="brand" | "supporting" | "highlight"` brings the conscia.com
  service tiles and case cards into products. Brand and supporting cards use
  the light-on-dark chrome scope; highlight uses the peach role.
- `Badge shape="pill"` renders fully rounded category tags. Status badges
  stay rounded.
- New `Eyebrow` pattern renders the "CASE — OCTOBER 8, 2026" metadata line,
  with a `<time>` element when `dateTime` is set.
- The foundation page shows the brand palette and its usage ratio, the
  patterns page shows brand surfaces, and the agent guide gains a brand
  usage section.

## 1.5.1 - 2026-10-26

A patch release: the active option in segmented and pill tabs is now clearly
visible in light mode, and tables get distinct header and footer bands.
Consumers upgrade without code changes.

Tabs:

- Segmented tabs sit on a new `surface-track` band and the active option is a
  raised `surface-track-selected` chip with `shadow-raised` and a
  `border-subtle` ring. The selected fill reaches 1.33:1 against the track in
  light mode and 1.39:1 in dark mode (previously about 1.01:1 in light mode).
- Pill tabs, including `NavigationTabsList variant="pills"`, fill the active
  pill with the new `selection-background-strong` token and add a
  `selection-border` ring. The fill reaches 1.31:1 against the canvas and
  1.44:1 against white surfaces in light mode, 1.57:1 and 1.46:1 in dark mode
  (previously about 1.06:1 against white). Text colours, focus rings, hover
  states, layout and sizes are unchanged.
- The Tabs playground page shows both variants on the canvas and inside a
  `DataPanelHeader`, and joins the visual baseline routes.

Tables and toolbars:

- Sortable `DataTable` headers use the table-head type (size, weight, tracking,
  uppercase) like plain headers. The sort control is now a plain button
  carrying `ds-type-table-head`, so a `Button`'s `ds-type-button` size no longer
  wins in a table that mixes sortable and static columns.
- A `PageToolbar` inside a `Card` or `InventorySurface` takes the surface inset
  (`--ds-surface-padding`) and keeps its bottom border on the card surface, so
  the search field and trailing actions no longer touch the card edges inside a
  `PageFrame`. Standalone toolbars on the page canvas are unchanged. Products
  can remove hand-added toolbar padding and global toolbar overrides.

Charts:

- `DailyVolumeChart` colours its successful series with the `success` token
  instead of the first chart series blue, so "Successful" matches outcome
  badges and breakdowns on the same page. New `successfulTone` and
  `unsuccessfulTone` props (`success`, `danger`, `warning`, `information`,
  `accent`) choose the series colours, and `successfulLabel` names the main
  series in the legend. Pass `successfulTone="accent"` to keep the previous
  blue for a measure with no outcome.

Tables:

- Column headers and the `DataTable` pagination footer sit on a new
  `surface-table-header` band, darker than both the rows and the card, with a
  `border-default` divider. `TableFooter` uses the same band. Header labels
  keep 5.26:1 contrast in light mode and 7.20:1 in dark mode.
- Inside a `Card` or `InventorySurface`, `DataTable` rows and `PageToolbar`
  take the card surface instead of painting the canvas. Products can drop
  rules that forced in-card toolbars onto the card surface.
- `TableCaption` is now screen-reader-only by default, and `Table` places
  visible captions above the table. Pass `visible` to show one, or
  `showCaption` on `DataTable` and `EntityTable`. A caption no longer renders
  between the last row and the pagination.
- On a coarse primary pointer, `--ds-control-height`, `-sm` and `-lg` rise to
  at least 44px in every density. Pagination buttons, the Rows control and
  sortable headers reach touch size without product overrides, so remove
  blanket `[&_button]:min-h-11` rules. Sortable header buttons now follow
  `--ds-control-height-sm` instead of a fixed 32px.

## 1.5.0 - 2026-10-26

A livelier visual layer that keeps the existing principles: semantic tokens,
density, and accessible contrast.

Foundation:

- Neutrals carry a faint Conscia burgundy cast in both themes, and the light
  canvas sits a step below white so surfaces lift. Muted text contrast on
  canvas improves from 4.43:1 to 5.02:1. Several light and dark neutral token
  values change.
- New three-tier elevation scale: `--ds-shadow-raised`, `--ds-shadow-floating`,
  and `--ds-shadow-overlay`, with dark-mode edge highlights and matching
  `shadow-raised`, `shadow-floating`, and `shadow-overlay` utilities. `Card`
  now rests on the raised tier by default. `Select` uses floating, and
  `Dialog`, `AlertDialog`, and `Sheet` use overlay.
- Stronger type hierarchy: heavier, tighter page titles (`--ds-page-title` is
  now 1.875rem comfortable and 1.625rem compact), separate
  `--ds-display-*` and `--ds-section-title-tracking` tokens, and a
  `ds-type-metric-value` utility for metric readouts. Bare `h1`–`h4` take the
  section title weight and tracking.
- New `brand-emphasis` color role, a mid-tone burgundy for identity accents,
  used on the primary `MetricCard` edge and state-view spots. Blue stays
  reserved for actions and selection.
- Motion tokens (`--ds-duration-*`, `--ds-ease-*`, `ease-standard`,
  `ease-enter`, `ease-exit`). Dialogs, alert dialogs, sheets, popovers, menus,
  selects, tooltips, and toasts now animate in and out; the
  `animate-in`/`animate-out` classes they carried had no backing utilities and
  are removed. Viewers who prefer reduced motion see overlays appear and
  disappear at once.
- `ds-texture-wash` (used by `PageHeader`) and `ds-texture-brand` utilities, the
  latter with a faint Conscia mark watermark, plus a soft glow behind the
  sidebar header. Textures are for chrome and brand moments, never behind data.

Charts and metrics:

- The chart series palette no longer reuses status colors. Series 1–5 are
  electric blue, plum, green, copper, and violet, validated per theme for
  color-vision separation and 3:1 contrast. `DailyVolumeChart` marks
  unsuccessful volume with the danger status color. New
  `--chart-area-opacity-start` and `--chart-area-opacity-end` tokens.
- `MetricCard` gains an opt-in `countUp` for numeric values, with `format`,
  `locale`, and `durationMs` options. Screen readers hear only the final value.
- `MetricTrend` renders as a tinted badge. Positive trends use Conscia green
  (`--trend-positive` now maps to `--brand-supporting`), with new
  `--trend-*-background` tokens.
- `ValueMeter` adds a `brand` tone, now the default, filled with a blue-to-
  burgundy blend. Pass `tone="neutral"` for the previous appearance.

Components:

- `Button` presses down slightly when active. `Card` adds `interactive` for
  cards that are links or entry points. `Skeleton` shimmers instead of pulsing.
- `TableRow` adds `interactive`, a pointer plus an action-colored edge rail on
  hover and focus. `DataTable` sets it for clickable rows.
- `StateView` renders its icon in a duotone spot and adds `tone` (`brand`
  default, `neutral`, `success`); `ErrorState` uses `danger`.
- The `nested` Tabs variant uses the Conscia green indicator.
- Refresh the playground visual baselines for the new foundation.

## 1.4.0 - 2026-10-20

- Add `variant="pills"` to `NavigationTabsList`, sharing the `Tabs` pills
  treatment so route-backed navigation can use pills while keeping link
  semantics and `aria-current="page"`. Underline remains the default.

Admin UI design-system handoff (DS-08 to DS-23):

- `Table` scrolls wide content horizontally by default instead of clipping it,
  and fades the edge that has more columns while scrolled. `scrollable={false}`
  is an explicit opt-out for callers that render a stacked layout.
- `StateView` and `ErrorState` no longer draw a bottom border. Add `divider` for
  states inside a table body, and `size="compact"` for empty states inside
  sections.
- `FormSelect` treats an empty value as no selection and never shows its
  internal sentinel.
- `PaginationControls` shows the current page with the selected-tab treatment
  in both themes, and page buttons share the Rows control height. New
  `paginationPageSizes` documents 25 rows for inventories and 10 for detail
  tables. Sortable `DataTable` headers use the table header type style.
- New `Disclosure`, `DateTimeField`, and `Stepper` primitives, a
  `DailyVolumeChart` pattern, and a `nested` Tabs variant.
- `PageFrame`, `PageHeader`, `PageToolbar`, and `DetailBackLink` share one left
  edge through the new `--ds-frame-padding-x` token. Empty `PageToolbar` slots
  collapse.
- `MetricBandItem` reserves its detail line so values share a baseline, and
  renders missing values quietly, with an optional `emptyValue`.
- Dark mode: a quieter `--danger-background` with higher text contrast, and a
  lighter `--chart-series-1` (at least 3:1 against every dark surface).
- Disabled primary buttons keep a tinted action surface with readable text.
- `Badge` sizes to its content by default; tone meanings are documented.

- Refresh the playground visual baselines and update the interaction specs for
  the redesigned playground header and navigation.

## 1.3.0 - 2026-10-06

- Polish the playground with compact quiet navigation, header appearance and
  density controls, searchable component catalogs, category filters, and useful
  empty states. Component documentation adds section links and previous/next
  navigation, with consistent spacing across desktop and mobile.
- Enable the playground search shortcut and match public export names as well as
  component families. Include the overflowing CodeBlock keyboard accessibility
  fix from PR #15 before publishing.
- Keep CodeBlock tab rails keyboard reachable during hydration and at one-pixel
  overflow boundaries, including browser-specific vertical overflow.

- Keep CodeBlock tabs and copy reachable in narrow containers, with independent tab and code scrolling, contextual selector labels, and constrained-container regression coverage.
- Add the optional `AppSidebar treatment="quiet"`, mapped to existing semantic surface and selection roles while preserving appearance variants and default styling.
- Extend `MetricBand` with an opt-in compact presentation: full-width metric rows below desktop, configured horizontal columns at desktop, React-node values, loading skeletons, and an accessible unavailable value.
- Correct `ActivityItem` prop types so its existing React-node title and metadata slots accept direct diagnostic links and timestamp content without changing row behavior.
- Add a discoverable developer-overview example combining quiet navigation, compact metrics, attention, recent requests, loading/unavailable states, and an empty state; update component guidance and the agent guide.

## 1.2.2 - 2026-10-05

- Make underline tabs quiet by default, removing the full-width rail from content and routed navigation tabs. Use `variant="divider"` on `Tabs` or `NavigationTabsList` to preserve the previous rail.
- Add `variant="pills"` for small groups of peer views; preserve segmented controls.
- Add a dedicated Tabs playground page linked from Components, showcasing quiet, divider, pills, compact, and segmented tabs.
- Update component and consumer guidance with tab variants and migration instructions.

## 1.2.0 - 2026-09-07

- Restore official Conscia burgundy (`#1e0721`) as the primary `brand` role,
  add stable burgundy, electric-blue, and green palette primitives, and expose
  theme-aware `brand-accent` and `brand-supporting-*` semantics.
- Preserve `brand-secondary-*` as v1 compatibility aliases, keep operational
  actions independent from brand identity, and move the first chart series to
  the accessible blue brand accent.
- Document the intentional `bg-brand` visual change and add source, packaged
  consumer, contrast, dark-mode, and playground coverage for the corrected
  contract.

## 1.1.2 - 2026-09-05

- Add the preferred integrated application header with structured start,
  responsive search, and action regions while retaining the split v1 shell.
- Add explicit static sidebar groups and opt-in submenus, remove the active
  left indicator, and retain legacy untyped collapsible sections for migration.
- Add chart/trend tokens, `MetricCard`, `MetricTrend`, `DataPanel`, and
  `AttentionList`, plus flexible leading/trailing activity-row slots.
- Expand the playground with an enforceable public-component inventory,
  pattern and shell catalogs, and a responsive delivery-metrics reference.
- Add package-local agent guidance, a generated component manifest, an
  idempotent consumer `AGENTS.md` initializer, and a static GitHub Pages
  deployment for the playground.

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
