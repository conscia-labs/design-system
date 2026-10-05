import {
  AppShell,
  AppSidebar,
  ActivityItem,
  ActivityList,
  Badge,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  MainRegion,
  MetricBand,
  MetricBandItem,
  PageContent,
  PageToolbar,
} from "@conscia-labs/design-system";
import { cn } from "@conscia-labs/design-system/utils";

// Importing the utility entry from a Server Component verifies that it did not
// inherit the component package's client-only boundary.
const topbarClassName = cn(
  "grid grid-cols-1",
  "lg:grid-cols-[minmax(0,1fr)_auto]",
);

export default function Page() {
  return (
    <AppShell>
      <AppSidebar treatment="quiet" className="bg-sidebar">
        <div className="flex h-full flex-col">Navigation</div>
      </AppSidebar>
      <MainRegion>
        <div data-testid="responsive-topbar" className={topbarClassName}>
          <span>Title</span>
          <span>Actions</span>
        </div>
        <PageToolbar />
        <PageContent>
          <MetricBand columns={3} presentation="compact">
            <MetricBandItem label="Available AI models" value={<a href="/models">6</a>} detail="Explore models" />
            <MetricBandItem label="Monthly spend" value="Less than $0.01" detail="Example allowance" />
            <MetricBandItem label="Requests this month" value="14" detail="Example total" />
          </MetricBand>
          <ActivityList>
            <ActivityItem
              title={<a href="/requests/req-example">gpt-4.1 diagnostics</a>}
              metadata={<time dateTime="2026-10-06T09:12:00Z">4 minutes ago</time>}
              status={<Badge variant="neutral">Provider failure</Badge>}
            />
          </ActivityList>
          <Card>
            <CardContent>Packaged card padding</CardContent>
          </Card>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="bg-brand p-3 text-brand-foreground">Burgundy brand surface</div>
            <div className="bg-brand-accent p-3 text-brand-accent-foreground">Blue brand accent</div>
            <div className="border border-brand-supporting-border bg-brand-supporting-background p-3 text-brand-supporting">
              Green supporting expression
            </div>
          </div>
          <DropdownMenu open>
            <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
            <DropdownMenuContent className="border opacity-70">
              <DropdownMenuItem>Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open>
            <DialogContent>
              <DialogTitle>Production dialog</DialogTitle>
              <DialogDescription>Dialog styling probe</DialogDescription>
            </DialogContent>
          </Dialog>
          <div className="hidden border-card bg-card p-4 dark:bg-sidebar lg:block">
            Dark and responsive probe
          </div>
        </PageContent>
      </MainRegion>
    </AppShell>
  );
}
