"use client";
import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "./utils";

type SwitchProps = Omit<React.ComponentProps<typeof BaseSwitch.Root>, "children"> & {
  size?: "sm" | "default";
  /** The text shown in the track when the switch is checked. */
  onLabel?: React.ReactNode;
  /** The text shown in the track when the switch is unchecked. */
  offLabel?: React.ReactNode;
};

type LabeledSwitchProps = Omit<SwitchProps, "onLabel" | "offLabel"> & {
  onLabel?: React.ReactNode;
  offLabel?: React.ReactNode;
};

function Switch({
  className,
  size = "default",
  onLabel,
  offLabel,
  ...props
}: SwitchProps) {
  const labeled = onLabel != null || offLabel != null;

  return (
    <BaseSwitch.Root
      data-slot="switch"
      data-size={size}
      data-labeled={labeled ? "true" : undefined}
      className={cn(
        "peer group/switch inline-flex shrink-0 items-center border border-transparent shadow-xs transition-all outline-none focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus/50 disabled:cursor-not-allowed disabled:opacity-50",
        labeled
          ? "relative rounded-[0.625rem] p-0.5 data-[size=default]:h-6 data-[size=default]:w-[5.5rem] data-[size=default]:[--switch-thumb-travel:4.25rem] data-[size=sm]:h-5 data-[size=sm]:w-[5.5rem] data-[size=sm]:[--switch-thumb-travel:4.5rem] data-checked:bg-action data-unchecked:bg-control-border"
          : "rounded-full data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-checked:bg-action data-unchecked:bg-control-border",
        className,
      )}
      {...props}
    >
      {labeled ? (
        <>
          <span
            aria-hidden="true"
            data-slot="switch-on-label"
            className="pointer-events-none absolute inset-y-0.5 left-0 flex w-1/2 translate-x-1 items-center justify-center overflow-hidden px-0.5 text-[0.5625rem] font-semibold leading-none tracking-[0.02em] text-action-foreground transition-[opacity,transform] group-data-checked/switch:opacity-100 group-data-unchecked/switch:opacity-0"
          >
            {onLabel ?? "ON"}
          </span>
          <span
            aria-hidden="true"
            data-slot="switch-off-label"
            className="pointer-events-none absolute inset-y-0.5 right-0 flex w-1/2 -translate-x-1 items-center justify-center overflow-hidden px-0.5 text-[0.5625rem] font-semibold leading-none tracking-[0.02em] text-text-supporting transition-[opacity,transform] group-data-checked/switch:opacity-0 group-data-unchecked/switch:opacity-100"
          >
            {offLabel ?? "OFF"}
          </span>
        </>
      ) : null}
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-canvas transition-transform",
          labeled
            ? "absolute top-1/2 left-0.5 z-10 -translate-y-1/2 data-checked:translate-x-[var(--switch-thumb-travel)] data-unchecked:translate-x-0 group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3"
            : "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0",
        )}
      />
    </BaseSwitch.Root>
  );
}

function LabeledSwitch({ onLabel = "ON", offLabel = "OFF", ...props }: LabeledSwitchProps) {
  return <Switch {...props} onLabel={onLabel} offLabel={offLabel} />;
}

export type { LabeledSwitchProps, SwitchProps };
export { LabeledSwitch, Switch };
