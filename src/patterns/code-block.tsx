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
  selectorLabel?: string;
  copyLabel?: string;
};

function CodeBlock({
  snippets,
  defaultValue,
  selectorLabel = "Code language",
  copyLabel = "Copy code",
  className,
  ...props
}: CodeBlockProps) {
  const initialValue = defaultValue ?? snippets[0]?.value ?? "";
  const [activeValue, setActiveValue] = React.useState(initialValue);
  const [copiedValue, setCopiedValue] = React.useState<string | null>(null);
  const [copyError, setCopyError] = React.useState(false);
  const tabsListRef = React.useRef<HTMLDivElement>(null);
  const copyStatusId = React.useId();
  const activeSnippet =
    snippets.find((snippet) => snippet.value === activeValue) ?? snippets[0];
  const selectedValue = activeSnippet?.value;

  React.useEffect(() => {
    const tabsList = tabsListRef.current;
    const selectedTab = tabsList?.querySelector<HTMLElement>('[data-active="true"]');
    if (!tabsList || !selectedTab) return;

    const listBounds = tabsList.getBoundingClientRect();
    const tabBounds = selectedTab.getBoundingClientRect();
    const visibleLeft = listBounds.left + tabsList.clientLeft;
    const visibleRight = visibleLeft + tabsList.clientWidth;

    if (tabBounds.left < visibleLeft) {
      tabsList.scrollLeft -= visibleLeft - tabBounds.left;
    } else if (tabBounds.right > visibleRight) {
      tabsList.scrollLeft += tabBounds.right - visibleRight;
    }
  }, [selectedValue]);

  if (!activeSnippet) return null;

  return (
    <div
      data-slot="code-block"
      className={cn("@container/code-block min-w-0 overflow-hidden rounded-lg border border-border-subtle bg-surface", className)}
      {...props}
    >
      <Tabs value={activeSnippet.value} onValueChange={setActiveValue} variant="segmented" className="gap-0">
        <div
          data-slot="code-block-toolbar"
          className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle bg-surface-muted px-3 py-2 @max-[28rem]/code-block:flex-col @max-[28rem]/code-block:items-stretch @max-[28rem]/code-block:gap-2"
        >
          <TabsList
            ref={tabsListRef}
            variant="segmented"
            size="compact"
            aria-label={selectorLabel}
            className="min-w-0 max-w-full overflow-x-auto overscroll-x-contain @max-[28rem]/code-block:w-full @max-[28rem]/code-block:self-stretch"
          >
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
            className="min-w-0 max-w-full shrink-0 @max-[28rem]/code-block:h-auto @max-[28rem]/code-block:min-h-[var(--ds-control-height-sm)] @max-[28rem]/code-block:w-full @max-[28rem]/code-block:justify-center @max-[28rem]/code-block:py-1.5"
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
            <span className="min-w-0 whitespace-normal [overflow-wrap:anywhere]">
              {copiedValue === activeSnippet.value ? "Copied" : copyLabel}
            </span>
          </Button>
          <span id={copyStatusId} className="sr-only" role="status" aria-live="polite">
            {copyError
              ? "Code could not be copied. Select the code and copy it manually."
              : copiedValue === activeSnippet.value
                ? "Code copied to clipboard."
                : ""}
          </span>
        </div>
        {snippets.map((snippet) => (
          <TabsContent key={snippet.value} value={snippet.value} className="m-0 min-w-0">
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
