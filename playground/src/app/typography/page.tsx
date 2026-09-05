import {
  Badge,
  CodeBlock,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@conscia-labs/design-system";

import { ExampleSection, PlaygroundPage } from "@/components/page";

const typeRoles = [
  { role: "Display title", utility: "ds-type-display-title", token: "--ds-display-title", sample: "Build with clarity", className: "ds-type-display-title" },
  { role: "Page title", utility: "ds-type-page-title", token: "--ds-page-title", sample: "Provider connections", className: "ds-type-page-title" },
  { role: "Section title", utility: "ds-type-section-title", token: "--ds-section-title", sample: "Routing configuration", className: "ds-type-section-title" },
  { role: "Card title", utility: "ds-type-card-title", token: "--ds-card-title-size", sample: "Connection health", className: "ds-type-card-title" },
  { role: "Body", utility: "ds-type-body", token: "--ds-body", sample: "Body copy explains the task and its operational context.", className: "ds-type-body" },
  { role: "UI text", utility: "ds-type-ui", token: "--ds-ui-text-size", sample: "Compact interface guidance and supporting labels", className: "ds-type-ui" },
  { role: "Metadata", utility: "ds-type-metadata", token: "--ds-metadata", sample: "Updated 2 minutes ago", className: "ds-type-metadata" },
  { role: "Eyebrow", utility: "ds-type-eyebrow", token: "--ds-eyebrow-size", sample: "WORKSPACE", className: "ds-type-eyebrow" },
] as const;

const fontStack = '"Source Sans 3 Variable", "Source Sans 3", "Source Sans", "Aptos", "Segoe UI", Arial, sans-serif';

export default function TypographyPage() {
  return (
    <PlaygroundPage
      title="Typography"
      description="Font loading, semantic type roles, hierarchy, density behavior, and practical usage guidance for Conscia products."
      actions={<Badge variant="neutral">Source Sans 3 Variable</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <ExampleSection title="Primary typeface" description="The design system loads Source Sans 3 from its published CSS entry points.">
          <div className="grid overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface md:grid-cols-[14rem_minmax(0,1fr)]">
            <div className="flex min-h-56 items-center justify-center border-b bg-surface-muted md:border-r md:border-b-0">
              <span className="text-[7rem] font-semibold leading-none tracking-[-0.06em]" aria-hidden="true">Aa</span>
            </div>
            <div className="flex flex-col justify-center p-6">
              <h2 className="ds-type-page-title">Source Sans 3</h2>
              <p className="ds-type-body mt-3 max-w-2xl text-text-secondary">
                A highly legible variable sans serif for product interfaces, operational data, controls, and longer reading surfaces. Consumers should import the design-system CSS and avoid downloading a second copy.
              </p>
              <div className="mt-5 rounded-[var(--ds-radius-control)] bg-surface-muted p-3">
                <div className="ds-type-eyebrow text-text-supporting">FONT STACK</div>
                <code className="mt-2 block break-words text-sm text-text-secondary">{fontStack}</code>
              </div>
            </div>
          </div>
        </ExampleSection>

        <ExampleSection title="Weight ladder" description="Use a small, intentional range instead of arbitrary weights.">
          <div className="divide-y divide-border-subtle overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface">
            <WeightRow weight={400} label="Regular" usage="Body copy and descriptions" />
            <WeightRow weight={500} label="Medium" usage="Labels, controls, and emphasis" />
            <WeightRow weight={600} label="Semibold" usage="Titles and active navigation" />
          </div>
        </ExampleSection>
      </div>

      <ExampleSection title="Semantic type roles" description="Choose typography by purpose. The utilities resolve through density-aware tokens rather than fixed local values.">
        <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface">
          <div className="hidden lg:block">
            <Table className="table-fixed">
              <TableHeader><TableRow><TableHead className="w-[14%]">Role</TableHead><TableHead className="w-[25%]">Utility</TableHead><TableHead className="w-[25%]">Token</TableHead><TableHead className="w-[36%]">Rendered example</TableHead></TableRow></TableHeader>
              <TableBody>
                {typeRoles.map((item) => (
                  <TableRow key={item.role}>
                    <TableCell className="whitespace-normal font-medium">{item.role}</TableCell>
                    <TableCell className="break-all whitespace-normal"><code className="text-sm">{item.utility}</code></TableCell>
                    <TableCell className="break-all whitespace-normal"><code className="text-sm text-text-supporting">{item.token}</code></TableCell>
                    <TableCell className="whitespace-normal"><div className={`${item.className} break-words`}>{item.sample}</div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="divide-y divide-border-subtle lg:hidden">
            {typeRoles.map((item) => (
              <div key={item.role} className="grid gap-2 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{item.role}</span>
                  <code className="text-xs text-text-supporting">{item.utility}</code>
                </div>
                <div className={`${item.className} break-words`}>{item.sample}</div>
                <code className="text-xs text-text-muted">{item.token}</code>
              </div>
            ))}
          </div>
        </div>
      </ExampleSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <ExampleSection title="Hierarchy in context" description="A page should have one obvious reading path before color or decoration is considered.">
          <article className="rounded-[var(--ds-radius-surface)] border bg-surface p-6">
            <div className="ds-type-eyebrow text-text-supporting">PROVIDER CONNECTION</div>
            <h2 className="ds-type-page-title mt-2">Amazon Bedrock</h2>
            <p className="ds-type-body mt-3 max-w-prose text-text-secondary">
              Route approved model traffic through the production AWS account. Credentials are healthy and available to twelve applications.
            </p>
            <section className="mt-7 border-t pt-5">
              <h3 className="ds-type-section-title">Connection health</h3>
              <p className="ds-type-ui mt-2 text-text-supporting">All checks passed in eu-west-1.</p>
              <div className="ds-type-metadata mt-3 text-text-muted">Last checked 2 minutes ago</div>
            </section>
          </article>
        </ExampleSection>

        <ExampleSection title="Usage rules" description="Keep the hierarchy consistent across product surfaces.">
          <div className="grid gap-3 rounded-[var(--ds-radius-surface)] border bg-surface p-5">
            <Guidance title="Use semantic roles" description="Select the shared utility that matches the content’s job, then let density tokens adapt it." />
            <Guidance title="Keep body copy readable" description="Use body or UI roles for sentences. Reserve metadata and menu roles for genuinely secondary, short content." />
            <Guidance title="Preserve heading order" description="Typography classes control appearance; semantic heading elements still communicate page structure." />
            <Guidance title="Avoid one-off sizes" description="Do not add local clamp(), pixel sizes, or fractional weights when an existing role expresses the hierarchy." />
          </div>
        </ExampleSection>
      </div>

      <ExampleSection title="Density comparison" description="Typography changes with the selected density while preserving the same semantic role names.">
        <div className="grid gap-4 lg:grid-cols-3">
          <DensitySpecimen density="comfortable" label="Comfortable" description="Default product rhythm" />
          <DensitySpecimen density="compact" label="Compact" description="Reduced spatial footprint" />
          <DensitySpecimen density="operational" label="Operational" description="Dense admin and workspace surfaces" />
        </div>
      </ExampleSection>

      <ExampleSection title="Implementation" description="Import one published CSS entry point, then apply the semantic utility that matches the content role.">
        <CodeBlock snippets={[
          { value: "tsx", label: "React", code: '<h1 className="ds-type-page-title">Provider connections</h1>\n<p className="ds-type-body text-text-secondary">Manage the providers available to this workspace.</p>\n<span className="ds-type-metadata text-text-supporting">Updated 2 minutes ago</span>' },
          { value: "css", label: "CSS", code: '@import "@conscia-labs/design-system/styles.css";\n\n/* Source Sans 3 and the semantic type tokens are included. */' },
        ]} />
      </ExampleSection>
    </PlaygroundPage>
  );
}

function WeightRow({ weight, label, usage }: { weight: 400 | 500 | 600; label: string; usage: string }) {
  return (
    <div className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-3 p-4">
      <div className="text-3xl leading-none" style={{ fontWeight: weight }}>{weight}</div>
      <div>
        <div className="font-medium" style={{ fontWeight: weight }}>{label} · The quick brown fox</div>
        <div className="ds-type-metadata mt-1 text-text-supporting">{usage}</div>
      </div>
    </div>
  );
}

function Guidance({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-l-2 border-selection-indicator pl-4">
      <h3 className="ds-type-card-title">{title}</h3>
      <p className="ds-type-ui mt-1 text-text-supporting">{description}</p>
    </div>
  );
}

function DensitySpecimen({ density, label, description }: { density: "comfortable" | "compact" | "operational"; label: string; description: string }) {
  return (
    <section data-density={density} className="rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]">
      <div className="ds-type-eyebrow text-text-supporting">{label}</div>
      <h3 className="ds-type-section-title mt-2">Inventory overview</h3>
      <p className="ds-type-body mt-2 text-text-secondary">The same semantic roles adapt to {description.toLowerCase()}.</p>
      <div className="ds-type-metadata mt-4 text-text-muted">Updated just now</div>
    </section>
  );
}
