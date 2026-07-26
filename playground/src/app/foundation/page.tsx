import { Badge, Button, Input } from "@conscia-labs/design-system";

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
            <div className="text-[var(--ds-page-title)] font-semibold">Page title</div>
            <div className="mt-3 text-[var(--ds-section-title)] font-semibold">Section title</div>
            <p className="mt-2 text-sm leading-6 text-text-secondary">Body text describes the operational implication of the current state without decorative emphasis.</p>
            <div className="mt-2 text-[var(--ds-metadata)] text-muted-foreground">Metadata: updated 2 minutes ago</div>
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
