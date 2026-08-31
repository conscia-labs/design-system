"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "./utils";

type FormSelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type FormSelectProps = {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  /**
   * Whether the popup blocks interaction outside the select while open.
   * Leave unset to preserve Base UI Select's modal default. Use `false` when
   * the select is nested inside a Dialog or Sheet.
   */
  modal?: boolean;
  placeholder?: string;
  options: FormSelectOption[];
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  onValueChange?: (value: string) => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  "aria-label"?: string;
};

const emptyValue = "__conscia_empty_select_value__";

function toSelectValue(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return value === "" ? emptyValue : value;
}

function fromSelectValue(value: string) {
  return value === emptyValue ? "" : value;
}

function FormSelect({
  name,
  id,
  value,
  defaultValue,
  required,
  disabled,
  modal,
  placeholder,
  options,
  className,
  triggerClassName,
  contentClassName,
  onValueChange,
  onClick,
  "aria-label": ariaLabel,
}: FormSelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const currentValue = value ?? internalValue;

  function handleValueChange(nextValue: string) {
    const actualValue = fromSelectValue(nextValue);

    if (value === undefined) {
      setInternalValue(actualValue);
    }

    onValueChange?.(actualValue);
  }

  return (
    <div className={cn("min-w-0", className)} onClick={onClick}>
      <Select
        name={name}
        value={toSelectValue(currentValue)}
        required={required}
        disabled={disabled}
        modal={modal}
        onValueChange={handleValueChange}
      >
        <SelectTrigger id={id} aria-label={ariaLabel} className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={toSelectValue(option.value) ?? emptyValue}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

const ConsciaFormSelect = FormSelect;

export { ConsciaFormSelect, FormSelect };
export type { FormSelectOption, FormSelectProps };
