"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
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
  "aria-label"?: string;
};

function SearchableSelect({
  id,
  name,
  value = "",
  options,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No matching options.",
  disabled = false,
  clearable = false,
  clearLabel = "Clear selection",
  optionsLabel,
  className,
  "aria-label": ariaLabel,
}: SearchableSelectProps) {
  const generatedId = React.useId();
  const listboxId = `${id ?? generatedId}-listbox`;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const activeOptionRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const selected = options.find((option) => option.value === value);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOptions = normalizedSearch
    ? options.filter((option) =>
        [option.label, option.description, ...(option.keywords ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch),
      )
    : options;
  const enabledIndexes = filteredOptions.reduce<number[]>((indexes, option, index) => {
    if (!option.disabled) {
      indexes.push(index);
    }

    return indexes;
  }, []);
  const resolvedActiveIndex = enabledIndexes.includes(activeIndex)
    ? activeIndex
    : (enabledIndexes[0] ?? -1);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    function closeWhenOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("pointerdown", closeWhenOutside);
    return () => document.removeEventListener("pointerdown", closeWhenOutside);
  }, [open]);

  React.useEffect(() => {
    if (open) {
      activeOptionRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [open, resolvedActiveIndex]);

  function select(option: SearchableSelectOption) {
    if (option.disabled) {
      return;
    }

    onValueChange(option.value);
    setSearch("");
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        const position = enabledIndexes.indexOf(current);
        return enabledIndexes[Math.min(enabledIndexes.length - 1, position + 1)] ?? -1;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        const position = enabledIndexes.indexOf(current);
        return enabledIndexes[Math.max(0, position === -1 ? 0 : position - 1)] ?? -1;
      });
    } else if (event.key === "Home") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(enabledIndexes[0] ?? -1);
    } else if (event.key === "End") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(enabledIndexes.at(-1) ?? -1);
    } else if (event.key === "Enter" && open && filteredOptions[resolvedActiveIndex]) {
      event.preventDefault();
      select(filteredOptions[resolvedActiveIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setSearch("");
    } else if (event.key === "Tab") {
      setOpen(false);
      setSearch("");
    }
  }

  return (
    <div ref={rootRef} data-slot="searchable-select" className={cn("relative min-w-0", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          id={id}
          role="combobox"
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={open && filteredOptions[resolvedActiveIndex] ? `${listboxId}-${resolvedActiveIndex}` : undefined}
          autoComplete="off"
          className="px-9"
          disabled={disabled}
          placeholder={open ? searchPlaceholder : placeholder}
          value={open ? search : selected?.label ?? ""}
          onFocus={(event) => {
            setOpen(true);
            setSearch("");
            event.currentTarget.select();
          }}
          onClick={() => {
            if (!open) {
              setOpen(true);
              setSearch("");
            }
          }}
          onChange={(event) => {
            setSearch(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
        />
        {clearable && value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="absolute right-8 top-1/2 -translate-y-1/2"
            aria-label={clearLabel}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onValueChange("");
              setSearch("");
            }}
          >
            <X />
          </Button>
        ) : null}
        <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      </div>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={optionsLabel ?? (ariaLabel ? `${ariaLabel} options` : "Options")}
          className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-border-subtle bg-popover p-1 text-popover-foreground shadow-md"
        >
          {filteredOptions.length ? filteredOptions.map((option, index) => (
            <button
              key={option.value}
              id={`${listboxId}-${index}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              disabled={option.disabled}
              tabIndex={-1}
              ref={index === resolvedActiveIndex ? activeOptionRef : undefined}
              data-active={index === resolvedActiveIndex}
              className="ds-type-menu-item flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left outline-none hover:bg-surface-muted focus-visible:bg-surface-muted data-[active=true]:bg-surface-muted disabled:pointer-events-none disabled:opacity-50"
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(option)}
            >
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="truncate font-medium">{option.label}</span>
                {option.description ? <span className="ds-type-menu-label truncate text-muted-foreground">{option.description}</span> : null}
              </span>
              {option.value === value ? <Check className="size-4 shrink-0 text-success-foreground" aria-hidden="true" /> : null}
            </button>
          )) : <p className="ds-type-menu-item px-3 py-6 text-center text-muted-foreground">{emptyMessage}</p>}
        </div>
      ) : null}
    </div>
  );
}

export { SearchableSelect };
export type { SearchableSelectOption, SearchableSelectProps };
