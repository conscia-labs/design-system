/**
 * The frame every text-entry control shares, so Input, SearchableSelect,
 * DateTimeField, InputGroup and NumberField cannot drift apart.
 */
const fieldFrameClasses =
  "flex h-[var(--ds-field-control-height)] w-full min-w-0 rounded-[var(--ds-field-control-radius)] border border-control-border bg-surface-control transition-colors";

/** A standalone text control: the frame plus its own focus and invalid states. */
const fieldControlClasses = `${fieldFrameClasses} ds-type-control px-[var(--ds-field-control-padding-x)] py-2 shadow-none outline-none selection:bg-action selection:text-action-foreground placeholder:text-text-supporting disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus-ring aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40`;

/** A frame around a bare input and its addons; states come from the input inside. */
const fieldGroupClasses = `${fieldFrameClasses} items-stretch overflow-hidden focus-within:border-focus focus-within:ring-[3px] focus-within:ring-focus-ring has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50 has-[input[aria-invalid=true]]:border-danger has-[input[aria-invalid=true]]:ring-danger/20 dark:has-[input[aria-invalid=true]]:ring-danger/40`;

/** The borderless input that sits inside a field group. */
const fieldGroupInputClasses =
  "ds-type-control min-w-0 flex-1 bg-transparent px-[var(--ds-field-control-padding-x)] text-text-primary outline-none placeholder:text-text-supporting disabled:cursor-not-allowed";

export { fieldControlClasses, fieldGroupClasses, fieldGroupInputClasses };
