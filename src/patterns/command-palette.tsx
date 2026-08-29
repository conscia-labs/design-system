"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { SearchIcon } from "lucide-react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../primitives/dialog";
import { cn } from "../primitives/utils";

type CommandPaletteItem = {
  description?: React.ReactNode;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
  id: string;
  keywords?: readonly string[];
  label: string;
  shortcut?: React.ReactNode;
};

type CommandPaletteProps = Omit<React.ComponentProps<"div">, "children" | "onSelect"> & {
  closeOnSelect?: boolean;
  defaultOpen?: boolean;
  description?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  items: readonly CommandPaletteItem[];
  onOpenChange?: (open: boolean) => void;
  onSelect: (item: CommandPaletteItem) => void;
  open?: boolean;
  placeholder?: string;
  title?: React.ReactNode;
  trigger?: React.ReactElement;
};

function CommandPalette({
  className,
  closeOnSelect = true,
  defaultOpen = false,
  description,
  emptyMessage = "No commands found.",
  items,
  onOpenChange,
  onSelect,
  open,
  placeholder = "Search commands...",
  title = "Command menu",
  trigger,
  ...props
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("");
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = open ?? internalOpen;
  const filteredItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      [item.label, ...(item.keywords ?? [])].some((value) =>
        value.toLocaleLowerCase().includes(normalizedQuery),
      ),
    );
  }, [items, query]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      if (nextOpen) {
        setQuery("");
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const handleSelect = React.useCallback(
    (item: CommandPaletteItem) => {
      onSelect(item);
      if (closeOnSelect) {
        handleOpenChange(false);
      }
    },
    [closeOnSelect, handleOpenChange, onSelect],
  );

  return (
    <div data-slot="command-palette" className={cn("contents", className)} {...props}>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {trigger ? <DialogTrigger render={trigger} /> : null}
        <DialogContent
          showCloseButton={false}
          size="small"
          aria-label={typeof title === "string" ? undefined : "Command menu"}
          className="max-w-xl gap-0 p-0"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
          <DialogBody className="overflow-hidden">
            <Combobox.Root<CommandPaletteItem>
              items={filteredItems}
              filter={() => true}
              open
              autoHighlight
              inputValue={query}
              onInputValueChange={setQuery}
              onValueChange={(item) => {
                if (item) {
                  handleSelect(item);
                }
              }}
              itemToStringLabel={(item) => [item.label, ...(item.keywords ?? [])].join(" ")}
              itemToStringValue={(item) => item.id}
            >
              <div className="flex items-center gap-2 border-b border-border-subtle px-4">
                <SearchIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                <Combobox.Input
                  aria-label="Search commands"
                  autoFocus
                  className="ds-type-control h-12 min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  placeholder={placeholder}
                />
              </div>
              <Combobox.List
                aria-label="Commands"
                className="max-h-[min(24rem,calc(100vh-10rem))] overflow-y-auto p-2 outline-none"
              >
                {filteredItems.length === 0 ? (
                  <div role="status" className="px-3 py-8 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                ) : null}
                {filteredItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                    {item.group && (index === 0 || filteredItems[index - 1]?.group !== item.group) ? (
                        <div role="presentation" className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground first:pt-1">
                          {item.group}
                        </div>
                      ) : null}
                      <Combobox.Item
                        index={index}
                        value={item}
                        disabled={item.disabled}
                        className="data-highlighted:bg-surface-muted data-highlighted:text-foreground relative flex min-w-0 items-start gap-3 rounded-md px-3 py-2.5 text-left outline-none data-disabled:pointer-events-none data-disabled:opacity-50"
                      >
                        {item.icon ? <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-muted-foreground">{item.icon}</span> : null}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{item.label}</span>
                          {item.description ? <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.description}</span> : null}
                        </span>
                        {item.shortcut ? <span className="shrink-0 text-xs text-muted-foreground">{item.shortcut}</span> : null}
                      </Combobox.Item>
                    </React.Fragment>
                ))}
              </Combobox.List>
            </Combobox.Root>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { CommandPalette };
export type { CommandPaletteItem, CommandPaletteProps };
