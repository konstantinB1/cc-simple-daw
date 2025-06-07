import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import type { Track } from "./TracksView";
import { consumeProp } from "@/decorators/sync";
import { playbackContext } from "@/context/playbackContext";
import { styleMap } from "lit/directives/style-map.js";
import { classMap } from "lit/directives/class-map.js";
import { getPlayheadPosition } from "./Tracks";

export type TrackEventData = {
    id: string;
    startTime: number;
    endTime?: number;
};

export type Position = TrackEventData & {
    xStart: number;
    xEnd?: number;
    zIndex: number;
    done?: boolean;
};

export type TrackEventDataEvent = {
    id: string;
    events: TrackEventData[];
};

@customElement("track-event")
export default class TrackEvents extends LitElement {
    @consumeProp({ context: playbackContext, subscribe: true })
    currentTime!: number;

    @consumeProp({ context: playbackContext, subscribe: true })
    isPlaying!: boolean;

    @consumeProp({ context: playbackContext, subscribe: true })
    isRecording!: boolean;

    @consumeProp({ context: playbackContext, subscribe: true })
    bpm!: number;

    @property({ type: Object })
    track!: Track;

    @state()
    events: Position[] = [];

    @state()
    private zIndex = 1;

    @query(".event-container")
    private eventContainer!: HTMLDivElement;

    static styles = [
        css`
            .event-container {
                position: relative;
                width: 100%;
                height: 60%;
            }

            .event {
                position: absolute;
                background: #fd1d1d;
                background: var(--color-tint-primary);
                box-shadow: 0 0px 5 px rgba(0, 0, 0, 0.2);
                border-left: 1px solid var(--color-accent);
                border-radius: 2px;
                min-width: 10px;
            }

            .event-drawing {
                border-right: none;
            }

            .event-done {
                border-right: 1px solid var(--color-accent);
            }
        `,
    ];

    connectedCallback(): void {
        super.connectedCallback();

        this.track.channel.onPlay(({ detail: { id } }) => {
            if (!this.isRecording) {
                return;
            }

            const zIndex = this.zIndex + 1;

            this.events = [
                {
                    id,
                    startTime: this.currentTime,
                    done: false,
                    xStart: getPlayheadPosition(this.bpm, this.currentTime),
                    zIndex,
                },
                ...this.events,
            ];

            this.zIndex = zIndex;
        });

        this.track.channel.onStop(({ detail: { id } }) => {
            if (!this.isRecording) {
                return;
            }

            this.events = this.events.map((ev) => {
                if (ev.id === id && !ev?.done) {
                    return {
                        ...ev,
                        done: true,
                        endTime: this.currentTime,
                        xEnd: getPlayheadPosition(this.bpm, this.currentTime),
                    };
                }

                return ev;
            });
        });
    }

    protected updated(_changedProperties: PropertyValues): void {
        if (_changedProperties.has("currentTime")) {
            Array.from(this.eventContainer.children).forEach(
                this.animateWidth.bind(this),
            );
        }
    }

    private animateWidth(el: Element) {
        const ev = this.events.find((ev) => ev.id === el.id);

        if (!ev) {
            return;
        }

        (el as HTMLElement).style.width =
            ev?.xEnd && ev.done
                ? ev?.xEnd - ev?.xStart + "px"
                : getPlayheadPosition(
                      this.bpm,
                      this.currentTime - ev.startTime,
                  ) + "px";
    }

    override render() {
        return html` <div class="event-container">
            ${this.events.map(({ done, xStart, zIndex, id }) => {
                const styles = styleMap({
                    transform: `translateX(${xStart}px)`,
                    top: "0px",
                    height: "100%",
                    zIndex,
                });

                const classes = classMap({
                    event: true,
                    "event-done": !!done,
                    "event-drawing": !done && this.isRecording,
                });

                return html`<div
                    id=${id}
                    class="${classes}"
                    style=${styles}
                ></div>`;
            })}
        </div>`;
    }
}
