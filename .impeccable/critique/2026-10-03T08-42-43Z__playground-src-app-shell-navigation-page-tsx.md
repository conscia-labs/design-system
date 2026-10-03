---
target: narrow component and shell visual review
total_score: 32
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/kent/dev/conscia/design-system/playground/src/app/shell-navigation/page.tsx"
target_fingerprint: "sha256:35222a0487553f16faa7629ca3d84475a5bca9ae5ad076774c3660e6281cf39d"
target_path: /Users/kent/dev/conscia/design-system/playground/src/app/shell-navigation/page.tsx
timestamp: 2026-10-03T08-42-43Z
slug: playground-src-app-shell-navigation-page-tsx
---
# Narrow component and shell review

## Heuristic scorecard

| Heuristic | Score | Evidence |
| --- | ---: | --- |
| Visibility of system status | 3/4 | Active navigation, badges, validation, loading, selected states, and overlay focus are visible; utility actions are mostly consumer-provided slots. |
| Match to the real world | 3/4 | Labels and control semantics are familiar and operational; some showcase copy is implementation-oriented. |
| User control and freedom | 4/4 | Sidebar collapse, mobile sheet, Escape close, cancel, close-sheet, and focus return are all present. |
| Consistency and standards | 4/4 | Action colors, selection surfaces, radii, control heights, and semantic states are coherent across primitives. |
| Error prevention | 3/4 | Invalid and destructive states are clear; narrow-width tab overflow and collapsed-label collisions have no system-level guard. |
| Recognition rather than recall | 3/4 | Expanded labels, icons, and tooltips work well; generated two-letter labels weaken recognition when collapsed. |
| Flexibility and efficiency | 3/4 | Density presets, shell variants, command palette, and responsive overlays are useful; intermediate header widths lack a priority contract. |
| Aesthetic and minimalist design | 3/4 | Quiet surfaces and restrained chrome feel deliberate; operational type and long tab rows become over-compressed. |
| Error recovery | 3/4 | Inline errors, cancel/close actions, and dismissible overlays are strong; post-navigation focus/state guidance is not explicit. |
| Help and documentation | 3/4 | Preferred and legacy shell compositions are documented with code; collapsed and overflow recipes need explicit guidance. |

Total: **32/40 — Good, with a few high-leverage responsive seams.**

## Design specificity

**Feels authored.** The near-black/burgundy shell rail, electric-blue action, quiet active surfaces, semantic status badges, and density tokens form a recognizable Conscia language. The next improvement is not more decoration; it is preserving that language when space is constrained.

## Overall impression

The reusable primitives are calm, legible, and behaviorally mature. Dialogs, menus, disclosures, sheets, validation, and focus treatment all read as a coherent system. The integrated shell also has a clear structural contract: the header spans the viewport, the sidebar begins below it, and the main region compensates for both.

The weak points appear at compression boundaries. The collapsed shell trades names for arbitrary acronyms, the seven-item resource tab row has no visible overflow strategy on mobile, and operational density reduces too many text roles at once. These are system-level visual risks because consumers will inherit them in real product screens.

## What is working

- Expanded navigation has clear hierarchy, quiet active treatment, and strong icon/label pairing.
- Dialog composition is excellent: clear title and explanation, strong focus ring, sensible width, visible cancel/destructive hierarchy, and Escape close.
- Dropdown and sheet surfaces have appropriate elevation/backdrop separation without visual noise.
- Button, form, badge, table, and status variants share one semantic color language across light/dark modes.
- `PageFrame` already exposes full, wide, focused, and reading widths; that is a useful escape hatch for product consumers.

## Cognitive load failures

- **High in the collapsed rail:** repeated or opaque two-letter labels force recall and make scanning unreliable.
- **Moderate in resource navigation:** seven tabs are easy to scan on desktop but become clipped on a 390px viewport, hiding the available route set.
- **Moderate in operational mode:** the showcase presents many controls in a compact vertical run; the 0.8125rem body/control/navigation floor makes the system feel denser than necessary.

These observations distinguish the playground’s “show every state” presentation from the primitive contracts themselves; this is not a critique of the playground’s information architecture.

## Emotional journey

The first impression is confident and quiet: strong shell framing, disciplined surfaces, and clear action/status colors. Confidence dips when the rail collapses into acronym-like labels and when mobile tabs visibly truncate. It peaks again in the dialog/sheet states, where focus, hierarchy, and consequences are unusually clear. The system leaves a trustworthy impression, but only if responsive recognition is treated as a first-class visual requirement.

## Priority issues

### P1 — Collapsed navigation loses recognition

The playground explicitly derives labels with `doc.family.slice(0, 2).toUpperCase()`, producing entries such as `AL`, `AV`, `BA`, and `BR`. In the core navigation, static groups render their items directly, while the collapsed dropdown projection is only applied to entries with collapsible children. The result is a visually compact rail that is technically accessible but hard to recognize at a glance.

Fix: never generate arbitrary initials as the default collapsed representation. Require an icon or an explicit short label, and give static groups a labeled popover projection when collapsed. Preserve the group label in the popover so the user can recover context without expanding the entire shell.

Suggested command: `$impeccable adapt` focused on collapsed-sidebar recognition.

### P1 — Resource tabs need a mobile overflow contract

The primitive showcase includes seven routed resource tabs: Overview, Configuration, Credentials, Organizations, Models, Health, and Activity. The mobile baseline visibly crops the row around Organizations, with no clear scroll affordance or “more” treatment. A product consumer copying this pattern can hide valid destinations.

Fix: define one responsive behavior in the tab primitive: horizontal scrolling with an edge cue, or a primary-tab limit with an explicit overflow menu. Keep the active tab discoverable and keyboard reachable in either mode.

Suggested command: `$impeccable adapt` focused on responsive tab overflow.

### P2 — Operational density lowers the text floor too aggressively

Operational density sets body, UI, navigation, control, and button text to 0.8125rem, with metadata at 0.75rem. The result is impressively compact, but the mobile baseline makes labels, helper text, and adjacent controls feel visually thin.

Fix: keep primary labels, navigation, and form controls at a readable minimum; reclaim density through spacing, row height, and secondary metadata before reducing type. Treat metadata as the only role allowed to go smaller than the control floor.

Suggested command: `$impeccable typeset` focused on operational-density minimums.

### P2 — Header utilities lack an intermediate-width priority model

The shell gives the start region flexible width, a search slot `w-[min(22rem,32vw)]`, and a non-shrinking actions group. That is clean at wide and mobile breakpoints, but brand/context, search, version, notifications, and account can compete between those endpoints.

Fix: define a compact header state: collapse or hide context text first, reduce search to an icon/trigger at an earlier breakpoint, and make version/utility visibility an explicit priority contract rather than relying on flex compression.

Suggested command: `$impeccable layout` focused on intermediate-width header priority.

## Persona checks

- **Alex, power user:** shortcuts, Escape behavior, command palette, and fast overlays are strong. The collapsed acronym rail is the main speed bump because it slows recognition on every navigation pass.
- **Sam, zoom/accessibility user:** semantic roles, names, validation, and focus states are strong. The operational text floor and long tab row should be tested at 200% zoom and narrow widths.
- **Casey, mobile operator:** the sheet and stacked controls feel dependable. Resource tabs and horizontally dense tables need a visible overflow strategy rather than relying on clipping/scroll discovery.

## Minor observations

- Keep the dialog/sheet focus and consequence treatment as a reference pattern; it is the strongest part of the current pass.
- The shell preview’s empty main region is appropriate for a component demo and should not drive a system-level “add more content” change.
- Tables are structurally sound, but mobile consumers should get a documented horizontal-overflow affordance alongside the table primitive.
- No source changes were made in this review.

## Questions

1. Should static navigation groups remain visually explicit only when expanded, or should the design system make a labeled collapsed popover the canonical behavior?
2. Is operational density intended for primary task text at mobile widths, or should it be reserved for desktop/table-heavy surfaces?
