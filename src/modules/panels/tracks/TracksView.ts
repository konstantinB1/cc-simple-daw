import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./AddTrackDialog";
import "./PlayheadNode";
import "./TrackViewEvents";
import "./TimeTracker";

import { typography } from "@/global-styles";
import type AudioSource from "@/lib/AudioSource";
import { classMap } from "lit/directives/class-map.js";
import type { TrackEventData } from "./TrackViewEvents";

import { SelectSize, type SelectOption } from "@/components/Select";
import { QuantisizeOptions } from "./Tracks";

export const MAX_TIME_BEATS = 4;
export const BEAT_WIDTH = 70;
export const NEEDLE_START_POS = 131;

export default class TracksView extends LitElement {
    private currentQuantisize: QuantisizeOptions = QuantisizeOptions["1/4"];

    sources!: AudioSource[];

    @state()
    private selectedTrack?: Track;

    @state()
    eventData: TrackEventData[] = [];

    master!: AudioSource;

    @property({ type: Array })
    tracks: Track[] = [];

    static styles = [
        typography,
        css`
            .tracks-container {
                width: 100%;
                min-height: 300px;
                max-height: 600px;
                overflow: hidden;
            }

            .times-container {
                display: flex;
                width: 100%;
                height: 30px;
                margin-left: ${NEEDLE_START_POS}px;
                border-left: 1px solid var(--color-accent);
            }

            .track-pool {
                position: relative;
                width: 100%;
                overflow: auto;
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
                height: 35px;
                padding: 0 5px;
            }

            .sub-track {
                position: sticky;
                left: 0;
                min-width: ${NEEDLE_START_POS - 1}px;
                max-width: ${NEEDLE_START_POS - 1}px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 50;
                background-color: var(--color-primary);
                border-right: 1px solid var(--color-accent);
                border-bottom: 1px solid var(--color-accent);
                border-bottom-left-radius: var(--border-radius);

                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

                &:hover {
                    background-color: var(--color-secondary);
                }
            }

            .muted-button {
                width: 6px;
                height: 6px;
                background-color: var(--color-success);
                border-radius: 50%;
                cursor: pointer;
                margin-right: 8px;
            }

            .track-name {
                font-size: 0.7em;
                margin-left: 5px;
                max-width: 80px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .track-row {
                width: 100%;
                display: flex;
                background-color: var(--color-secondary);
                position: relative;
                border-bottom-left-radius: 100px;
                border-top-left-radius: 100px;
            }

            .tools-bar {
                width: 100%;
                height: 50px;
                background-color: var(--color-primary);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 10px;
            }
        `,
    ];

    private generateCells(id: string): TemplateResult[] {
        const lines = [];
        const quantisizedBeats = this.currentQuantisize;
        const totalBeats = Math.ceil(MAX_TIME_BEATS * BEAT_WIDTH);

        for (let i = 0; i < totalBeats; i += quantisizedBeats) {
            lines.push(
                html`<div id=${id + i} class="typography-300 time-beat"></div>`,
            );
        }

        return lines;
    }

    private setSelectedTrack(track: Track): void {
        this.selectedTrack = track;
    }

    renderQuantisisedTrackCells(
        tracks: Track[] = this.tracks,
        isSub: boolean = false,
    ): TemplateResult[] {
        return tracks.map((track: Track) => {
            const classes = classMap({
                "track-name": true,
                "typography-200": isSub,
                "typography-500": !isSub,
            });

            const rowClasses = classMap({
                "track-row": true,
                "selected-row": this.selectedTrack?.id === track.id,
            });

            return html`
                <div
                    class="${rowClasses}"
                    @click=${() => this.setSelectedTrack(track)}
                >
                    <div class="sub-track">
                        <div class="${classes}">${track.channel.name}</div>
                        <div class="muted-button"></div>
                    </div>
                    <track-event .track=${track as any}></track-event>
                    ${this.generateCells(track.id)}
                </div>
            `;
        });
    }

    private get quantisizeSelectOptions(): SelectOption[] {
        return Object.keys(QuantisizeOptions).map((key) => ({
            label: key,
            value: QuantisizeOptions[key as keyof typeof QuantisizeOptions],
        }));
    }

    connectedCallback(): void {
        super.connectedCallback();
        // window.addEventListener("wheel", this.handleZoomChange, {
        //     passive: false,
        // });
    }

    disconnectedCallback(): void {
        window.removeEventListener("wheel", this.handleZoomChange);
    }

    private handleZoomChange = (event: WheelEvent): void => {
        if (event.deltaY < 0) {
            this.currentQuantisize = Math.max(
                QuantisizeOptions["1/64"],
                this.currentQuantisize / 2,
            );
        } else {
            this.currentQuantisize = Math.min(
                QuantisizeOptions["1/2"],
                this.currentQuantisize * 2,
            );
        }
        event.preventDefault();
    };

    protected render(): TemplateResult {
        return html`
            <div class="tracks-container">
                <div class="tools-bar">
                    <div class="tool-item">
                        <daw-select
                            .size=${SelectSize.Small}
                            .options=${this.quantisizeSelectOptions}
                            .value=${this.currentQuantisize}
                            @change=${(e: CustomEvent) => {
                                this.currentQuantisize = e.detail.value;
                            }}
                        ></daw-select>
                    </div>
                </div>
                <div class="track-pool">
                    <div class="times-container">
                        <time-tracker .currentQuantisize=${4}></time-tracker>
                    </div>
                    <div class="tracks-slots">
                        ${this.renderQuantisisedTrackCells()}
                    </div>
                </div>
            </div>
        `;
    }
}
