const HOLD_TIMEOUT_MS = 100;

export enum DragEvent {
    Start,
    End,
    Dragging,
}

export type DragControllerData = {
    event: DragEvent;
    coords: [number, number];
};

const Y_BOTTOM_PADDING = 40; // 10px padding + 30px for the bottom bar

export default class DragController extends EventTarget {
    private holdTimeout: NodeJS.Timeout | null = null;
    private dragOffset: [number, number] = [0, 0];
    private pos: [number, number] = [0, 0];

    public isDragging: boolean = false;

    private element?: HTMLElement;

    constructor(startPos: [number, number] = [0, 0]) {
        super();
        this.setStartPos(startPos);
        this.handleWindowMouseMove = this.handleWindowMouseMove.bind(this);
        this.handleWindowMouseUp = this.handleWindowMouseUp.bind(this);
    }

    public setElement(element: HTMLElement): void {
        this.element = element;
    }

    public setStartPos(pos: [number, number]): void {
        this.pos = pos;
    }

    public handleMouseDown(event: MouseEvent): void {
        if (
            !(event.target as HTMLElement).classList.contains("card-draggable")
        ) {
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
        if (!this.isDragging) {
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

    private get height(): number {
        return this.element?.getBoundingClientRect().height || 0;
    }

    private getY(pos: number): number {
        const viewportHeight = document.documentElement.clientHeight;

        if (pos < 80) {
            return 80;
        }

        if (pos + this.height > viewportHeight - Y_BOTTOM_PADDING) {
            return viewportHeight - this.height - Y_BOTTOM_PADDING; // 10px padding
        }
        return pos;
    }

    private getX(pos: number): number {
        const width = this.element?.getBoundingClientRect().width!;
        const viewportWidth = document.documentElement.clientWidth;

        if (pos + width > viewportWidth) {
            return viewportWidth - width - 10; // 10px padding
        }

        if (pos < 0) {
            return 0;
        }

        return pos;
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
