import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@conscia-labs/design-system";

import { componentDocs } from "@/components/component-docs";
import { PlaygroundPage } from "@/components/page";

export default function ComponentsPage() {
  return (
    <PlaygroundPage
      title="Components"
      description="Every public component family, with focused examples, options, accessibility guidance, and package imports."
    >
      <div className="grid gap-px overflow-hidden rounded-[var(--ds-radius-surface)] border bg-border-subtle md:grid-cols-2 xl:grid-cols-3">
        {componentDocs.map((doc) => (
          <Link
            key={doc.slug}
            href={doc.route}
            className="group flex min-h-40 flex-col bg-surface p-5 outline-none transition-colors hover:bg-surface-muted focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-focus/50"
          >
            <div className="flex items-start justify-between gap-3">
              <Badge variant={doc.category === "Compatibility" ? "warning" : doc.category === "Pattern" ? "accent" : "neutral"}>{doc.category}</Badge>
              <ArrowRight className="size-4 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-text-primary" aria-hidden="true" />
            </div>
            <h2 className="ds-type-section-title mt-5">{doc.family}</h2>
            <p className="ds-type-ui mt-1 text-text-supporting">{doc.description}</p>
            <div className="ds-type-metadata mt-auto pt-4 text-text-muted">{doc.exports.length} public exports</div>
          </Link>
        ))}
      </div>
    </PlaygroundPage>
  );
}
