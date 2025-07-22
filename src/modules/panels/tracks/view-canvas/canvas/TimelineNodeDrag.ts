import {
    TRACK_LEGEND_CONTAINER_PX,
    LEGEND_CONTENT_LINE,
    TIME_LEGEND_CELL_HEIGHT,
    BASE_CELL_WIDTH,
    TRACK_LINE_BASE_HEIGHT_PX,
} from "./canvasConstants";
import DragState from "./DragState";
import type TracksCanvasRenderer from "./TracksCanvasRenderer";

export default class TimelineNodeDragSystem {
    readonly dragState = new DragState();

    private animationFrameId: number | null = null;
    private momentumAnimationId: number | null = null;

    private isShiftKeyPressed = false;
    private isSelecting = false;
    private selectionStart: { x: number; y: number } | null = null;
    private selectionEnd: { x: number; y: number } | null = null;

    selectCoords: [number, number] = [-1, -1];

    constructor(
        private element: HTMLElement,
        private rootRenderer: TracksCanvasRenderer,
    ) {
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.startEvents();
    }

    private startEvents() {
        this.element.addEventListener("mousedown", this.handleMouseDown);
        this.element.addEventListener("mousemove", this.handleMouseMove);
        this.element.addEventListener("mouseup", this.handleMouseUp);
        this.element.addEventListener("mouseleave", this.handleMouseLeave);
        this.element.addEventListener("keydown", this.handleKeyDown);
        this.element.addEventListener("keyup", this.handleKeyUp);
    }

    removeEvents() {
        this.element.removeEventListener("mousedown", this.handleMouseDown);
        this.element.removeEventListener("mousemove", this.handleMouseMove);
        this.element.removeEventListener("mouseup", this.handleMouseUp);
        this.element.removeEventListener("mouseleave", this.handleMouseLeave);
    }

    private handleKeyDown(e: KeyboardEvent) {
        this.isShiftKeyPressed = e.shiftKey;
    }

    private handleKeyUp(e: KeyboardEvent) {
        this.isShiftKeyPressed = e.shiftKey;
    }

    private startSelection(e: MouseEvent) {
        const rect = this.element.getBoundingClientRect();
        this.selectionStart = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        this.selectionEnd = { ...this.selectionStart };
        this.isSelecting = true;
        this.element.style.cursor = "crosshair";
    }

    private updateSelection(e: MouseEvent) {
        if (!this.isSelecting || !this.selectionStart) return;

        const rect = this.element.getBoundingClientRect();
        this.selectionEnd = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        // Trigger re-render to show selection rectangle
        this.rootRenderer.render();
    }

    private endSelection() {
        if (!this.isSelecting) return;

        this.isSelecting = false;
        this.element.style.cursor = "default";

        if (this.selectionStart && this.selectionEnd) {
            // Calculate selection bounds in timeline coordinates
            const startCoords = this.screenToTimelineCoords(
                this.selectionStart,
            );
            const endCoords = this.screenToTimelineCoords(this.selectionEnd);

            const selectionBounds = {
                left: Math.min(startCoords.x, endCoords.x),
                right: Math.max(startCoords.x, endCoords.x),
                top: Math.min(startCoords.y, endCoords.y),
                bottom: Math.max(startCoords.y, endCoords.y),
            };

            console.log("Selection bounds:", selectionBounds);
            // TODO: Find and select events within these bounds
        }

        this.selectionStart = null;
        this.selectionEnd = null;
        this.rootRenderer.render();
    }

    private screenToTimelineCoords(screenCoords: { x: number; y: number }) {
        const timelineAreaStartX =
            TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE;
        const relativeMouseX = screenCoords.x - timelineAreaStartX;
        const currentBeatWidth =
            BASE_CELL_WIDTH * this.rootRenderer.zoomState.current.level;

        const timelineX =
            (relativeMouseX + this.rootRenderer.viewportOffsetX) /
            currentBeatWidth;

        const timelineAreaStartY = TIME_LEGEND_CELL_HEIGHT;
        const relativeMouseY = screenCoords.y - timelineAreaStartY;
        const trackIndex = Math.floor(
            (relativeMouseY + this.rootRenderer.currentBottomYOffset) /
                TRACK_LINE_BASE_HEIGHT_PX,
        );

        return {
            x: Math.max(0, timelineX),
            y: Math.max(0, trackIndex),
        };
    }

    public getClickedCoords(e: MouseEvent): { x: number; y: number } {
        const rect = this.element.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        return this.screenToTimelineCoords({ x: mouseX, y: mouseY });
    }

    private handleMouseUp() {
        if (this.isSelecting) {
            this.endSelection();
            return;
        }

        if (this.dragState.isDragging) {
            this.dragState.end();
            this.element.style.cursor = "grab";

            // Start momentum animation if there's velocity
            if (this.dragState.hasActiveMomentum) {
                this.startMomentumAnimation();
            }
        }
    }

    private handleMouseDown(e: MouseEvent) {
        const animationState = this.rootRenderer.animationState;

        if (
            e.offsetX < TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE ||
            e.offsetY < TIME_LEGEND_CELL_HEIGHT
        ) {
            return;
        }

        if (!this.isShiftKeyPressed) {
            // Start selection mode
            this.startSelection(e);
        } else {
            // Existing drag behavior
            if (animationState.isAnimating) {
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                }
                animationState.complete();
            }

            if (this.momentumAnimationId) {
                cancelAnimationFrame(this.momentumAnimationId);
                this.momentumAnimationId = null;
            }

            const rect = this.element.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;

            this.dragState.start(mouseX, this.rootRenderer.viewportOffsetX);
            this.element.style.cursor = "grabbing";
        }
    }

    private handleMouseMove(e: MouseEvent) {
        if (this.isSelecting) {
            this.updateSelection(e);
            return;
        }

        if (!this.dragState.isDragging) {
            // Update cursor based on position and mode
            if (e.offsetX >= TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE) {
                this.element.style.cursor = this.isShiftKeyPressed
                    ? "grab"
                    : "default";
            } else {
                this.element.style.cursor = "default";
            }
            return;
        }

        const rect = this.element.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        const deltaX = this.dragState.update(mouseX);

        this.rootRenderer.updateViewportOffset(deltaX);
    }

    private handleMouseLeave() {
        if (this.isSelecting) {
            this.endSelection();
            return;
        }

        if (this.dragState.isDragging) {
            this.dragState.end();
            this.element.style.cursor = "default";

            // Start momentum animation if there's velocity
            if (this.dragState.hasActiveMomentum) {
                this.startMomentumAnimation();
            }
        }
    }

    private startMomentumAnimation() {
        // Simplified momentum with minimal physics
        if (this.momentumAnimationId) {
            cancelAnimationFrame(this.momentumAnimationId);
        }

        const animate = () => {
            const deltaX = this.dragState.updateMomentum();

            if (Math.abs(deltaX) > 0) {
                // Higher threshold to stop sooner
                this.rootRenderer.updateViewportOffset(deltaX);
                this.momentumAnimationId = requestAnimationFrame(animate);
            } else {
                this.momentumAnimationId = null;
            }
        };

        this.momentumAnimationId = requestAnimationFrame(animate);
    }

    public drawSelection(ctx: CanvasRenderingContext2D) {
        if (!this.isSelecting || !this.selectionStart || !this.selectionEnd)
            return;

        const left = Math.min(this.selectionStart.x, this.selectionEnd.x);
        const top = Math.min(this.selectionStart.y, this.selectionEnd.y);
        const width = Math.abs(this.selectionEnd.x - this.selectionStart.x);
        const height = Math.abs(this.selectionEnd.y - this.selectionStart.y);

        // Draw selection rectangle
        ctx.strokeStyle = "rgba(0, 123, 255, 0.8)";
        ctx.fillStyle = "rgba(0, 123, 255, 0.1)";
        ctx.lineWidth = 1;

        ctx.fillRect(left, top, width, height);
        ctx.strokeRect(left, top, width, height);
    }
}
