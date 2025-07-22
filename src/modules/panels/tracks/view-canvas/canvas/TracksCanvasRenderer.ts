import {
    LEGEND_CONTENT_LINE,
    BASE_CELL_WIDTH,
    MIN_VIRTUAL_TIMELINE_BEATS,
    TRACK_LEGEND_CONTAINER_PX,
    TRACK_LINE_BASE_HEIGHT_PX,
    TIME_LEGEND_CELL_HEIGHT,
} from "./canvasConstants";
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
import AnimationState from "./AnimationState";
import TimelineNodeDragSystem from "./TimelineNodeDrag";

export default class TracksCanvasRenderer {
    ctx: CanvasRenderingContext2D;
    element: HTMLCanvasElement;
    currentBottomYOffset = 0;
    viewportOffsetX: number = 0;
    tracks: AudioSource[] = [];

    readonly events: AudioEvent[] = [];
    readonly renderNodes: TrackCanvasNode[] = [];

    private _bounds: DOMRect;

    readonly animationState = new AnimationState();
    readonly zoomState = new ZoomState();

    private container: HTMLElement | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private dragSystem: TimelineNodeDragSystem | null = null;

    constructor(
        element: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        container: HTMLElement | null = null,
    ) {
        this.ctx = ctx;
        this.element = element;
        this.container = container;

        this.renderNodes = [
            new TimelineNode(this),
            new TracksNode(this),
            new PlayheadNode(this),
        ];

        this._bounds = element.getBoundingClientRect();

        this.setupResizeObserver();

        new CanvasScroll(this);
        this.dragSystem = new TimelineNodeDragSystem(this.element, this);
        this.animationState = new AnimationState();
    }

    set bounds(rect: DOMRect) {
        this._bounds = rect;
        this.clampVerticalScroll();
    }

    get bounds(): DOMRect {
        return this._bounds;
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

        // Draw selection overlay after all nodes
        if (this.dragSystem) {
            this.dragSystem.drawSelection(this.ctx);
        }
    }

    updateViewportOffset(deltaX: number) {
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
        // Cleanup ResizeObserver
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        if (this.dragSystem) {
            this.dragSystem.removeEvents();
            this.dragSystem = null;
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
