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
  "absolute right-3 top-3 inline-flex size-[var(--ds-control-height-sm)] items-center justify-center rounded-xs text-text-supporting opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 focus:ring-offset-canvas disabled:pointer-events-none [&_svg]:size-4";

/** Backdrop, viewport and popup shared by Dialog and AlertDialog. */
const modalBackdropClasses = `fixed inset-0 ${overlayLayers.modal} bg-scrim`;
const modalViewportClasses = `fixed inset-0 flex items-center justify-center p-4 ${overlayLayers.modal}`;
const modalPopupClasses =
  "relative grid max-h-[min(42rem,calc(100dvh-2rem))] w-full max-w-[calc(100%-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-5 overflow-hidden rounded-lg border bg-canvas p-5 text-text-primary shadow-[var(--ds-shadow-overlay)] outline-none sm:p-6";

export { modalBackdropClasses, modalPopupClasses, modalViewportClasses, overlayCloseClasses, overlayLayers };
