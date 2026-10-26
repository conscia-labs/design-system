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

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

/**
 * Counts a numeric metric up from zero on first render, and from the
 * previous value when it changes. Assistive technology reads only the final
 * value; the animated digits are hidden from it.
 *
 * The clock is a Web Animation on the digits, so tooling that finishes
 * animations (browser devtools, visual-regression screenshots) lands on the
 * final value instead of capturing a frame mid-count.
 */
function MetricCountUp({ value, options = {} }: { value: number; options?: MetricCountUpOptions }) {
  const [displayed, setDisplayed] = React.useState(value);
  const digitsRef = React.useRef<HTMLSpanElement>(null);
  const previous = React.useRef<number | null>(null);
  const durationMs = options.durationMs ?? DEFAULT_DURATION_MS;

  React.useEffect(() => {
    const from = previous.current ?? 0;
    previous.current = value;
    let frame = 0;
    const settle = () => {
      cancelAnimationFrame(frame);
      setDisplayed(value);
    };

    if (from === value || durationMs <= 0 || prefersReducedMotion()) {
      frame = requestAnimationFrame(settle);
      return () => cancelAnimationFrame(frame);
    }

    const showProgress = (progress: number) => setDisplayed(from + (value - from) * easeOutCubic(progress));
    const digits = digitsRef.current;

    if (digits && typeof digits.animate === "function") {
      const clock = digits.animate(null, { duration: durationMs, fill: "none" });
      clock.onfinish = settle;
      const tick = () => {
        const progress = clock.effect?.getComputedTiming().progress;
        if (clock.playState === "finished" || progress == null) return settle();
        showProgress(progress);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => {
        cancelAnimationFrame(frame);
        clock.onfinish = null;
        clock.cancel();
      };
    }

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      if (progress === 1) return settle();
      showProgress(progress);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return (
    <>
      <span ref={digitsRef} aria-hidden="true">{formatMetricNumber(displayed, value, options)}</span>
      <span className="sr-only">{formatMetricNumber(value, value, options)}</span>
    </>
  );
}

export { MetricCountUp, formatMetricNumber };
export type { MetricCountUpOptions };
