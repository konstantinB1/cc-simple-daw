import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./BpmPicker";
import "./TimeIndicator";
import Metronome from "./Metronome";

import WithPlaybackContext from "@/mixins/WithPlaybackContext";
import { StopWatch } from "@/utils/TimeUtils";

@customElement("recorder-component")
export default class Recorder extends WithPlaybackContext(LitElement) {
    private metronome!: Metronome;

    @state()
    private isMetronomeOn: boolean = false;

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

    connectedCallback(): void {
        super.connectedCallback();

        this.metronome = new Metronome(
            this.playbackContext.master.audioContext,
        );

        this.metronome.preloadTickSound();
    }

    private toggleMetronome(): void {
        this.isMetronomeOn = !this.isMetronomeOn;
    }

    private handlePlay(): void {
        this.$toggleIsPlaying();

        const isPlaying = !this.playbackContext.isPlaying;

        if (isPlaying) {
            this.stopWatch.stop();
        }

        this.isMetronomeOn && this.playbackContext.isPlaying
            ? this.metronome?.start(this.playbackContext.bpm)
            : this.metronome?.stop();

        if (!isPlaying) {
            this.stopWatch.start(() => {
                this.$setCurrentTime(this.stopWatch.getElapsedTime());
            })!;
        }
    }

    private handleRewind(): void {
        this.$setCurrentTime(0);
        this.stopWatch.reset();

        if (this.playbackContext.isPlaying) {
            this.stopWatch.start(() => {
                this.$setCurrentTime(this.stopWatch.getElapsedTime());
            })!;

            if (this.isMetronomeOn) {
                this.metronome.rewind();
            }
        }
    }

    private handleRecord(): void {
        // if (this.playbackContext.isRecording) {
        //     this.recorderClass?.stop();
        // } else {
        //     this.dest =
        //         this.playbackContext.master.audioContext.createMediaStreamDestination();
        //     this.recorderClass = new AudioRecorder(this.dest.stream);
        //     this.playbackContext.master.audioContext
        //         .createMediaStreamSource(this.dest.stream)
        //         .connect(this.playbackContext.master.audioContext.destination);
        //     this.recorderClass.start();
        // }

        this.$toggleIsRecording();
    }

    private get renderIsPlayingIcon(): TemplateResult {
        if (!this.playbackContext.isPlaying) {
            return html`<play-icon size=${15}></play-icon>`;
        }

        return html`<stop-icon size=${15}></stop-icon>`;
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
                        <rewind-icon size=${20}></rewind-icon>
                    </icon-button>
                    <icon-button size=${40} @handle-click=${this.handlePlay}>
                        ${this.renderIsPlayingIcon}
                    </icon-button>
                    <icon-button size=${40}>
                        <forward-icon size=${20}></forward-icon>
                    </icon-button>
                    <bpm-picker></bpm-picker>
                    <icon-button
                        .isActive=${this.isMetronomeOn}
                        size=${40}
                        @handle-click=${this.toggleMetronome}
                    >
                        <metronome-icon></metronome-icon>
                    </icon-button>
                </div>
            </div>
        `;
    }
}
