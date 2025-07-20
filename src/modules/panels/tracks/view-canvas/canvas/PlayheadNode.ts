import { themeVars } from "@/styles";
import {
    BASE_CELL_WIDTH,
    LEGEND_CONTENT_LINE,
    TRACK_LEGEND_CONTAINER_PX,
} from "./canvasConstants";
import TrackCanvasStoreState from "../TrackCanvasStoreState";
import type { RootRenderer, TrackCanvasNode } from "./NodeInterface";
import type TracksCanvasRenderer from "./TracksCanvasRenderer";

export default class PlayheadNode
    extends TrackCanvasStoreState
    implements TrackCanvasNode
{
    private rootRenderer!: TracksCanvasRenderer;
    private lastIndicatorBounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null = null;

    protected onCurrentTimeChange(newTime: number): void {
        super.onCurrentTimeChange(newTime);
        this.rootRenderer?.render();
    }

    protected onBpmChange(newBpm: number): void {
        super.onBpmChange(newBpm);
        this.rootRenderer?.render();
    }

    constructor(rootRenderer: RootRenderer) {
        super();
        this.rootRenderer = rootRenderer;
        this.setupClickHandler();
    }

    private setupClickHandler(): void {
        this.rootRenderer.element.addEventListener("click", (e) => {
            if (this.lastIndicatorBounds && this.isClickOnIndicator(e)) {
                this.centerViewportOnPlayhead();
            }
        });
    }

    private isClickOnIndicator(e: MouseEvent): boolean {
        if (!this.lastIndicatorBounds) return false;

        const rect = this.rootRenderer.element.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const bounds = this.lastIndicatorBounds;
        return (
            clickX >= bounds.x &&
            clickX <= bounds.x + bounds.width &&
            clickY >= bounds.y &&
            clickY <= bounds.y + bounds.height
        );
    }

    private centerViewportOnPlayhead(): void {
        const bpm = this.bpm;
        const currentTime = this.currentTime;

        if (!bpm || currentTime < 0) return;

        const currentBeatWidth =
            BASE_CELL_WIDTH * this.rootRenderer.zoomState.current.level;
        const timeInSeconds = currentTime / 1000;
        const beatPosition = timeInSeconds * (bpm / 60);
        const timelineX = beatPosition * currentBeatWidth;

        // Calculate viewport center position
        const scrollableWidth =
            this.rootRenderer.bounds.width -
            TRACK_LEGEND_CONTAINER_PX -
            LEGEND_CONTENT_LINE;
        const centerOffset = timelineX - scrollableWidth / 2;

        // Update viewport offset to center on playhead
        const maxScrollX = Math.max(
            0,
            currentBeatWidth * this.rootRenderer.virtualTimelineBeats -
                scrollableWidth,
        );

        this.rootRenderer.viewportOffsetX = Math.max(
            0,
            Math.min(maxScrollX, centerOffset),
        );
        this.rootRenderer.render();
    }

    draw(): void {
        const bpm = this.bpm;
        const currentTime = this.currentTime;
        const ctx = this.rootRenderer.ctx;
        const currentBeatWidth =
            BASE_CELL_WIDTH * this.rootRenderer.zoomState.current.level;

        if (!bpm && currentTime !== 0) {
            throw new Error("BPM is not set");
        }

        // Handle negative time values gracefully
        if (currentTime < 0) {
            this.drawPlayheadIndicator("left", Math.abs(currentTime));
            return;
        }

        // Convert time to beat position using BPM
        // Formula: beats = (time in seconds) * (BPM / 60)
        const timeInSeconds = currentTime / 1000;
        const beatPosition = timeInSeconds * (bpm / 60);
        const timelineX = beatPosition * currentBeatWidth;

        // Calculate the actual screen X position accounting for viewport offset
        const playheadX =
            TRACK_LEGEND_CONTAINER_PX +
            LEGEND_CONTENT_LINE +
            timelineX -
            this.rootRenderer.viewportOffsetX;

        // Only draw if playhead is within the visible area
        const minX = TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE;

        if (playheadX < minX) {
            this.drawPlayheadIndicator("left", currentTime);
            return;
        }

        if (playheadX > this.rootRenderer.bounds.width) {
            this.drawPlayheadIndicator("right", currentTime);
            return;
        }

        // Draw playhead line
        ctx.strokeStyle = themeVars.colorTintPrimary;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, this.rootRenderer.bounds.height);
        ctx.stroke();
    }

    private drawPlayheadIndicator(
        direction: "left" | "right",
        time: number,
    ): void {
        const ctx = this.rootRenderer.ctx;
        const bounds = this.rootRenderer.bounds;

        // Indicator dimensions
        const indicatorWidth = 60;
        const indicatorHeight = 24;
        const margin = 10;

        // Position based on direction
        const x =
            direction === "left"
                ? TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE + margin
                : bounds.width - indicatorWidth - margin;
        const y = margin;

        // Store bounds for click detection
        this.lastIndicatorBounds = {
            x,
            y,
            width: indicatorWidth,
            height: indicatorHeight,
        };

        // Draw background with hover effect
        ctx.fillStyle = themeVars.colorTintPrimary;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(x, y, indicatorWidth, indicatorHeight);

        // Draw border
        ctx.strokeStyle = themeVars.colorText;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.strokeRect(x, y, indicatorWidth, indicatorHeight);

        // Draw arrow and text
        ctx.fillStyle = themeVars.colorText;
        ctx.font = "10px Montserrat, serif";
        ctx.textAlign = "center";

        const centerX = x + indicatorWidth / 2;
        const centerY = y + indicatorHeight / 2;

        // Format time for display
        const timeInSeconds = Math.abs(time) / 1000;
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = (timeInSeconds % 60).toFixed(1);
        const timeText = `${minutes}:${seconds.padStart(4, "0")}`;

        // Draw arrow
        const arrowSymbol = direction === "left" ? "◀" : "▶";
        ctx.fillText(arrowSymbol, centerX, centerY - 2);

        // Draw time
        ctx.font = "8px Montserrat, serif";
        ctx.fillText(timeText, centerX, centerY + 8);

        ctx.textAlign = "start"; // Reset text alignment

        // Add cursor pointer hint
        this.rootRenderer.element.style.cursor = "pointer";
    }
}
