import {
    SCROLL_SENSITIVITY,
    TIME_LEGEND_CELL_HEIGHT,
    TRACK_LINE_BASE_HEIGHT_PX,
} from "./canvasConstants";

export default class Movement {
    static getNextOffset(
        elHeight: number,
        deltaY: number,
        currentBottomOffset: number,
        tracksLen: number,
    ): number {
        const scaledDeltaY = deltaY * SCROLL_SENSITIVITY;
        const current = currentBottomOffset + scaledDeltaY;

        const availableTrackHeight = elHeight - TIME_LEGEND_CELL_HEIGHT;
        const effectiveHeight =
            availableTrackHeight - TRACK_LINE_BASE_HEIGHT_PX;
        const tracksPerViewport = Math.floor(
            effectiveHeight / TRACK_LINE_BASE_HEIGHT_PX,
        );
        const maxScroll = Math.max(
            0,
            (tracksLen - tracksPerViewport) * TRACK_LINE_BASE_HEIGHT_PX,
        );

        let nextBottomYOffset = current;

        // Only proceed if there's something to scroll
        if (maxScroll > 0) {
            if (current >= maxScroll) {
                nextBottomYOffset = maxScroll;
            } else if (current <= 0) {
                nextBottomYOffset = 0;
            } else {
                nextBottomYOffset = current;
            }
        }

        return nextBottomYOffset;
    }
}
