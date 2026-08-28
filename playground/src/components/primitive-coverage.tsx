"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FormSelect,
  Input,
  Label,
  SearchableSelect,
  Separator,
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
  Switch,
  Textarea,
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

  return (
    <div data-testid="primitive-coverage" className="col-span-full grid min-w-0 gap-6 xl:grid-cols-2">
      <ExampleSection title="Custom visual primitives">
        <div className="grid gap-4 rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]">
          <Alert variant="information">
            <AlertTitle>Information state</AlertTitle>
            <AlertDescription>Shared primitives keep supporting context readable without competing with the primary task.</AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle>Model connection</CardTitle>
              <CardDescription>A compact surface with a clear title and supporting description.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-medium">Conscia Gateway</div>
                <div className="text-sm text-muted-foreground">Connected and ready</div>
              </div>
              <Badge variant="success" className="ml-auto">Ready</Badge>
            </CardContent>
          </Card>
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
              <span className="block text-muted-foreground">Run a health check after configuration changes.</span>
            </span>
            <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} aria-label="Automatic diagnostics" />
          </label>
        </div>
      </ExampleSection>

      <ExampleSection title="Disclosure and overlay states">
        <div className="flex flex-wrap items-start gap-3 rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]">
          <Collapsible className="w-full rounded-[var(--ds-radius-control)] border p-3">
            <CollapsibleTrigger className="text-sm font-medium">Show implementation notes</CollapsibleTrigger>
            <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
              The baseline captures both the collapsed and expanded anatomy without changing the component implementation.
            </CollapsibleContent>
          </Collapsible>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
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
                <SheetClose asChild>
                  <Button variant="outline">Close sheet</Button>
                </SheetClose>
                <Button>Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </ExampleSection>
    </div>
  );
}

export { PrimitiveCoverage };
