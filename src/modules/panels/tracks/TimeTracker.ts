import {
    css,
    html,
    LitElement,
    type PropertyValues,
    type TemplateResult,
} from "lit";
import { MAX_TIME_BEATS, BEAT_WIDTH } from "./TracksView";
import { customElement, property, query, state } from "lit/decorators.js";

import { consumeProp } from "@/decorators/sync";
import { playbackContext, TimeEventChange } from "@/context/playbackContext";
import { PlaybackContextConsumerBase } from "@/mixins/WithPlaybackContext";
import { msToSeconds } from "@/utils/TimeUtils";
import { styleMap } from "lit/directives/style-map.js";

export const getPlayheadPosition = (
    bpm: number,
    currentTime: number,
): number => {
    const secondsPerBeat = 60 / bpm;
    const pxPerSecond = 80 / secondsPerBeat;
    return msToSeconds(currentTime) * pxPerSecond;
};

const getCurrentTimeFromPosition = (bpm: number, position: number): number => {
    const secondsPerBeat = 60 / bpm;
    const pxPerSecond = 80 / secondsPerBeat;
    return (position / pxPerSecond) * 1000;
};

@customElement("time-tracker")
export default class TimeTracker extends LitElement {
    @property({ type: Number })
    currentQuantisize!: number;

    @consumeProp({ context: playbackContext, subscribe: true })
    bpm!: number;

    @consumeProp({ context: playbackContext, subscribe: true })
    currentTime!: number;

    @state()
    xPos: number = 0;

    private playbackCtxConsumer = new PlaybackContextConsumerBase(this);

    @state()
    private cachedCells!: TemplateResult[];

    @query(".time-container")
    private container!: HTMLDivElement;

    private seeking: boolean = false;

    static styles = [
        css`
            .time-container {
                width: 100%;
                display: flex;
                cursor: pointer;
            }

            .time-cell {
                display: flex;
                justify-content: flex;
                align-items: center;
                font-size: 0.7em;
                border-bottom: 1px solid var(--color-accent);
                height: 50px;
                padding: 0 5px;
            }
        `,
    ];

    constructor() {
        super();

        this.addEventListener("mouseup", this.mouseUpHandler.bind(this));
        this.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
        this.addEventListener("mousedown", this.mouseDownHandler.bind(this));
    }

    private get xLeft() {
        return this.container.getBoundingClientRect().left;
    }

    protected updated(_changedProperties: PropertyValues): void {
        if (_changedProperties.has("currentTime")) {
            this.xPos = getPlayheadPosition(this.bpm, this.currentTime);
        }

        if (_changedProperties.has("currentQuantisize")) {
            this.renderTimeCells();
        }
    }

    private renderTimeCells() {
        const lines = [];
        const quantisizedBeats = this.currentQuantisize;
        const totalBeats = Math.ceil(MAX_TIME_BEATS * BEAT_WIDTH);

        const styles = styleMap({
            maxWidth: `${BEAT_WIDTH}px`,
            minWidth: `${BEAT_WIDTH}px`,
        });

        for (let i = 0, y = 1; i < totalBeats; i += quantisizedBeats, y++) {
            lines.push(
                html`<div
                    class="typography-300 time-cell"
                    data-cellid=${y}
                    style=${styles}
                >
                    ${i}
                </div>`,
            );
        }

        this.cachedCells = lines;
    }

    private mouseUpHandler() {
        this.seeking = false;
    }

    private mouseMoveHandler(e: MouseEvent) {
        if (this.seeking) {
            const x = e.clientX - this.xLeft;

            const time = x <= 0 ? 0 : getCurrentTimeFromPosition(this.bpm, x);

            this.playbackCtxConsumer.$setCurrentTime({
                value: time,
                type: TimeEventChange.SeekEnd,
            });
        }
    }

    private mouseDownHandler() {
        this.playbackCtxConsumer.$setCurrentTime({
            value: this.currentTime,
            type: TimeEventChange.SeekStart,
        });

        this.seeking = true;
    }

    override render() {
        return html`
            <div
                class="time-container"
                @mousedown=${this.mouseDownHandler}
                @mouseup=${this.mouseUpHandler}
                @click=${this.mouseUpHandler}
            >
                <playhead-node .xPosition=${this.xPos}></playhead-node>
                ${this.cachedCells}
            </div>
        `;
    }
}
