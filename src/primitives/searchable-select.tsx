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
};

type SearchableSelectProps = {
  id?: string;
  value?: string;
  options: SearchableSelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  "aria-label"?: string;
};

function SearchableSelect({
  id,
  value = "",
  options,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No matching options.",
  disabled = false,
  clearable = false,
  className,
  "aria-label": ariaLabel,
}: SearchableSelectProps) {
  const generatedId = React.useId();
  const listboxId = `${id ?? generatedId}-listbox`;
  const rootRef = React.useRef<HTMLDivElement>(null);
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
  const resolvedActiveIndex = Math.min(activeIndex, Math.max(0, filteredOptions.length - 1));

  React.useEffect(() => {
    function closeWhenOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("pointerdown", closeWhenOutside);
    return () => document.removeEventListener("pointerdown", closeWhenOutside);
  }, []);

  function select(option: SearchableSelectOption) {
    onValueChange(option.value);
    setSearch("");
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => Math.min(filteredOptions.length - 1, current + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => Math.max(0, current - 1));
    } else if (event.key === "Enter" && open && filteredOptions[resolvedActiveIndex]) {
      event.preventDefault();
      select(filteredOptions[resolvedActiveIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setSearch("");
    }
  }

  return (
    <div ref={rootRef} data-slot="searchable-select" className={cn("relative min-w-0", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          id={id}
          role="combobox"
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
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
            className="absolute right-8 top-1/2 -translate-y-1/2"
            aria-label="Clear selection"
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
          aria-label={ariaLabel ? `${ariaLabel} options` : "Options"}
          className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-border-subtle bg-popover p-1 text-popover-foreground shadow-md"
        >
          {filteredOptions.length ? filteredOptions.map((option, index) => (
            <button
              key={option.value}
              id={`${listboxId}-${index}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              data-active={index === resolvedActiveIndex}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-[length:var(--ds-menu-item-size)] outline-none hover:bg-surface-muted focus-visible:bg-surface-muted data-[active=true]:bg-surface-muted"
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(option)}
            >
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="truncate font-medium">{option.label}</span>
                {option.description ? <span className="truncate text-[length:var(--ds-menu-label-size)] text-muted-foreground">{option.description}</span> : null}
              </span>
              {option.value === value ? <Check className="size-4 shrink-0 text-success-foreground" aria-hidden="true" /> : null}
            </button>
          )) : <p className="px-3 py-6 text-center text-[length:var(--ds-menu-item-size)] text-muted-foreground">{emptyMessage}</p>}
        </div>
      ) : null}
    </div>
  );
}

export { SearchableSelect };
export type { SearchableSelectOption, SearchableSelectProps };
