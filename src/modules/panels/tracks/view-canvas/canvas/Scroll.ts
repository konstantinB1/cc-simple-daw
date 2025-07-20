import {
    BASE_CELL_WIDTH,
    LEGEND_CONTENT_LINE,
    TRACK_LEGEND_CONTAINER_PX,
    ZOOM_SCROLL_SENSITIVITY,
    ZoomAction,
} from "./canvasConstants";
import Movement from "./Movement";
import type TracksCanvasRenderer from "./TracksCanvasRenderer";

export default class CanvasScroll {
    private rootRenderer: TracksCanvasRenderer;
    private lastZoomTime = 0;
    private throttleMs = 20; // Throttle zoom events to every 100ms

    constructor(rootRenderer: TracksCanvasRenderer) {
        this.rootRenderer = rootRenderer;

        this.handleWheel = this.handleWheel.bind(this);

        rootRenderer.element.addEventListener("wheel", this.handleWheel, {
            passive: false,
        });
    }

    private handleWheel(e: WheelEvent) {
        e.preventDefault();
        e.stopPropagation();

        const root = this.rootRenderer;
        const element = root.element;

        const rect = element.getBoundingClientRect();

        // Y Scroll
        if (!e.ctrlKey) {
            root.currentBottomYOffset = Movement.getNextOffset(
                rect.height,
                e.deltaY,
                root.currentBottomYOffset,
                root.tracks.length,
            );

            root.render();
        } else {
            const now = Date.now();
            const scaledDeltaY = e.deltaY * ZOOM_SCROLL_SENSITIVITY;

            if (now - this.lastZoomTime < this.throttleMs) {
                return;
            }

            this.lastZoomTime = now;

            const zoomType: ZoomAction =
                scaledDeltaY > 0 ? ZoomAction.Out : ZoomAction.In;

            if (e.offsetX < TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE) {
                return;
            }

            const mouseOffsetInScrollableArea =
                e.offsetX - TRACK_LEGEND_CONTAINER_PX - LEGEND_CONTENT_LINE;

            root.zoomState.x = mouseOffsetInScrollableArea;

            // Cancel any ongoing animations for immediate response
            if (root.animationState.isAnimating) {
                if (root.animationFrameId) {
                    cancelAnimationFrame(root.animationFrameId);
                    root.animationFrameId = null;
                }
                root.animationState.complete();
            }

            const currentZoomLevel = root.zoomState.current!.level;
            const currentViewportOffsetX = root.viewportOffsetX;

            zoomType === ZoomAction.Out
                ? root.zoomState.prev()
                : root.zoomState.next();

            const targetZoomLevel = root.zoomState.current!.level;

            // If zoom level didn't change (at min/max), don't animate
            if (currentZoomLevel === targetZoomLevel) {
                return;
            }

            // Simple zoom calculation - no complex animations
            const currentBeatWidth = BASE_CELL_WIDTH * currentZoomLevel;
            const targetBeatWidth = BASE_CELL_WIDTH * targetZoomLevel;

            // Calculate new viewport offset to keep mouse position stable
            const timelinePositionUnderMouse =
                currentViewportOffsetX + mouseOffsetInScrollableArea;

            const scaleFactor = targetBeatWidth / currentBeatWidth;
            const newTimelinePositionUnderMouse =
                timelinePositionUnderMouse * scaleFactor;

            let targetViewportOffsetX = Math.max(
                0,
                newTimelinePositionUnderMouse - mouseOffsetInScrollableArea,
            );

            // Clamp viewport offset
            const scrollableWidth =
                root.bounds.width -
                TRACK_LEGEND_CONTAINER_PX -
                LEGEND_CONTENT_LINE;
            const totalVirtualWidth =
                targetBeatWidth * root.virtualTimelineBeats;
            const maxScrollX = Math.max(0, totalVirtualWidth - scrollableWidth);
            targetViewportOffsetX = Math.min(targetViewportOffsetX, maxScrollX);

            // Apply immediately for natural feel
            root.viewportOffsetX = targetViewportOffsetX;

            // Simple render without complex animation
            root.render();
        }
    }

    detach() {
        this.rootRenderer.element.removeEventListener(
            "wheel",
            this.handleWheel,
        );
    }
}
