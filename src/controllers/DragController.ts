import { clampXToViewport, clampYToViewport } from "@/utils/geometry";

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

const Y_BOTTOM_PADDING = 5;
const X_PADDING = 5;

export function getAxisBoundaries(
    containerRect: DOMRect,
    pos: number,
    axis: "x" | "y",
): number {
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = containerRect.height;

    if (axis === "x") {
        if (pos < X_PADDING) {
            return X_PADDING;
        }
        if (pos + X_PADDING > viewportWidth) {
            return viewportWidth - X_PADDING;
        }
    } else if (axis === "y") {
        const top = containerRect.top;
        if (pos < top) {
            return top + Y_BOTTOM_PADDING;
        }
        if (pos + Y_BOTTOM_PADDING > viewportHeight) {
            return viewportHeight - Y_BOTTOM_PADDING - top;
        }
    }

    return pos;
}

export default class DragController extends EventTarget {
    private holdTimeout: NodeJS.Timeout | null = null;
    private dragOffset: [number, number] = [0, 0];
    private pos: [number, number] = [0, 0];

    public isDragging: boolean = false;

    private element?: HTMLElement;
    private readonly containerRect: DOMRect;

    enabled: boolean = true;

    private pendingMeasure = true;
    private startPos: [number, number] = [0, 0];

    private dragBoundary?: (e: MouseEvent) => boolean;

    constructor(
        startPos: [number, number] = [0, 0],
        containerRect: DOMRect,
        dragBoundary?: (e: MouseEvent) => boolean,
    ) {
        super();
        this.containerRect = containerRect;

        this.dragBoundary = dragBoundary;
        this.setStartPos(startPos);
        this.handleWindowMouseMove = this.handleWindowMouseMove.bind(this);
        this.handleWindowMouseUp = this.handleWindowMouseUp.bind(this);
    }

    private get elRect(): DOMRect | undefined {
        return this.element?.getBoundingClientRect();
    }

    public setElement(element: HTMLElement): void {
        this.element = element;

        requestAnimationFrame(() => {
            if (this.pendingMeasure) {
                this.pendingMeasure = false;
                const [startX, startY] = this.startPos;

                this.pos = [this.getX(startX), this.getY(startY)];
            }
        });
    }

    public setStartPos([x, y]: [number, number]): void {
        if (!this.element) {
            this.pendingMeasure = true;
            this.startPos = [this.getX(x), this.getY(y)];

            this.dispatchEvent(
                new CustomEvent("start-pos-change", {
                    detail: this.startPos,
                    bubbles: true,
                    composed: true,
                }),
            );
        } else {
            this.pos = [this.getX(x), this.getY(y)];
        }
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

    private handleWindowMouseMove = (event: MouseEvent) => {
        if (!this.isDragging || !this.enabled) {
            return;
        }

        const [offsetX, offsetY] = this.dragOffset;
        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;

        this.pos = [this.getX(newX), this.getY(newY)];

        this.triggerDragEvent({
            event: DragEvent.Dragging,
            coords: this.pos,
        });
    };

    private getY(pos: number): number {
        return clampYToViewport(
            this.containerRect,
            pos,
            this.elRect?.height ?? 0,
            Y_BOTTOM_PADDING,
        );
    }

    private getX(pos: number): number {
        return clampXToViewport(pos, this.elRect?.width ?? 0, X_PADDING);
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
