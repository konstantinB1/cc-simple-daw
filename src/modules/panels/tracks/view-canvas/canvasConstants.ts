export const LEGEND_CONTENT_LINE = 0.5;

export const BASE_CELL_WIDTH = 100;
export const MIN_VIRTUAL_TIMELINE_BEATS = 40; // Minimum beats in virtual timeline
export const MIN_VIEWPORT_BEATS = 10; // Minimum beats to show in viewport

export let lastZoomTime = 0;
export const ZOOM_THROTTLE_MS = 16; // Minimal throttle for 60fps
export const SCROLL_SENSITIVITY = 0.3; // Reduced scroll sensitivity
export const ZOOM_SCROLL_SENSITIVITY = 0.3; // Reduced zoom sensitivity

// Minimal physics constants for drag scrolling
export const DRAG_SENSITIVITY = 1.0; // Simple 1:1 drag response
export const FRICTION = 0.85; // Higher friction for quicker stop
export const MIN_VELOCITY = 0.5; // Higher minimum to stop sooner
export const MAX_VELOCITY = 20; // Lower maximum velocity

export const MIN_ZOOM_LEVEL = 0.25;
export const MAX_ZOOM_LEVEL = 5;
export const DEFAULT_ZOOM_LEVEL = 0.75;

export const TRACK_LINE_BASE_HEIGHT_PX = 35;
export const TRACK_LEGEND_CONTAINER_PX = 170;
export const TIME_LEGEND_CELL_HEIGHT = 30;

function createZoomLevels(
    min: number,
    max: number,
    step: number,
    defaultZoomLevel: number = DEFAULT_ZOOM_LEVEL,
): number[] {
    const levels = [];
    for (let i = min; i <= max; i += step) {
        if (i === defaultZoomLevel) {
            levels.unshift(parseFloat(i.toFixed(2))); // Ensure 2 decimal precision
            continue; // Skip adding it again later
        }

        levels.push(parseFloat(i.toFixed(2))); // Ensure 2 decimal precision
    }
    return levels;
}

export const zooms = createZoomLevels(
    MIN_ZOOM_LEVEL,
    MAX_ZOOM_LEVEL,
    0.1,
    DEFAULT_ZOOM_LEVEL,
);

export enum ZoomAction {
    In,
    Out,
}
