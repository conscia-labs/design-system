"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { X } from "lucide-react";

import { fieldGroupClasses } from "./field-control";
import { cn } from "./utils";

type TagInputProps = {
  id?: string;
  /** Submits one form value per tag under this name. */
  name?: string;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Names the remove button on each tag; the tag is appended. */
  removeLabel?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

/**
 * Free-text values entered one at a time and shown as removable tags. Enter
 * or a comma adds the typed tag. Use MultiSelect when the values come from a
 * known list.
 */
function TagInput({ id, name, value, defaultValue, onValueChange, placeholder = "Add a tag", disabled = false, removeLabel = "Remove", className, ...aria }: TagInputProps) {
  const [inner, setInner] = React.useState(defaultValue ?? []);
  const [text, setText] = React.useState("");
  const tags = value ?? inner;

  const change = (next: string[]) => {
    setInner(next);
    onValueChange?.(next);
  };
  const add = () => {
    const tag = text.trim();
    if (tag && !tags.includes(tag)) change([...tags, tag]);
    setText("");
  };

  const inputProps = {
    "data-slot": "tag-input-input",
    value: text,
    disabled,
    placeholder: tags.length ? "" : placeholder,
    className: "ds-type-control h-7 min-w-16 flex-1 bg-transparent px-1 text-text-primary outline-none placeholder:text-text-supporting disabled:cursor-not-allowed",
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value),
    onBlur: add,
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Enter on an empty input is left alone so it still submits the form.
      if (event.key === "," || (event.key === "Enter" && text.trim())) {
        event.preventDefault();
        add();
      } else if (event.key === "Backspace" && !text && tags.length) {
        change(tags.slice(0, -1));
      }
    },
    ...aria,
  };

  return (
    <div data-slot="tag-input" className={cn(fieldGroupClasses, "h-auto min-h-[var(--ds-field-control-height)] flex-wrap items-center gap-1 overflow-visible px-2 py-1", className)}>
      {tags.map((tag) => (
        <span key={tag} data-slot="tag-input-tag" className="ds-type-metadata flex max-w-full items-center gap-1 rounded-sm bg-surface-track py-0.5 pl-2 pr-0.5 text-text-primary">
          <span className="truncate">{tag}</span>
          <button
            type="button"
            disabled={disabled}
            aria-label={`${removeLabel} ${tag}`}
            onClick={() => change(tags.filter((candidate) => candidate !== tag))}
            className="inline-flex size-5 items-center justify-center rounded-sm text-text-supporting outline-none hover:bg-surface-muted hover:text-text-primary focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
          {name ? <input type="hidden" name={name} value={tag} /> : null}
        </span>
      ))}
      {/* As in Input: an explicit id is wired by hand, otherwise Field names the input. */}
      {id !== undefined ? <input id={id} {...inputProps} /> : <BaseInput {...inputProps} />}
    </div>
  );
}

export { TagInput };
export type { TagInputProps };
