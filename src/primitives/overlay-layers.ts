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

export { overlayLayers };
