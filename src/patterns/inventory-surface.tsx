import * as React from "react";

import { Card } from "../primitives/card";
import { cn } from "../primitives/utils";

function InventorySurface({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="inventory-surface"
      className={cn("gap-0 overflow-hidden py-0", className)}
      {...props}
    />
  );
}

function InventoryDesktop({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="inventory-desktop" className={cn("hidden lg:block", className)} {...props} />;
}

function InventoryMobile({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="inventory-mobile" className={cn("divide-y divide-border-subtle lg:hidden", className)} {...props} />;
}

export { InventoryDesktop, InventoryMobile, InventorySurface };
