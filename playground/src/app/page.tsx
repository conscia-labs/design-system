import Link from "next/link";
import { Badge, Button, CodeBlock } from "@conscia-labs/design-system";

import { componentInventory } from "@/components/component-inventory";
import { DesignPreferences } from "@/components/design-preferences";
import { ExampleSection, PlaygroundPage } from "@/components/page";
import {
  designSystemPackageName,
  designSystemVersion,
} from "@/lib/design-system-metadata";

const categories = ["Foundation", "Primitive", "Pattern", "Compatibility"] as const;

const catalogSections = categories.map((category) => ({
  category,
  entries: componentInventory.filter((entry) => entry.category === category),
}));

const publicExportCount = componentInventory.reduce(
  (total, entry) => total + entry.exports.length,
  0,
);

const quickStartSnippets = [
  {
    value: "install",
    label: "Install",
    code: `pnpm add ${designSystemPackageName}`,
  },
  {
    value: "styles",
    label: "Styles",
    code: `@import "tailwindcss";
@import "${designSystemPackageName}/tailwind.css";`,
  },
  {
    value: "component",
    label: "Component",
    code: `import { Button } from "${designSystemPackageName}";

export function SaveAction() {
  return <Button type="submit">Save changes</Button>;
}`,
  },
];

const layers = [
  {
    title: "Foundation",
    description: "Semantic tokens, typography, appearance, density, spacing, and elevation.",
    href: "/foundation",
  },
  {
    title: "Primitives",
    description: "Accessible controls and content building blocks with a stable Conscia API.",
    href: "/components",
  },
  {
    title: "Patterns",
    description: "Reusable application shells, tables, filters, state views, and workflows.",
    href: "/patterns",
  },
] as const;

const ownership = [
  {
    title: "Use the design system for",
    items: [
      "Shared visual and interaction conventions",
      "Accessible controls and recurring product patterns",
      "Appearance, density, and semantic design tokens",
    ],
  },
  {
    title: "Keep in the product application",
    items: [
      "Routing, authentication, and permissions",
      "Data fetching, mutations, and validation",
      "Product-specific state and one-off workflows",
    ],
  },
] as const;

export default function OverviewPage() {
  return (
    <PlaygroundPage
      title="Overview"
      description="Start here to understand the Conscia design system, install it in an application, and find the right component or pattern."
      actions={
        <Badge variant="neutral" className="self-start">
          Version {designSystemVersion}
        </Badge>
      }
    >
      <section
        className="overflow-hidden rounded-[var(--ds-radius-surface)] border border-border-default bg-surface-raised shadow-[var(--ds-shadow-raised)]"
      >
        <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-8">
          <div className="max-w-3xl">
            <Badge variant="information">Conscia product foundation</Badge>
            <h2 className="ds-type-display-title mt-4 max-w-2xl">
              Build consistent product experiences from shared decisions.
            </h2>
            <p className="ds-type-body mt-4 max-w-2xl text-text-supporting">
              Use foundation tokens for visual language, primitives for accessible controls,
              and patterns for recurring product workflows. Applications keep ownership of
              their data and business behavior.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button render={<Link href="/components" />}>Browse components</Button>
              <Button variant="outline" render={<Link href="/patterns" />}>
                Explore patterns
              </Button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 sm:min-w-72">
            <div className="rounded-[var(--ds-radius-control)] border border-border-subtle bg-surface p-4">
              <dt className="ds-type-metadata text-text-supporting">Families</dt>
              <dd className="ds-type-page-title mt-1 tabular-nums">{componentInventory.length}</dd>
            </div>
            <div className="rounded-[var(--ds-radius-control)] border border-border-subtle bg-surface p-4">
              <dt className="ds-type-metadata text-text-supporting">Public exports</dt>
              <dd className="ds-type-page-title mt-1 tabular-nums">{publicExportCount}</dd>
            </div>
          </dl>
        </div>
      </section>

      <ExampleSection
        title="Get started"
        description="A Tailwind v4 application needs the package, one global stylesheet import, and the components it uses."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
          <CodeBlock snippets={quickStartSnippets} />
          <ol className="grid gap-3 rounded-[var(--ds-radius-surface)] border border-border-subtle bg-surface p-4">
            <li className="flex gap-3">
              <Badge
                variant="neutral"
                className="mt-0.5 size-6 shrink-0 justify-center rounded-full p-0"
              >
                1
              </Badge>
              <div>
                <div className="ds-type-ui font-semibold">Install and load styles</div>
                <p className="ds-type-metadata mt-1 text-text-supporting">
                  Import the Tailwind integration once in the application&apos;s global stylesheet.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge
                variant="neutral"
                className="mt-0.5 size-6 shrink-0 justify-center rounded-full p-0"
              >
                2
              </Badge>
              <div>
                <div className="ds-type-ui font-semibold">Set root preferences</div>
                <p className="ds-type-metadata mt-1 text-text-supporting">
                  Start with system appearance and comfortable density, then opt into denser
                  modes deliberately.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Badge
                variant="neutral"
                className="mt-0.5 size-6 shrink-0 justify-center rounded-full p-0"
              >
                3
              </Badge>
              <div>
                <div className="ds-type-ui font-semibold">Choose the highest useful layer</div>
                <p className="ds-type-metadata mt-1 text-text-supporting">
                  Prefer an existing pattern when it already captures the workflow; compose
                  primitives for new reusable needs.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </ExampleSection>

      <ExampleSection
        title="How the system is organized"
        description="Each layer builds on the one before it. Start at the highest layer that matches the problem."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {layers.map((layer, index) => (
            <Link
              key={layer.title}
              href={layer.href}
              className="group rounded-[var(--ds-radius-surface)] border border-border-subtle bg-surface p-5 outline-none transition-colors hover:bg-surface-muted focus-visible:ring-[3px] focus-visible:ring-focus/50"
            >
              <div className="ds-type-metadata text-text-muted">0{index + 1}</div>
              <h3 className="ds-type-section-title mt-3 group-hover:text-text-primary">{layer.title}</h3>
              <p className="ds-type-ui mt-2 text-text-supporting">{layer.description}</p>
              <div className="ds-type-metadata mt-4 font-semibold text-text-primary">Open {layer.title.toLowerCase()} →</div>
            </Link>
          ))}
        </div>
      </ExampleSection>

      <ExampleSection
        title="Ownership boundary"
        description="The design system stays reusable by owning presentation conventions without becoming an application framework."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {ownership.map((group) => (
            <section
              key={group.title}
              className="rounded-[var(--ds-radius-surface)] border border-border-subtle bg-surface p-5"
            >
              <h3 className="ds-type-card-title">{group.title}</h3>
              <ul className="ds-type-ui mt-3 grid list-disc gap-2 pl-5 text-text-supporting">
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </ExampleSection>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <ExampleSection
          title="Design system inventory"
          description="Every public component family links to a maintained catalog or realistic reference screen."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {catalogSections.map(({ category, entries }) => (
              <section
                key={category}
                className="overflow-hidden rounded-[var(--ds-radius-surface)] border border-border-default bg-surface"
              >
                <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
                  <h3 className="ds-type-card-title">{category}</h3>
                  <Badge variant="neutral">{entries.length} families</Badge>
                </header>
                <div className="divide-y divide-border-subtle">
                  {entries.map((entry) => (
                    <Link
                      key={entry.family}
                      href={entry.route}
                      className="block px-4 py-3 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus/50 focus-visible:ring-inset"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="ds-type-ui font-medium">{entry.family}</div>
                          <div className="ds-type-metadata mt-0.5 text-text-supporting">{entry.description}</div>
                        </div>
                        <span className="ds-type-metadata shrink-0 tabular-nums text-text-muted">
                          {entry.exports.length}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </ExampleSection>
        <aside className="h-fit rounded-[var(--ds-radius-surface)] border bg-surface p-4">
          <h2 className="ds-type-card-title">Global controls</h2>
          <p className="ds-type-ui mt-1 text-text-supporting">
            Appearance and density update shared root attributes across every example.
          </p>
          <div className="mt-4"><DesignPreferences /></div>
          <Button
            className="mt-5 w-full"
            variant="outline"
            render={<Link href="/delivery-metrics" />}
          >
            Open dashboard example
          </Button>
        </aside>
      </div>
    </PlaygroundPage>
  );
}
