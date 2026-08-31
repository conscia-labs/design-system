"use client";
import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { IconButton } from "./button";
import { overlayLayers } from "./overlay-layers";
import { cn } from "./utils";

type SearchableSelectOption = { value: string; label: string; description?: string; keywords?: string[]; disabled?: boolean };
type SearchableSelectProps = { id?: string; name?: string; value?: string; options: SearchableSelectOption[]; onValueChange: (value: string) => void; placeholder?: string; searchPlaceholder?: string; emptyMessage?: string; disabled?: boolean; clearable?: boolean; clearLabel?: string; optionsLabel?: string; className?: string; /** Whether the popup blocks interaction outside the combobox. Defaults to false for nested-overlay use. */ modal?: boolean; "aria-label"?: string };

function SearchableSelect({ id, name, value = "", options, onValueChange, placeholder = "Select an option", searchPlaceholder = "Search...", emptyMessage = "No matching options.", disabled = false, clearable = false, clearLabel = "Clear selection", optionsLabel, className, modal = false, "aria-label": ariaLabel }: SearchableSelectProps) {
  const selected = options.find((option) => option.value === value) ?? null;
  const items = React.useMemo(() => options.map((option) => option.value), [options]);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(selected?.label ?? "");
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useLayoutEffect(() => { if (!open && inputRef.current) inputRef.current.value = selected?.label ?? ""; }, [open, selected?.label]);
  return <div data-slot="searchable-select" className={cn("relative min-w-0", className)}><Combobox.Root items={items} autoHighlight modal={modal} open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) setInputValue(selected?.label ?? ""); }} value={value} inputValue={open ? inputValue : selected?.label ?? ""} onInputValueChange={setInputValue} onValueChange={(next) => { const nextOption = options.find((option) => option.value === next); setInputValue(nextOption?.label ?? ""); onValueChange(next ?? ""); }} itemToStringLabel={(item) => options.find((option) => option.value === item)?.label ?? ""} itemToStringValue={(item) => item ?? ""} name={name} disabled={disabled}>
    <Combobox.InputGroup className="relative flex items-center">
      <Combobox.Input ref={inputRef} id={id} aria-label={ariaLabel} placeholder={searchPlaceholder} onKeyDown={(event) => { if (event.key === "Enter" && open) { const matches = options.filter((option) => !option.disabled && option.label.toLowerCase().includes(inputValue.toLowerCase())); const match = matches.at(-1); if (match && match.value !== value) { event.preventDefault(); setOpen(false); onValueChange(match.value); } } }} className="ds-type-control h-[var(--ds-field-control-height)] w-full rounded-[var(--ds-field-control-radius)] border border-control-border bg-surface-control px-3 pr-16 outline-none focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus/50 disabled:cursor-not-allowed disabled:opacity-50" />
      {clearable && selected ? <IconButton type="button" size="sm" variant="ghost" aria-label={clearLabel} onClick={() => onValueChange("")} className="absolute right-7"><X className="size-4" /></IconButton> : null}
      <Combobox.Trigger aria-label={ariaLabel ?? placeholder} className="absolute right-1 inline-flex size-8 items-center justify-center rounded-sm text-text-supporting outline-none focus-visible:ring-2 focus-visible:ring-focus"><ChevronsUpDown className="size-4" /></Combobox.Trigger>
    </Combobox.InputGroup>
    <Combobox.Portal><Combobox.Positioner data-slot="searchable-select-positioner" className={cn(overlayLayers.popup, "w-[var(--anchor-width)]")}><Combobox.Popup className="mt-1 max-h-72 overflow-auto rounded-md border bg-surface-floating p-1 text-text-primary shadow-[var(--ds-shadow-floating)] outline-none"><Combobox.Empty className="px-2 py-3 text-sm text-text-supporting">{emptyMessage}</Combobox.Empty><Combobox.List aria-label={optionsLabel ?? "Options"}>{(optionValue: string) => { const option = options.find((candidate) => candidate.value === optionValue); if (!option) return null; return <Combobox.Item key={option.value} value={option.value} disabled={option.disabled} className="ds-type-menu-item data-highlighted:bg-surface-muted relative flex cursor-default items-start gap-2 rounded-sm px-2 py-2 pr-8 outline-none data-disabled:pointer-events-none data-disabled:opacity-50"><span className="mt-0.5 flex size-4 shrink-0 items-center justify-center"><Combobox.ItemIndicator><Check className="size-4" /></Combobox.ItemIndicator></span><span className="min-w-0"><span className="block truncate text-sm">{option.label}</span>{option.description ? <span className="block truncate text-xs text-text-supporting">{option.description}</span> : null}</span></Combobox.Item>; }}</Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal>
  </Combobox.Root></div>;
}
export { SearchableSelect };
export type { SearchableSelectOption, SearchableSelectProps };
