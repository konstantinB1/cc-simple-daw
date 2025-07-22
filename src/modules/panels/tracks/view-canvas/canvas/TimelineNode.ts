import { themeVars } from "@/styles";
import {
    TRACK_LEGEND_CONTAINER_PX,
    LEGEND_CONTENT_LINE,
    BASE_CELL_WIDTH,
    MIN_VIEWPORT_BEATS,
    TIME_LEGEND_CELL_HEIGHT,
} from "./canvasConstants";
import type TracksCanvasRenderer from "./TracksCanvasRenderer";
import { store } from "@/store/AppStore";
import type { TrackCanvasNode } from "./NodeInterface";
import TrackCanvasStoreState from "../TrackCanvasStoreState";

export default class TimelineNode
    extends TrackCanvasStoreState
    implements TrackCanvasNode
{
    private rootRenderer: TracksCanvasRenderer;

    constructor(rootRenderer: TracksCanvasRenderer) {
        super();
        this.rootRenderer = rootRenderer;

        this.handleClick = this.handleClick.bind(this);
        this.rootRenderer.element.addEventListener("click", this.handleClick, {
            passive: true,
        });
    }

    private withTimelineFont() {
        const ctx = this.rootRenderer.ctx;

        ctx.font = "12px Montserrat, serif";
        ctx.lineWidth = 0.5;
    }

    private getTimeFromMousePosition(mouseX: number): number {
        const timelineAreaX =
            mouseX - (TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE);

        // Account for viewport offset
        const totalTimelineX =
            timelineAreaX + this.rootRenderer.viewportOffsetX;

        // Convert to beat position
        const currentBeatWidth =
            BASE_CELL_WIDTH * this.rootRenderer.zoomState.current!.level;
        const beatPosition = totalTimelineX / currentBeatWidth;

        // Convert beat position to time in milliseconds
        // Formula: time = (beat position / (BPM / 60)) * 1000
        const timeInSeconds = beatPosition / (this.bpm! / 60);
        const timeInMs = timeInSeconds * 1000;

        // Ensure we don't return negative time
        return Math.max(0, timeInMs);
    }

    private handleClick(e: MouseEvent) {
        // Only handle clicks in the timeline area (not in the legend)
        if (e.offsetX < TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE) {
            return;
        }

        // Only handle clicks in the timeline header area
        if (e.offsetY > TIME_LEGEND_CELL_HEIGHT) {
            return;
        }

        const clickedTime = this.getTimeFromMousePosition(e.offsetX);

        store.setCurrentTime(clickedTime);
    }

    draw(): void {
        const {
            ctx,
            bounds: { width: maxWidth, height: totalHeight },
            zoomState: {
                current: { level: zoomLevel },
            },
            viewportOffsetX,
            virtualTimelineBeats,
        } = this.rootRenderer;

        // Calculate how many beats fit in the scrollable viewport
        const scrollableWidth =
            maxWidth - TRACK_LEGEND_CONTAINER_PX - LEGEND_CONTENT_LINE;

        // Use custom zoom level during animation, otherwise use current state
        const beatWidth = BASE_CELL_WIDTH * zoomLevel;

        // Ensure we show at least the minimum number of beats
        const beatsToShow = Math.max(
            MIN_VIEWPORT_BEATS,
            Math.ceil(scrollableWidth / beatWidth) + 3, // +3 for partial beats and safety margin
        );

        this.withTimelineFont();

        // Always start the first beat at the legend boundary
        const startX = TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE;

        // Calculate which beat to start from based on viewport offset
        const firstBeatIndex = Math.floor(viewportOffsetX / beatWidth);
        const beatOffsetX = -(viewportOffsetX % beatWidth);

        for (let i = 0; i < beatsToShow; i++) {
            const beatStart = startX + beatOffsetX + i * beatWidth;
            const beatEnd = beatStart + beatWidth;
            const beat = firstBeatIndex + i + 1;

            // Stop if we've exceeded our virtual timeline
            if (beat > virtualTimelineBeats) {
                break;
            }

            // Skip beats that are completely before the visible area
            if (beatEnd <= startX) {
                continue;
            }

            // Only draw if beat starts within visible area or extends into it
            if (beatStart >= maxWidth) {
                break; // Stop drawing if we're past the right edge
            }

            // Calculate actual width to draw (clip at viewport edges)
            const clippedBeatStart = Math.max(beatStart, startX);
            const clippedBeatEnd = Math.min(beatEnd, maxWidth);
            const actualBeatWidth = clippedBeatEnd - clippedBeatStart;

            // Only draw if there's something visible and beat is positive
            if (actualBeatWidth > 0 && beat > 0) {
                // Draw beat background (clipped)
                ctx.fillStyle = themeVars.colorPrimary;
                ctx.fillRect(
                    clippedBeatStart,
                    0,
                    actualBeatWidth,
                    TIME_LEGEND_CELL_HEIGHT,
                );

                // Draw beat line (only if the line is within visible area)
                if (beatStart >= startX && beatStart < maxWidth) {
                    ctx.strokeStyle = themeVars.colorBorder;
                    ctx.beginPath();
                    ctx.moveTo(beatStart, 0);
                    ctx.lineTo(beatStart, totalHeight);
                    ctx.stroke();
                }

                // Draw beat number based on zoom level and beat significance
                if (actualBeatWidth > 15 && beatStart + 10 < maxWidth) {
                    let shouldShowText = false;

                    if (beatWidth >= 80) {
                        // High zoom - show all beat numbers
                        shouldShowText = true;
                    } else if (beatWidth >= 40) {
                        // Medium zoom - show all beats
                        shouldShowText = true;
                    } else if (beatWidth >= 20) {
                        // Low zoom - show every 5th beat + beat 1
                        shouldShowText = beat === 1 || beat % 5 === 0;
                    } else if (beatWidth >= 10) {
                        // Very low zoom - show every 10th beat + beat 1
                        shouldShowText = beat === 1 || beat % 10 === 0;
                    } else {
                        // Extremely low zoom - show only every 20th beat + beat 1
                        shouldShowText = beat === 1 || beat % 20 === 0;
                    }

                    if (shouldShowText) {
                        ctx.fillStyle = themeVars.colorText;
                        ctx.fillText(
                            String(beat),
                            Math.max(clippedBeatStart + 5, beatStart + 10),
                            Math.ceil(TIME_LEGEND_CELL_HEIGHT / 2) + 5,
                        );
                    }
                }
            }
        }
    }
}
