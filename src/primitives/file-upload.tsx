"use client";

import * as React from "react";
import { Upload } from "lucide-react";

import { cn } from "./utils";

type FileUploadProps = Omit<React.ComponentProps<"input">, "type" | "value" | "onChange" | "children"> & {
  /** The prompt, which also names the file input. */
  label?: React.ReactNode;
  /** Supporting text such as accepted types and the size limit. */
  description?: React.ReactNode;
  onFilesChange?: (files: File[]) => void;
};

/**
 * A drop zone around a native file input, so files submit with the form and
 * the keyboard and the browser's file dialog work as usual.
 */
function FileUpload({ label = "Drop files here or browse", description, onFilesChange, className, disabled, multiple, ...props }: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragging, setDragging] = React.useState(false);

  const update = (list: FileList | null) => {
    const next = Array.from(list ?? []);
    setFiles(next);
    onFilesChange?.(next);
  };

  return (
    <label
      data-slot="file-upload"
      data-dragging={dragging ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        const input = inputRef.current;
        if (disabled || !input) return;
        // shortcut: dropped files are not checked against `accept`, validate on submit or in onFilesChange.
        const transfer = new DataTransfer();
        Array.from(event.dataTransfer.files).slice(0, multiple ? undefined : 1).forEach((file) => transfer.items.add(file));
        input.files = transfer.files;
        update(transfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-1 rounded-[var(--ds-radius-surface)] border border-dashed border-control-border bg-surface-control px-4 py-6 text-center text-sm transition-colors hover:bg-surface-muted has-[:focus-visible]:border-focus has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-focus-ring data-dragging:border-focus data-dragging:bg-selection-background data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
    >
      <Upload className="size-5 text-text-supporting" aria-hidden="true" />
      <span className="font-medium text-text-primary">{label}</span>
      {description ? <span className="ds-type-metadata text-text-supporting">{description}</span> : null}
      {files.length ? (
        <span data-slot="file-upload-files" className="mt-1 max-w-full break-words text-text-primary">
          {files.map((file) => file.name).join(", ")}
        </span>
      ) : null}
      <input ref={inputRef} type="file" className="sr-only" disabled={disabled} multiple={multiple} onChange={(event) => update(event.target.files)} {...props} />
    </label>
  );
}

export { FileUpload };
export type { FileUploadProps };
