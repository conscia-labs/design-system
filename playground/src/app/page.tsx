import Link from "next/link";
import { Badge, Button } from "@conscia-labs/design-system";

import { componentInventory } from "@/components/component-inventory";
import { DesignPreferences } from "@/components/design-preferences";
import { ExampleSection, PlaygroundPage } from "@/components/page";

const categories = ["Foundation", "Primitive", "Pattern", "Compatibility"] as const;

export default function OverviewPage() {
  return (
    <PlaygroundPage
      title="Overview"
      description="The executable catalog for Conscia foundation tokens, primitives, product patterns, and reference applications."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <ExampleSection title="Design system inventory" description="Every public component family links to a maintained catalog or realistic reference screen.">
            <div className="grid gap-3 md:grid-cols-2">
              {categories.map((category) => {
                const entries = componentInventory.filter((entry) => entry.category === category);
                return (
                  <section key={category} className="overflow-hidden rounded-[var(--ds-radius-surface)] border border-border-default bg-surface">
                    <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
                      <h2 className="ds-type-card-title">{category}</h2>
                      <Badge variant="neutral">{entries.length} families</Badge>
                    </header>
                    <div className="divide-y divide-border-subtle">
                      {entries.map((entry) => (
                        <Link key={entry.family} href={entry.route} className="block px-4 py-3 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus/50 focus-visible:ring-inset">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="ds-type-ui font-medium">{entry.family}</div>
                              <div className="ds-type-metadata mt-0.5 text-text-supporting">{entry.description}</div>
                            </div>
                            <span className="ds-type-metadata shrink-0 tabular-nums text-text-muted">{entry.exports.length}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </ExampleSection>
        </div>
        <aside className="h-fit rounded-[var(--ds-radius-surface)] border bg-surface p-4">
          <h2 className="ds-type-card-title">Global controls</h2>
          <p className="ds-type-ui mt-1 text-text-supporting">Appearance and density update shared root attributes across every example.</p>
          <div className="mt-4"><DesignPreferences /></div>
          <Button className="mt-5 w-full" variant="outline" render={<Link href="/delivery-metrics" />}>Open dashboard example</Button>
        </aside>
      </div>
    </PlaygroundPage>
  );
}
