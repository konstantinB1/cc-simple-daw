export default class PanelPosition {
    private panelElement: HTMLElement;
    private containerElement: HTMLElement;

    constructor(panelElement: HTMLElement, containerElement: HTMLElement) {
        this.panelElement = panelElement;
        this.containerElement = containerElement;
    }

    async computePosition(
        startX: number,
        startY: number,
    ): Promise<[number, number]> {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                const panelRect = this.panelElement.getBoundingClientRect();
                const containerWidth = this.containerElement.clientWidth;
                const containerHeight = this.containerElement.clientHeight;
                const panelWidth =
                    this.panelElement.offsetWidth || panelRect.width;
                const panelHeight = panelRect.height;

                let adjustedX = startX;
                let adjustedY = startY;

                // Calculate maximum positions where panel can be placed without overflow
                const maxX = containerWidth - panelWidth;
                const maxY = containerHeight - panelHeight;

                // Clamp X position to valid range
                adjustedX = Math.max(0, Math.min(startX, maxX));

                // Clamp Y position to valid range (prevents bottom viewport overflow)
                adjustedY = Math.max(0, Math.min(startY, maxY));

                if (adjustedY < 0) {
                    adjustedY = 0;
                }

                resolve([adjustedX, adjustedY]);
            });
        });
    }
}
