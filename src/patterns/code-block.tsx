"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "../primitives/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../primitives/tabs";
import { cn } from "../primitives/utils";

type CodeBlockSnippet = {
  value: string;
  label: string;
  code: string;
};

type CodeBlockProps = Omit<React.ComponentProps<"div">, "children"> & {
  snippets: CodeBlockSnippet[];
  defaultValue?: string;
  copyLabel?: string;
};

function CodeBlock({
  snippets,
  defaultValue,
  copyLabel = "Copy code",
  className,
  ...props
}: CodeBlockProps) {
  const initialValue = defaultValue ?? snippets[0]?.value ?? "";
  const [activeValue, setActiveValue] = React.useState(initialValue);
  const [copiedValue, setCopiedValue] = React.useState<string | null>(null);
  const [copyError, setCopyError] = React.useState(false);
  const copyStatusId = React.useId();
  const activeSnippet =
    snippets.find((snippet) => snippet.value === activeValue) ?? snippets[0];

  if (!activeSnippet) return null;

  return (
    <div
      data-slot="code-block"
      className={cn("overflow-hidden rounded-lg border border-border-subtle bg-surface", className)}
      {...props}
    >
      <Tabs value={activeSnippet.value} onValueChange={setActiveValue} variant="segmented" className="gap-0">
        <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-muted px-3 py-2">
          <TabsList variant="segmented" size="compact" aria-label="Code language">
            {snippets.map((snippet) => (
              <TabsTrigger key={snippet.value} value={snippet.value}>
                {snippet.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(activeSnippet.code);
                setCopiedValue(activeSnippet.value);
                setCopyError(false);
              } catch {
                setCopiedValue(null);
                setCopyError(true);
              }
            }}
            aria-describedby={copyStatusId}
          >
            {copiedValue === activeSnippet.value ? <Check /> : <Copy />}
            {copiedValue === activeSnippet.value ? "Copied" : copyLabel}
          </Button>
          <span id={copyStatusId} className="sr-only" role="status" aria-live="polite">{copyError ? "Code could not be copied. Select the code and copy it manually." : copiedValue === activeSnippet.value ? "Code copied to clipboard." : ""}</span>
        </div>
        {snippets.map((snippet) => (
          <TabsContent key={snippet.value} value={snippet.value} className="m-0">
            <pre
              aria-label={`${snippet.label} code example`}
              tabIndex={0}
              className="max-h-[32rem] overflow-auto p-4 text-sm leading-6 outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-focus/50"
            >
              <code>{snippet.code}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export { CodeBlock };
export type { CodeBlockProps, CodeBlockSnippet };
