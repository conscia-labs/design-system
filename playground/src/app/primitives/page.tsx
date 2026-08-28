"use client";

import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  NavigationTab,
  NavigationTabs,
  NavigationTabsList,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@conscia-labs/design-system";

import { ExampleSection, PlaygroundPage } from "@/components/page";
import { PrimitiveCoverage } from "@/components/primitive-coverage";

export default function PrimitivesPage() {
  return (
    <TooltipProvider>
      <PlaygroundPage
        title="Primitives"
        description="The first shared Conscia primitives, rendered with meaningful states and global appearance/density adaptation."
      >
        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <ExampleSection title="Button">
            <div className="flex flex-wrap gap-2 rounded-[var(--ds-radius-surface)] border bg-surface p-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
            </div>
          </ExampleSection>

          <ExampleSection title="Form controls">
            <div className="rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="model-name">Model display name</FieldLabel>
                  <Input id="model-name" defaultValue="Claude Sonnet 4" />
                  <FieldDescription>Use the user-facing AI Model name, not the provider-native identifier.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="availability">Availability</FieldLabel>
                  <Select defaultValue="available">
                    <SelectTrigger id="availability" className="w-full">
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="restricted">Limited</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field data-invalid>
                  <FieldLabel htmlFor="model-alias">Model alias</FieldLabel>
                  <Input id="model-alias" aria-invalid defaultValue="model:auto" />
                  <FieldError>Aliases must be unique within the organization.</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="disabled-field">Disabled field</FieldLabel>
                  <Input id="disabled-field" disabled defaultValue="Inherited from platform catalog" />
                </Field>
                <label className="grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-2 text-sm">
                  <Checkbox defaultChecked className="mt-0.5" />
                  <span>
                    Include this model in default developer access.
                    <span className="block text-[var(--ds-metadata)] text-muted-foreground">Checkbox alignment remains stable with multi-line labels.</span>
                  </span>
                </label>
              </FieldGroup>
            </div>
          </ExampleSection>

          <ExampleSection title="Badge">
            <div className="flex flex-wrap gap-2 rounded-[var(--ds-radius-surface)] border bg-surface p-4">
              <Badge variant="accent">Accent</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="information">Information</Badge>
              <Badge variant="success">Available</Badge>
              <Badge variant="warning">Limited</Badge>
              <Badge variant="danger">Unavailable</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>
          </ExampleSection>

          <ExampleSection title="Tabs">
            <NavigationTabs aria-label="Resource sections">
              <NavigationTabsList>
                <NavigationTab href="#tabs" active>
                  Overview
                </NavigationTab>
                <NavigationTab href="#tabs-configuration">Configuration</NavigationTab>
                <NavigationTab href="#tabs-credentials">Credentials</NavigationTab>
                <NavigationTab href="#tabs-organizations">Organizations</NavigationTab>
                <NavigationTab href="#tabs-models">Models</NavigationTab>
                <NavigationTab href="#tabs-health">Health</NavigationTab>
                <NavigationTab href="#tabs-activity">Activity</NavigationTab>
              </NavigationTabsList>
            </NavigationTabs>
            <p className="pt-3 text-sm text-muted-foreground">
              Routed resource navigation exposes the current page and keeps the full tab target interactive.
            </p>
            <Tabs defaultValue="overview" className="pt-4">
              <TabsList aria-label="Layered content example">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">Shared tab behavior with stable selected state.</TabsContent>
              <TabsContent value="usage" className="pt-3 text-sm text-muted-foreground">Usage view placeholder.</TabsContent>
              <TabsContent value="activity" className="pt-3 text-sm text-muted-foreground">Activity view placeholder.</TabsContent>
            </Tabs>
            <Tabs variant="segmented" defaultValue="table" className="rounded-[var(--ds-radius-surface)] border bg-surface p-4">
              <TabsList aria-label="Display mode example">
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="compact">Compact</TabsTrigger>
              </TabsList>
              <TabsContent value="table" className="pt-3 text-sm text-muted-foreground">Segmented tabs are reserved for compact mode switching.</TabsContent>
              <TabsContent value="list" className="pt-3 text-sm text-muted-foreground">List mode placeholder.</TabsContent>
              <TabsContent value="compact" className="pt-3 text-sm text-muted-foreground">Compact mode placeholder.</TabsContent>
            </Tabs>
          </ExampleSection>

          <ExampleSection title="Table">
            <div className="rounded-[var(--ds-radius-surface)] border bg-surface">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>AI Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Provider</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow data-state="selected">
                    <TableCell>Claude Sonnet 4</TableCell>
                    <TableCell><Badge variant="success">Available</Badge></TableCell>
                    <TableCell>Amazon Bedrock</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nova Pro</TableCell>
                    <TableCell><Badge variant="warning">Limited</Badge></TableCell>
                    <TableCell>Amazon Bedrock</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">Empty state appears in the table content region when no rows match.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </ExampleSection>

          <ExampleSection title="Dialog, Dropdown, Tooltip">
            <div className="flex flex-wrap gap-2 rounded-[var(--ds-radius-surface)] border bg-surface p-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rotate API key</DialogTitle>
                    <DialogDescription>Consequential actions keep a clear title, explanation, and focus state.</DialogDescription>
                  </DialogHeader>
                  <DialogBody>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="rotation-note">Rotation note</FieldLabel>
                        <Input id="rotation-note" placeholder="Reason for audit history" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="rotation-owner">Owner</FieldLabel>
                        <Select defaultValue="platform">
                          <SelectTrigger id="rotation-owner" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="platform">Platform operations</SelectItem>
                              <SelectItem value="security">Security team</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>
                  </DialogBody>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Rotate key</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Destructive dialog</Button>
                </DialogTrigger>
                <DialogContent size="small">
                  <DialogHeader>
                    <DialogTitle>Disable model access</DialogTitle>
                    <DialogDescription>This verifies destructive dialog spacing without changing data.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Disable</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Model actions</DropdownMenuLabel>
                  <DropdownMenuItem>View details</DropdownMenuItem>
                  <DropdownMenuItem>Set preferred</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">Remove access</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost">Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Tooltips name compact controls.</TooltipContent>
              </Tooltip>
            </div>
          </ExampleSection>

          <PrimitiveCoverage />
        </div>
      </PlaygroundPage>
    </TooltipProvider>
  );
}
