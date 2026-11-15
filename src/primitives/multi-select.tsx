"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Check, X } from "lucide-react";

import { fieldGroupClasses } from "./field-control";
import { overlayLayers } from "./overlay-layers";
import type { SearchableSelectOption } from "./searchable-select";
import { cn } from "./utils";

type MultiSelectProps = {
  id?: string;
  name?: string;
  value?: string[];
  defaultValue?: string[];
  options: SearchableSelectOption[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  /** Names the remove button on each chip; the option label is appended. */
  removeLabel?: string;
  optionsLabel?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

/**
 * Several choices from a searchable list, shown as removable chips inside the
 * field. Use SearchableSelect for one choice.
 */
function MultiSelect({
  id, name, value, defaultValue, options, onValueChange,
  placeholder = "Select options", emptyMessage = "No matching options.",
  disabled = false, removeLabel = "Remove", optionsLabel, className,
  "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid,
}: MultiSelectProps) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const items = React.useMemo(() => options.map((option) => option.value), [options]);
  const labelOf = React.useCallback((item: string) => options.find((option) => option.value === item)?.label ?? item, [options]);
  const { contains } = Combobox.useFilter();

  const filter = React.useCallback((optionValue: string, query: string) => {
    if (!query) return true;
    const option = options.find((candidate) => candidate.value === optionValue);
    return Boolean(option && [option.label, ...(option.keywords ?? [])].some((text) => contains(text, query)));
  }, [contains, options]);

  return (
    <Combobox.Root
      multiple items={items} filter={filter} autoHighlight
      value={value} defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next)}
      itemToStringLabel={labelOf}
      name={name} disabled={disabled}
    >
      <Combobox.Chips
        ref={anchorRef}
        data-slot="multi-select"
        className={cn(fieldGroupClasses, "h-auto min-h-[var(--ds-field-control-height)] flex-wrap items-center gap-1 overflow-visible px-2 py-1", className)}
      >
        <Combobox.Value>
          {(selected: string[]) => (
            <>
              {selected.map((item) => (
                <Combobox.Chip
                  key={item}
                  data-slot="multi-select-chip"
                  aria-label={labelOf(item)}
                  className="ds-type-metadata flex max-w-full cursor-default items-center gap-1 rounded-sm bg-surface-track py-0.5 pl-2 pr-0.5 text-text-primary outline-none data-highlighted:bg-selection-background-strong focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  <span className="truncate">{labelOf(item)}</span>
                  <Combobox.ChipRemove
                    aria-label={`${removeLabel} ${labelOf(item)}`}
                    className="inline-flex size-5 items-center justify-center rounded-sm text-text-supporting outline-none hover:bg-surface-muted hover:text-text-primary"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </Combobox.ChipRemove>
                </Combobox.Chip>
              ))}
              <Combobox.Input
                data-slot="multi-select-input"
                {...(id !== undefined ? { id } : {})}
                aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy} aria-invalid={ariaInvalid}
                placeholder={selected.length ? "" : placeholder}
                className="ds-type-control h-7 min-w-16 flex-1 bg-transparent px-1 text-text-primary outline-none placeholder:text-text-supporting disabled:cursor-not-allowed"
              />
            </>
          )}
        </Combobox.Value>
      </Combobox.Chips>
      <Combobox.Portal>
        <Combobox.Positioner anchor={anchorRef} data-slot="multi-select-positioner" className={cn(overlayLayers.popup, "w-[var(--anchor-width)]")}>
          <Combobox.Popup data-slot="multi-select-content" className="mt-1 max-h-72 overflow-auto rounded-md border bg-surface-floating p-1 text-text-primary shadow-[var(--ds-shadow-floating)] outline-none">
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
  );
}

export { MultiSelect };
export type { MultiSelectProps };
