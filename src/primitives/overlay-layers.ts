/**
 * Shared stacking layers for portaled surfaces.
 *
 * Keep the layer on the element that owns portal positioning and any
 * interaction backdrop so popup surfaces escape clipping ancestors while
 * retaining a predictable visual order.
 */
const overlayLayers = {
  modal: "z-40",
  popup: "z-50",
  transient: "z-[100]",
} as const;

const overlayCloseClasses =
  "absolute right-3 top-3 inline-flex size-[var(--ds-control-height-sm)] items-center justify-center rounded-xs text-text-supporting opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-canvas disabled:pointer-events-none [&_svg]:size-4";

export { overlayCloseClasses, overlayLayers };
