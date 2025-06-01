import WithPlaybackContext from "@/mixins/WithPlaybackContext";

import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";

const MAX_TIME_BEATS = 64;
const BEAT_WIDTH = 40;
const TRACK_SLOTS = 10;

@customElement("tracks-canvas")
export default class TracksCanvas extends WithPlaybackContext(LitElement) {
    @query("#tracks-canvas")
    private canvasElement!: HTMLCanvasElement;

    private animationFrameId?: number;

    private isDrawing: boolean = false;

    static styles = [
        css`
            .container {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: auto;
            }
        `,
    ];

    protected updated(_changedProperties: PropertyValues): void {
        super.updated(_changedProperties);

        if (_changedProperties.has("playbackContext")) {
            if (this.playbackContext.isPlaying) {
                this.isDrawing = true;
                this.requestAnimationFrameSync();
            } else {
                this.isDrawing = false;
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = undefined;
                }
            }
        }
    }

    private drawStartPos() {
        const ctx = this.canvasElement.getContext("2d")!;
        ctx.fillStyle = "#1d1d1d";
        ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.drawGrid();
        this.drawPlayhead();
    }

    private clearCanvas() {
        const ctx = this.canvasElement.getContext("2d")!;
        ctx.clearRect(
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height,
        );
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);
        this.drawStartPos();
    }

    private drawPlayhead() {
        const ctx = this.canvasElement.getContext("2d")!;
        const currentTime =
            this.playbackContext.master.audioContext.currentTime;
        const currentBeat = Math.floor(
            (currentTime / (60 / this.playbackContext.bpm)) * 4,
        );
        const x = currentBeat * BEAT_WIDTH;

        ctx.strokeStyle = "#d95656";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.canvasElement.height);
        ctx.stroke();
    }

    private syncPlayheadWithTime() {
        if (!this.isDrawing) {
            return;
        }

        const ctx = this.canvasElement.getContext("2d")!;
        const time = this.playbackContext.currentTime;
        const currentBeat = Math.floor(
            (time / (60 / this.playbackContext.bpm)) * 4,
        );
        const x = currentBeat * BEAT_WIDTH;

        ctx.clearRect(
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height,
        );
        ctx.fillStyle = "#1d1d1d";
        ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.drawGrid();
        this.drawPlayhead();

        ctx.strokeStyle = "#d95656";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.canvasElement.height);
        ctx.stroke();
        this.requestAnimationFrameSync();
    }

    private requestAnimationFrameSync() {
        this.animationFrameId = requestAnimationFrame(
            this.syncPlayheadWithTime.bind(this),
        );
    }

    private drawGrid() {
        const ctx = this.canvasElement.getContext("2d")!;

        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;

        for (let i = 0; i <= MAX_TIME_BEATS; i++) {
            const x = i * BEAT_WIDTH;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvasElement.height);
            ctx.stroke();
        }

        for (let i = 0; i < TRACK_SLOTS; i++) {
            const y = (i + 1) * (this.canvasElement.height / TRACK_SLOTS);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvasElement.width, y);
            ctx.stroke();
        }
    }

    protected render() {
        return html`<div class="container">
            <canvas id="tracks-canvas" width="5000" height="500"></canvas>
        </div>`;
    }
}
