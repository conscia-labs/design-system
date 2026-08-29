# Base UI v1 Migration

Status: **Phase 5.5 complete**

Branch: `feature/base-ui-migration`

Starting commit: `064aad7` (`v0.4.0`)

Package: `@conscia-labs/design-system`

Current package version: `0.4.0`

## Objective

Release `@conscia-labs/design-system@1.0.0` as a Conscia-owned design system with Base UI providing behavior and accessibility for complex components, and custom Conscia implementations providing the component APIs, styling, and visual language.

The migration must remove Radix dependencies and shadcn-derived component source. Existing component names and concepts remain recognizable, but v1 is a clean API break where implementation details such as `asChild` are not preserved.

The current visual language is the baseline. A component implementation may be rewritten without changing its appearance, spacing, density behavior, dark mode, or accessibility semantics unless a separate design decision records the change.

## Non-goals

- Do not copy Kumo source code or adopt Kumo as a runtime dependency.
- Do not introduce the shadcn CLI, registry, `components.json`, or generated shadcn files.
- Do not expose raw Base UI primitives from the package root.
- Do not make every simple visual component depend on Base UI.
- Do not perform an unplanned visual redesign during the behavior migration.
- Do not preserve Radix implementation details as part of the v1 public API.

Kumo is used as architectural inspiration: custom styled components layered over Base UI behavior, with generated low-level primitives considered only if they reduce maintenance later. Base UI's `render` convention is the replacement direction for the current slot-like composition behavior.

## Locked v1 decisions

| Decision | v1 policy |
| --- | --- |
| Public naming | Retain current public component names and concepts; internal files may be reorganized. |
| Compatibility | Clean API break. Existing Radix-specific props are not compatibility requirements. |
| Composition | Remove `asChild`. Use `render` only on action/trigger components that need custom host composition. |
| Searchable select | Keep `SearchableSelect` as the public name initially; implement it using Base UI Combobox behavior. |
| Simple components | Re-author as Conscia-owned React components. |
| Complex behavior | Re-author Conscia wrappers around Base UI. |
| Base UI packaging | Add `@base-ui/react` as a runtime dependency, keep React/React DOM as peers, and bundle Base UI into the distribution. |
| Root exports | Do not export a raw Base UI primitive barrel. |
| Generic utilities | `cn`, `clsx`, `tailwind-merge`, and class-variance-authority may remain as generic utilities. |
| Internal anatomy | Existing `data-slot` markers may remain temporarily to avoid styling churn; they are not a v1 public contract. |
| State styling | Replace Radix-specific variables and selectors with Base UI state attributes or Conscia-owned state hooks. |
| Baseline | Playwright Chromium screenshots and browser interaction checks. The local runner uses installed Chromium-based Chrome; CI may override the channel. |

## Milestone roadmap

- [x] Phase 0 — Contract, branch alignment, inventory, and health baseline.
- [x] Phase 1 — Playground visual and interaction baseline.
- [x] Phase 2 — Base UI dependency, packaging, and implementation conventions.
- [x] Phase 3 — Rewrite simple custom primitives.
- [x] Phase 4 — Rewrite behavior-heavy primitives with Base UI.
- [x] Phase 5 — Rewrite composed patterns and application shells.
- [x] Phase 5.5 — Add supporting primitives and interaction patterns.
- [ ] Phase 6 — Remove Radix-specific styling and normalize tokens.
- [ ] Phase 7 — Accessibility, interaction, responsive, and regression QA.
- [ ] Phase 8 — Package hardening, migration guide, version `1.0.0`, and release.

Each phase requires its exit criteria and evidence to be recorded here before the next phase starts.

## Phase 0 — Contract and inventory

### Branch alignment

- [x] Confirm clean worktree before migration work.
- [x] Check out the existing local `feature/base-ui-migration` branch.
- [x] Fast-forward the feature branch to `main` using `--ff-only`.
- [x] Preserve existing feature-branch history; no reset or force push.
- [x] Record the first migration implementation commit after Phase 0 is complete: `53aea84`.

The feature branch was at `46aeb79` (`v0.3.4`) and was a clean ancestor of `main` at `064aad7` (`v0.4.0`). It was fast-forwarded without a merge commit.

### Current implementation inventory

#### Custom Conscia-owned components to re-author

These components do not need Base UI behavior as their primary implementation:

- `Alert`
- `Avatar`
- `Badge`
- `BrandIcon`
- `Button`
- `Card`
- `Field`
- `Input`
- `Label`
- `Separator`
- `Skeleton`
- `Table`
- `Textarea`

The current visual variants, class names, token usage, and accessibility attributes are retained as the baseline while their source is re-authored where needed.

#### Base UI behavior wrappers to re-author

- `Checkbox`
- `Collapsible`
- `Dialog`
- `Sheet`
- `DropdownMenu`
- `Select`
- `FormSelect`
- `SearchableSelect`
- `Switch`
- `Tabs`
- `Tooltip`

These remain Conscia APIs. Base UI is an internal behavior layer, not the public component identity.

#### Pattern consumers to migrate after primitives

- App shell and mobile sheet behavior.
- Sidebar navigation and collapsible sections.
- Confirmation dialog.
- Data/entity tables and row actions.
- Workbench and reference patterns.

#### Current Radix dependency inventory

The current package manifest contains these Radix dependencies and they are all migration candidates for removal:

```text
@radix-ui/react-avatar
@radix-ui/react-checkbox
@radix-ui/react-collapsible
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-label
@radix-ui/react-select
@radix-ui/react-separator
@radix-ui/react-slot
@radix-ui/react-switch
@radix-ui/react-tabs
@radix-ui/react-tooltip
```

Current Radix imports are present in the primitive implementations and in `src/patterns/app-shell.tsx`. Current slot-like composition is also present in `src/primitives/button.tsx`, `src/patterns/app-shell.tsx`, `src/patterns/sidebar-navigation.tsx`, `src/patterns/confirmation-dialog.tsx`, and the playground examples.

#### Styling and test inventory

- `src/foundation/styles.css` uses Radix collapsible variables and Radix-style `data-state` selectors.
- Select styling references Radix select sizing and transform-origin variables.
- Several playground and pattern call sites use `asChild`.
- `playground/src/test/design-system-playground.test.mjs` asserts Radix imports and source implementation details.
- `src/test/components.test.tsx` contains behavior checks and state-attribute assertions.
- Package verification is handled by `scripts/verify-package.mjs` and `scripts/test-packaged-consumer.mjs`.

#### Public export inventory

- `src/primitives/index.ts` exports all current primitives.
- `src/patterns/index.ts` exports all current patterns.
- `src/client.ts` exposes foundation, patterns, and primitives through the package root.
- The v1 migration keeps the named Conscia exports but does not expose raw Base UI modules.

#### External consumers

Local workspace inspection found the package source, playground, package consumer fixture, and repository documentation. External consumers outside this repository are **not confirmed** and must not be assumed absent. The package README, consumer fixture, and published package metadata are the available local compatibility evidence.

### Compatibility matrix

The detailed matrix is maintained by component family as migration work begins. Every row must record current behavior, target behavior, visual baseline coverage, tests, composition needs, and migration status.

| Component family | Current behavior source | v1 implementation | Composition | Baseline coverage | Status |
| --- | --- | --- | --- | --- | --- |
| Simple visual primitives | Custom Conscia files | Custom Conscia React | Native props; `render` only where required | Phase 1 primitives page | Pending |
| Dialog and Sheet | Radix Dialog wrappers | Base UI Dialog wrappers | `render` on triggers/close actions where required | Open/close/focus/mobile | Pending |
| Menu | Radix Dropdown Menu | Base UI Menu wrapper | `render` on trigger where required | Keyboard and selection | Pending |
| Select and FormSelect | Radix Select wrappers | Base UI Select wrapper | Native trigger API plus controlled state | Open/select/keyboard | Pending |
| SearchableSelect | Custom combobox behavior | Base UI Combobox wrapper | Explicit Conscia API | Filter/select/keyboard | Pending |
| Tabs | Radix Tabs wrapper | Base UI Tabs wrapper | Native tab anatomy | Selected panels | Pending |
| Tooltip | Radix Tooltip wrapper | Base UI Tooltip wrapper | `render` on trigger where required | Hover/focus | Pending |
| Checkbox, Switch, Collapsible | Radix wrappers | Base UI wrappers | Native trigger API | State changes | Pending |
| Patterns | Mixed primitive consumers | Conscia patterns using v1 primitives | Rewrite after primitives | Reference patterns | Pending |

### Phase 0 health evidence

Run and record every command before starting component rewrites:

```text
pnpm test
pnpm typecheck
pnpm typecheck:playground
pnpm lint
pnpm lint:playground
pnpm test:package
pnpm test:consumer
pnpm build:playground
```

| Command | Result | Classification | Notes |
| --- | --- | --- | --- |
| `pnpm test` | Pass | — | 30 contract tests and 18 unit tests pass. Vitest uses the proven single-worker VM-thread pool. |
| `pnpm typecheck` | Pass | — | No diagnostics. |
| `pnpm typecheck:playground` | Pass | — | Includes the new Playground fixture and Playwright test TypeScript. |
| `pnpm lint` | Pass | — | No diagnostics. |
| `pnpm lint:playground` | Pass | — | No diagnostics. |
| `pnpm test:package` | Pass | — | Build, `publint`, package artifact, and public import verification pass. |
| `pnpm test:consumer` | Partial | Environment/setup | Package build and pack pass; fixture install is blocked by unavailable npm registry DNS in the environment. |
| `pnpm build:playground` | Pass | — | Production build compiles and prerenders all routes. |

Failure classifications are limited to existing failure, environment/setup failure, or migration-relevant failure. Unknown failures block the Phase 0 exit gate.

### Phase 0 exit criteria

- [x] Branch is aligned with `main`.
- [x] v1 API and no-shadcn policy are recorded.
- [x] Initial dependency, source, style, test, and export inventory is recorded.
- [x] Compatibility matrix is established.
- [x] External consumer status is explicitly marked unconfirmed.
- [x] All health commands have fresh results recorded and failures are classified.
- [x] No component implementation has been rewritten; only baseline fixtures and test infrastructure were added.

## Phase 1 — Playground visual and interaction baseline

Phase 1 freezes the current implementation before Base UI rewrites begin. It is a measurement phase, not a visual redesign.

### Browser infrastructure

Add Playwright as a development dependency and configure Chromium against:

```text
pnpm dev:playground
http://127.0.0.1:3020
```

Required implementation pieces:

- Root Playwright configuration.
- Stable visual test directory and snapshot paths.
- `test:visual` script.
- `test:visual:update` script.
- Fixed locale and timezone.
- Font readiness wait.
- Animation and transition suppression for screenshots.
- No network-dependent fixture data.
- Committed baseline screenshots.

The baseline test file contains 40 tests: 36 visual cases and 4 interaction suites. `playwright.config.ts` uses the installed Chromium-based Chrome channel locally to avoid requiring a separate browser download, while retaining the `chromium` project name and allowing `PLAYWRIGHT_CHANNEL` to override it.

### Deterministic preference state

The test fixture initializes both current storage key generations:

```text
conscia-appearance
conscia-density
conscia-appearance:v1
conscia-density:v1
```

Screenshots use explicit `light` or `dark` appearance. `system` is covered by an interaction test with emulated system color schemes, not golden screenshots.

### Required playground coverage

The existing playground structure and aesthetics remain. The primitives page receives only the missing deterministic examples required to represent the public primitive surface:

- Button variants and sizes.
- Avatar, Badge, Alert, Card, Separator, and Skeleton.
- Input, Textarea, Field, Label, Description, and Error states.
- Checkbox checked/unchecked and Switch on/off.
- Select, FormSelect, and SearchableSelect.
- Tabs with selected and unselected panels.
- Dialog and Sheet open/closed states.
- Dropdown Menu open/closed states.
- Tooltip visible/hidden states.
- Collapsible expanded/collapsed states.
- Table selected, normal, empty, and overflow states.

All fixture data must be static and must not use timestamps, randomness, or network requests.

### Visual snapshot matrix

Create full-page snapshots for each route and state below:

- Routes: `/foundation`, `/primitives`, `/reference-patterns`.
- Viewports: desktop `1440x1100`, mobile `390x844`.
- Appearance: light and dark.
- Density: comfortable, compact, and operational.

Snapshot names must include route, viewport, appearance, and density.

### Required browser interactions

- Dialog opens, exposes its title, closes with Escape, and restores focus.
- Sheet opens and closes, including mobile behavior.
- Dropdown menu supports keyboard navigation and closes correctly.
- Select supports keyboard selection and updates its visible value.
- SearchableSelect filters, navigates, selects, and closes correctly.
- Tabs update selected state and visible panel content.
- Tooltip appears on hover and keyboard focus.
- Checkbox, Switch, and Collapsible update their state.
- Appearance and density preferences update document state and persist after reload.
- Reference-pattern search, sorting, filtering, selection, and loading/empty/error states remain functional.
- Mobile routes do not introduce unintended horizontal overflow.

### Phase 1 exit criteria

- [x] Playwright is reproducible with Chromium-based Chrome.
- [x] All public primitives have deterministic playground examples.
- [x] Full visual snapshot matrix is committed: 36 PNG snapshots.
- [x] Interaction and keyboard tests pass: 4 suites.
- [x] Two consecutive clean visual runs have no unexplained differences: 40/40 passed on each run.
- [x] Existing unit, contract, typecheck, lint, package, and playground build checks pass.
- [x] Baseline command evidence is recorded here.
- [x] No Base UI migration has started.

## Later implementation sequence

1. Add Base UI and packaging conventions.
2. Rewrite simple custom primitives without copying shadcn source.
3. Rewrite behavior families in this order: Dialog/Sheet, menus, Select/SearchableSelect, Tabs, Tooltip, Checkbox/Switch/Collapsible.
4. Rewrite patterns after their primitive dependencies stabilize.
5. Add focused supporting primitives and interaction patterns before token cleanup.
6. Remove Radix dependencies and Radix-specific CSS variables.
7. Replace source-level implementation assertions with behavior contracts.
8. Run the visual baseline after every component family.
9. Harden package metadata, documentation, migration notes, and release checks.
10. Release v1 only after no Radix imports, no shadcn-derived component source, and complete validation evidence.

## Phase 2 — Base UI dependency, packaging, and conventions

Phase 2 establishes Base UI as an internal implementation dependency. Existing
Radix-backed components and their public APIs remain unchanged until the later
rewrite phases.

### Locked conventions

- `@base-ui/react` is pinned exactly to `1.7.0` as a runtime dependency.
- React and React DOM remain peer dependencies; Base UI is not a peer dependency.
- Base UI is imported by component path and no raw Base UI namespace is exported.
- `tsup` externalizes only React and React DOM, so Base UI is bundled into the distribution when production wrappers begin importing it.
- `render` and `useRender` replace new `asChild`/Slot patterns only where composition is required.
- `data-slot` remains internal anatomy; Base UI state attributes are styling inputs, not public contracts.
- The playground application root uses `isolation: isolate` for predictable portaled layering.
- No production primitive or pattern is rewritten in this phase.

### Proof harness and package evidence

- [x] Base UI component-path imports resolve for the planned behavior families.
- [x] `render` composition merges props and refs on a custom host.
- [x] Dialog dismissal, checkbox/switch state, and collapsible state work in the test environment.
- [x] A closed Base UI root renders through React server rendering.
- [x] Package verification rejects unresolved Base UI imports in `dist`.
- [x] The package root continues to expose Conscia components only.
- [x] Existing visual snapshots remain the reference after portal-root setup.

Phase 2 evidence: the proof harness passes 4/4; `pnpm test`, typechecks, lint,
package verification, and the production playground build pass; and two
consecutive `pnpm test:visual` runs pass 40/40. `pnpm test:consumer` completes
package build and pack verification but its fixture install remains blocked by
unavailable npm registry DNS in the environment.

## Phase 3 — Conscia-owned simple primitives

Phase 3 rewrites the simple visual primitives without copying shadcn source or
using Radix Slot. Behavior-heavy primitives remain on their existing Radix
implementations for Phase 4.

### Implemented contract

- `Button` is a native/custom-host Conscia component with the existing variants,
  sizes, default `type="button"`, `buttonVariants`, and narrowly scoped Base UI
  `render` composition. `asChild` is not supported.
- `IconButton` is the canonical accessible icon-only action. It requires an
  `aria-label` or `aria-labelledby`, supports `sm`, `default`, and `lg`, and
  keeps `Button size="icon"` as a migration-compatible API.
- `Avatar`, `Label`, `Separator`, `Input`, `Textarea`, and `Skeleton` are
  native/custom React implementations with explicit loading, semantic,
  invalid-state, and decorative behavior.
- `Alert`, `Badge`, and `BrandIcon` remain Conscia-owned visual primitives with
  semantic variants and existing token/dark-mode behavior.
- `Alert` uses a non-live `group` relationship by default, automatically wiring
  composed title and description IDs while preserving explicit consumer IDs.
- `Card` now supports `default`, `muted`, and `elevated` variants, header
  actions, and `CardFooter` without introducing an interactive-card primitive.
- `Table` retains low-level semantic anatomy and adds `TableCaption` and
  `TableFooter`; `DataTable` remains the operational pattern.

### Phase 3 evidence

- [x] Six bounded primitive groups compile and pass focused behavior tests.
- [x] `src/test/simple-primitives.test.tsx` covers native semantics, image
  fallback, state styling, composition, anatomy, and representative axe checks.
- [x] `@radix-ui/react-avatar`, `@radix-ui/react-label`, and
  `@radix-ui/react-separator` were removed. Radix Slot and behavior-family
  packages remain intentionally deferred.
- [x] Package verification covers `IconButton`, `CardFooter`, `TableCaption`,
  and `TableFooter`, and confirms Base UI is bundled rather than imported by
  consumers.
- [x] Playground coverage includes IconButton, Card variants/actions/footer,
  and Table caption/footer. Intentional Phase 3 changes refreshed 15 visual
  snapshots: primitive additions changed the `/primitives` route, and row
  state anatomy changes affected the mobile reference-pattern captures.
- [x] `pnpm test`, typechecks, lint, package verification, and the playground
  build pass. The refreshed visual suite passes 40/40 on two consecutive clean
  runs; existing development hydration warnings remain documented for the
  behavior-family migration.
- [x] Avatar source replacement resets before paint, preventing a stale loaded
  image from appearing while the replacement source resolves.

### Deferred by design

The behavior-heavy Dialog, Sheet, menus, Select, SearchableSelect, Tabs,
Tooltip, Checkbox, Switch, and Collapsible families are not rewritten here.
No specialized CompactTable, InteractiveTable, or InteractiveCard components
were added.

## Phase 4 — Base UI behavior primitives

Phase 4 replaces the behavior-heavy Radix wrappers with Conscia-owned Base UI
wrappers. Dialog, Drawer-backed Sheet, AlertDialog, Menu, Select, Combobox,
Tabs, Tooltip, Checkbox, Switch, and Collapsible now use Base UI anatomy and
state attributes while retaining the established Conscia names and visual
tokens. Popover and AlertDialog are new public primitives. Toast is delivered
in Phase 5.5; NumberField and Base UI Field remain deferred.

The SearchableSelect public API remains string-based. ConfirmationDialog now
uses AlertDialog semantics. Existing `data-slot` markers remain internal;
Radix-specific state variables were removed from migrated families. The
remaining Radix Slot dependency is intentionally retained for app-shell and
sidebar compatibility call sites scheduled for the later pattern/cleanup
phases. Phase 5 completes those call-site migrations and removes the
dependency.

### Phase 4 evidence

- [x] Base UI wrappers compile, package verification passes, and Base UI is
  bundled in the distribution.
- [x] Radix behavior-family dependencies and imports were removed; only the
  deferred Slot compatibility dependency remains.
- [x] Dialog, Drawer Sheet, AlertDialog, Menu, Select, Combobox, Tabs,
  Tooltip, Checkbox, Switch, and Collapsible wrappers are exported through the
  Conscia primitives entrypoint.
- [x] ConfirmationDialog and playground trigger consumers were migrated from
  `asChild` to Base UI `render` composition.
- [x] Contract tests pass 30/30, unit tests pass 32/32, typechecks and lint
  pass, and
  package artifacts pass verification.
- [x] The complete visual and interaction browser matrix passes 40/40 on two
  consecutive runs against the local playground.
- [x] The playground production build passes. Consumer verification packages
  the artifact but remains blocked only by unavailable npm registry DNS.

### Phase 4 validation notes

The intentional Phase 4 visual refresh updated the remaining reference-pattern
captures after Base UI state/structure changes. Two subsequent complete runs
passed 40/40. The first production playground build exposed a client-boundary
issue in the source package entry; adding the existing client boundary to
`src/index.ts` resolved it, and the build now passes.

## Phase 5 — Composed patterns and application shells

Phase 5 migrates the application shell and its consumers onto the Phase 4
composition conventions, then adds focused refinements to the native sidebar
and operational table patterns. This phase does not introduce a new
NavigationMenu abstraction, new table types, or a visual redesign.

### Implemented contract

- `AppSidebar` now defaults to `variant="auto"`: light mode uses the light
  surface hierarchy and dark mode retains the dark identity. Explicit `light`
  and `dark` variants remain available.
- `NavigationItem` and `NavigationSubItem` are ref-forwarding Conscia pattern
  components using Base UI `useRender`; `asChild` and the Radix Slot
  compatibility path are removed from the shell.
- Collapsed section flyouts use the dedicated Base UI menu link anatomy so
  route selection both navigates and dismisses the flyout. Mobile navigation
  closes the Drawer-backed shell as soon as a link is selected.
- Sidebar entries support optional visual `badge` and `count` metadata with
  explicit accessible labels. The metadata is hidden from duplicate assistive
  technology announcements while the link name includes the meaningful text.
- `ProductIdentity` supports an optional `collapsedLabel` fallback for a
  compact monogram or mark when the shell is collapsed.
- Sidebar content exposes scroll-before and scroll-after state from a small
  `ResizeObserver`/scroll subscription. CSS fade affordances appear only when
  content overflows, and reduced-motion users receive no fade transition.
  Active-section auto-scroll and additional sidebar primitives remain out of
  scope.
- `DataTable` accepts an optional semantic `caption`, renders an indeterminate
  select-all checkbox for partial page selection, and exposes `aria-selected`
  on selected rows. `EntityTable` forwards the caption without creating a new
  table type.
- The playground demonstrates the sidebar metadata and collapsed identity,
  and the AI Models table uses a deterministic caption fixture.
- `@radix-ui/react-slot` is removed from the runtime manifest and lockfile;
  no source import remains. Package verification now rejects Radix runtime
  imports and the removed `asChild` API from bundled JavaScript.

### Phase 5 evidence

- [x] App-shell and sidebar consumers use Base UI `render` composition and no
  longer import Radix Slot or expose `asChild`.
- [x] Desktop active state, collapse state, collapsed flyout navigation, menu
  dismissal, mobile Drawer navigation, and mobile link dismissal are covered
  by browser interaction tests.
- [x] Sidebar badge/count semantics, appearance-aware default styling,
  collapsed identity fallback, and table caption/selection semantics are
  covered by unit and contract tests.
- [x] Existing behavior-heavy primitives remain unchanged; no new
  NavigationMenu, InteractiveTable, or specialized table primitive was added.
- [x] Intentional visual refresh updated the 12 `/reference-patterns`
  snapshots across desktop/mobile, appearance, and density states to include
  the semantic table caption. No unrelated route or theme changes were
  accepted.
- [x] `pnpm test` passes: 31 contract tests and 36 unit tests.
- [x] `pnpm typecheck`, `pnpm typecheck:playground`, `pnpm lint`, and
  `pnpm lint:playground` pass.
- [x] `pnpm test:package` passes, including build, `publint`, bundled Base UI
  verification, no-Radix/no-`asChild` guards, and public export checks.
- [x] `pnpm build:playground` passes with all static routes generated. The
  first sandboxed attempt was classified as an environment permission issue
  when Turbopack tried to bind a process port; the permission-enabled rerun
  passed without a source change.
- [x] `pnpm test:visual` passes 41/41 in two consecutive clean runs. The
  suite now contains 36 visual cases and 5 interaction suites.
- [x] `pnpm test:consumer` reaches package build, pack, and artifact
  verification, then remains blocked by unavailable npm registry DNS while
  installing the isolated fixture dependencies.

### Phase 5 validation notes

The first post-change visual run identified only the expected caption changes
in the 12 reference-pattern captures. Those snapshots were regenerated once,
then the complete 41-test suite passed twice consecutively. Browser validation
also caught and corrected a subtle integration issue: Base UI `Menu.Item`
closed the collapsed flyout without allowing the Next.js link to navigate;
the sidebar now uses `Menu.LinkItem` with `closeOnClick` for that route-backed
case.

## Phase 5.5 — Supporting components and interaction patterns

Phase 5.5 adds the focused supporting surface identified during the Phase 5
review, before Phase 6 token cleanup. These additions are intentionally small
and composable: they cover recurring product interaction needs without adding
parallel card/table families or introducing a global application registry.

### Implemented contract

- `ShortcutHint` is a native, decorative-by-default `<kbd>` primitive. An
  explicit `label` or ARIA label makes it discoverable to assistive technology.
  The native sidebar search now uses this shared primitive.
- `Spinner` is a token-aware, reduced-motion-friendly loading indicator. It is
  decorative by default and becomes a labelled `status` only when a label is
  supplied.
- `AvatarGroup` composes existing `Avatar` children, supports `sm`, `default`,
  and `lg` sizing, and exposes deterministic overflow through `max` and
  optional `total` metadata. It does not create a separate avatar data model.
- `FilterChip` provides a non-nested active-filter surface with an optional
  accessible remove action. `FilterBar` composes those chips into a wrapping,
  responsive active-filter strip with an opt-in clear-all action.
- `CommandPalette` accepts explicit command items, filters labels and
  keywords, supports disabled/grouped commands, keyboard navigation, and
  selection callbacks. It uses the existing Conscia Dialog shell with Base UI
  Combobox behavior internally; it does not maintain a global command registry.
- `ToastProvider`, `ToastViewport`, `useToast`, and the toast anatomy provide
  opt-in notifications backed by Base UI Toast management. The API supports
  variants, priorities, actions, explicit dismissal, updates, and promise
  lifecycles. The provider is not mounted globally by `AppShell`.
- Existing Card and Table APIs remain unchanged. No `InteractiveCard`,
  `CompactTable`, or alternate table family was introduced.

### Public exports and compatibility

The new primitives are exported from the primitives entrypoint and package
root: `ShortcutHint`, `Spinner`, `AvatarGroup`, `FilterChip`, and the Toast
provider/viewport/hook plus anatomy. `FilterBar` and `CommandPalette` are
exported from the patterns entrypoint and package root. Existing public names,
version `0.4.0`, and Base UI bundling conventions remain unchanged.

The packaged-consumer fixture was updated to stop passing the removed
Radix-era `forceMount` prop to open Dialog and DropdownMenu content. This keeps
consumer verification aligned with the v1 API break rather than preserving an
implementation-specific prop.

### Phase 5.5 evidence

- [x] Supporting primitives and patterns compile and are covered by focused
  behavior tests, including representative `axe-core` checks.
- [x] Command palette keyword filtering, keyboard selection, controlled open
  state, and focus restoration are covered in Vitest and the playground.
- [x] Toast creation, content, managed dismissal, variants, and opt-in
  provider/viewport wiring are covered in Vitest and the playground.
- [x] Playground coverage includes all seven additions with deterministic
  fixture data, plus an end-to-end interaction suite for filtering commands,
  clearing active filters, showing toasts, and mobile overflow checks.
- [x] The intended `/primitives` visual refresh regenerated 12 snapshots across
  desktop/mobile, light/dark, and comfortable/compact/operational density.
  Foundation and reference-pattern snapshots were not changed.
- [x] `pnpm test` passes: 31 contract tests and 42 unit tests.
- [x] `pnpm typecheck`, `pnpm typecheck:playground`, `pnpm lint`, and
  `pnpm lint:playground` pass.
- [x] `pnpm test:package` passes, including bundled Base UI and public export
  verification.
- [x] `pnpm build:playground` passes and prerenders all playground routes.
- [x] `pnpm test:consumer` passes with the packaged consumer production build.
- [x] The full Playwright suite passes 42/42 on two consecutive clean runs.

### Phase 5.5 exit criteria

- [x] All requested supporting components are implemented and exported.
- [x] New behavior is opt-in and does not add global provider or registry
  assumptions to existing application shells.
- [x] Visual changes are intentional, localized to the primitives page, and
  protected by refreshed baselines.
- [x] Package, consumer, accessibility, interaction, and visual evidence is
  recorded before starting Phase 6.

## Progress ledger

| Phase | Status | Start commit | Completion commit | Evidence |
| --- | --- | --- | --- | --- |
| Phase 0 | Complete | `064aad7` | `53aea84` | Charter, inventory, health checks, and runner stabilization recorded |
| Phase 1 | Complete | `53aea84` | `53aea84` | 36 visual snapshots, 4 interaction suites, two clean 40-test runs |
| Phase 2 | Complete | `d7c1a6f` | `657e8a6` | Base UI 1.7.0, proof harness, portal convention, and bundle guard recorded; full validation passed |
| Phase 3 | Complete | Working tree | Working tree | Conscia-owned simple primitives, IconButton, Card/Table anatomy, focused behavior tests, package verification, and refreshed visual baselines |
| Phase 4 | Complete | `1dc8aa6` | Working tree | Base UI behavior wrappers, AlertDialog/Popover, dependency cleanup, package/playground gates, and two consecutive 40/40 browser runs |
| Phase 5 | Complete | `e40cc6a` | `fab320e` | Shell composition migration, sidebar refinements, DataTable semantics, package cleanup, 41-test browser matrix, and validation evidence recorded |
| Phase 5.5 | Complete | Working tree | Working tree | ShortcutHint, Spinner, AvatarGroup, FilterChip/FilterBar, CommandPalette, opt-in Toast, playground coverage, 42-test browser matrix, and packaged consumer verification |
| Phase 6 | Pending | Pending | Pending | |
| Phase 7 | Pending | Pending | Pending | |
| Phase 8 | Pending | Pending | Pending | |

## Decision log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-08-28 | Preserve public component names while resetting v1 APIs. | Keeps the migration discoverable while removing Radix/shadcn implementation constraints. |
| 2026-08-28 | Use Playwright visual snapshots as the baseline. | Protects aesthetics, density, dark mode, responsive behavior, and composed patterns during rewrites. |
| 2026-08-28 | Use Kumo as architectural inspiration only. | Adopts the useful custom-wrapper model without coupling the project to Kumo source or tooling. |
| 2026-08-28 | Use Vitest VM threads with one worker for the default unit runner. | The existing fork pool timed out before collection in this Node/sandbox environment; the alternate pool passes all 18 unit tests. |
| 2026-08-28 | Remove the Next.js development portal from Playwright captures. | The dev indicator was nondeterministic and is not part of the design-system visual contract. |
| 2026-08-28 | Pin `@base-ui/react` to `1.7.0` and keep it internal. | Reproducible behavior and a clean Conscia-owned public API are required before wrapper rewrites. |
| 2026-08-28 | Add a direct Base UI proof harness before production wrappers. | Validates module resolution, composition, state, portals, and SSR without mixing Phase 2 with component migration. |
| 2026-08-28 | Keep simple primitives custom and use Base UI only for Button composition in Phase 3. | Native HTML is the smallest reliable implementation for visual primitives; behavior-heavy families need a separate migration boundary. |
| 2026-08-28 | Make IconButton canonical while retaining `Button size="icon"`. | Improves accessible API discoverability without forcing an early compatibility cleanup across existing consumers. |
| 2026-08-28 | Keep Card and Table extensible through focused anatomy and variants. | Avoids multiplying primitive types while supporting the recurring product patterns identified in the audit. |
| 2026-08-28 | Make Alert title/description relationships automatic but non-live by default. | Provides a meaningful accessible group without turning every informational alert into an announcement. |
| 2026-08-28 | Treat `ConsciaIconButton` as a strict compatibility alias. | The alias now follows the canonical accessible IconButton contract; consumers must provide an accessible name, while `Button size="icon"` remains available during migration. |
| 2026-08-29 | Add the client directive to the source package root entry. | Next.js consumers resolving the workspace source need the same client boundary as the built package entry when Base UI client modules are present. |
| 2026-08-29 | Make the native sidebar appearance-aware by default while retaining explicit light/dark variants. | The shell should inherit the product appearance without removing the ability to preserve a deliberately dark navigation identity. |
| 2026-08-29 | Use Base UI `Menu.LinkItem` for collapsed route flyouts. | Route-backed menu entries must preserve native navigation and close the flyout after selection; action items and links have different Base UI behavior contracts. |
| 2026-08-29 | Keep sidebar metadata opt-in and provide separate accessible labels. | Badges and counts improve operational scanning without forcing decorative presentation text into every navigation name. |
| 2026-08-29 | Add overflow fades driven by measured scroll state, without active-section auto-scroll. | The sidebar needs a quiet affordance for hidden content while keeping route changes and focus movement predictable. |
| 2026-08-29 | Strengthen `DataTable` with caption and ARIA selection semantics instead of adding table variants. | Semantic anatomy improves real consumers without multiplying the primitive surface or replacing the existing operational pattern. |
| 2026-08-29 | Remove `@radix-ui/react-slot` after shell migration. | All remaining shell consumers now use Base UI composition, so retaining the compatibility dependency would preserve an implementation path that v1 explicitly removes. |
| 2026-08-29 | Add `ShortcutHint`, `Spinner`, `AvatarGroup`, `FilterChip`, `FilterBar`, `CommandPalette`, and opt-in `Toast` before Phase 6. | These components address recurring product needs while keeping the primitive surface composable and avoiding speculative card/table variants. |
| 2026-08-29 | Compose `AvatarGroup` from existing `Avatar` children and keep `FilterBar` as an active-filter strip. | Existing anatomy stays reusable, and filtering remains a pattern concern rather than a new data or toolbar abstraction. |
| 2026-08-29 | Give `CommandPalette` explicit items and keep Toast provider/viewport opt-in. | Explicit ownership makes behavior predictable for package consumers and avoids hidden global registries or application-shell assumptions. |

## Blockers and notes

Known environment notes: the package consumer fixture and production playground
build now pass with the permission-enabled runner. Earlier Phase 0–5 records
retain the historical npm-DNS and sandbox port limitations that affected those
runs. Development runs may still log Base UI Combobox hydration warnings while
the client-side caret styling is initialized; they do not affect the production
build or the passing browser matrix.
