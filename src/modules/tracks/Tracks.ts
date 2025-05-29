import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import type { VSTInstrument } from "../vst/VST";

import "./AddTrackDialog";

import { typography } from "@/global-styles";
import type { DialogEventDetail } from "./AddTrackDialog";

const MAX_TIME_BEATS = 32;

class TrackRecord {
    constructor(
        public id: string,
        public name: string,
        public color: string,
        public beats: number[],
        public vsti: VSTInstrument,
    ) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.beats = beats;
        this.vsti = vsti;
    }
}

export enum QuantisizeOptions {
    "1/2" = 2,
    "1/4" = 4,
    "1/8" = 8,
    "1/16" = 16,
    "1/32" = 32,
    "1/64" = 64,
}

@customElement("tracks-component")
export default class Tracks extends LitElement {
    @property({ type: Array })
    private tracks: TrackRecord[] = [];

    private dialogElement?: HTMLDialogElement;

    private currentQuantisize: QuantisizeOptions = QuantisizeOptions["1/4"];

    private bpm!: number;

    private isPlaying!: boolean;

    @query(".current-time-indicator")
    private currentTimeIndicator?: HTMLDivElement;

    @state()
    private xPosition: number = 0;

    static styles = [
        typography,
        css`
            .tracks-container {
                width: 100%;
                min-height: 300px;
                height: 300px;
            }

            .no-tracks-div {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                gap: 5px;
            }

            .no-track-text {
                margin: 0;
            }

            .times-container {
                display: flex;
                flex-wrap: nowrap;
                width: 100%;
                height: 30px;
            }

            .track-data {
                width: 100px;
            }

            .track-pool {
                position: relative;
                display: flex;
                flex-wrap: nowrap;
                width: 100%;
                overflow: auto;
            }

            .tracks-container {
                display: flex;
                background-color: var(--color-primary);
            }

            .time-beat {
                min-width: 140px;
                height: 30px;
            }

            table {
                border-collapse: collapse;
            }

            table thead th {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font-size: 0.7em;
            }

            .time-beat {
                background-color: var(--color-secondary);
                color: var(--color-white);
                border-right: 1px solid var(--color-accent);
            }

            .current-time-indicator {
                position: absolute;
                width: 1px;
                border-left: 1px solid var(--color-tint-primary);
                height: 100%;
                left: 0;
                top: 0;
            }
        `,
    ];

    private renderTracks() {
        const openDialog = () => {
            this.dialogElement?.showModal();
        };

        if (this.tracks.length === 0) {
            return html`<div class="no-tracks-div">
                <h4 class="no-track-text typography-200">
                    No tracks available.
                </h4>
                <button @click=${openDialog}>Add Track</button>
            </div>`;
        }
    }

    private updateIndicatorPosition() {
        const currentTimeIndicator = this.shadowRoot?.querySelector(
            ".current-time-indicator",
        );

        if (currentTimeIndicator) {
            const currentTime = this.getCurrentTimeInBeats();
            const quantisizedBeats = this.currentQuantisize;
            const position = (currentTime / quantisizedBeats) * 100; // Calculate percentage position

            this.xPosition = position;
        }
    }

    private getCurrentTimeInBeats(): number {
        // calculate the current time in beats based on the BPM and quantisize
        const secondsPerBeat = 60 / this.bpm;
        const currentTimeInSeconds = performance.now() / 1000; // Get current time in seconds
        const currentTimeInBeats = Math.floor(
            currentTimeInSeconds / secondsPerBeat,
        );

        return currentTimeInBeats;
    }

    private setDialogElement({
        detail: { dialogRef },
    }: CustomEvent<DialogEventDetail>): void {
        if (!dialogRef) {
            throw new Error("Dialog element is not provided.");
        }

        this.dialogElement = dialogRef;
    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);

        const changed = Array.from(changedProperties.keys());

        if (changed.includes("bpm") || changed.includes("isPlaying")) {
            this.updateIndicatorPosition();
        }
    }

    private renderTimes() {
        const times = [];

        for (let i = 0; i < MAX_TIME_BEATS; i++) {
            times.push(
                html`<th class="time-beat typography-300">${i + 1}</th>`,
            );
        }

        return times;
    }

    renderQuantisisedLines() {
        const lines = [];
        const quantisizedBeats = this.currentQuantisize;

        for (let i = 0; i < MAX_TIME_BEATS; i += quantisizedBeats) {
            lines.push(
                html`<th class="time-beat typography-300">
                    ${i + 1} - ${i + quantisizedBeats}
                </th>`,
            );
        }

        return lines;
    }

    protected render(): TemplateResult {
        return html`
            <add-track-dialog
                @dialog-ready=${this.setDialogElement}
            ></add-track-dialog>
            <card-component
                card-width="640px"
                .startPos=${[550, 80] as const}
                is-draggable
                card-id="tracks-card"
            >
                <div class="tracks-container">
                    <div class="track-data">qweqw</div>
                    <div class="track-pool">
                        <div class="current-time-indicator"></div>
                        <table>
                            <thead>
                                <tr class="times-container">
                                    ${this.renderQuantisisedLines()}
                                </tr>
                            </thead>
                            <!-- <tbody>
                                ${this.tracks.map(
                                (track) => html`
                                    <tr class="track-row">
                                        <td
                                            class="track-name"
                                            style="background-color: ${track.color}"
                                        >
                                            ${track.name}
                                        </td>
                                        ${track.beats.map(
                                            (beat) => html`
                                                <td
                                                    class="beat-cell"
                                                    style="background-color: ${beat
                                                        ? track.color
                                                        : "transparent"}"
                                                ></td>
                                            `,
                                        )}
                                    </tr>
                                `,
                            )}
                            </tbody> -->
                        </table>
                    </div>
                </div>
            </card-component>
        `;
    }
}
