"use client";

import * as React from "react";

import { cn } from "./utils";

const useAvatarEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

type AvatarImageStatus = "idle" | "loading" | "loaded" | "error";

type AvatarContextValue = {
  status: AvatarImageStatus;
  setStatus: React.Dispatch<React.SetStateAction<AvatarImageStatus>>;
};

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

function useAvatarContext() {
  const context = React.useContext(AvatarContext);
  if (!context) {
    throw new Error("AvatarImage and AvatarFallback must be used inside Avatar.");
  }
  return context;
}

function Avatar({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [status, setStatus] = React.useState<AvatarImageStatus>("idle");

  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      <div data-slot="avatar" className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)} {...props}>
        {children}
      </div>
    </AvatarContext.Provider>
  );
}

function AvatarImage({
  alt = "",
  className,
  onError,
  onLoad,
  src,
  ...props
}: React.ComponentProps<"img">) {
  const { status, setStatus } = useAvatarContext();

  useAvatarEffect(() => {
    setStatus(src ? "loading" : "error");
  }, [src, setStatus]);

  return (
    // The library must use a framework-neutral image element rather than Next's Image component.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="avatar-image"
      className={cn("aspect-square size-full", status === "loaded" ? "" : "hidden", className)}
      alt={alt}
      src={src}
      {...props}
      onLoad={(event) => {
        setStatus("loaded");
        onLoad?.(event);
      }}
      onError={(event) => {
        setStatus("error");
        onError?.(event);
      }}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { status } = useAvatarContext();

  return <div data-slot="avatar-fallback" className={cn("flex size-full items-center justify-center rounded-full bg-surface-muted text-xs font-medium text-muted-foreground", status === "loaded" ? "hidden" : "", className)} {...props} />;
}

export { Avatar, AvatarFallback, AvatarImage };
