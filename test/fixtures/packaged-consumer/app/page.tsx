import {
  AppShell,
  AppSidebar,
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
      <AppSidebar className="bg-sidebar">
        <div className="flex h-full flex-col">Navigation</div>
      </AppSidebar>
      <MainRegion>
        <div data-testid="responsive-topbar" className={topbarClassName}>
          <span>Title</span>
          <span>Actions</span>
        </div>
        <PageToolbar />
        <PageContent>
          <Card>
            <CardContent>Packaged card padding</CardContent>
          </Card>
          <DropdownMenu open>
            <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
            <DropdownMenuContent forceMount className="border opacity-70">
              <DropdownMenuItem>Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open>
            <DialogContent forceMount>
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
