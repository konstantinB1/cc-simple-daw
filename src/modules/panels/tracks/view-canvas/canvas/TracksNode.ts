import { themeVars } from "@/styles";
import {
    TIME_LEGEND_CELL_HEIGHT,
    TRACK_LEGEND_CONTAINER_PX,
    LEGEND_CONTENT_LINE,
    TRACK_LINE_BASE_HEIGHT_PX,
    TRACK_LEGEND_TITLE_X_PADDING_PX,
    TRACK_LEGEND_TITLE_Y_PADDING_PX,
    BASE_CELL_WIDTH,
} from "./canvasConstants";
import type AudioSource from "@/lib/AudioSource";
import TrackCanvasStoreState from "../TrackCanvasStoreState";
import type TracksCanvasRenderer from "./TracksCanvasRenderer";
import type { RootRenderer } from "./NodeInterface";

export default class TracksNode extends TrackCanvasStoreState {
    private rootRenderer: TracksCanvasRenderer;

    constructor(rootRenderer: RootRenderer) {
        super();
        this.rootRenderer = rootRenderer;
    }

    private drawScrollIndicator(
        maxHeight: number,
        currentBottomYOffset: number,
        tracks: AudioSource[],
    ) {
        const ctx = this.rootRenderer.ctx;

        // Calculate total track content height vs available space
        const availableTrackHeight = maxHeight - TIME_LEGEND_CELL_HEIGHT;
        const totalTrackContentHeight =
            tracks.length * TRACK_LINE_BASE_HEIGHT_PX;

        // Only draw if there are tracks that can be scrolled
        if (
            tracks.length === 0 ||
            totalTrackContentHeight <= availableTrackHeight
        ) {
            return;
        }

        const indicatorX = TRACK_LEGEND_CONTAINER_PX - 8; // 8px from right edge of legend
        const indicatorWidth = 4;
        const indicatorTopY = TIME_LEGEND_CELL_HEIGHT + 4; // Start a bit below timeline
        const availableHeight = availableTrackHeight - 8; // Leave some padding

        // Calculate scroll progress (0 to 1) based on track content only
        const maxScroll = Math.max(
            0,
            totalTrackContentHeight - availableTrackHeight,
        );
        const scrollProgress =
            maxScroll > 0 ? currentBottomYOffset / maxScroll : 0;

        // Calculate indicator height based on visible content ratio
        const visibleRatio = Math.min(
            1,
            availableTrackHeight / totalTrackContentHeight,
        );
        const indicatorHeight = Math.max(20, availableHeight * visibleRatio); // Minimum 20px height

        // Calculate indicator position
        const maxIndicatorTravel = availableHeight - indicatorHeight;
        const indicatorY = indicatorTopY + scrollProgress * maxIndicatorTravel;

        // Draw scrollbar track (background)
        ctx.fillStyle = themeVars.colorBorder;
        ctx.fillRect(
            indicatorX,
            indicatorTopY,
            indicatorWidth,
            availableHeight,
        );

        // Draw scrollbar thumb (indicator)
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillRect(indicatorX, indicatorY, indicatorWidth, indicatorHeight);

        // Add subtle border to thumb
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(indicatorX, indicatorY, indicatorWidth, indicatorHeight);
    }

    private drawTrack(index: number, maxWidth: number, yPosition?: number) {
        const ctx = this.rootRenderer.ctx;

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = themeVars.cardColor;

        ctx.beginPath();

        // If no yPosition provided, calculate it starting below the timeline
        const y =
            yPosition ??
            TIME_LEGEND_CELL_HEIGHT + (index + 1) * TRACK_LINE_BASE_HEIGHT_PX;

        // Track lines should extend from the legend boundary to the canvas width
        ctx.moveTo(TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE, y);
        ctx.lineTo(maxWidth, y);
        ctx.stroke();
    }

    draw() {
        const {
            ctx,
            bounds: { height: maxHeight },
            currentBottomYOffset,
            tracks,
        } = this.rootRenderer;

        // Clear the legend area first
        ctx.fillStyle = themeVars.cardColor;
        ctx.fillRect(
            0,
            TIME_LEGEND_CELL_HEIGHT,
            TRACK_LEGEND_CONTAINER_PX,
            maxHeight - TIME_LEGEND_CELL_HEIGHT,
        );

        ctx.fillStyle = themeVars.colorBorder;
        ctx.fillRect(
            TRACK_LEGEND_CONTAINER_PX,
            TIME_LEGEND_CELL_HEIGHT,
            LEGEND_CONTENT_LINE,
            maxHeight - TIME_LEGEND_CELL_HEIGHT,
        );

        this.drawScrollIndicator(maxHeight, currentBottomYOffset, tracks);

        // Calculate which tracks are visible
        const availableHeight = maxHeight - TIME_LEGEND_CELL_HEIGHT;
        const firstVisibleTrack = Math.floor(
            currentBottomYOffset / TRACK_LINE_BASE_HEIGHT_PX,
        );

        // Calculate exactly how many tracks can fit in the available space
        // Account for the timeline header offset by reducing available space
        const effectiveHeight = availableHeight - TRACK_LINE_BASE_HEIGHT_PX; // Reserve space for timeline offset
        const tracksPerViewport = Math.floor(
            effectiveHeight / TRACK_LINE_BASE_HEIGHT_PX,
        );

        // Calculate the last visible track index - ensure we include the last track
        const lastPossibleTrack = Math.min(
            firstVisibleTrack + tracksPerViewport, // Remove the -1 here
            tracks.length - 1,
        );

        // Render tracks from first to last visible (inclusive)
        for (
            let trackIndex = firstVisibleTrack;
            trackIndex <= lastPossibleTrack;
            trackIndex++
        ) {
            if (trackIndex >= tracks.length) break;

            const track = tracks[trackIndex];
            const trackName = track?.name ?? "Unknown track";

            // Calculate the relative position within the viewport
            const relativePosition = trackIndex - firstVisibleTrack;
            const trackY =
                TIME_LEGEND_CELL_HEIGHT +
                TRACK_LINE_BASE_HEIGHT_PX + // Offset for timeline header
                relativePosition * TRACK_LINE_BASE_HEIGHT_PX -
                (currentBottomYOffset % TRACK_LINE_BASE_HEIGHT_PX);

            // More generous bounds checking to ensure we catch the last track
            if (
                trackY >= TIME_LEGEND_CELL_HEIGHT - 10 &&
                trackY < maxHeight + 10
            ) {
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = themeVars.colorBorder;
                ctx.lineCap = "square";
                ctx.font = "12px Montserrat, serif";

                // Draw track separator line across full viewport width
                ctx.beginPath();
                ctx.moveTo(0, trackY);
                ctx.lineTo(this.rootRenderer.bounds.width, trackY);
                ctx.stroke();

                ctx.fillStyle = themeVars.colorText;
                ctx.fillText(
                    trackName,
                    TRACK_LEGEND_TITLE_X_PADDING_PX,
                    trackY - TRACK_LEGEND_TITLE_Y_PADDING_PX,
                    TRACK_LEGEND_CONTAINER_PX,
                );

                this.drawTrack(trackIndex, trackY);
                this.drawTrackEvents(track, trackY);
            }
        }
    }

    private drawTrackEvents(track: AudioSource, trackY: number) {
        const {
            ctx,
            zoomState: {
                current: { level: zoomLevel },
            },
            bounds: { width: maxWidth },
            viewportOffsetX,
            events,
        } = this.rootRenderer;
        const currentBeatWidth = BASE_CELL_WIDTH * zoomLevel;

        // Filter events for this track
        const trackEvents = events.filter(
            (event) => event.trackId === track.id,
        );

        for (const event of trackEvents) {
            // Convert event times to beat positions using BPM
            const startTimeInSeconds = event.startTime / 1000;
            const startBeatPosition = startTimeInSeconds * (this.bpm! / 60);
            const startX = startBeatPosition * currentBeatWidth;

            let endX: number;
            let isPlaying = false;

            if (event.data.isPlaying && event.endTime === 0) {
                // Event is currently playing - sync with playhead
                isPlaying = true;
                const currentTimeInSeconds = this.currentTime / 1000;
                const currentBeatPosition =
                    currentTimeInSeconds * (this.bpm! / 60);
                endX = currentBeatPosition * currentBeatWidth;
            } else if (event.endTime > 0) {
                // Event has ended
                const endTimeInSeconds = event.endTime / 1000;
                const endBeatPosition = endTimeInSeconds * (this.bpm! / 60);
                endX = endBeatPosition * currentBeatWidth;
            } else {
                // Event hasn't started or has no end time
                continue;
            }

            // Calculate screen positions accounting for viewport offset
            const screenStartX =
                TRACK_LEGEND_CONTAINER_PX +
                LEGEND_CONTENT_LINE +
                startX -
                viewportOffsetX;
            const screenEndX =
                TRACK_LEGEND_CONTAINER_PX +
                LEGEND_CONTENT_LINE +
                endX -
                viewportOffsetX;

            // Only draw if the event is visible in the viewport
            const minX = TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE;

            if (screenEndX < minX || screenStartX > maxWidth) {
                continue; // Event is outside visible area
            }

            // Clamp to visible area
            const clippedStartX = Math.max(screenStartX, minX);
            const clippedEndX = Math.min(screenEndX, maxWidth);
            const eventWidth = clippedEndX - clippedStartX;

            if (eventWidth <= 0) {
                continue;
            }

            // Draw event block
            const eventHeight = TRACK_LINE_BASE_HEIGHT_PX - 10; // Leave some padding
            const eventTopY = trackY - TRACK_LINE_BASE_HEIGHT_PX + 5; // Position within track row

            // Set colors based on playing state
            if (isPlaying) {
                ctx.fillStyle = themeVars.colorSuccess;
                ctx.globalAlpha = 0.8;
            } else {
                ctx.fillStyle = themeVars.colorTintPrimary;
                ctx.globalAlpha = 0.6;
            }

            // Draw the event block
            ctx.fillRect(clippedStartX, eventTopY, eventWidth, eventHeight);

            // Add a subtle border
            ctx.strokeStyle = isPlaying
                ? themeVars.colorText
                : themeVars.colorBorder;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.strokeRect(clippedStartX, eventTopY, eventWidth, eventHeight);

            // Draw event name if there's enough space
            if (eventWidth > 50) {
                ctx.fillStyle = themeVars.colorText;
                ctx.font = "10px Montserrat, serif";
                const textY = eventTopY + eventHeight / 2 + 3;
                const textX = clippedStartX + 5;

                // Clip text to event width
                ctx.save();
                ctx.beginPath();
                ctx.rect(clippedStartX, eventTopY, eventWidth, eventHeight);
                ctx.clip();

                ctx.fillText(event.data.id || "Event", textX, textY);
                ctx.restore();
            }
        }
    }
}
