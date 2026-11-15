"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";

import { cn } from "./utils";

type SliderProps = Omit<React.ComponentProps<typeof BaseSlider.Root>, "children"> & {
  /** Visible name. Without it, pass `aria-label`. */
  label?: React.ReactNode;
  /** Shows the formatted value beside the label. */
  showValue?: boolean;
  /** Names each thumb of a range, such as `["Minimum", "Maximum"]`. */
  thumbLabels?: string[];
};

/** A value, or a range when the value is an array, picked by dragging along a track. */
function Slider({ label, showValue = false, thumbLabels, className, value, defaultValue, "aria-label": ariaLabel, ...props }: SliderProps) {
  const initial = value ?? defaultValue;
  const thumbCount = Array.isArray(initial) ? initial.length : 1;

  return (
    <BaseSlider.Root data-slot="slider" value={value} defaultValue={defaultValue} className={cn("grid gap-2", className)} {...props}>
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-4 text-sm">
          {label ? <BaseSlider.Label data-slot="slider-label" className="font-medium text-text-primary">{label}</BaseSlider.Label> : <span />}
          {showValue ? <BaseSlider.Value data-slot="slider-value" className="tabular-nums text-text-supporting" /> : null}
        </div>
      ) : null}
      <BaseSlider.Control data-slot="slider-control" className="flex h-5 w-full touch-none select-none items-center data-disabled:cursor-not-allowed data-disabled:opacity-50">
        <BaseSlider.Track data-slot="slider-track" className="h-1.5 w-full rounded-full bg-surface-muted">
          <BaseSlider.Indicator data-slot="slider-indicator" className="rounded-full bg-action" />
          {Array.from({ length: thumbCount }, (_, index) => (
            <BaseSlider.Thumb
              key={index}
              index={index}
              data-slot="slider-thumb"
              aria-label={thumbLabels?.[index] ?? ariaLabel}
              className="size-4 rounded-full border-2 border-action bg-surface shadow-raised has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-focus-ring"
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}

export { Slider };
export type { SliderProps };
