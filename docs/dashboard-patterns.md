# Dashboard patterns

`MetricCard` expresses one operational metric through a label, description,
value, unit, benchmark/status, optional trend, and optional visualization.
Visualization content is chart-library agnostic and requires a textual
`visualizationSummary`.

`MetricTrend` keeps direction separate from sentiment. For example, decreasing
lead time is `direction="down"` with `sentiment="positive"`. Always supply an
accessible label that states both ideas.

`DataPanel` is the flush operational alternative to a general `Card`. Use its
header, content, and footer anatomy for charts, divided rows, and compact panel
actions. Use `padded` content only when the child does not own its spacing.

`AttentionList` represents persistent findings, not live announcements. Tone
is paired with an icon and accessible severity label. Use `Alert` when content
must be announced as a status or alert instead.

`ActivityItem` accepts `leading` and `trailing` slots for status markers and
structured metadata. The historical `icon` and `status` props remain valid.

Chart series, grid, axis, annotation, and trend colors resolve through semantic
tokens in both themes. Applications own chart selection, data transforms,
tooltips, axes, and responsive dashboard grid composition.
