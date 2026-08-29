"use client";
import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "./utils";
function Switch({ className, size = "default", ...props }: React.ComponentProps<typeof BaseSwitch.Root> & { size?: "sm" | "default" }) { return <BaseSwitch.Root data-slot="switch" data-size={size} className={cn("peer group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-checked:bg-action data-unchecked:bg-control-border", className)} {...props}><BaseSwitch.Thumb data-slot="switch-thumb" className="pointer-events-none block rounded-full bg-canvas transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0" /></BaseSwitch.Root>; }
export { Switch };
