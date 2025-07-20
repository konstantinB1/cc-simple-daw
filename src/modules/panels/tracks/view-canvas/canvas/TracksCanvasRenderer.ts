import {
    LEGEND_CONTENT_LINE,
    BASE_CELL_WIDTH,
    MIN_VIRTUAL_TIMELINE_BEATS,
    TRACK_LEGEND_CONTAINER_PX,
    TRACK_LINE_BASE_HEIGHT_PX,
    TIME_LEGEND_CELL_HEIGHT,
} from "./canvasConstants";
import DragState from "./DragState";
import AnimationState from "./AnimationState";
import ZoomState from "./ZoomState";
import { themeVars } from "@/styles";
import type { AudioEvent, PlayEvent } from "@/lib/AudioSource";

import type AudioSource from "@/lib/AudioSource";
import PlayheadNode from "./PlayheadNode";
import TimelineNode from "./TimelineNode";
import TracksNode from "./TracksNode";
import type { TrackCanvasNode } from "./NodeInterface";
import TrackCanvasStoreState from "../TrackCanvasStoreState";
import CanvasScroll from "./Scroll";

export default class TracksCanvasRenderer extends TrackCanvasStoreState {
    ctx: CanvasRenderingContext2D;
    element: HTMLCanvasElement;
    currentBottomYOffset = 0;
    viewportOffsetX: number = 0;
    animationFrameId: number | null = null;

    private _bounds: DOMRect;

    readonly zoomState = new ZoomState();
    readonly animationState = new AnimationState();
    readonly events: AudioEvent[] = [];
    readonly renderNodes: TrackCanvasNode[] = [];
    readonly dragState = new DragState();

    private container: HTMLElement | null = null;
    private momentumAnimationId: number | null = null;
    private resizeObserver: ResizeObserver | null = null;

    tracks: AudioSource[] = [];

    constructor(
        element: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        container: HTMLElement | null = null,
    ) {
        super();

        this.ctx = ctx;
        this.element = element;
        this.container = container;

        this.renderNodes = [
            new TimelineNode(this),
            new TracksNode(this),
            new PlayheadNode(this),
        ];

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        this._bounds = element.getBoundingClientRect();

        this.startEvents();
        this.setupResizeObserver();

        new CanvasScroll(this);
    }

    protected override onCurrentTimeChange(newTime: number): void {
        super.onCurrentTimeChange(newTime);
    }

    protected override onBpmChange(newTime: number): void {
        super.onBpmChange(newTime);
    }

    set bounds(rect: DOMRect) {
        this._bounds = rect;
        this.clampVerticalScroll();
    }

    get bounds(): DOMRect {
        return this._bounds;
    }

    setBPM(bpm: number) {
        this.bpm = bpm;
    }

    setTracks(tracks: AudioSource[]) {
        this.tracks = Array.from(tracks);
        this.render();
    }

    addEvent(e: PlayEvent, currentTime: number, trackId: string) {
        const existingEvent = this.events.findIndex(
            (ev) => ev.data.id === e.id,
        );

        if (existingEvent === -1) {
            this.events.push({
                startTime: currentTime,
                endTime: 0,
                data: e,
                trackId,
            });
        } else {
            this.events[existingEvent] = {
                data: e,
                startTime: this.events[existingEvent].startTime,
                endTime: currentTime,
                trackId,
            };
        }
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
        this.element.addEventListener("mousedown", this.handleMouseDown);
        this.element.addEventListener("mousemove", this.handleMouseMove);
        this.element.addEventListener("mouseup", this.handleMouseUp);
        this.element.addEventListener("mouseleave", this.handleMouseLeave);
    }

    private removeEvents() {
        this.element.removeEventListener("mousedown", this.handleMouseDown);
        this.element.removeEventListener("mousemove", this.handleMouseMove);
        this.element.removeEventListener("mouseup", this.handleMouseUp);
        this.element.removeEventListener("mouseleave", this.handleMouseLeave);
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

        this.ctx.fillStyle = themeVars.colorPrimary;
        this.ctx.clearRect(0, 0, width, height);

        // Clamp vertical scroll after bounds change
        this.clampVerticalScroll();
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

    get virtualTimelineBeats(): number {
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

    render() {
        this.reset();
        this.renderNodes.forEach((node) => {
            node.draw();
        });
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

        this.viewportOffsetX = Math.max(
            0,
            Math.min(maxScrollX, this.viewportOffsetX + deltaX),
        );

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

    public setViewportOffsetX(offsetX: number): void {
        const scrollableWidth =
            this._bounds.width -
            TRACK_LEGEND_CONTAINER_PX -
            LEGEND_CONTENT_LINE;
        const currentBeatWidth =
            BASE_CELL_WIDTH * this.zoomState.current!.level;
        const totalVirtualWidth = currentBeatWidth * this.virtualTimelineBeats;
        const maxScrollX = Math.max(0, totalVirtualWidth - scrollableWidth);

        this.viewportOffsetX = Math.max(0, Math.min(maxScrollX, offsetX));
        this.render();
    }
}
