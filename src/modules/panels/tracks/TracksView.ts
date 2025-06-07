import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./AddTrackDialog";
import "./PlayheadNode";
import "./TrackViewEvents";

import { typography } from "@/global-styles";
import WithAudioChannelsContext from "@/mixins/WithAudioChannels";
import type AudioSource from "@/lib/AudioSource";
import { classMap } from "lit/directives/class-map.js";
import { NEEDLE_START_POS } from "./PlayheadNode";
import type { TrackEventData, TrackEventDataEvent } from "./TrackViewEvents";

const MAX_TIME_BEATS = 4;
const BEAT_WIDTH = 70;

export class Track {
    channel: AudioSource;

    id: string;

    parent?: Track;

    constructor(channel: AudioSource, parent?: Track) {
        this.channel = channel;
        this.id = channel.id;
        this.parent = parent;
    }

    mute(): void {
        this.channel.setMuted(true);
    }

    unmute(): void {
        this.channel.setMuted(false);
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

@customElement("tracks-view")
export default class TracksView extends WithAudioChannelsContext(LitElement) {
    private currentQuantisize: QuantisizeOptions = QuantisizeOptions["1/4"];

    @state()
    private selectedTrack?: Track;

    @state()
    eventData: TrackEventData[] = [];

    static styles = [
        typography,
        css`
            .tracks-container {
                width: 100%;
                min-height: 300px;
                max-height: 500px;
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

            .tracks-container {
                display: flex;
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

            .time-cell {
                display: flex;
                justify-content: flex;
                align-items: center;
                font-size: 0.7em;
                border-bottom: 1px solid var(--color-accent);
                min-width: ${BEAT_WIDTH}px;
                max-width: ${BEAT_WIDTH}px;
                height: 50px;
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

            .selected-row {
                border: 1px solid var(--color-tint-primary);
                border-left: 0;
            }

            .selected {
                border: 1px solid var(--color-tint-primary);
            }
        `,
    ];

    private get tracks(): Track[] {
        return this.audioChannels.channels.flatMap((channel: AudioSource) => {
            const track = new Track(channel);

            return [
                track,
                ...(channel.subChannels?.map((subChannel) => {
                    return new Track(subChannel, track);
                }) || []),
            ];
        });
    }

    renderQuantisisedLines() {
        const lines = [];
        const quantisizedBeats = this.currentQuantisize;
        const totalBeats = Math.ceil(MAX_TIME_BEATS * BEAT_WIDTH);

        for (let i = 0; i < totalBeats; i += quantisizedBeats) {
            lines.push(html`<div class="typography-300 time-cell">${i}</div>`);
        }

        return lines;
    }

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

    private getEventDataForTrack({
        detail: { id, events },
    }: CustomEvent<TrackEventDataEvent>): void {
        console.log("Upcoming events for track:", id, events);
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
                    <track-event
                        @upcoming-events=${this.getEventDataForTrack}
                        .track=${track as any}
                    ></track-event>
                    ${this.generateCells(track.id)}
                </div>
            `;
        });
    }

    protected render(): TemplateResult {
        return html`
            <div class="tracks-container">
                <div class="track-pool">
                    <playhead-node></playhead-node>
                    <div class="times-container">
                        ${this.renderQuantisisedLines()}
                    </div>
                    <div class="tracks-slots">
                        ${this.renderQuantisisedTrackCells()}
                    </div>
                </div>
            </div>
        `;
    }
}
