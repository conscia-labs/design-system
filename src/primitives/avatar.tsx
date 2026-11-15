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

type AvatarStatus = "online" | "away" | "busy" | "offline";

type AvatarProps = React.ComponentProps<"div"> & {
  size?: "sm" | "default" | "lg";
  /** Presence dot on the lower right corner. */
  status?: AvatarStatus;
  /** Announced for the status dot, for example "Online". Without it the dot is decorative. */
  statusLabel?: string;
};

const avatarStatusClasses: Record<AvatarStatus, string> = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-danger",
  offline: "bg-neutral",
};

function Avatar({
  children,
  className,
  size = "default",
  status: presence,
  statusLabel,
  ...props
}: AvatarProps) {
  const [status, setStatus] = React.useState<AvatarImageStatus>("idle");

  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      <div data-slot="avatar" data-size={size} className={cn("relative flex size-8 shrink-0 rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6", className)} {...props}>
        {children}
        {presence ? (
          <span
            data-slot="avatar-status"
            data-status={presence}
            aria-hidden={statusLabel ? undefined : true}
            className={cn("absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-canvas", avatarStatusClasses[presence])}
          >
            {statusLabel ? <span className="sr-only">{statusLabel}</span> : null}
          </span>
        ) : null}
      </div>
    </AvatarContext.Provider>
  );
}

type AvatarImageProps = Omit<React.ComponentProps<"img">, "alt"> & {
  alt: string;
};

function AvatarImage({
  alt,
  className,
  onError,
  onLoad,
  ref,
  src,
  ...props
}: AvatarImageProps) {
  const { status, setStatus } = useAvatarContext();
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  useAvatarEffect(() => {
    const image = imageRef.current;
    // An image that loaded before hydration never fires onLoad.
    const alreadyLoaded = Boolean(src && image?.complete && image.naturalWidth > 0);
    setStatus(alreadyLoaded ? "loaded" : src ? "loading" : "error");
  }, [src, setStatus]);

  return (
    // The library must use a framework-neutral image element rather than Next's Image component.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="avatar-image"
      ref={(node) => {
        imageRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn("aspect-square size-full rounded-full object-cover", status === "loaded" ? "" : "hidden", className)}
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

  return <div data-slot="avatar-fallback" className={cn("flex size-full items-center justify-center rounded-full bg-surface-muted text-xs font-medium text-text-supporting", status === "loaded" ? "hidden" : "", className)} {...props} />;
}

export { Avatar, AvatarFallback, AvatarImage };
export type { AvatarImageProps, AvatarProps, AvatarStatus };
