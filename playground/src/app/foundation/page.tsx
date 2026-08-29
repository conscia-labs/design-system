import {
  Badge,
  BrandIcon,
  BrandWordmark,
  Button,
  Input,
} from "@conscia-labs/design-system";

import { ExampleSection, PlaygroundPage } from "@/components/page";

export default function FoundationPage() {
  return (
    <PlaygroundPage
      title="Foundation"
      description="Semantic foundation examples rendered as interface fragments across surfaces, weight, typography, spacing, radius, elevation, and status."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <ExampleSection title="Canvas and surface hierarchy">
          <div className="grid gap-3 rounded-[var(--ds-radius-surface)] border bg-canvas p-4">
            <Surface label="Canvas" className="bg-canvas" />
            <Surface label="Surface" className="bg-surface" />
            <Surface label="Raised surface" className="bg-surface-raised shadow-[var(--ds-shadow-raised)]" />
            <Surface label="Floating surface" className="bg-surface-floating shadow-[var(--ds-shadow-floating)]" />
            <Surface label="Overlay surface" className="bg-surface-overlay shadow-[var(--ds-shadow-floating)]" />
          </div>
        </ExampleSection>

        <ExampleSection title="Visual weight and semantic text">
          <div className="rounded-[var(--ds-radius-surface)] border bg-surface p-4">
            <div className="text-base font-semibold text-text-primary">Primary operational state</div>
            <div className="mt-1 text-sm text-text-secondary">Secondary explanation that supports the current task.</div>
            <div className="mt-3 text-[var(--ds-metadata)] font-medium text-text-supporting">Supporting metadata</div>
            <div className="mt-1 text-[var(--ds-metadata)] text-text-muted">Muted diagnostic context</div>
          </div>
        </ExampleSection>

        <ExampleSection title="Long-form reading surfaces">
          <div className="rounded-[var(--ds-radius-surface)] border bg-surface p-4">
            <article className="rounded-[var(--ds-radius-control)] border bg-surface-raised p-4 shadow-[var(--ds-shadow-raised)]">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-text-primary">Conversation response</div>
                <div className="text-[var(--ds-metadata)] text-text-supporting">Just now</div>
              </div>
              <p className="mt-2 max-w-prose text-sm leading-6 text-text-secondary">
                A calm reading surface keeps the primary response clear while supporting context stays visible without competing with it.
              </p>
              <div className="mt-3 rounded-[var(--ds-radius-control)] bg-surface-muted px-3 py-2 text-[var(--ds-metadata)] text-text-supporting">
                Supporting context · shared semantic surfaces
              </div>
            </article>
          </div>
        </ExampleSection>

        <ExampleSection title="Border, radius, and elevation">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[var(--ds-radius-control)] border bg-surface p-4 text-sm">Control radius</div>
            <div className="rounded-[var(--ds-radius-surface)] border bg-surface-raised p-4 text-sm shadow-[var(--ds-shadow-raised)]">Raised</div>
            <div className="rounded-[var(--ds-radius-surface)] border bg-surface-floating p-4 text-sm shadow-[var(--ds-shadow-floating)]">Floating</div>
          </div>
        </ExampleSection>

        <ExampleSection title="Accent and status families">
          <div className="flex flex-wrap gap-2 rounded-[var(--ds-radius-surface)] border bg-surface p-4">
            <Badge variant="default">Primary</Badge>
            <Badge variant="info">Information</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Danger</Badge>
            <Badge variant="outline">Neutral</Badge>
          </div>
        </ExampleSection>

        <ExampleSection title="Brand roles">
          <div className="grid gap-3 rounded-[var(--ds-radius-surface)] border bg-surface p-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-[var(--ds-radius-control)] bg-surface-muted p-4">
              <BrandIcon aria-label="Conscia" className="size-10" />
              <div className="text-sm font-medium text-text-primary">Symbol mark · theme-aware</div>
            </div>
            <div className="flex items-center rounded-[var(--ds-radius-control)] bg-surface-muted p-4">
              <BrandWordmark aria-label="Conscia" className="w-36 max-w-full" />
            </div>
            <div className="rounded-[var(--ds-radius-control)] bg-brand p-4 text-sm font-medium text-brand-foreground">
              Primary brand · identity and signature moments
            </div>
            <div className="rounded-[var(--ds-radius-control)] border border-brand-secondary-border bg-brand-secondary-background p-4 text-sm font-medium text-brand-secondary">
              Secondary brand · restrained supporting expression
            </div>
          </div>
        </ExampleSection>

        <ExampleSection title="Typography hierarchy">
          <div className="rounded-[var(--ds-radius-surface)] border bg-surface p-4">
            <div className="ds-type-display-title">Welcome / display</div>
            <div className="ds-type-page-title">Page title</div>
            <div className="ds-type-section-title mt-3">Section title</div>
            <p className="ds-type-ui mt-2 text-text-secondary">Body text describes the operational implication of the current state without decorative emphasis.</p>
            <div className="ds-type-metadata mt-2 text-text-supporting">Metadata: updated 2 minutes ago</div>
          </div>
        </ExampleSection>

        <ExampleSection
          title="Operational typography"
          description="An opt-in scale for dense admin, catalog, connector, chat, and workspace-like surfaces."
        >
          <div data-density="operational" className="rounded-[var(--ds-radius-surface)] border bg-surface p-4">
            <div className="ds-type-eyebrow text-text-supporting">Workspace / operational</div>
            <h3 className="ds-type-page-title mt-1">Inventory overview</h3>
            <p className="ds-type-ui mt-2 max-w-2xl text-text-secondary">
              The operational preset tightens type rhythm and control text without changing the shared palette, surfaces, or accessibility behavior.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm">Primary action</Button>
              <span className="ds-type-metadata text-text-supporting">Updated 2 minutes ago</span>
            </div>
            <div className="mt-4 rounded-[var(--ds-radius-control)] bg-surface-muted p-3">
              <div className="ds-type-section-title">Connected resources</div>
              <div className="ds-type-eyebrow mt-2 text-text-supporting">Sources</div>
            </div>
          </div>
        </ExampleSection>

        <ExampleSection title="Semantic spacing and sizing">
          <div className="rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-space-section)]">
            <div className="flex flex-col gap-[var(--ds-space-group)]">
              <div className="flex flex-col gap-[var(--ds-space-field)]">
                <label className="text-sm font-medium" htmlFor="foundation-name">Model alias</label>
                <Input id="foundation-name" defaultValue="enterprise-fast" />
              </div>
              <div className="flex gap-[var(--ds-space-control)]">
                <Button>Save</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        </ExampleSection>
      </div>
    </PlaygroundPage>
  );
}

function Surface({ label, className }: { label: string; className: string }) {
  return (
    <div className={`rounded-[var(--ds-radius-surface)] border px-3 py-2 text-sm ${className}`}>
      {label}
    </div>
  );
}
