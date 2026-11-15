import * as React from "react";

/** The missing-value treatment shared by MetricBandItem and MetricCard. Internal. */
function MetricBandEmptyValue({ children }: { children?: React.ReactNode }) {
  return (
    <span data-slot="metric-band-empty-value" className="ds-type-ui font-medium text-text-muted">
      {children ?? <span aria-label="Unavailable">—</span>}
    </span>
  );
}

export { MetricBandEmptyValue };
