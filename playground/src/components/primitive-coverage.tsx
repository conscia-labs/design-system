"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarGroup,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  CommandPalette,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FilterBar,
  FilterChip,
  FormSelect,
  Input,
  IconButton,
  Label,
  SearchableSelect,
  Separator,
  ShortcutHint,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Spinner,
  Switch,
  Textarea,
  useToast,
} from "@conscia-labs/design-system";

import { ExampleSection } from "@/components/page";

const searchableOptions = [
  { value: "bedrock", label: "Amazon Bedrock", description: "Managed model access", keywords: ["aws", "provider"] },
  { value: "openai", label: "OpenAI", description: "Hosted model access", keywords: ["provider", "chat"] },
  { value: "vertex", label: "Vertex AI", description: "Google Cloud models", keywords: ["gcp", "provider"] },
];

function PrimitiveCoverage() {
  const [searchableValue, setSearchableValue] = useState("bedrock");
  const [switchChecked, setSwitchChecked] = useState(true);
  const [activeFilters, setActiveFilters] = useState(["Provider", "Availability"]);
  const { add: addToast } = useToast();

  const commandItems = [
    { id: "open-models", label: "Open AI Models", description: "Browse the model catalog", group: "Navigate", shortcut: <ShortcutHint label="Command M">⌘M</ShortcutHint> },
    { id: "open-settings", label: "Open settings", description: "Manage workspace preferences", keywords: ["preferences"], group: "Navigate", shortcut: <ShortcutHint label="Command comma">⌘,</ShortcutHint> },
    { id: "refresh-catalog", label: "Refresh catalog", description: "Sync the latest provider models", keywords: ["sync", "reload"], group: "Actions", disabled: true },
  ];

  return (
    <div data-testid="primitive-coverage" className="col-span-full grid min-w-0 gap-6 xl:grid-cols-2">
      <ExampleSection title="Custom visual primitives">
        <div className="grid gap-4 rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]">
          <Alert variant="information">
            <AlertTitle>Information state</AlertTitle>
            <AlertDescription>Shared primitives keep supporting context readable without competing with the primary task.</AlertDescription>
          </Alert>
          <Card>
            <CardHeader action={<IconButton variant="ghost" size="sm" aria-label="More model connection actions">…</IconButton>}>
              <CardTitle>Model connection</CardTitle>
              <CardDescription>A compact surface with a clear title and supporting description.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-medium">Conscia Gateway</div>
                <div className="text-sm text-text-supporting">Connected and ready</div>
              </div>
              <Badge variant="success" className="ml-auto">Ready</Badge>
            </CardContent>
            <CardFooter className="text-sm text-text-supporting">Last checked a few moments ago.</CardFooter>
          </Card>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card variant="default"><CardContent className="p-4 text-sm">Default surface</CardContent></Card>
            <Card variant="muted"><CardContent className="p-4 text-sm">Muted surface</CardContent></Card>
            <Card variant="elevated"><CardContent className="p-4 text-sm">Elevated surface</CardContent></Card>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label htmlFor="coverage-notes">Notes</Label>
            <Textarea id="coverage-notes" defaultValue="Documented for the visual baseline." />
          </div>
          <div className="grid gap-2" aria-label="Loading state">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </ExampleSection>

      <ExampleSection title="Behavioral controls">
        <div className="grid gap-4 rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="coverage-provider">Provider</FieldLabel>
              <FormSelect
                id="coverage-provider"
                aria-label="Provider"
                value="bedrock"
                options={searchableOptions.map(({ value, label }) => ({ value, label }))}
                onValueChange={() => undefined}
              />
              <FieldDescription>FormSelect keeps the option list close to the field contract.</FieldDescription>
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="coverage-alias">Alias</FieldLabel>
              <Input id="coverage-alias" aria-invalid defaultValue="model:auto" />
              <FieldError>Aliases must be unique within the organization.</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="coverage-search">Searchable provider</FieldLabel>
              <SearchableSelect
                id="coverage-search"
                aria-label="Searchable provider"
                value={searchableValue}
                options={searchableOptions}
                onValueChange={setSearchableValue}
                clearable
              />
            </Field>
          </FieldGroup>
          <label className="flex items-start gap-2 text-sm">
            <Checkbox defaultChecked className="mt-0.5" />
            <span>Include this provider in the default catalog.</span>
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            <span>
              <span className="block font-medium">Automatic diagnostics</span>
              <span className="block text-text-supporting">Run a health check after configuration changes.</span>
            </span>
            <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} aria-label="Automatic diagnostics" />
          </label>
        </div>
      </ExampleSection>

      <ExampleSection title="Disclosure and overlay states">
        <div className="flex flex-wrap items-start gap-3 rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]">
          <Collapsible className="w-full rounded-[var(--ds-radius-control)] border p-3">
            <CollapsibleTrigger className="text-sm font-medium">Show implementation notes</CollapsibleTrigger>
            <CollapsibleContent className="pt-3 text-sm text-text-supporting">
              The baseline captures both the collapsed and expanded anatomy without changing the component implementation.
            </CollapsibleContent>
          </Collapsible>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Provider details</SheetTitle>
                <SheetDescription>A mobile-friendly side surface for supporting configuration work.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <div className="rounded-[var(--ds-radius-control)] bg-surface-muted p-3 text-sm">
                  Amazon Bedrock · Connected
                </div>
              </SheetBody>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>Close sheet</SheetClose>
                <Button>Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </ExampleSection>

      <ExampleSection title="Supporting components">
        <div className="grid gap-4 rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-text-supporting">Keyboard shortcut</span>
            <ShortcutHint label="Command K">⌘K</ShortcutHint>
            <span className="text-sm text-text-supporting">Loading</span>
            <Spinner size="sm" label="Loading model data" />
            <Spinner label="Loading" />
            <Spinner size="lg" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <AvatarGroup max={3} total={7} aria-label="Model owners">
              <Avatar><AvatarFallback>AL</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>BK</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>CM</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>DS</AvatarFallback></Avatar>
            </AvatarGroup>
            <span className="text-sm text-text-supporting">Seven owners, four shown in the overflow count.</span>
          </div>
          <FilterBar onClearAll={() => setActiveFilters([])}>
            {activeFilters.includes("Provider") ? <FilterChip label="Provider" value="Amazon Bedrock" onRemove={() => setActiveFilters((filters) => filters.filter((filter) => filter !== "Provider"))} /> : null}
            {activeFilters.includes("Availability") ? <FilterChip label="Availability" value="Available" onRemove={() => setActiveFilters((filters) => filters.filter((filter) => filter !== "Availability"))} /> : null}
          </FilterBar>
          <div className="flex flex-wrap gap-2">
            <CommandPalette
              items={commandItems}
              onSelect={(item) => addToast({ title: item.label, description: "Command selected.", variant: "success" })}
              trigger={<Button variant="outline">Open command palette</Button>}
            />
            <Button
              variant="outline"
              onClick={() => addToast({ title: "Catalog synced", description: "The provider catalog is up to date.", variant: "success" })}
            >
              Show success toast
            </Button>
            <Button
              variant="ghost"
              onClick={() => addToast({ title: "Connection needs attention", description: "The provider did not respond within the expected window.", variant: "warning", priority: "high" })}
            >
              Show warning toast
            </Button>
          </div>
        </div>
      </ExampleSection>
    </div>
  );
}

export { PrimitiveCoverage };
