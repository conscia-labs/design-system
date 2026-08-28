# Base UI v1 Migration

Status: **Phase 1 complete**

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
- [ ] Phase 2 — Base UI dependency, packaging, and implementation conventions.
- [ ] Phase 3 — Rewrite simple custom primitives.
- [ ] Phase 4 — Rewrite behavior-heavy primitives with Base UI.
- [ ] Phase 5 — Rewrite composed patterns and application shells.
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
- [ ] Record the first implementation commit after Phase 0 is complete.

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
5. Remove Radix dependencies and Radix-specific CSS variables.
6. Replace source-level implementation assertions with behavior contracts.
7. Run the visual baseline after every component family.
8. Harden package metadata, documentation, migration notes, and release checks.
9. Release v1 only after no Radix imports, no shadcn-derived component source, and complete validation evidence.

## Progress ledger

| Phase | Status | Start commit | Completion commit | Evidence |
| --- | --- | --- | --- | --- |
| Phase 0 | Complete | `064aad7` | Pending | Charter, inventory, health checks, and runner stabilization recorded |
| Phase 1 | Complete | Pending | Pending | 36 visual snapshots, 4 interaction suites, two clean 40-test runs |
| Phase 2 | Pending | Pending | Pending | |
| Phase 3 | Pending | Pending | Pending | |
| Phase 4 | Pending | Pending | Pending | |
| Phase 5 | Pending | Pending | Pending | |
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

## Blockers and notes

Known environment notes: the package consumer fixture cannot resolve npm registry dependencies because registry DNS is unavailable in this environment. The current Radix checkbox implementation also emits existing development hydration mismatch warnings; those are intentionally logged for the later Base UI rewrite and do not affect the committed baseline captures.
