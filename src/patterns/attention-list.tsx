import * as React from "react";
import { CheckCircle2, CircleAlert, CircleX, Info } from "lucide-react";

import { cn } from "../primitives/utils";

type AttentionTone = "neutral" | "information" | "success" | "warning" | "danger";

function AttentionList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="attention-list" className={cn("grid gap-2", className)} {...props} />;
}

type AttentionItemProps = Omit<React.ComponentProps<"li">, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  metadata?: React.ReactNode;
  action?: React.ReactNode;
  tone?: AttentionTone;
  severityLabel?: string;
  icon?: React.ReactNode;
};

const toneClasses: Record<AttentionTone, string> = {
  neutral: "border-neutral-border bg-neutral-background text-neutral-foreground",
  information: "border-information-border bg-information-background text-information-foreground",
  success: "border-success-border bg-success-background text-success-foreground",
  warning: "border-warning-border bg-warning-background text-warning-foreground",
  danger: "border-danger-border bg-danger-background text-danger-foreground",
};

function AttentionItem({ title, description, metadata, action, tone = "neutral", severityLabel = `${tone[0].toUpperCase()}${tone.slice(1)}`, icon, className, ...props }: AttentionItemProps) {
  const Icon = tone === "danger" ? CircleX : tone === "warning" ? CircleAlert : tone === "success" ? CheckCircle2 : Info;

  return (
    <li data-slot="attention-item" data-tone={tone} className={cn("grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-[var(--ds-radius-control)] border px-3 py-2.5", toneClasses[tone], className)} {...props}>
      <span className="mt-0.5 [&>svg]:size-4" aria-hidden="true">{icon ?? <Icon />}</span>
      <div className="min-w-0">
        <span className="sr-only">{severityLabel}: </span>
        <div className="ds-type-ui font-medium">{title}</div>
        {description ? <div className="ds-type-metadata mt-0.5 opacity-85">{description}</div> : null}
        {metadata ? <div className="ds-type-metadata mt-1 opacity-85">{metadata}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </li>
  );
}

export { AttentionItem, AttentionList };
export type { AttentionItemProps, AttentionTone };
