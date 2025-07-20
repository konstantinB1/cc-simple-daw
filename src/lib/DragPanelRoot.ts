import type { Panel, PanelElement } from "./PanelScreenManager";

export type PanelDragParams = {
    element: PanelElement;
    pos: [number, number];
    prevPos: [number, number];
    isDragging: boolean;
    currentDragDirection?:
        | "left"
        | "right"
        | "top"
        | "bottom"
        | "left-top"
        | "left-bottom"
        | "right-top"
        | "right-bottom";
};

export default class DragPanelRoot {
    private panels: WeakMap<Panel, PanelDragParams> = new WeakMap();

    container: HTMLElement | null = null;

    setPanelState(
        panelId: Panel,
        pos: [number, number],
        isDragging: boolean = false,
    ): void {
        const panel = this.panels.get(panelId);

        if (panel) {
            panel.prevPos = panel.pos; // Update prevPos BEFORE setting new pos
            panel.pos = pos;
            panel.isDragging = isDragging;

            this.drawAlignementLines(panel);
        } else {
            console.warn(`Panel with ID ${panelId} not found.`);
        }
    }

    addPanel(panel: Panel, element: PanelElement): void {
        this.panels.set(panel, {
            element,
            pos: [0, 0],
            prevPos: [0, 0],
            isDragging: false,
        });
    }

    private drawAlignementLines(panel: PanelDragParams) {
        const [x, y] = panel.pos;
        const [prevX, prevY] = panel.prevPos;

        const deltaX = x - prevX;
        const deltaY = y - prevY;

        let dragDirection:
            | "left"
            | "right"
            | "top"
            | "bottom"
            | "left-top"
            | "left-bottom"
            | "right-top"
            | "right-bottom"
            | undefined;

        // Check if there's any movement
        if (deltaX !== 0 || deltaY !== 0) {
            const horizontalDirection =
                deltaX < 0 ? "left" : deltaX > 0 ? "right" : null;
            const verticalDirection =
                deltaY < 0 ? "top" : deltaY > 0 ? "bottom" : null;

            // Combine directions if both axes have movement
            if (horizontalDirection && verticalDirection) {
                dragDirection =
                    `${horizontalDirection}-${verticalDirection}` as any;
            } else if (horizontalDirection) {
                dragDirection = horizontalDirection;
            } else if (verticalDirection) {
                dragDirection = verticalDirection;
            }
        }

        panel.currentDragDirection = dragDirection;
    }
}
