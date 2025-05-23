import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./BpmPicker";
import Metronome from "./Metronome";

@customElement("recorder-component")
export default class Recorder extends LitElement {
    @property({ type: Boolean })
    isPlaying: boolean = false;

    @property({ type: Number })
    bpm: number = 120;

    private metronome: Metronome = new Metronome();

    @state()
    private isMetronomeOn: boolean = false;

    static styles = [
        css`
            .button-wrapper {
                display: flex;
                gap: 6px;
            }
        `,
    ];

    connectedCallback(): void {
        super.connectedCallback();

        this.metronome.preloadTickSound();
    }

    private toggleMetronome(): void {
        this.isMetronomeOn = !this.isMetronomeOn;
    }

    private handleBpmChange(event: CustomEvent): void {
        this.bpm = event.detail.bpm;

        if (this.isPlaying) {
            this.bpm = event.detail.bpm;
        }
    }

    private handlePlay(): void {
        this.isPlaying = !this.isPlaying;

        this.isMetronomeOn && this.isPlaying
            ? this.metronome.start(this.bpm)
            : this.metronome.stop();
    }

    private get renderIsPlayingIcon(): TemplateResult {
        if (!this.isPlaying) {
            return html`<play-icon size=${15}></play-icon>`;
        }

        return html`<stop-icon size=${15}></stop-icon>`;
    }

    render() {
        return html`
            <div class="container">
                <card-component is-draggable>
                    <div class="button-wrapper">
                        <icon-button size=${40}>
                            <record-icon size=${20}></record-icon>
                        </icon-button>
                        <icon-button
                            size=${40}
                            @handle-click=${this.handlePlay}
                        >
                            ${this.renderIsPlayingIcon}
                        </icon-button>
                        <bpm-picker
                            .bpm=${this.bpm}
                            @bpm-changed=${this.handleBpmChange}
                        ></bpm-picker>
                        <icon-button
                            .isActive=${this.isMetronomeOn}
                            size=${40}
                            @handle-click=${this.toggleMetronome}
                        >
                            <metronome-icon></metronome-icon>
                        </icon-button>
                    </div>
                </card-component>
            </div>
        `;
    }
}
