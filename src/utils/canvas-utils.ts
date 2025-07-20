// Onclick handler for canvas elements, that limits the click area to the x,y
export function createClickArea(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    element: HTMLCanvasElement,
    callback: (event: MouseEvent) => void,
): () => (event: MouseEvent) => void {
    const listener = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (x >= startX && x <= endX && y >= startY && y <= endY) {
            callback(event);
        }
    };

    document.addEventListener("click", listener);

    return () => {
        return () => {
            document.removeEventListener("click", listener);
        };
    };
}
