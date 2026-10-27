import { Boxes, FileText, LayoutDashboard, Settings } from "lucide-react";
import { Badge, BrandWordmark, Button, CodeBlock } from "@conscia-labs/design-system";

import { ExampleSection, PlaygroundPage } from "@/components/page";

const integratedShellCode = `const navigation = [
  {
    type: "group",
    id: "delivery",
    label: "Delivery metrics",
    items: [
      { id: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
      { id: "/reporting", label: "Reporting", icon: <FileText /> },
    ],
  },
];

<AppShell headerLayout="integrated">
  <AppHeader>
    <AppHeaderStart>{/* identity and context */}</AppHeaderStart>
    <AppHeaderSearch mobileTrigger={mobileSearch}>{search}</AppHeaderSearch>
    <AppHeaderActions>{/* utilities and account */}</AppHeaderActions>
  </AppHeader>
  <AppSidebar><AppSidebarContent><SidebarNavigation entries={navigation} /></AppSidebarContent></AppSidebar>
  <MainRegion>{children}</MainRegion>
</AppShell>`;

const submenuCode = `{
  type: "submenu",
  id: "advanced",
  label: "Advanced tools",
  icon: <Settings />,
  defaultOpen: false,
  items: advancedRoutes,
}`;

export default function ShellNavigationPage() {
  return (
    <PlaygroundPage title="Shell and navigation" description="The integrated header and quiet, labeled navigation groups are the preferred application-shell composition.">
      <ExampleSection title="Preferred integrated shell" description="The live playground frame demonstrates this composition: one global header spans the viewport and the sidebar begins beneath it.">
        <div className="grid overflow-hidden rounded-[var(--ds-radius-surface)] border border-border-default bg-canvas shadow-[var(--ds-shadow-raised)] md:grid-cols-[13rem_minmax(0,1fr)]">
          <aside className="border-r border-sidebar-border bg-sidebar-canvas p-3 text-sidebar-primary-text">
            <NavGroup label="Delivery metrics" items={[["Dashboard", LayoutDashboard, true], ["Reporting", FileText, false]]} />
            <NavGroup label="Product configuration" items={[["Pipeline", Boxes, false], ["Settings", Settings, false]]} />
          </aside>
          <div className="min-h-72 p-6">
            <div className="flex items-center gap-2"><h2 className="ds-type-page-title">Dashboard</h2><Badge variant="success">Healthy</Badge></div>
            <p className="ds-type-ui mt-2 max-w-lg text-text-supporting">Only the active destination receives a quiet surface. Section labels organize the information architecture without becoming controls.</p>
          </div>
        </div>
      </ExampleSection>

      <ExampleSection title="Brand chrome" description="AppHeader tone=&quot;brand&quot; and AppSidebar variant=&quot;brand&quot; paint the chrome Conscia burgundy, as on conscia.com, in both appearances. Controls inside switch to light-on-burgundy automatically.">
        <div className="overflow-hidden rounded-[var(--ds-radius-surface)] border border-border-default bg-canvas shadow-[var(--ds-shadow-raised)]">
          <div data-chrome="brand" className="flex h-12 items-center gap-3 border-b border-border-subtle bg-canvas px-4 text-text-primary">
            <BrandWordmark aria-label="Conscia" className="w-24" />
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="neutral">v1.6.0</Badge>
              <Button variant="ghost" size="sm">Appearance</Button>
              <Button variant="outline" size="sm">Contact</Button>
            </div>
          </div>
          <div className="grid md:grid-cols-[13rem_minmax(0,1fr)]">
            <aside data-sidebar-variant="brand" data-chrome="brand" className="border-r border-sidebar-border bg-sidebar-canvas p-3 text-sidebar-primary-text">
              <NavGroup label="Delivery metrics" items={[["Dashboard", LayoutDashboard, true], ["Reporting", FileText, false]]} />
              <NavGroup label="Product configuration" items={[["Pipeline", Boxes, false], ["Settings", Settings, false]]} />
            </aside>
            <div className="min-h-72 p-6">
              <div className="flex items-center gap-2"><h2 className="ds-type-page-title">Dashboard</h2><Badge variant="success">Healthy</Badge></div>
              <p className="ds-type-ui mt-2 max-w-lg text-text-supporting">Burgundy carries the chrome, as the brand&apos;s colour-usage guide intends. The workspace stays on the neutral canvas so data keeps its contrast.</p>
            </div>
          </div>
        </div>
      </ExampleSection>

      <ExampleSection title="Supergraphic" description="ds-supergraphic draws the Conscia dot rings behind content: electric blue inside brand chrome, faint burgundy on light surfaces. Never behind data.">
        <div className="grid gap-4 md:grid-cols-2">
          <div data-chrome="brand" className="ds-supergraphic min-h-48 overflow-hidden rounded-[var(--ds-radius-surface)] bg-canvas p-6 text-text-primary">
            <p className="ds-type-eyebrow text-text-supporting">Brand chrome</p>
            <h3 className="ds-type-page-title mt-2 max-w-[14rem]">Secure progress</h3>
          </div>
          <div className="ds-supergraphic min-h-48 overflow-hidden rounded-[var(--ds-radius-surface)] border bg-surface p-6">
            <p className="ds-type-eyebrow text-text-supporting">Light surface</p>
            <h3 className="ds-type-page-title mt-2 max-w-[14rem]">Welcome back</h3>
          </div>
        </div>
      </ExampleSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <ExampleSection title="Canonical API" description="Static groups are explicit and remain visible by default.">
          <CodeBlock snippets={[{ value: "tsx", label: "React", code: integratedShellCode }]} />
        </ExampleSection>
        <ExampleSection title="Explicit submenus" description="Use disclosure only for genuine hierarchy or unusually long groups; submenu triggers never receive the leaf active treatment.">
          <CodeBlock snippets={[{ value: "tsx", label: "Entry", code: submenuCode }]} />
        </ExampleSection>
      </div>

      <ExampleSection title="Compatibility" description="Existing split headers and untyped collapsible sections continue to work during the v1 migration window.">
        <div className="grid gap-3 md:grid-cols-3">
          <Rule title="Preferred" detail="AppHeader with static SidebarNavigationGroup entries." />
          <Rule title="Supported" detail="TopBar and AppSidebarHeader in split shells." />
          <Rule title="Migration-only" detail="Untyped sections whose items collapse implicitly." />
        </div>
      </ExampleSection>
    </PlaygroundPage>
  );
}

function NavGroup({ label, items }: { label: string; items: ReadonlyArray<readonly [string, typeof LayoutDashboard, boolean]> }) {
  return (
    <section className="mb-4" aria-label={label}>
      <div className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-sidebar-group-label">{label}</div>
      <div className="grid gap-1">
        {items.map(([name, Icon, active]) => (
          <div key={name} className={`flex h-8 items-center gap-2 rounded-[var(--ds-radius-control)] px-2 text-sm ${active ? "bg-sidebar-active-background font-semibold text-sidebar-active-foreground" : "text-sidebar-secondary-text"}`}>
            <Icon className="size-4" /><span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Rule({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-[var(--ds-radius-surface)] border bg-surface p-4"><div className="ds-type-card-title">{title}</div><p className="ds-type-ui mt-1 text-text-supporting">{detail}</p></div>;
}
