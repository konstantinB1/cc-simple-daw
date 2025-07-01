import {
    css,
    html,
    LitElement,
    type PropertyValues,
    type TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./BpmPicker";
import "./TimeIndicator";
import Metronome from "./Metronome";

import WithPlaybackContext from "@/mixins/WithPlaybackContext";
import { msToSeconds, StopWatch } from "@/utils/TimeUtils";
import type { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import { TimeEventChange } from "@/context/playbackContext";

@customElement("playback-element")
export default class PlaybackElement extends WithPlaybackContext(LitElement) {
    @property({ type: Object })
    keyboardManager!: LayeredKeyboardManager;

    private metronome!: Metronome;

    @state()
    private isMetronomeOn: boolean = false;

    @state()
    private countdown: boolean = false;

    private stopWatch = new StopWatch();

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

        this.metronome = new Metronome(
            this.playbackContext.preview,
            this.playbackContext.audioContext,
        );
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
        this.consumer.$toggleIsPlaying();

        const isPlaying = !this.playbackContext.isPlaying;
        const currentTime = this.playbackContext.currentTime;

        if (isPlaying) {
            this.metronome.cancelCountdown();
            this.stopWatch.stop();
            this.playbackContext.scheduler.stop();
        } else {
            const setCurrentTime = (time: number) =>
                this.consumer.$setCurrentTime({
                    value: time,
                    type: TimeEventChange.Natural,
                });

            if (this.countdown) {
                await this.metronome.fixedCountdown(this.playbackContext.bpm);

                this.stopWatch.start(() => {
                    const elapsedTime = this.stopWatch.getElapsedTime();
                    setCurrentTime(elapsedTime);
                }, currentTime)!;

                this.playbackContext.master.stop();
            } else {
                this.stopWatch.start(() => {
                    const elapsedTime = this.stopWatch.getElapsedTime();
                    setCurrentTime(elapsedTime);

                    this.playbackContext.scheduler.startFrom(
                        msToSeconds(elapsedTime),
                    );
                }, currentTime)!;
            }
        }
    }

    private metronomeLoop() {
        if (this.isMetronomeOn && this.playbackContext.isPlaying) {
            this.metronome.tick(
                this.playbackContext.currentTime,
                this.playbackContext.bpm,
            );
        }

        this.metronomeRafId = requestAnimationFrame(
            this.metronomeLoop.bind(this),
        );
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated?.(_changedProperties);

        if (_changedProperties.has("lastTimeEventChange")) {
            this.playbackContext.scheduler.stop();
        }

        if (this.playbackContext.isPlaying && this.isMetronomeOn) {
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
        this.consumer.$setCurrentTime({
            value: 0,
            type: TimeEventChange.Rewinded,
        });

        this.stopWatch.reset();

        if (this.playbackContext.isPlaying) {
            this.playbackContext.scheduler.reschedule();

            this.stopWatch.start();

            if (this.isMetronomeOn) {
                this.metronome.rewind();
            }
        }
    }

    private handleRecord(): void {
        this.consumer.$toggleIsRecording();
    }

    private get renderIsPlayingIcon(): TemplateResult {
        if (!this.playbackContext.isPlaying) {
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
                        .isActive=${this.playbackContext.isRecording}
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
