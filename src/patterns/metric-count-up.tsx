"use client";

import * as React from "react";

type MetricCountUpOptions = {
  /** Number formatting for every frame and the final value. Defaults to the value's own decimal places, without grouping. */
  format?: Intl.NumberFormatOptions;
  /** Locale for `format`. Fixed by default so server and client render the same string. */
  locale?: string;
  /** Animation length in milliseconds. */
  durationMs?: number;
};

const DEFAULT_DURATION_MS = 900;

function decimalPlaces(value: number) {
  const [, fraction = ""] = String(value).split(".");
  return fraction.length;
}

function formatMetricNumber(value: number, target: number, options: MetricCountUpOptions) {
  if (options.format) {
    return new Intl.NumberFormat(options.locale ?? "en-US", options.format).format(value);
  }
  return value.toFixed(decimalPlaces(target));
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

/**
 * Counts a numeric metric up from zero on first render, and from the
 * previous value when it changes. Assistive technology reads only the final
 * value; the animated digits are hidden from it.
 */
function MetricCountUp({ value, options = {} }: { value: number; options?: MetricCountUpOptions }) {
  const [displayed, setDisplayed] = React.useState(value);
  const previous = React.useRef<number | null>(null);
  const durationMs = options.durationMs ?? DEFAULT_DURATION_MS;

  React.useEffect(() => {
    const from = previous.current ?? 0;
    previous.current = value;
    let frame = 0;

    if (from === value || durationMs <= 0 || prefersReducedMotion()) {
      frame = requestAnimationFrame(() => setDisplayed(value));
      return () => cancelAnimationFrame(frame);
    }

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayed(progress === 1 ? value : from + (value - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return (
    <>
      <span aria-hidden="true">{formatMetricNumber(displayed, value, options)}</span>
      <span className="sr-only">{formatMetricNumber(value, value, options)}</span>
    </>
  );
}

export { MetricCountUp, formatMetricNumber };
export type { MetricCountUpOptions };
