export function clampXToViewport(
    pos: number,
    elWidth: number,
    padding: number = 0,
): number {
    const viewportWidth = document.documentElement.clientWidth;

    if (pos + elWidth > viewportWidth - padding) {
        return viewportWidth - elWidth - padding;
    }

    if (pos < padding) {
        return padding;
    }

    return pos;
}

export function clampYToViewport(
    containerRect: DOMRect,
    pos: number,
    elHeight: number,
    padding = 0,
): number {
    const viewportHeight = document.documentElement.clientHeight;
    const containerBottom = containerRect.top + containerRect.height;

    // Clamp to container bounds first
    if (pos < containerRect.top + padding) {
        return containerRect.top + padding;
    }

    if (pos + elHeight >= containerBottom - padding) {
        return containerBottom - elHeight;
    }

    // Then clamp to viewport bounds
    if (pos < padding) {
        return padding;
    }

    if (pos + elHeight > viewportHeight - padding) {
        return viewportHeight - elHeight - padding;
    }

    return pos;
}

export function getElementOveflowContainerDiff(
    container: HTMLElement,
    element: HTMLElement,
): [number, number] {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    if (!containerRect || !elementRect) {
        throw new Error(
            "Container or element does not have a valid bounding rectangle",
        );
    }

    const isOverflowing =
        elementRect.left < containerRect.left ||
        elementRect.right > containerRect.right ||
        elementRect.top < containerRect.top ||
        elementRect.bottom > containerRect.bottom;

    return isOverflowing
        ? [
              elementRect.left - containerRect.left,
              elementRect.top - containerRect.top,
          ]
        : [0, 0];
}
