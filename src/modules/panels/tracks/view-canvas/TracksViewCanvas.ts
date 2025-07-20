import {
    css,
    html,
    LitElement,
    type PropertyValues,
    type TemplateResult,
} from "lit";
import { query, property, state } from "lit/decorators.js";

import TracksCanvasRenderer from "./canvas/TracksCanvasRenderer";

import { classMap } from "lit/directives/class-map.js";
import type { AudioEvent, PlayEvent } from "@/lib/AudioSource";
import type { Panel } from "@/lib/PanelScreenManager";
import { msToSeconds } from "@/utils/TimeUtils";

import AudioSource from "@/lib/AudioSource";
import { store } from "@/store/AppStore";
import WatchController, { storeSubscriber } from "@/store/StoreLit";

export default class TracksViewCanvas extends LitElement {
    @property({ type: String })
    quantisize?: string;

    @property({ type: Object })
    panel!: Panel;

    @query("#tracks-view-canvas")
    private canvas!: HTMLCanvasElement;

    @query(".tracks-container")
    private tracksContainer!: HTMLDivElement;

    @state()
    isFullscreen: boolean = false;

    @state()
    eventData: AudioEvent[] = [];

    @storeSubscriber(store, (state) => ({
        currentTime: state.playback.currentTime,
        channels: state.playback.channels,
    }))
    private playback!: {
        currentTime: number;
        channels: AudioSource[];
    };

    watcherController = new WatchController(this, store, {
        "playback.channels": async (channels: AudioSource[]) => {
            channels.forEach((track) => {
                track.onPlay((event: CustomEvent<PlayEvent>) => {
                    this.handlePlayEvent(event, track);
                });
            });

            this.renderHelper?.setTracks(this.playback.channels);

            await this.updateComplete;
            this.renderHelper.render();
        },
    });

    private renderHelper!: TracksCanvasRenderer;

    private get currentTimeSeconds(): number {
        return msToSeconds(this.playback.currentTime);
    }

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
                touch-action: none;
            }

            #tracks-view-canvas:active {
                cursor: grabbing;
            }
        `,
    ];

    protected async firstUpdated(): Promise<void> {
        this.renderHelper = new TracksCanvasRenderer(
            this.canvas,
            this.canvas.getContext("2d")!,
            this.tracksContainer,
        );

        this.renderHelper.setTracks(this.playback.channels);

        this.panel?.onFullscreenChange((isFullscreen) => {
            this.isFullscreen = isFullscreen;
            this.renderHelper.forceRefresh();
        });

        await this.updateComplete;

        if (this.playback.channels.length > 0) {
            this.renderHelper.render();
        }
    }

    private handlePlayEvent(
        event: CustomEvent<PlayEvent>,
        track: AudioSource,
    ): void {
        const state = store.getState();
        const playback = state.playback;

        if (!playback.isPlaying) {
            return;
        }

        this.renderHelper.addEvent(
            event.detail,
            playback.currentTime,
            track.id,
        );

        store.scheduler.addToQueue(track, {
            startTime: this.currentTimeSeconds,
            endTime: this.currentTimeSeconds,
            id: event.detail.id,
            isPlaying: event.detail.isPlaying,
        });

        this.renderHelper.render();
    }

    protected updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);

        if (changedProperties.has("isFullscreen") && this.renderHelper) {
            this.renderHelper.setTracks(this.playback.channels);
            this.renderHelper.forceRefresh();
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
