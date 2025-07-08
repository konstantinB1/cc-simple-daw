import { css, html, LitElement, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./BpmPicker";
import "./TimeIndicator";
import Metronome from "./Metronome";

import type { LayeredKeyboardManager } from "@/lib/KeyboardManager";

import { store } from "@/store/AppStore";
import WatchController, { storeSubscriber } from "@/store/StoreLit";

@customElement("playback-element")
export default class PlaybackElement extends LitElement {
    @property({ type: Object })
    keyboardManager!: LayeredKeyboardManager;

    private metronome!: Metronome;

    @state()
    private isMetronomeOn: boolean = false;

    @state()
    private countdown: boolean = false;

    @storeSubscriber(store, (state) => ({
        currentTime: state.playback.currentTime,
        isPlaying: state.playback.isPlaying,
        isRecording: state.playback.isRecording,
        bpm: state.playback.bpm,
    }))
    private state = {
        currentTime: 0,
        isPlaying: false,
        isRecording: false,
        bpm: 120,
    };

    watchController = new WatchController(this, store, {
        "playback.lastTimeEventChange": () => {
            store.scheduler.stop();
        },
        "playback.isPlaying": (isPlaying: boolean) => {
            if (isPlaying && this.isMetronomeOn) {
                if (!this.metronomeRafId) {
                    this.metronomeLoop();
                }
            } else if (this.metronomeRafId) {
                cancelAnimationFrame(this.metronomeRafId);
                this.metronome.stop();
                this.metronomeRafId = undefined;
            }
        },
    });

    static styles = [
        css`
            .button-wrapper {
                display: flex;
                gap: 6px;
            }

            .time-indicator-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100px;
            }
        `,
    ];

    private metronomeRafId: number | undefined = undefined;

    connectedCallback(): void {
        super.connectedCallback();

        this.metronome = new Metronome(store.preview, store.ctx);

        this.metronome.preloadTickSound();

        this.keyboardManager.addKeys([
            {
                active: true,
                keys: ["Shift", "r"],
                description: "Toggle Recording",
                handler: () => this.handleRecord(),
            },
            {
                active: true,
                keys: ["Space"],
                description: "Toggle Play/Pause",
                handler: () => this.handlePlay(),
            },
            {
                active: true,
                keys: ["Shift", "m"],
                description: "Toggle Metronome",
                handler: () => this.toggleMetronome(),
            },
            {
                active: true,
                keys: ["Shift", "ArrowLeft"],
                description: "Rewind to Start",
                handler: () => this.handleRewind(),
            },
            {
                active: true,
                keys: ["Shift", "c"],
                description: "Toggle Countdown",
                handler: () => this.toggleCountdown(),
            },
        ]);
    }

    private toggleMetronome(): void {
        this.isMetronomeOn = !this.isMetronomeOn;
    }

    private async handlePlay(): Promise<void> {
        const isPlaying = this.state.isPlaying;

        if (isPlaying) {
            this.metronome.cancelCountdown();
            store.stopPlayback();
        } else {
            if (this.countdown) {
                await this.metronome.fixedCountdown(this.state.bpm);
            }

            store.startPlayback();
        }
    }

    private metronomeLoop() {
        if (this.isMetronomeOn && this.state.isPlaying) {
            this.metronome.tick(this.state.currentTime, this.state.bpm);
        }

        this.metronomeRafId = requestAnimationFrame(
            this.metronomeLoop.bind(this),
        );
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated?.(_changedProperties);

        if (this.state.isPlaying && this.isMetronomeOn) {
            if (!this.metronomeRafId) {
                this.metronomeLoop();
            }
        } else if (this.metronomeRafId) {
            cancelAnimationFrame(this.metronomeRafId);
            this.metronome.stop();
            this.metronomeRafId = undefined;
        }
    }

    private handleRewind(): void {
        store.rewind();

        if (this.state.isPlaying) {
            store.scheduler.reschedule();

            if (this.isMetronomeOn) {
                this.metronome.rewind();
            }
        }
    }

    private handleRecord(): void {
        store.toggleRecording();
    }

    private get renderIsPlayingIcon(): TemplateResult {
        if (!this.state.isPlaying) {
            return html`<play-icon size=${14}></play-icon>`;
        }

        return html`<stop-icon size=${14}></stop-icon>`;
    }

    private toggleCountdown(): void {
        this.countdown = !this.countdown;
    }

    render() {
        return html`
            <div class="container">
                <div class="button-wrapper">
                    <icon-button
                        .isActive=${this.state.isRecording}
                        size=${40}
                        @handle-click=${this.handleRecord}
                    >
                        <record-icon size=${20}></record-icon>
                    </icon-button>
                    <icon-button size=${40} @handle-click=${this.handleRewind}>
                        <rewind-icon size=${17}></rewind-icon>
                    </icon-button>
                    <icon-button size=${40} @handle-click=${this.handlePlay}>
                        ${this.renderIsPlayingIcon}
                    </icon-button>
                    <bpm-picker></bpm-picker>
                    <icon-button
                        .isActive=${this.isMetronomeOn}
                        size=${40}
                        @handle-click=${this.toggleMetronome}
                    >
                        <metronome-icon .size=${20}></metronome-icon>
                    </icon-button>
                    <icon-button
                        .isActive=${this.countdown}
                        size=${40}
                        @handle-click=${this.toggleCountdown}
                    >
                        <clock-icon .size=${17}></clock-icon>
                    </icon-button>
                </div>
            </div>
        `;
    }
}
