import { DEFAULT_ZOOM_LEVEL } from "./canvasConstants";

const ZOOM_ANIMATION_DURATION_MS = 200;

function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

export default class AnimationState {
    isAnimating = false;
    startTime = 0;
    startZoomLevel = DEFAULT_ZOOM_LEVEL;
    targetZoomLevel = DEFAULT_ZOOM_LEVEL;
    startViewportOffsetX = 0;
    targetViewportOffsetX = 0;
    mouseX = 0;

    start(
        startZoom: number,
        targetZoom: number,
        startOffset: number,
        targetOffset: number,
        mouseX: number,
    ) {
        this.isAnimating = true;
        this.startTime = performance.now();
        this.startZoomLevel = startZoom;
        this.targetZoomLevel = targetZoom;
        this.startViewportOffsetX = startOffset;
        this.targetViewportOffsetX = targetOffset;
        this.mouseX = mouseX;
    }

    getInterpolatedValues(currentTime: number): {
        zoomLevel: number;
        viewportOffsetX: number;
        progress: number;
    } {
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / ZOOM_ANIMATION_DURATION_MS, 1);
        const easedProgress = easeOutCubic(progress);

        const zoomLevel =
            this.startZoomLevel +
            (this.targetZoomLevel - this.startZoomLevel) * easedProgress;

        const viewportOffsetX =
            this.startViewportOffsetX +
            (this.targetViewportOffsetX - this.startViewportOffsetX) *
                easedProgress;

        return { zoomLevel, viewportOffsetX, progress };
    }

    complete() {
        this.isAnimating = false;
    }
}
