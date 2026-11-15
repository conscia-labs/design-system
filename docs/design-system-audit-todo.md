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

### Accessibility and tokens

- [x] One focus ring colour at 3:1, plus a forced-colours outline.
- [x] `dark:` utilities match `data-appearance="dark"`.
- [x] Brand chrome link and action hover tokens.
- [x] Darker dark-mode `--action-hover`.
- [x] `--ds-radius-pill`, `--scrim`, `--danger-solid-foreground`; raw
      durations onto the duration tokens.

### Naming and bugs

- [x] `danger`, `sm` and `lg` aliases; `render` on NavigationTab and
      DetailBackLink; deprecated PageHeader `action` / `actionNode`.
- [x] `MetricCountUp` flash, tooltip arrow side, SheetContent `side`
      (deprecated in favour of `Sheet side`).
- [x] Playwright `net::ERR_ABORTED` flake: navigation is retried once.

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

Done, except:

- [ ] One radius system: `--radius` and `--ds-radius-surface` differ in the
      balanced and airy moods, so deriving one from the other changes how
      those moods look. Needs a design decision. `--ds-radius-pill` exists.
- [ ] Shell z-index 10/20/30 is still raw.
- [ ] Dead tokens (`--sidebar-active-indicator`, `--text-disabled`,
      `--ds-space-inline`, `brand-secondary-*`, `brand-emphasis-*`) are
      public, so removing them is a 2.0 change.

### 3. Naming

Aliases are in. Left for 2.0 or later:

- [ ] Remove the old names (`destructive`, `error`, `small`, `large`,
      `compact`, PageHeader's `action` / `actionNode`, SheetContent's `side`).
- [ ] Badge still has `danger` and `destructive` as separate variants.
- [ ] Format the one-line files (`select`, `dialog`, `alert-dialog`,
      `popover`, `dropdown-menu`, `tooltip`). The repo has no formatter, so
      this needs one added first.

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

- [x] DatePicker and date range
- [x] Multi-select Combobox

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

- [x] Avatar `size` and status dot
- [x] Badge dot / icon
- [x] Toast icons and loading variant
- [ ] Animated tab indicator
- [x] Sheet sizes
- [x] Chart loading / empty states
- [ ] Timeline

### 6. Bugs left open from the audit

- [ ] Sidebar open state and side are corrected after mount (layout shift).
- [ ] With a `pendingLabel`, a pending button can still change width. Fixing
      it means rendering both labels, which the existing LoadingButton test
      forbids.
- [ ] Tooltip arrow offsets for `left`, `right` and `bottom` follow the same
      rule as `top` but only `top` was checked in a browser.
