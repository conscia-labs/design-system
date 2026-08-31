"use client";

import { useState } from "react";

import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormSelect,
  SearchableSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@conscia-labs/design-system";

import { ExampleSection, PlaygroundPage } from "@/components/page";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready" },
  { value: "archived", label: "Archived" },
];

const modelOptions = [
  { value: "gpt-5", label: "GPT-5", description: "OpenAI · text generation" },
  { value: "claude-sonnet", label: "Claude Sonnet", description: "Anthropic · text generation" },
  { value: "gemini-pro", label: "Gemini Pro", description: "Google · text generation" },
];

function DialogFrame({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>Open {title}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-4 overflow-y-auto" data-testid={`${title}-dialog-body`}>
          {children}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SelectControl({ testId, label }: { testId: string; label: string }) {
  return (
    <Select modal={false} defaultValue="draft">
      <SelectTrigger data-testid={testId} aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function SearchableControl({ testId, label }: { testId: string; label: string }) {
  const [value, setValue] = useState("");
  return <SearchableSelect modal={false} className="w-full" aria-label={label} value={value} onValueChange={setValue} options={modelOptions} id={testId} />;
}

function SheetFixture() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>Open Sheet overlay test</Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet overlay test</SheetTitle>
        </SheetHeader>
        <SheetBody className="grid gap-4 overflow-y-auto">
          <SelectControl testId="sheet-select-trigger" label="Sheet status" />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

function NestedModalFixture() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>Open nested Dialog and Sheet</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogTitle>Outer dialog</DialogTitle>
        <DialogBody>
          <Sheet open>
            <SheetContent>
              <SheetHeader><SheetTitle>Nested sheet</SheetTitle></SheetHeader>
              <SheetBody><SelectControl testId="nested-select-trigger" label="Nested status" /></SheetBody>
            </SheetContent>
          </Sheet>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default function OverlayRegressionsPage() {
  return (
    <PlaygroundPage
      title="Nested overlay regressions"
      description="Browser-level coverage for portaled Select, FormSelect, and SearchableSelect controls inside the modal surfaces used by the admin workflows."
    >
      <ExampleSection title="Consuming-app scenarios">
        <div className="grid gap-4 rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)] md:grid-cols-3">
          <div className="grid gap-3" data-testid="invite-platform-user-scenario">
            <h2 className="font-medium">Platform Admin → Invite platform user</h2>
            <DialogFrame title="Invite platform user" description="Nested searchable and regular selects remain interactive.">
              <SearchableControl testId="invite-identity" label="Conscia identity" />
              <SelectControl testId="invite-role" label="Platform role" />
            </DialogFrame>
          </div>
          <div className="grid gap-3" data-testid="review-candidate-scenario">
            <h2 className="font-medium">Model Catalog → Review candidate</h2>
            <DialogFrame title="Review candidate" description="Candidate review fields use the standard primitives.">
              <SelectControl testId="review-action" label="Review action" />
              <SearchableControl testId="review-model" label="Public model" />
            </DialogFrame>
          </div>
          <div className="grid gap-3" data-testid="create-model-scenario">
            <h2 className="font-medium">Model Catalog → Create model</h2>
            <DialogFrame title="Create model" description="FormSelect contributes its native value while remaining nested-safe.">
              <FormSelect modal={false} name="vendor" aria-label="Model vendor" defaultValue="gpt-5" options={modelOptions.map(({ value, label }) => ({ value, label }))} />
            </DialogFrame>
          </div>
        </div>
      </ExampleSection>

      <ExampleSection title="Surface combinations">
        <div className="flex flex-wrap gap-3 rounded-[var(--ds-radius-surface)] border bg-surface p-[var(--ds-surface-padding)]">
          <SheetFixture />
          <NestedModalFixture />
        </div>
      </ExampleSection>
    </PlaygroundPage>
  );
}
