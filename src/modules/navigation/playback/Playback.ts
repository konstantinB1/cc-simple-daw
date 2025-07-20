import {
    css,
    html,
    LitElement,
    type PropertyValues,
    type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";

import "./BpmPicker";
import "./TimeIndicator";

import type { LayeredKeyboardManager } from "@/lib/KeyboardManager";

import { store } from "@/store/AppStore";
import WatchController, { storeSubscriber } from "@/store/StoreLit";
import Metronome from "@/lib/Metronome";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import IconButton from "@/components/IconButton";
import RecordIcon from "@/components/icons/RecordIcon";
import RewindIcon from "@/components/icons/RewindIcon";
import BpmPicker from "./BpmPicker";
import MetronomeIcon from "@/components/icons/MetronomeIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import StopIcon from "@/components/icons/StopIcon";

export default class PlaybackElement extends ScopedRegistryHost(LitElement) {
    static elementDefinitions = {
        "icon-button": IconButton,
        "record-icon": RecordIcon,
        "rewind-icon": RewindIcon,
        "metronome-icon": MetronomeIcon,
        "clock-icon": ClockIcon,
        "play-icon": PlayIcon,
        "stop-icon": StopIcon,
        "bpm-picker": BpmPicker,
    };

    @property({ type: Object })
    keyboardManager!: LayeredKeyboardManager;

    private metronome!: Metronome;

    @state()
    private isMetronomeOn: boolean = false;

    @state()
    private countdown: boolean = false;

    @state()
    private beatsPerBar: number = 4;

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
            if (!this.metronome) {
                return;
            }

            if (isPlaying && this.isMetronomeOn) {
                this.metronome.start(this.state.bpm, this.beatsPerBar);
            } else {
                this.metronome.stop();
            }
        },
        "playback.bpm": (bpm: number) => {
            if (this.isMetronomeOn) {
                this.metronome.restart(bpm, this.beatsPerBar);
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

    async connectedCallback(): Promise<void> {
        super.connectedCallback();

        this.metronome = new Metronome({
            channel: store.master,
            ctx: store.ctx,
        });

        this.metronome.loadMetronomeSound(
            "/cc-simple-daw/assets/sounds/metronome-tick.wav",
        );

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

    protected updated(_changedProperties: PropertyValues): void {
        super.updated(_changedProperties);

        if (_changedProperties.has("isMetronomeOn")) {
            if (this.isMetronomeOn) {
                this.metronome.unmute();
            } else {
                this.metronome.mute();
            }
        }
    }

    private toggleMetronome(): void {
        this.isMetronomeOn = !this.isMetronomeOn;
    }

    private async handlePlay(): Promise<void> {
        const isPlaying = this.state.isPlaying;

        if (isPlaying) {
            this.metronome.stop();
            store.stopPlayback();
        } else {
            this.metronome.start(this.state.bpm, this.beatsPerBar);

            store.startPlayback();
        }
    }

    private handleRewind(): void {
        store.rewind();

        if (this.state.isPlaying) {
            store.scheduler.reschedule();

            if (this.isMetronomeOn) {
                console.log("Rewinding metronome", this.state.bpm);
                this.metronome.stop();
                this.metronome.start(this.state.bpm, this.beatsPerBar);
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
