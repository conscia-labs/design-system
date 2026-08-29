"use client";
import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "./utils";
function Checkbox({ className, ...props }: React.ComponentProps<typeof BaseCheckbox.Root>) { return <BaseCheckbox.Root data-slot="checkbox" className={cn("peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-danger/20 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground", className)} {...props}><BaseCheckbox.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current"><CheckIcon className="size-3.5" /></BaseCheckbox.Indicator></BaseCheckbox.Root>; }
export { Checkbox };
