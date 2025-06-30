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

import TracksCanvasRenderer from "./TracksCanvasRenderer";
import WithScreenManager from "@/mixins/WithScreenManager";
import { classMap } from "lit/directives/class-map.js";
import type Track from "@/lib/AudioTrack";

@customElement("tracks-view-canvas")
export default class TracksViewCanvas extends WithScreenManager(LitElement) {
    @property({ type: Array })
    tracks: Track[] = [];

    @property({ type: String })
    quantisize?: string;

    @query("#tracks-view-canvas")
    private canvas!: HTMLCanvasElement;

    @query(".tracks-container")
    private tracksContainer!: HTMLDivElement;

    @consumeProp({ context: playbackContext, subscribe: true })
    currentTime!: number;

    @consumeProp({ context: playbackContext, subscribe: true })
    bpm!: number;

    @state()
    isFullscreen: boolean = false;

    private renderHelper!: TracksCanvasRenderer;

    static styles = [
        css`
            :host {
                display: block;
                width: 100%;
                height: 100%;
                position: relative;
            }

            .tracks-container {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
                border-bottom-left-radius: var(--border-radius);
                border-bottom-right-radius: var(--border-radius);
            }

            .is-fullscreen {
                width: 100vw;
                height: calc(100vh - 97px);
                position: fixed;
                top: 97px;
                left: 0;
                z-index: 1000;
                overflow: hidden;
            }

            .normal-mode {
                width: 100%;
                height: 450px; /* Further reduced to show ~6-7 tracks */
            }

            #tracks-view-canvas {
                width: 100%;
                height: 100%;
                display: block;
                cursor: grab;
                background-color: var(--color-primary);
                touch-action: none; /* Prevent touch scrolling interference */
            }

            #tracks-view-canvas:active {
                cursor: grabbing;
            }
        `,
    ];

    protected firstUpdated(): void {
        this.renderHelper = new TracksCanvasRenderer(
            this.canvas,
            this.canvas.getContext("2d")!,
            this.tracksContainer,
        );

        const panel = this.screenManager.getPanel("tracks-view");

        panel?.onFullscreenChange((isFullscreen) => {
            this.isFullscreen = isFullscreen;

            this.renderHelper.setTracks(this.tracks);
            this.renderHelper.forceRefresh();
        });

        // Initial render if tracks are already available
        if (this.tracks.length > 0) {
            this.renderHelper.setTracks(this.tracks);
            requestAnimationFrame(() => {
                this.renderHelper.render();
            });
        }
    }

    protected updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);

        // Only re-render when tracks actually change
        if (
            changedProperties.has("tracks") &&
            this.tracks.length > 0 &&
            this.renderHelper
        ) {
            this.tracks.forEach((track) => {});

            this.renderHelper.setTracks(this.tracks);
            // Use requestAnimationFrame for smoother rendering
            requestAnimationFrame(() => {
                this.renderHelper.render();
            });
        }

        // Force refresh when fullscreen state changes
        if (changedProperties.has("isFullscreen") && this.renderHelper) {
            // Use longer timeout to ensure DOM has fully updated
            setTimeout(() => {
                this.renderHelper.setTracks(this.tracks);
                this.renderHelper.forceRefresh();
            });
        }

        if (changedProperties.has("bpm") && this.renderHelper) {
            this.renderHelper.setCurrentTime(this.currentTime);

            // Re-render the canvas with updated playhead
            this.renderHelper.render();
        }

        if (changedProperties.has("currentTime") && this.renderHelper) {
            this.renderHelper.setCurrentTime(this.currentTime);
            this.renderHelper.render();
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        this.renderHelper?.destroy();
    }

    protected render(): TemplateResult {
        const classes = classMap({
            "tracks-container": true,
            "is-fullscreen": this.isFullscreen,
            "normal-mode": !this.isFullscreen,
        });

        return html`
            <div class=${classes}>
                <canvas id="tracks-view-canvas"></canvas>
            </div>
        `;
    }
}
