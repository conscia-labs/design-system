import { Badge, Button } from "@conscia-labs/design-system";

import { DesignPreferences } from "@/components/design-preferences";
import { ExampleSection, PlaygroundPage } from "@/components/page";

const docs = [
  ["01", "Design Constitution", "docs/design/01-design-constitution.md"],
  ["02", "Foundation", "docs/design/02-foundation.md"],
  ["03", "Interface Architecture", "docs/design/03-interface-architecture.md"],
  ["04", "Component Principles", "docs/design/04-component-principles.md"],
  ["05", "Reference Patterns", "docs/design/05-reference-patterns.md"]
];

export default function OverviewPage() {
  return (
    <PlaygroundPage
      title="Overview"
      description="The executable visual reference for Conscia foundation tokens, primitives, and canonical product patterns."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <ExampleSection title="Purpose">
            <div className="rounded-[var(--ds-radius-surface)] border bg-surface p-4 text-sm leading-6">
              This playground verifies that the design system works as code. It demonstrates shared primitives, global
              appearance, density, and the first executable resource-list reference pattern without calling product APIs.
            </div>
          </ExampleSection>
          <ExampleSection title="Source documents">
            <div className="grid gap-2">
              {docs.map(([number, title, path]) => (
                <div key={number} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 rounded-[var(--ds-radius-surface)] border bg-surface px-3 py-2">
                  <Badge variant="outline">{number}</Badge>
                  <div>
                    <div className="text-sm font-medium">{title}</div>
                    <div className="text-[var(--ds-metadata)] text-text-supporting">{path}</div>
                  </div>
                </div>
              ))}
            </div>
          </ExampleSection>
          <ExampleSection title="Implementation status">
            <div className="grid gap-2 md:grid-cols-3">
              {["Foundation tokens active", "Primitive catalogue started", "AI Models Resource List implemented"].map((item) => (
                <div key={item} className="rounded-[var(--ds-radius-surface)] border bg-surface p-4">
                  <Badge variant="success">Ready</Badge>
                  <div className="mt-3 text-sm font-medium">{item}</div>
                </div>
              ))}
            </div>
          </ExampleSection>
          <ExampleSection title="Principles in practice">
            <div className="grid gap-2 md:grid-cols-2">
              {["Information before interface", "Density without clutter", "Semantic color only", "Build once, use everywhere"].map((item) => (
                <div key={item} className="rounded-[var(--ds-radius-surface)] border bg-surface p-3 text-sm">{item}</div>
              ))}
            </div>
          </ExampleSection>
        </div>
        <aside className="h-fit rounded-[var(--ds-radius-surface)] border bg-surface p-4">
          <h2 className="text-sm font-semibold">Global controls</h2>
          <p className="mt-1 text-sm text-text-supporting">Controls write root attributes. Components adapt without page-specific overrides.</p>
          <div className="mt-4">
            <DesignPreferences />
          </div>
          <Button className="mt-5 w-full" variant="outline">Inspect reference pattern</Button>
        </aside>
      </div>
    </PlaygroundPage>
  );
}
