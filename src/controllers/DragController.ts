import Observer from "@/lib/Observer";

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

export default class DragController {
    private holdTimeout: NodeJS.Timeout | null = null;
    private dragOffset: [number, number] = [0, 0];
    private pos: [number, number] = [0, 0];

    private obs: Observer<DragControllerData> = new Observer();

    public isDragging: boolean = false;

    private element?: HTMLElement;

    public setElement(element: HTMLElement): void {
        this.element = element;
    }

    public handleMouseDown(event: MouseEvent): void {
        const [x, y] = this.pos;

        this.dragOffset = [event.clientX - x, event.clientY - y];

        this.holdTimeout = setTimeout(() => {
            this.isDragging = true;

            this.obs.notify("dragChange", {
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

        this.pos = [this.getX(newX), newY < 80 ? 80 : newY];

        this.obs.notify("dragChange", {
            event: DragEvent.Dragging,
            coords: this.pos,
        });
    };

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

    private handleWindowMouseUp = (_: MouseEvent) => {
        if (this.holdTimeout) {
            clearTimeout(this.holdTimeout);
            this.holdTimeout = null;
        }

        this.obs.notify("dragChange", {
            event: DragEvent.End,
            coords: this.pos,
        });

        window.removeEventListener("mousemove", this.handleWindowMouseMove);
        window.removeEventListener("mouseup", this.handleWindowMouseUp);
    };

    public onDragChange(cb: (data: DragControllerData) => void): void {
        this.obs.subscribe("dragChange", cb);
    }
}
