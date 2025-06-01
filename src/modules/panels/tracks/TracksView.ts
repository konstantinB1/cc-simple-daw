import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./AddTrackDialog";
import "./TracksCanvas";

import { typography } from "@/global-styles";
import type { DialogEventDetail } from "./AddTrackDialog";
import { styleMap } from "lit/directives/style-map.js";
import WithPlaybackContext from "@/mixins/WithPlaybackContext";
import { msToSeconds } from "@/utils/TimeUtils";
import type { VSTInstrument } from "@/modules/vst/VST";
import type PanelScreenManager from "@/lib/PanelScreenManager";

const MAX_TIME_BEATS = 8;
const BEAT_WIDTH = 40;
const TRACK_SLOTS = 10;

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
export default class TracksView extends WithPlaybackContext(LitElement) {
    @property({ type: Array })
    private tracks: TrackRecord[] = [];

    private dialogElement?: HTMLDialogElement;

    private currentQuantisize: QuantisizeOptions = QuantisizeOptions["1/4"];

    screenManagerInstance!: PanelScreenManager;

    static styles = [
        typography,
        css`
            .tracks-container {
                width: 100%;
                min-height: 300px;
                height: 100%;
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
                width: 180px;
            }

            .track-pool {
                position: relative;
                flex-wrap: nowrap;
                width: 100%;
                overflow: auto;
            }

            .tracks-container {
                display: flex;
                background-color: var(--color-primary);
            }

            .time-beat {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font-size: 0.7em;
                border-right: 1px solid var(--color-accent);
                border-bottom: 1px solid var(--color-accent);
                min-width: ${BEAT_WIDTH}px;
                max-width: ${BEAT_WIDTH}px;
                background-color: var(--color-secondary);
                height: 100%;
                padding-left: 10px;
            }

            .track-row {
                height: 50px;
                display: flex;
                flex-wrap: nowrap;
                width: 100%;
                border-bottom: 1px solid var(--color-accent);
                position: relative;
                background-color: var(--color-secondary);
            }

            .current-time-indicator {
                position: absolute;
                width: 1px;
                border-left: 1px solid var(--color-tint-primary);
                height: 100%;
                z-index: 10;
            }
        `,
    ];

    private setDialogElement({
        detail: { dialogRef },
    }: CustomEvent<DialogEventDetail>): void {
        if (!dialogRef) {
            throw new Error("Dialog element is not provided.");
        }

        this.dialogElement = dialogRef;
    }

    renderQuantisisedLines() {
        const lines = [];
        const quantisizedBeats = this.currentQuantisize;
        const totalBeats = Math.ceil(MAX_TIME_BEATS * BEAT_WIDTH);

        for (let i = 0; i < totalBeats; i += quantisizedBeats) {
            lines.push(html`<div class="typography-300 time-beat">${i}</div>`);
        }

        return lines;
    }

    renderQuantisisedTrackCells() {
        const lines = [];
        const quantisizedBeats = this.currentQuantisize;
        const totalBeats = Math.ceil(MAX_TIME_BEATS * BEAT_WIDTH);

        for (let i = 0; i < totalBeats; i += quantisizedBeats) {
            lines.push(html`<div class="typography-300 time-beat"></div>`);
        }

        return lines;
    }

    private renderTimeIndicator() {
        return html`<div
            class="current-time-indicator"
            style=${styleMap({
                transform: `translateX(${this.getPlayheadPosition()}px)`,
            })}
        ></div>`;
    }

    private getPlayheadPosition(): number {
        const secondsPerBeat = 60 / this.playbackContext.bpm;
        const pxPerSecond = 51 / secondsPerBeat;

        return msToSeconds(this.playbackContext.currentTime) * pxPerSecond;
    }

    private renderTrackSlots(): TemplateResult[] {
        const slots: TemplateResult[] = [];

        for (let i = 0; i < TRACK_SLOTS; i++) {
            slots.push(
                html`<div class="track-row">
                    ${this.renderQuantisisedTrackCells()}
                </div>`,
            );
        }

        return slots;
    }

    protected render(): TemplateResult {
        return html`
            <add-track-dialog
                @dialog-ready=${this.setDialogElement}
            ></add-track-dialog>
            <div class="tracks-container">
                <div class="track-data">qweqw</div>
                <div class="track-pool">
                    ${this.renderTimeIndicator()}
                    <div class="times-container">
                        ${this.renderQuantisisedLines()}
                    </div>
                    <div class="tracks-slots">${this.renderTrackSlots()}</div>
                </div>
            </div>
        `;
    }
}
