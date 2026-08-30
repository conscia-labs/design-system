"use client";
import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

type SheetSide = "top" | "right" | "bottom" | "left";

const swipeDirectionBySide: Record<SheetSide, React.ComponentProps<typeof Drawer.Root>["swipeDirection"]> = {
  top: "up",
  right: "right",
  bottom: "down",
  left: "left",
};

type SheetProps = React.ComponentProps<typeof Drawer.Root> & {
  /** Sets the panel position and the corresponding swipe-to-dismiss direction. */
  side?: SheetSide;
};

const SheetSideContext = React.createContext<SheetSide>("right");

function Sheet({ side = "right", swipeDirection, ...props }: SheetProps) {
  return <SheetSideContext.Provider value={side}><Drawer.Root data-slot="sheet" swipeDirection={swipeDirection ?? swipeDirectionBySide[side]} {...props} /></SheetSideContext.Provider>;
}
function SheetTrigger({ ...props }: React.ComponentProps<typeof Drawer.Trigger>) { return <Drawer.Trigger data-slot="sheet-trigger" {...props} />; }
function SheetPortal({ ...props }: React.ComponentProps<typeof Drawer.Portal>) { return <Drawer.Portal data-slot="sheet-portal" {...props} />; }
function SheetClose({ ...props }: React.ComponentProps<typeof Drawer.Close>) { return <Drawer.Close data-slot="sheet-close" {...props} />; }
const sideClasses: Record<SheetSide, string> = { top: "inset-x-0 top-0 max-h-[90vh] border-b", right: "right-0 top-0 h-full max-w-md border-l sm:max-w-lg", bottom: "inset-x-0 bottom-0 max-h-[90vh] border-t", left: "left-0 top-0 h-full max-w-md border-r sm:max-w-lg" };
function SheetOverlay({ className, ...props }: React.ComponentProps<typeof Drawer.Backdrop>) { return <Drawer.Backdrop data-slot="sheet-overlay" className={cn("fixed inset-0 z-50 bg-black/50 data-open:animate-in data-closed:animate-out", className)} {...props} />; }
function SheetContent({ className, children, side: sideProp, closeLabel = "Close", ...props }: React.ComponentProps<typeof Drawer.Popup> & { side?: SheetSide; closeLabel?: string }) {
  const contextSide = React.useContext(SheetSideContext);
  const side = sideProp ?? contextSide;
  return <SheetPortal><SheetOverlay /><Drawer.Viewport className="fixed inset-0 z-50 pointer-events-none"><Drawer.Popup data-slot="sheet-content" className={cn("pointer-events-auto absolute flex w-full flex-col gap-6 bg-canvas p-6 text-text-primary shadow-lg outline-none data-open:animate-in data-closed:animate-out", sideClasses[side], className)} {...props}>{children}<Drawer.Close data-slot="sheet-close" className="absolute right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-canvas [&_svg]:size-4"><XIcon /><span className="sr-only">{closeLabel}</span></Drawer.Close></Drawer.Popup></Drawer.Viewport></SheetPortal>;
}
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="sheet-header" className={cn("grid gap-2 pr-8", className)} {...props} />; }
function SheetTitle({ className, ...props }: React.ComponentProps<typeof Drawer.Title>) { return <Drawer.Title data-slot="sheet-title" className={cn("text-lg font-semibold leading-tight", className)} {...props} />; }
function SheetDescription({ className, ...props }: React.ComponentProps<typeof Drawer.Description>) { return <Drawer.Description data-slot="sheet-description" className={cn("text-sm text-text-supporting", className)} {...props} />; }
function SheetBody({ className, ...props }: React.ComponentProps<typeof Drawer.Content>) { return <Drawer.Content data-slot="sheet-body" className={cn("flex min-h-0 flex-1 flex-col gap-[var(--ds-space-group)] overflow-y-auto pr-1", className)} {...props} />; }
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-4", className)} {...props} />; }
export { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger };
