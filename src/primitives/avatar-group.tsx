import * as React from "react";

import { cn } from "./utils";

type AvatarGroupProps = React.ComponentProps<"div"> & {
  max?: number;
  size?: "sm" | "default" | "lg";
  total?: number;
};

function AvatarGroup({
  children,
  className,
  max,
  size = "default",
  total,
  ...props
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children);
  const visibleCount = max === undefined ? avatars.length : Math.max(0, Math.floor(max));
  const visibleAvatars = avatars.slice(0, visibleCount);
  const totalCount = Math.max(avatars.length, total ?? avatars.length);
  const overflowCount = Math.max(0, totalCount - visibleAvatars.length);

  return (
    <div
      data-slot="avatar-group"
      data-size={size}
      className={cn(
        "flex items-center [&>[data-slot=avatar]]:relative [&>[data-slot=avatar]]:z-0 [&>[data-slot=avatar]]:shrink-0 [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-background [&>[data-slot=avatar]]:transition-[margin,z-index] hover:[&>[data-slot=avatar]]:z-10 data-[size=default]:gap-0 data-[size=default]:[&>[data-slot=avatar]]:-ml-2 data-[size=default]:[&>[data-slot=avatar]]:size-8 data-[size=lg]:gap-0 data-[size=lg]:[&>[data-slot=avatar]]:-ml-2.5 data-[size=lg]:[&>[data-slot=avatar]]:size-10 data-[size=sm]:gap-0 data-[size=sm]:[&>[data-slot=avatar]]:-ml-1.5 data-[size=sm]:[&>[data-slot=avatar]]:size-6 [&>[data-slot=avatar]:first-child]:ml-0",
        className,
      )}
      role="group"
      {...props}
    >
      {visibleAvatars}
      {overflowCount > 0 ? (
        <span
          data-slot="avatar-group-overflow"
          className="relative z-0 inline-flex shrink-0 items-center justify-center rounded-full border-2 border-background bg-surface-muted font-medium text-muted-foreground data-[size=default]:-ml-2 data-[size=default]:size-8 data-[size=default]:text-xs data-[size=lg]:-ml-2.5 data-[size=lg]:size-10 data-[size=lg]:text-sm data-[size=sm]:-ml-1.5 data-[size=sm]:size-6 data-[size=sm]:text-[0.625rem]"
          aria-label={`${overflowCount} more ${overflowCount === 1 ? "avatar" : "avatars"}`}
          title={`${overflowCount} more ${overflowCount === 1 ? "avatar" : "avatars"}`}
        >
          +{overflowCount}
        </span>
      ) : null}
    </div>
  );
}

export { AvatarGroup };
export type { AvatarGroupProps };
