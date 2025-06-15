import { playbackContext } from "@/context/playbackContext";
import { consumeProp } from "@/decorators/sync";

import {
    css,
    html,
    LitElement,
    type PropertyValues,
    type TemplateResult,
} from "lit";
import { customElement, query, property, state } from "lit/decorators.js";
import type { Track } from "../Tracks";
import TracksCanvasRenderer from "./TracksCanvasRenderer";

@customElement("tracks-view-canvas")
export default class TracksViewCanvas extends LitElement {
    @property({ type: Array })
    tracks: Track[] = [];

    @query("#tracks-view-canvas")
    private canvas!: HTMLCanvasElement;

    @state()
    private zoomLevel = 1;

    @state()
    private scrollX = 0;

    @state()
    private scrollY = 0;

    @consumeProp({ context: playbackContext, subscribe: true })
    currentTime!: number;

    @consumeProp({ context: playbackContext, subscribe: true })
    bpm!: number;

    private isDragging = false;
    private lastMouseX = 0;
    private lastMouseY = 0;
    private gridWidth = 50;
    private trackHeight = 60;
    private timelineHeight = 30;

    private renderHelper!: TracksCanvasRenderer;

    private zoomedGridWidth?: number;

    static styles = [
        css`
            .tracks-container {
                width: 100%;
                min-height: 300px;
                max-height: 500px;
                position: relative;
                overflow: hidden;
                border-bottom-left-radius: var(--border-radius);
                border-bottom-right-radius: var(--border-radius);
            }

            #tracks-view-canvas {
                width: 100%;
                display: block;
                cursor: grab;
                background-color: var(--color-primary);
                border-top: 1px solid rgba(255, 255, 255, 0.02);
            }

            #tracks-view-canvas:active {
                cursor: grabbing;
            }

            .zoom-controls {
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                gap: 5px;
                z-index: 10;
            }

            .zoom-btn {
                padding: 5px 10px;
                background: #f0f0f0;
                border: 1px solid #ccc;
                cursor: pointer;
                border-radius: 3px;
            }

            .zoom-btn:hover {
                background: #e0e0e0;
            }
        `,
    ];

    protected updated(_changedProperties: PropertyValues): void {
        if (_changedProperties.has("tracks")) {
            this.renderHelper.tracks = this.tracks;

            this.renderHelper.drawTracksLegend();
        }
    }

    private renderGrid(): void {
        // this.zoomedGridWidth = CELL_BASE_WIDTH_PX * this.zoomLevel;
        // const visibleStartTime = Math.floor(
        //     -this.scrollX / this.zoomedGridWidth,
        // );
        // const visibleEndTime = Math.ceil(
        //     (width - this.scrollX) / this.zoomedGridWidth,
        // );
        // this.renderHelper.drawTracksLegend(this.tracks);
        // const contentX = canvas.clientWidth - TRACK_LEGEND_CONTAINER_PX;
        // const contentY = canvas.clientHeight - this.tracks.length;
        // // Draw timeline header background
        // ctx.fillStyle = cssVars.primary;
        // ctx.fillRect(0, 0, width, this.timelineHeight);
        // // Background color
        // ctx.fillStyle = cssVars.secondary;
        // ctx.fillRect(
        //     0,
        //     this.timelineHeight,
        //     width,
        //     height - this.timelineHeight,
        // );
        // // Draw timeline grid lines and time markers
        // ctx.strokeStyle = cssVars.cardColor;
        // ctx.lineWidth = 1.5;
        // ctx.fillStyle = cssVars.text;
        // ctx.font = "12px Montserrat, sans-serif";
        // for (let time = visibleStartTime; time <= visibleEndTime; time++) {
        //     const x = this.scrollX + time * this.zoomedGridWidth;
        //     if (x >= 0 && x <= width) {
        //         // Vertical grid lines
        //         ctx.beginPath();
        //         ctx.moveTo(x, 0);
        //         ctx.lineTo(x, height);
        //         ctx.stroke();
        //         // Time markers
        //         if (time >= 0) {
        //             const timeText = `${Math.floor(time / 4)}:${time % 4}`;
        //             ctx.fillText(timeText, x + 2, 15);
        //         }
        //     }
        // }
        // // Draw horizontal track lines with vertical scrolling
        // const visibleTrackStart = Math.floor(-this.scrollY / this.trackHeight);
        // const visibleTrackEnd =
        //     Math.floor(
        //         (height - this.timelineHeight - this.scrollY) /
        //             this.trackHeight,
        //     ) + 1;
        // for (let track = visibleTrackStart; track <= visibleTrackEnd; track++) {
        //     const y =
        //         this.timelineHeight + this.scrollY + track * this.trackHeight;
        //     if (y >= this.timelineHeight && y <= height) {
        //         ctx.beginPath();
        //         ctx.moveTo(0, y);
        //         ctx.lineTo(width, y);
        //         ctx.stroke();
        //         // fill track grids
        //     }
        // }
        // const playhead = getPlayheadPosition(this.bpm, this.currentTime);
        // // Draw playhead line
        // ctx.strokeStyle = cssVars.tintPrimary;
        // ctx.lineWidth = 2;
        // ctx.beginPath();
        // ctx.moveTo(
        //     this.scrollX + playhead * this.zoomedGridWidth,
        //     this.timelineHeight,
        // );
        // ctx.lineTo(this.scrollX + playhead * this.zoomedGridWidth, height);
        // ctx.stroke();
        // // Draw timeline header border
        // ctx.strokeStyle = "#ffffff";
        // ctx.lineWidth = 0.4;
        // ctx.beginPath();
        // ctx.moveTo(0, this.timelineHeight);
        // ctx.lineTo(width, this.timelineHeight);
        // ctx.stroke();
    }

    // private handleWheel = (e: WheelEvent): void => {
    //     e.preventDefault();

    //     if (e.ctrlKey || e.metaKey) {
    //         // Zoom
    //         const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
    //         const newZoom = Math.max(
    //             0.1,
    //             Math.min(5, this.zoomLevel * zoomDelta),
    //         );

    //         // Zoom towards mouse position
    //         const rect = this.canvas.getBoundingClientRect();
    //         const mouseX = e.clientX - rect.left;
    //         const worldX = (mouseX - this.scrollX) / this.zoomLevel;

    //         this.zoomLevel = newZoom;
    //         this.scrollX = mouseX - worldX * this.zoomLevel;

    //         this.renderGrid();
    //     } else if (e.shiftKey) {
    //         // Vertical scroll with shift key
    //         this.scrollY += e.deltaY;
    //         this.renderGrid();
    //     } else {
    //         // Horizontal scroll
    //         this.scrollX = Math.min(0, this.scrollX - e.deltaX - e.deltaY);
    //         this.renderGrid();
    //     }
    // };

    // private handleMouseDown = (e: MouseEvent): void => {
    //     this.isDragging = true;
    //     this.lastMouseX = e.clientX;
    //     this.lastMouseY = e.clientY;
    //     this.canvas.style.cursor = "grabbing";
    // };

    // private handleMouseMove = (e: MouseEvent): void => {
    //     if (this.isDragging) {
    //         const deltaX = e.clientX - this.lastMouseX;
    //         const deltaY = e.clientY - this.lastMouseY;
    //         this.scrollX = Math.min(0, this.scrollX + deltaX);
    //         this.scrollY += deltaY; // Vertical scrolling
    //         this.lastMouseX = e.clientX;
    //         this.lastMouseY = e.clientY;
    //         this.renderGrid();
    //     }
    // };

    // private handleMouseUp = (): void => {
    //     this.isDragging = false;
    //     this.canvas.style.cursor = "grab";
    // };

    private zoomIn(): void {
        this.zoomLevel = Math.min(5, this.zoomLevel * 1.2);
        this.renderGrid();
    }

    private zoomOut(): void {
        this.zoomLevel = Math.max(0.1, this.zoomLevel / 1.2);
        this.renderGrid();
    }

    private resetZoom(): void {
        this.zoomLevel = 1;
        this.scrollX = 0;
        this.scrollY = 0; // Reset vertical scroll
        this.renderGrid();
    }

    protected firstUpdated(): void {
        const ctx = this.canvas.getContext("2d");

        this.renderHelper = new TracksCanvasRenderer(this.canvas, ctx!);
        // this.canvas.addEventListener("wheel", this.handleWheel);
        // this.canvas.addEventListener("mousedown", this.handleMouseDown);
        // this.canvas.addEventListener("mousemove", this.handleMouseMove);
        // this.canvas.addEventListener("mouseup", this.handleMouseUp);
        // this.canvas.addEventListener("mouseleave", this.handleMouseUp);

        // Initial render
        setTimeout(() => this.renderGrid(), 0);

        // Handle resize
        new ResizeObserver(() => this.renderGrid()).observe(this.canvas);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        // this.canvas?.removeEventListener("wheel", this.handleWheel);
        // this.canvas?.removeEventListener("mousedown", this.handleMouseDown);
        // this.canvas?.removeEventListener("mousemove", this.handleMouseMove);
        // this.canvas?.removeEventListener("mouseup", this.handleMouseUp);
        // this.canvas?.removeEventListener("mouseleave", this.handleMouseUp);
    }

    protected render(): TemplateResult {
        return html`
            <div class="tracks-container">
                <canvas id="tracks-view-canvas" height="130"></canvas>
                <div class="zoom-controls">
                    <button class="zoom-btn" @click=${this.zoomOut}>-</button>
                    <button class="zoom-btn" @click=${this.resetZoom}>
                        Reset
                    </button>
                    <button class="zoom-btn" @click=${this.zoomIn}>+</button>
                </div>
            </div>
        `;
    }
}
