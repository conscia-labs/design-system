"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Badge, Button, Card, CardHeader, Input, StateView } from "@conscia-labs/design-system";
import { componentDocs } from "@/components/component-docs";

const categories = [
  { value: "Primitive", label: "Primitives", description: "Accessible controls and content building blocks." },
  { value: "Pattern", label: "Patterns", description: "Compositions for recurring product workflows." },
  { value: "Compatibility", label: "Compatibility", description: "Legacy aliases for applications migrating to v1." },
] as const;

export function ComponentCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const normalizedQuery = query.trim().toLowerCase();
  const matches = componentDocs.filter((doc) =>
    (category === "All" || doc.category === category) &&
    [doc.family, doc.description, ...doc.exports].join(" ").toLowerCase().includes(normalizedQuery),
  );
  const groups = categories.map((group) => ({ ...group, entries: matches.filter((doc) => doc.category === group.value) })).filter((group) => group.entries.length);

  return (
    <div className="grid min-w-0 gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-supporting" />
          <Input type="search" aria-label="Find a component" placeholder="Search components or exports…" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Component category">
          {[{ value: "All", label: "All" }, ...categories].map((option) => (
            <Button key={option.value} size="sm" variant={category === option.value ? "secondary" : "ghost"} aria-pressed={category === option.value} onClick={() => setCategory(option.value)}>{option.label}</Button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="ds-type-metadata text-text-supporting" role="status">{matches.length} component {matches.length === 1 ? "family" : "families"}{normalizedQuery ? " matching “" + query.trim() + "”" : ""}</p>
        <Button variant="link" size="sm" render={<Link href="/components/tabs" />}>Compare tab styles <ArrowRight aria-hidden="true" /></Button>
      </div>
      {matches.length ? (
        <div className={groups.length > 1 ? "grid items-start gap-6 xl:grid-cols-2" : "grid gap-6"}>
          {groups.map((group) => (
            <Card key={group.value} className="gap-0 overflow-hidden pb-0">
              <CardHeader action={<Badge variant="neutral">{group.entries.length}</Badge>} className="pb-4">
                <h2 className="ds-type-section-title">{group.label}</h2>
                <p className="ds-type-ui text-text-supporting">{group.description}</p>
              </CardHeader>
              <div className="divide-y divide-border-subtle border-t border-border-subtle">
                {group.entries.map((doc) => (
                  <Link key={doc.slug} href={doc.route} className="group flex min-w-0 items-center gap-4 px-[var(--ds-surface-padding)] py-4 outline-none transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus">
                    <div className="min-w-0 flex-1">
                      <h3 className="ds-type-ui font-semibold">{doc.family}</h3>
                      <p className="ds-type-metadata mt-1 text-text-supporting">{doc.description}</p>
                    </div>
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-text-supporting group-hover:text-text-primary" />
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <StateView title="No components found" description="Try a component name or public export, or clear your filters to browse the full catalog." icon={<Search />} action={<Button variant="outline" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</Button>} />
      )}
    </div>
  );
}
