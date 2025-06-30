import { cssVars } from "@/global-styles";
import lookupGen from "@gen/track-canvas-lookup.json" assert { type: "json" };
import {
    ZOOM_THROTTLE_MS,
    ZOOM_SCROLL_SENSITIVITY,
    ZoomAction,
    LEGEND_CONTENT_LINE,
    BASE_CELL_WIDTH,
    MIN_VIRTUAL_TIMELINE_BEATS,
    MIN_VIEWPORT_BEATS,
} from "./canvasConstants";
import DragState from "./DragState";
import AnimationState from "./AnimationState";
import ZoomState from "./ZoomState";
import { themeVars } from "@/styles";
import Movement from "./Movement";
import type { PlayEvent, StopEvent } from "@/lib/AudioSource";
import type Track from "@/lib/AudioTrack";

let lastZoomTime = 0;

const {
    TIME_LEGEND_CELL_HEIGHT,
    TRACK_LEGEND_CONTAINER_PX,
    TRACK_LEGEND_TITLE_X_PADDING_PX,
    TRACK_LEGEND_TITLE_Y_PADDING_PX,
    TRACK_LINE_BASE_HEIGHT_PX,
} = lookupGen.constants;

class TrackEvent {
    startTime: number = 0;
    endTime: number = -1;
    track?: Track;

    get isPlaying(): boolean {
        return this.startTime !== 0 && this.endTime === -1;
    }
}

class TracksEventManager extends EventTarget {
    private tracks: Set<Track> = new Set<Track>();

    currentTime: number = 0;

    constructor() {
        super();

        this.onPlay = this.onPlay.bind(this);
        this.onStop = this.onStop.bind(this);
    }

    addTracks(tracks: Track[]) {
        for (const track of tracks) {
            if (!this.tracks.has(track)) {
                this.tracks.add(track);

                track.channel.addEventListener(
                    "audio-channel/play",
                    this.onPlay,
                );

                track.channel.addEventListener(
                    "audio-channel/stop",
                    this.onStop,
                );
            }
        }
    }

    private onStop(e: Event) {
        const stopEvent = (e as CustomEvent<StopEvent>).detail;
        console.log("Track stopped:", stopEvent.id);
    }

    private onPlay(e: Event) {
        const playEvent = (e as CustomEvent<PlayEvent>).detail;
        console.log("Track played:", playEvent.id);
    }
}

export default class TracksCanvasRenderer {
    ctx: CanvasRenderingContext2D;
    element: HTMLCanvasElement;

    private currentBottomYOffset = 0;

    set bounds(rect: DOMRect) {
        this._bounds = rect;
        this.clampVerticalScroll(); // Recalculate scroll limits when bounds change
    }

    get bounds(): DOMRect {
        return this._bounds;
    }

    private _bounds: DOMRect;

    private zoomState = new ZoomState();

    private throttleMs: number;

    private viewportOffsetX: number = 0;

    private container: HTMLDivElement | null = null;

    private animationState = new AnimationState();
    private animationFrameId: number | null = null;
    private dragState = new DragState();
    private momentumAnimationId: number | null = null;

    private resizeObserver: ResizeObserver | null = null;

    private eventManager: TracksEventManager = new TracksEventManager();

    currentTime: number = 0;

    setCurrentTime(time: number) {
        this.currentTime = time;
        this.eventManager.currentTime = time;

        this.render();
    }

    constructor(
        element: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        container: HTMLDivElement | null = null,
        throttleMs: number = ZOOM_THROTTLE_MS,
    ) {
        this.throttleMs = throttleMs;
        this.ctx = ctx;
        this.element = element;
        this.container = container;

        this.handleWheel = this.handleWheel.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        this._bounds = element.getBoundingClientRect();

        this.startEvents();
        this.setupResizeObserver();
    }

    private tracks: Track[] = [];

    setTracks(tracks: Track[]) {
        this.tracks = tracks;
        this.eventManager.addTracks(tracks);
    }

    private setupResizeObserver() {
        if (typeof ResizeObserver !== "undefined") {
            this.resizeObserver = new ResizeObserver((entries) => {
                for (const _ of entries) {
                    requestAnimationFrame(() => {
                        this.forceRefresh();
                    });
                }
            });

            // Observe both canvas and container
            this.resizeObserver.observe(this.element);
            if (this.container) {
                this.resizeObserver.observe(this.container);
            }
        }
    }

    private startEvents() {
        // Add passive: false to ensure preventDefault works
        this.element.addEventListener("wheel", this.handleWheel, {
            passive: false,
        });
        this.element.addEventListener("mousedown", this.handleMouseDown);
        this.element.addEventListener("mousemove", this.handleMouseMove);
        this.element.addEventListener("mouseup", this.handleMouseUp);
        this.element.addEventListener("mouseleave", this.handleMouseLeave);

        // Also add wheel event to container if available for fullscreen support
        if (this.container) {
            this.container.addEventListener("wheel", this.handleWheel, {
                passive: false,
            });
        }
    }

    private removeEvents() {
        this.element.removeEventListener("wheel", this.handleWheel);
        this.element.removeEventListener("mousedown", this.handleMouseDown);
        this.element.removeEventListener("mousemove", this.handleMouseMove);
        this.element.removeEventListener("mouseup", this.handleMouseUp);
        this.element.removeEventListener("mouseleave", this.handleMouseLeave);

        if (this.container) {
            this.container.removeEventListener("wheel", this.handleWheel);
        }
    }

    private reset() {
        // Use container bounds if available, otherwise use canvas bounds
        if (this.container) {
            this._bounds = this.container.getBoundingClientRect();
        } else {
            this._bounds = this.element.getBoundingClientRect();
        }

        const canvas = this.element;
        const rect = this._bounds;

        const width = rect.width;
        const height = rect.height;

        // Only update canvas size if it actually changed
        if (this.element.width !== width || this.element.height !== height) {
            this.element.width = width;
            this.element.height = height;

            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;

            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            this.ctx.scale(devicePixelRatio, devicePixelRatio);
        }

        this.ctx.fillStyle = cssVars.tintPrimary;
        this.ctx.clearRect(0, 0, width, height);

        // Clamp vertical scroll after bounds change
        this.clampVerticalScroll();
    }

    private get totalHeight() {
        // Only count actual track heights, not the timeline header space
        return (
            this.tracks.length * TRACK_LINE_BASE_HEIGHT_PX +
            TIME_LEGEND_CELL_HEIGHT
        );
    }

    private clampVerticalScroll() {
        const elHeight = this._bounds.height;
        const availableTrackHeight = elHeight - TIME_LEGEND_CELL_HEIGHT;

        // Account for timeline header offset in viewport calculation
        const effectiveHeight =
            availableTrackHeight - TRACK_LINE_BASE_HEIGHT_PX;
        const tracksPerViewport = Math.floor(
            effectiveHeight / TRACK_LINE_BASE_HEIGHT_PX,
        );

        // Maximum scroll should allow seeing all tracks
        const maxScroll = Math.max(
            0,
            (this.tracks.length - tracksPerViewport) *
                TRACK_LINE_BASE_HEIGHT_PX,
        );

        // Clamp current scroll position to valid range
        this.currentBottomYOffset = Math.max(
            0,
            Math.min(this.currentBottomYOffset, maxScroll),
        );
    }

    private handleWheel(e: WheelEvent) {
        e.preventDefault();
        e.stopPropagation();

        const rect = this.element.getBoundingClientRect();

        // Y Scroll
        if (!e.ctrlKey) {
            this.currentBottomYOffset = Movement.getNextOffset(
                rect.height,
                e.deltaY,
                this.currentBottomYOffset,
                this.tracks.length,
            );

            this.render();
        } else {
            const now = Date.now();
            const scaledDeltaY = e.deltaY * ZOOM_SCROLL_SENSITIVITY;

            if (now - lastZoomTime < this.throttleMs) {
                return;
            }

            lastZoomTime = now;

            const zoomType: ZoomAction =
                scaledDeltaY > 0 ? ZoomAction.Out : ZoomAction.In;

            if (e.offsetX < TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE) {
                return;
            }

            const mouseOffsetInScrollableArea =
                e.offsetX - TRACK_LEGEND_CONTAINER_PX - LEGEND_CONTENT_LINE;

            this.zoomState.x = mouseOffsetInScrollableArea;

            // Cancel any ongoing animations for immediate response
            if (this.animationState.isAnimating) {
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                }
                this.animationState.complete();
            }

            const currentZoomLevel = this.zoomState.current!.level;
            const currentViewportOffsetX = this.viewportOffsetX;

            zoomType === ZoomAction.Out
                ? this.zoomState.prev()
                : this.zoomState.next();

            const targetZoomLevel = this.zoomState.current!.level;

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
                this._bounds.width -
                TRACK_LEGEND_CONTAINER_PX -
                LEGEND_CONTENT_LINE;
            const totalVirtualWidth =
                targetBeatWidth * this.virtualTimelineBeats;
            const maxScrollX = Math.max(0, totalVirtualWidth - scrollableWidth);
            targetViewportOffsetX = Math.min(targetViewportOffsetX, maxScrollX);

            // Apply immediately for natural feel
            this.viewportOffsetX = targetViewportOffsetX;

            // Simple render without complex animation
            this.render();
        }
    }

    private startZoomAnimation() {
        // Simplified - no complex animation needed
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        const animate = (currentTime: number) => {
            const { progress } =
                this.animationState.getInterpolatedValues(currentTime);

            if (progress < 1) {
                this.animationFrameId = requestAnimationFrame(animate);
                this.render();
            } else {
                this.animationState.complete();
                this.animationFrameId = null;
                this.render();
            }
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    private withTimelineFont() {
        this.ctx.font = "12px Montserrat, serif";
        this.ctx.lineWidth = 0.5;
    }

    private handleZoom() {
        // Simplified zoom handling
        this.clampViewportOffset();
        this.render();
    }

    private clampViewportOffset() {
        const scrollableWidth =
            this._bounds.width -
            TRACK_LEGEND_CONTAINER_PX -
            LEGEND_CONTENT_LINE;
        const currentBeatWidth =
            BASE_CELL_WIDTH * this.zoomState.current!.level;
        const totalVirtualWidth = currentBeatWidth * this.virtualTimelineBeats;

        // Ensure we can scroll to see the last beat completely
        const maxScrollX = Math.max(0, totalVirtualWidth - scrollableWidth);

        this.viewportOffsetX = Math.max(
            0,
            Math.min(this.viewportOffsetX, maxScrollX),
        );
    }

    private get virtualTimelineBeats(): number {
        // Calculate minimum beats needed to fill the viewport at current zoom
        const scrollableWidth =
            this._bounds.width -
            TRACK_LEGEND_CONTAINER_PX -
            LEGEND_CONTENT_LINE;
        const currentBeatWidth =
            BASE_CELL_WIDTH * this.zoomState.current!.level;
        const beatsToFillViewport = Math.ceil(
            scrollableWidth / currentBeatWidth,
        );

        // Use at least the minimum, but scale up if needed to fill larger viewports
        return Math.max(MIN_VIRTUAL_TIMELINE_BEATS, beatsToFillViewport + 20); // +20 for scroll buffer
    }

    private renderTimelineAtZoom(customZoomLevel?: number) {
        const ctx = this.ctx;

        // Calculate how many beats fit in the scrollable viewport
        const scrollableWidth =
            this._bounds.width -
            TRACK_LEGEND_CONTAINER_PX -
            LEGEND_CONTENT_LINE;

        // Use custom zoom level during animation, otherwise use current state
        const zoomLevel = customZoomLevel ?? this.zoomState.current!.level;
        const beatWidth = BASE_CELL_WIDTH * zoomLevel;

        // Ensure we show at least the minimum number of beats
        const beatsToShow = Math.max(
            MIN_VIEWPORT_BEATS,
            Math.ceil(scrollableWidth / beatWidth) + 3, // +3 for partial beats and safety margin
        );

        this.withTimelineFont();

        // Always start the first beat at the legend boundary
        const startX = TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE;
        const maxX = this._bounds.width; // Right edge of viewport

        // Calculate which beat to start from based on viewport offset
        const firstBeatIndex = Math.floor(this.viewportOffsetX / beatWidth);
        const beatOffsetX = -(this.viewportOffsetX % beatWidth);

        for (let i = 0; i < beatsToShow; i++) {
            const beatStart = startX + beatOffsetX + i * beatWidth;
            const beatEnd = beatStart + beatWidth;
            const beat = firstBeatIndex + i + 1;

            // Stop if we've exceeded our virtual timeline
            if (beat > this.virtualTimelineBeats) {
                break;
            }

            // Skip beats that are completely before the visible area
            if (beatEnd <= startX) {
                continue;
            }

            // Only draw if beat starts within visible area or extends into it
            if (beatStart >= maxX) {
                break; // Stop drawing if we're past the right edge
            }

            // Calculate actual width to draw (clip at viewport edges)
            const clippedBeatStart = Math.max(beatStart, startX);
            const clippedBeatEnd = Math.min(beatEnd, maxX);
            const actualBeatWidth = clippedBeatEnd - clippedBeatStart;

            // Only draw if there's something visible and beat is positive
            if (actualBeatWidth > 0 && beat > 0) {
                // Draw beat background (clipped)
                ctx.fillStyle = cssVars.cardColor;
                ctx.fillRect(
                    clippedBeatStart,
                    0,
                    actualBeatWidth,
                    TIME_LEGEND_CELL_HEIGHT,
                );

                // Draw beat line (only if the line is within visible area)
                if (beatStart >= startX && beatStart < maxX) {
                    ctx.strokeStyle = themeVars.colorBorder;
                    ctx.beginPath();
                    ctx.moveTo(beatStart, 0);
                    ctx.lineTo(beatStart, this.totalHeight);
                    ctx.stroke();
                }

                // Draw beat number based on zoom level and beat significance
                if (actualBeatWidth > 15 && beatStart + 10 < maxX) {
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
                        ctx.fillStyle = cssVars.text;
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

    private drawTracksLegend() {
        const ctx = this.ctx;

        // Clear the legend area first
        ctx.fillStyle = cssVars.cardColor;
        ctx.fillRect(
            0,
            TIME_LEGEND_CELL_HEIGHT,
            TRACK_LEGEND_CONTAINER_PX,
            this._bounds.height - TIME_LEGEND_CELL_HEIGHT,
        );

        ctx.fillStyle = cssVars.border;
        ctx.fillRect(
            TRACK_LEGEND_CONTAINER_PX,
            TIME_LEGEND_CELL_HEIGHT,
            LEGEND_CONTENT_LINE,
            this._bounds.height - TIME_LEGEND_CELL_HEIGHT,
        );

        // Draw scroll indicator
        this.drawScrollIndicator();

        // Calculate which tracks are visible
        const availableHeight = this._bounds.height - TIME_LEGEND_CELL_HEIGHT;
        const firstVisibleTrack = Math.floor(
            this.currentBottomYOffset / TRACK_LINE_BASE_HEIGHT_PX,
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
            this.tracks.length - 1,
        );

        // Render tracks from first to last visible (inclusive)
        for (
            let trackIndex = firstVisibleTrack;
            trackIndex <= lastPossibleTrack;
            trackIndex++
        ) {
            if (trackIndex >= this.tracks.length) break;

            const track = this.tracks[trackIndex];
            const trackName = track?.channel.name ?? "Unknown track";

            // Calculate the relative position within the viewport
            const relativePosition = trackIndex - firstVisibleTrack;
            const trackY =
                TIME_LEGEND_CELL_HEIGHT +
                TRACK_LINE_BASE_HEIGHT_PX + // Offset for timeline header
                relativePosition * TRACK_LINE_BASE_HEIGHT_PX -
                (this.currentBottomYOffset % TRACK_LINE_BASE_HEIGHT_PX);

            // More generous bounds checking to ensure we catch the last track
            if (
                trackY >= TIME_LEGEND_CELL_HEIGHT - 10 &&
                trackY < this._bounds.height + 10
            ) {
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = "rgba(255,255,255,0.1)";
                ctx.lineCap = "square";
                ctx.font = "12px Montserrat, serif";

                // Draw track separator line
                ctx.beginPath();
                ctx.moveTo(0, trackY);
                ctx.lineTo(TRACK_LEGEND_CONTAINER_PX, trackY);
                ctx.stroke();

                ctx.fillStyle = cssVars.text;
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

    private drawTrack(index: number, yPosition?: number) {
        const ctx = this.ctx;

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = cssVars.cardColor;

        ctx.beginPath();

        // If no yPosition provided, calculate it starting below the timeline
        const y =
            yPosition ??
            TIME_LEGEND_CELL_HEIGHT + (index + 1) * TRACK_LINE_BASE_HEIGHT_PX;

        // Track lines should extend from the legend boundary to the canvas width
        ctx.moveTo(TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE, y);
        ctx.lineTo(this._bounds.width, y);
        ctx.stroke();
    }

    private drawPlaceholderToolbar() {
        const ctx = this.ctx;
        ctx.fillStyle = cssVars.cardColor;
        ctx.fillRect(
            0,
            0,
            TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE,
            TIME_LEGEND_CELL_HEIGHT,
        );
        ctx.strokeStyle = cssVars.border;
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.strokeRect(
            0,
            TIME_LEGEND_CELL_HEIGHT,
            TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE,
            this.totalHeight + TIME_LEGEND_CELL_HEIGHT,
        );
    }

    render() {
        this.reset();
        this.drawPlaceholderToolbar();
        this.drawTracksLegend();
        this.renderTimelineAtZoom(); // Use the unified timeline rendering method
        this.drawPlayhead();
    }

    private drawTrackEvents(track: Track, y: number) {}

    private drawScrollIndicator() {
        const ctx = this.ctx;

        // Calculate total track content height vs available space
        const availableTrackHeight =
            this._bounds.height - TIME_LEGEND_CELL_HEIGHT;
        const totalTrackContentHeight =
            this.tracks.length * TRACK_LINE_BASE_HEIGHT_PX;

        // Only draw if there are tracks that can be scrolled
        if (
            this.tracks.length === 0 ||
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
            maxScroll > 0 ? this.currentBottomYOffset / maxScroll : 0;

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
        ctx.fillStyle = cssVars.border;
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

    private drawPlayhead() {
        const ctx = this.ctx;

        const currentBeatWidth =
            BASE_CELL_WIDTH * this.zoomState.current!.level;

        // Convert playheadTime to beat position
        const beatPosition = this.currentTime / 1000;
        const timelineX = beatPosition * currentBeatWidth;

        // Calculate the actual screen X position accounting for viewport offset
        const playheadX =
            TRACK_LEGEND_CONTAINER_PX +
            LEGEND_CONTENT_LINE +
            timelineX -
            this.viewportOffsetX;

        // Only draw if playhead is within the visible area
        const minX = TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE;
        const maxX = this._bounds.width;

        if (playheadX < minX || playheadX > maxX) {
            return; // Playhead is outside visible area
        }

        // Draw playhead line
        ctx.strokeStyle = cssVars.tintPrimary;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, this.totalHeight);
        ctx.stroke();
    }

    private handleMouseDown(e: MouseEvent) {
        // Only start drag if we're in the timeline area (not in the legend)
        if (e.offsetX < TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE) {
            return;
        }

        // Cancel any ongoing animations
        if (this.animationState.isAnimating) {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            this.animationState.complete();
        }

        if (this.momentumAnimationId) {
            cancelAnimationFrame(this.momentumAnimationId);
            this.momentumAnimationId = null;
        }

        const rect = this.element.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        this.dragState.start(mouseX, this.viewportOffsetX);
        this.element.style.cursor = "grabbing";
    }

    private handleMouseMove(e: MouseEvent) {
        if (!this.dragState.isDragging) {
            // Update cursor based on position
            if (e.offsetX >= TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE) {
                this.element.style.cursor = "grab";
            } else {
                this.element.style.cursor = "default";
            }
            return;
        }

        const rect = this.element.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        const deltaX = this.dragState.update(mouseX);

        this.updateViewportOffset(deltaX);
    }

    private updateViewportOffset(deltaX: number) {
        // Calculate max scroll position based on virtual timeline
        const scrollableWidth =
            this._bounds.width -
            TRACK_LEGEND_CONTAINER_PX -
            LEGEND_CONTENT_LINE;
        const currentBeatWidth =
            BASE_CELL_WIDTH * this.zoomState.current!.level;
        const totalVirtualWidth = currentBeatWidth * this.virtualTimelineBeats;

        const maxScrollX = Math.max(0, totalVirtualWidth - scrollableWidth);

        // Simple, direct update without complex physics
        this.viewportOffsetX = Math.max(
            0,
            Math.min(maxScrollX, this.viewportOffsetX + deltaX),
        );

        // Direct render for immediate response
        this.render();
    }

    private handleMouseUp() {
        if (this.dragState.isDragging) {
            this.dragState.end();
            this.element.style.cursor = "grab";

            // Start momentum animation if there's velocity
            if (this.dragState.hasActiveMomentum) {
                this.startMomentumAnimation();
            }
        }
    }

    private handleMouseLeave() {
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

            if (Math.abs(deltaX) > 0.1) {
                // Higher threshold to stop sooner
                this.updateViewportOffset(deltaX);
                this.momentumAnimationId = requestAnimationFrame(animate);
            } else {
                this.momentumAnimationId = null;
                this.dragState.stop(); // Force stop momentum
            }
        };

        this.momentumAnimationId = requestAnimationFrame(animate);
    }

    // Add public method to force bounds update and re-render
    public updateBoundsAndRender() {
        // Force bounds recalculation
        if (this.container) {
            this._bounds = this.container.getBoundingClientRect();
        } else {
            this._bounds = this.element.getBoundingClientRect();
        }

        // Clamp scroll position to new bounds
        this.clampVerticalScroll();

        // Force a complete re-render
        this.render();
    }

    public forceRefresh() {
        const oldBounds = this._bounds;

        if (this.container) {
            this._bounds = this.container.getBoundingClientRect();
        } else {
            this._bounds = this.element.getBoundingClientRect();
        }

        const widthChange = Math.abs(this._bounds.width - oldBounds.width);
        const heightChange = Math.abs(this._bounds.height - oldBounds.height);

        if (widthChange > 100 || heightChange > 100) {
            this.currentBottomYOffset = 0;
            this.viewportOffsetX = 0;
        }

        this.clampVerticalScroll();
        this.render();
    }

    public destroy() {
        this.removeEvents();

        // Cleanup ResizeObserver
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this.momentumAnimationId) {
            cancelAnimationFrame(this.momentumAnimationId);
            this.momentumAnimationId = null;
        }
    }
}
