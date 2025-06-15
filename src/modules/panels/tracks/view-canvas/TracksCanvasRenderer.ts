import { cssVars } from "@/global-styles";
import type { Track } from "../Tracks";

const CELL_BASE_WIDTH_PX = 60;
const TRACK_LINE_BASE_HEIGHT_PX = 40;
const TRACK_LEGEND_CONTAINER_PX = 170;
const TRACK_LEGEND_TITLE_Y_PADDING_PX = 15;
const TRACK_LEGEND_TITLE_X_PADDING_PX = 10;
const LEGEND_CONTENT_LINE = 10;

const TOTAL_PX_X = 4000;

export default class TracksCanvasRenderer {
    tracks: Track[] = [];
    ctx: CanvasRenderingContext2D;
    element: HTMLCanvasElement;

    private currentBottomYOffset = 0;

    private viewportTracks: Track[] = [];

    private bounds: DOMRect;

    constructor(element: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.element = element;

        this.handleWheel = this.handleWheel.bind(this);

        this.bounds = element.getBoundingClientRect();

        this.scrollListen();
    }

    scrollListen() {
        this.element.addEventListener("wheel", this.handleWheel);
    }

    reset() {
        const width = this.bounds.width;
        const height = this.bounds.height;
        this.element.width = width;
        this.element.height = height;

        this.ctx.fillStyle = cssVars.tintPrimary;
        this.ctx.clearRect(0, 0, width, height);
    }

    private handleWheel(e: WheelEvent) {
        e.preventDefault();

        const elHeight = this.bounds.height;
        let current = this.currentBottomYOffset + e.deltaY;

        if (current + elHeight >= this.totalHeight) {
            const endOfScroll = this.totalHeight - elHeight;

            if (endOfScroll !== this.currentBottomYOffset) {
                this.currentBottomYOffset = endOfScroll;
                this.drawTracksLegend();
            }
        } else if (current <= 0) {
            current = 0;
        } else {
            this.currentBottomYOffset = current;
            this.drawTracksLegend();
        }
    }

    private get totalHeight() {
        return this.tracks.length * TRACK_LINE_BASE_HEIGHT_PX;
    }

    private drawTrack(index: number) {
        const ctx = this.ctx;

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = cssVars.cardColor;

        ctx.beginPath();
        ctx.moveTo(
            TRACK_LEGEND_CONTAINER_PX + LEGEND_CONTENT_LINE,
            index * TRACK_LINE_BASE_HEIGHT_PX,
        );
        ctx.lineTo(TOTAL_PX_X, index * TRACK_LINE_BASE_HEIGHT_PX);
        ctx.stroke();
    }

    drawContent() {}
    drawTracksLegend() {
        this.reset();

        const startIndex = Math.floor(
            this.currentBottomYOffset / TRACK_LINE_BASE_HEIGHT_PX,
        );

        this.viewportTracks = this.tracks.slice(startIndex);

        const tracks = this.viewportTracks;
        const ctx = this.ctx;

        const tracksHeight = tracks.length * TRACK_LINE_BASE_HEIGHT_PX;

        ctx.fillStyle = cssVars.cardColor;
        ctx.fillRect(0, 0, TRACK_LEGEND_CONTAINER_PX, tracksHeight);

        ctx.fillStyle = cssVars.border;
        ctx.fillRect(
            TRACK_LEGEND_CONTAINER_PX,
            0,
            LEGEND_CONTENT_LINE,
            tracksHeight,
        );

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const trackName = track.channel.name ?? "Unknown track";

            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineCap = "square";
            ctx.textRendering = "auto";

            ctx.font = "12px Montserrat, serif";

            const line = i + 1;

            ctx.beginPath();
            ctx.moveTo(0, line * TRACK_LINE_BASE_HEIGHT_PX);
            ctx.lineTo(
                TRACK_LEGEND_CONTAINER_PX,
                line * TRACK_LINE_BASE_HEIGHT_PX,
            );

            ctx.fillStyle = cssVars.text;
            ctx.fillText(
                trackName,
                TRACK_LEGEND_TITLE_X_PADDING_PX,
                line * TRACK_LINE_BASE_HEIGHT_PX -
                    TRACK_LEGEND_TITLE_Y_PADDING_PX,
                TRACK_LEGEND_CONTAINER_PX,
            );

            ctx.stroke();

            this.drawTrack(i);
        }
    }
}
