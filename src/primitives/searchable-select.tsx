"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { IconButton } from "./button";
import { overlayLayers } from "./overlay-layers";
import { cn } from "./utils";

type SearchableSelectOption = {
  value: string;
  label: string;
  description?: string;
  keywords?: string[];
  disabled?: boolean;
};

type SearchableSelectProps = {
  id?: string;
  name?: string;
  value?: string;
  options: SearchableSelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  clearable?: boolean;
  clearLabel?: string;
  optionsLabel?: string;
  className?: string;
  /** Whether the popup blocks interaction outside the combobox. Defaults to false for nested-overlay use. */
  modal?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

function SearchableSelect({
  id, name, value = "", options, onValueChange,
  placeholder = "Select an option", searchPlaceholder = "Search...",
  emptyMessage = "No matching options.", disabled = false, clearable = false,
  clearLabel = "Clear selection", optionsLabel, className, modal = false,
  "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid,
}: SearchableSelectProps) {
  const selected = options.find((option) => option.value === value) ?? null;
  const items = React.useMemo(() => options.map((option) => option.value), [options]);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(selected?.label ?? "");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { contains } = Combobox.useFilter();

  React.useLayoutEffect(() => {
    if (!open && inputRef.current) inputRef.current.value = selected?.label ?? "";
  }, [open, selected?.label]);

  const filter = React.useCallback((optionValue: string, query: string) => {
    if (!query) return true;
    const option = options.find((candidate) => candidate.value === optionValue);
    return Boolean(option && [option.label, ...(option.keywords ?? [])].some((text) => contains(text, query)));
  }, [contains, options]);

  return (
    <div data-slot="searchable-select" className={cn("relative min-w-0", className)}>
      <Combobox.Root
        items={items} filter={filter} autoHighlight modal={modal}
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setInputValue(selected?.label ?? "");
        }}
        value={value} inputValue={open ? inputValue : selected?.label ?? ""}
        onInputValueChange={setInputValue}
        onValueChange={(next) => {
          const nextOption = options.find((option) => option.value === next);
          setInputValue(nextOption?.label ?? "");
          onValueChange(next ?? "");
        }}
        itemToStringLabel={(item) => options.find((option) => option.value === item)?.label ?? ""}
        itemToStringValue={(item) => item ?? ""}
        name={name} disabled={disabled}
      >
        <Combobox.InputGroup className="relative flex items-center">
          <Combobox.Input
            ref={inputRef} id={id} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy} aria-invalid={ariaInvalid} placeholder={searchPlaceholder}
            className={cn(
              "ds-type-control h-[var(--ds-field-control-height)] w-full min-w-0 rounded-[var(--ds-field-control-radius)] border border-control-border bg-surface-control px-[var(--ds-field-control-padding-x)] py-2 outline-none transition-colors selection:bg-action selection:text-action-foreground placeholder:text-text-supporting focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus/50 aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 disabled:cursor-not-allowed disabled:opacity-50",
              clearable && selected ? "pr-20" : "pr-10",
            )}
          />
          {clearable && selected ? (
            <IconButton type="button" size="sm" variant="ghost" aria-label={clearLabel} onClick={() => onValueChange("")} className="absolute right-9">
              <X className="size-4" />
            </IconButton>
          ) : null}
          <Combobox.Trigger aria-label={ariaLabel ?? placeholder} aria-labelledby={ariaLabelledBy} className="absolute right-1 inline-flex size-8 items-center justify-center rounded-sm text-text-supporting outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ChevronsUpDown className="size-4" />
          </Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner data-slot="searchable-select-positioner" className={cn(overlayLayers.popup, "w-[var(--anchor-width)]")}>
            <Combobox.Popup className="mt-1 max-h-72 overflow-auto rounded-md border bg-surface-floating p-1 text-text-primary shadow-[var(--ds-shadow-floating)] outline-none">
              <Combobox.Empty className="px-2 py-3 text-sm text-text-supporting">{emptyMessage}</Combobox.Empty>
              <Combobox.List aria-label={optionsLabel ?? "Options"}>
                {(optionValue: string) => {
                  const option = options.find((candidate) => candidate.value === optionValue);
                  if (!option) return null;
                  return (
                    <Combobox.Item key={option.value} value={option.value} disabled={option.disabled} className="ds-type-menu-item data-highlighted:bg-surface-muted relative flex cursor-default items-start gap-2 rounded-sm py-1.5 pl-2 pr-8 outline-none data-disabled:pointer-events-none data-disabled:opacity-50">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{option.label}</span>
                        {option.description ? <span className="ds-type-metadata mt-0.5 block truncate text-text-supporting">{option.description}</span> : null}
                      </span>
                      <span className="absolute right-2 top-1.5 flex size-4 items-center justify-center">
                        <Combobox.ItemIndicator><Check className="size-4" /></Combobox.ItemIndicator>
                      </span>
                    </Combobox.Item>
                  );
                }}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}

export { SearchableSelect };
export type { SearchableSelectOption, SearchableSelectProps };
