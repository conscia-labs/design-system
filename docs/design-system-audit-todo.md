# Design system audit: status and todo

Status of every suggestion from the November 2026 audit. Checked items are
implemented; `fix/1.7.5` holds the bug fixes and `feature/1.8.0-components`
holds the new components and the Field work.

## Done

### Abstractions

- [x] **One field shell.** `Input`, `Textarea`, `SelectTrigger`,
      `SearchableSelect`, `DateTimeField`, `InputGroup`, and `NumberField`
      share `src/primitives/field-control.ts`.
- [x] **A Field that wires itself.** `Field` connects label, description,
      error, and `invalid` to the control inside it. `Label` and `FieldLabel`
      share that wiring, and all Field parts still work outside a `Field`.
- [x] **`pending` on Button.** `LoadingButton` is now a preset of it. Without
      a `pendingLabel` the button keeps its width.
- [x] **Private segmented control replaced** by the `SegmentedControl`
      primitive in the preference controls.
- [x] **Height animation on Collapsible and Disclosure.**
- [x] **Uncontrolled sorting in DataTable** (part of "DataTable as the only
      table").

### Visual polish

- [x] Pill radius capped on the filter bar and attention items.
- [x] Outline buttons distinguishable from disabled ones.
- [x] Red error text; solid destructive button in dark mode.
- [x] Elevated cards differ from default and muted in dark mode.
- [x] Field borders at about 3:1.
- [x] Delivery metrics: padded hero chart with an axis; status wraps below
      narrow metric titles.
- [x] One case for sortable and plain table headers.
- [x] `text-wrap: balance`, tabular numerals in tables, `dvh` for overlays.

### Components

- [x] RadioGroup
- [x] SegmentedControl
- [x] Breadcrumb
- [x] Accordion
- [x] Progress
- [x] InputGroup
- [x] NumberField

## Todo

Ordered by suggested sequence: polish that users see, then accessibility and
tokens, then naming, then larger refactors, then new components.

### 1. Visual polish

Done, except:

- [ ] Airy fields are still borderless fills, so they do not meet 3:1 at rest.
- [ ] The delivery metrics hero chart has an x axis only, drawn by hand in
      the playground page.

The floating top bar already had a blurred fill once scrolled; nothing
changed there.

### 2. Accessibility and tokens

- [ ] Focus rings: one recipe, solid enough to pass 3:1, plus a
      `forced-colors` rule.
- [ ] Dark mode selector: make `dark:` utilities match
      `data-appearance="dark"` as well as `.dark`.
- [ ] Brand chrome: re-point `--text-link`, track, and hover tokens (link text
      on burgundy is about 2.4:1).
- [ ] Dark `--action-hover` under white text is about 4:1; darken it.
- [ ] One radius system: derive `--radius` from `--ds-radius-*` (or the
      reverse) and add `--ds-radius-pill`.
- [ ] Raw values onto scales: shell z-index 10/20/30, about 18 raw durations,
      `bg-black/50` scrims (add a scrim token), `text-white` on destructive
      buttons.
- [ ] Remove dead tokens: `--sidebar-active-indicator`, `--text-disabled`,
      `--ds-space-inline`, `brand-secondary-*`, `brand-emphasis-*`.

### 3. Naming (aliases now, removals at 2.0)

- [ ] Tone names: standardise on `danger`; alias `destructive` (Button, menu
      item), `error` (Toast), and Badge's duplicate pairs.
- [ ] Size names: standardise on `sm | default | lg`; alias Dialog's
      `small | large` and the `compact` variants.
- [ ] Prop names: `actions`, `description`, `title` everywhere; retire
      PageHeader's `action` / `actionNode`.
- [ ] Link rendering: `render` on `NavigationTab`, `DetailBackLink`, and
      `PageHeader`'s back link, as Button and BreadcrumbLink have.
- [ ] Code style: format the one-line files (`select`, `dialog`,
      `alert-dialog`, `popover`, `dropdown-menu`, `tooltip`).

### 4. Larger refactors

- [ ] DataTable as the only table: fold in `EntityTable` and
      `InventoryDesktop/Mobile`; add uncontrolled pagination and selection,
      `loading` / `error` / `empty` states in the body, sticky header, column
      visibility, and row context for `mobileRow`.
- [ ] One surface and one heading block: build `DataPanel`,
      `InventorySurface`, `DetailSection`, and `ResourceSummary` on `Card`;
      extract a shared heading with a `headingLevel` prop.
- [ ] One `MetricValue` shared by `MetricCard`, `MetricBandItem`, and
      `ValueMeter` (empty value, loading height, count-up).
- [ ] Split `app-shell.tsx` into sidebar state, sidebar, navigation, header,
      and page frame; add a controlled `sidebarOpen`.
- [ ] Shared overlay classes for Dialog and AlertDialog; one scroll-position
      hook for Table and Tabs.

### 5. New components

High priority:

- [ ] DatePicker and date range
- [ ] Multi-select Combobox

Medium priority:

- [ ] Slider
- [ ] Checkbox and radio menu items
- [ ] ContextMenu
- [ ] HoverCard
- [ ] Banner or dismissible Alert
- [ ] FileUpload
- [ ] TagInput
- [ ] ScrollArea

Small additions:

- [ ] Avatar `size` and status dot
- [ ] Badge dot / icon
- [ ] Toast icons and loading variant
- [ ] Animated tab indicator
- [ ] Sheet sizes
- [ ] Chart loading / empty states
- [ ] Timeline

### 6. Bugs left open from the audit

- [ ] `MetricCountUp` shows the final value, drops to 0, then counts up.
- [ ] `SheetContent` `side` moves the panel but not the slide or swipe
      direction.
- [ ] Sidebar open state and side are corrected after mount (layout shift).
- [ ] Tooltip arrow has no per-side offset.
- [ ] The Playwright accessibility test sometimes fails with
      `net::ERR_ABORTED` on `page.goto` when the dev server reloads mid-run;
      it passes on a re-run. Consider running the suite against a production
      build.
- [ ] With a `pendingLabel`, a pending button can still change width. Fixing
      it means rendering both labels, which the existing LoadingButton test
      forbids.
