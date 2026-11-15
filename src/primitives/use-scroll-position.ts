import * as React from "react";

type ScrollPosition = "none" | "start" | "middle" | "end";

/**
 * Where a horizontally scrolling element sits: "none" when it does not
 * overflow. Table and the tab rails use it to fade their scrolled edges.
 */
function useScrollPosition<T extends HTMLElement>(ref: React.RefObject<T | null>, enabled = true) {
  const [scrollPosition, setScrollPosition] = React.useState<ScrollPosition>("none");

  const updateScrollPosition = React.useCallback(() => {
    const element = ref.current;
    if (!element || !enabled) {
      setScrollPosition("none");
      return;
    }

    const maximumScroll = element.scrollWidth - element.clientWidth;
    const nextPosition: ScrollPosition =
      maximumScroll <= 1
        ? "none"
        : element.scrollLeft <= 1
          ? "start"
          : element.scrollLeft >= maximumScroll - 1
            ? "end"
            : "middle";

    setScrollPosition((current) => (current === nextPosition ? current : nextPosition));
  }, [enabled, ref]);

  React.useEffect(() => {
    const element = ref.current;

    updateScrollPosition();
    if (!element || !enabled) return;

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateScrollPosition);
    resizeObserver?.observe(element);
    // The content can grow without the scroller resizing, as a table does inside its container.
    if (element.firstElementChild) resizeObserver?.observe(element.firstElementChild);

    const mutationObserver = typeof MutationObserver === "undefined" ? null : new MutationObserver(updateScrollPosition);
    mutationObserver?.observe(element, { characterData: true, childList: true, subtree: true });

    element.addEventListener("scroll", updateScrollPosition, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      element.removeEventListener("scroll", updateScrollPosition);
    };
  }, [enabled, ref, updateScrollPosition]);

  return [scrollPosition, updateScrollPosition] as const;
}

export { useScrollPosition };
export type { ScrollPosition };
