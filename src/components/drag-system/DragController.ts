import type PanelPosition from "@/modules/view/PanelPosition";

const HOLD_TIMEOUT_MS = 15;

export enum DragEvent {
    Start,
    End,
    Dragging,
}

export type DragControllerData = {
    event: DragEvent;
    coords: [number, number];
};

export default class DragController extends EventTarget {
    private holdTimeout: NodeJS.Timeout | null = null;
    private dragOffset: [number, number] = [0, 0];
    private pos: [number, number] = [0, 0];

    public isDragging: boolean = false;

    private position: PanelPosition;

    enabled: boolean = true;

    private dragBoundary?: (e: MouseEvent) => boolean;

    constructor(
        position: PanelPosition,
        dragBoundary?: (e: MouseEvent) => boolean,
        startPos: [number, number] = [0, 0],
    ) {
        super();

        this.position = position;
        this.dragBoundary = dragBoundary;
        this.handleWindowMouseMove = this.handleWindowMouseMove.bind(this);
        this.handleWindowMouseUp = this.handleWindowMouseUp.bind(this);

        this.setStartPos(startPos);
    }

    public async setStartPos([x, y]: [number, number]): Promise<void> {
        this.pos = await this.position.computePosition(x, y);
    }

    public handleMouseDown(event: MouseEvent): void {
        if (!this.dragBoundary?.(event) || !this.enabled) {
            return;
        }

        const [x, y] = this.pos;

        this.dragOffset = [event.clientX - x, event.clientY - y];

        this.holdTimeout = setTimeout(() => {
            this.isDragging = true;

            this.triggerDragEvent({
                event: DragEvent.Start,
                coords: this.pos,
            });

            window.addEventListener("mousemove", this.handleWindowMouseMove);
        }, HOLD_TIMEOUT_MS);

        window.addEventListener("mouseup", this.handleWindowMouseUp);
    }

    private async handleWindowMouseMove(event: MouseEvent) {
        if (!this.isDragging || !this.enabled) {
            return;
        }

        const [offsetX, offsetY] = this.dragOffset;
        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;

        this.pos = await this.position.computePosition(newX, newY);

        this.triggerDragEvent({
            event: DragEvent.Dragging,
            coords: this.pos,
        });
    }

    private triggerDragEvent(event: DragControllerData): void {
        const customEvent = new CustomEvent<DragControllerData>("drag-change", {
            detail: event,
            bubbles: true,
            composed: true,
        });

        this.dispatchEvent(customEvent);
    }

    private handleWindowMouseUp = (_: MouseEvent) => {
        if (!this.isDragging || !this.enabled) {
            return;
        }

        if (this.holdTimeout) {
            clearTimeout(this.holdTimeout);
            this.holdTimeout = null;
        }

        this.triggerDragEvent({
            event: DragEvent.End,
            coords: this.pos,
        });

        window.removeEventListener("mousemove", this.handleWindowMouseMove);
        window.removeEventListener("mouseup", this.handleWindowMouseUp);
    };

    public onDragChange(cb: (data: DragControllerData) => void): void {
        this.addEventListener("drag-change", (event: Event) => {
            cb((event as CustomEvent<DragControllerData>).detail);
        });
    }
}
