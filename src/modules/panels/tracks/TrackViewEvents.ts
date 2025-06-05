import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Track } from "./TracksView";
import { consumeProp } from "@/decorators/sync";
import { playbackContext } from "@/context/playbackContext";
import { msToSeconds } from "@/utils/TimeUtils";
import { styleMap } from "lit/directives/style-map.js";
import { classMap } from "lit/directives/class-map.js";
import { getPlayheadPosition } from "./Tracks";

export type TrackEvent = {
    id: string;
    done?: boolean;
    xEnd?: number;
    xStart?: number;
    zIndex: number;
    startTime?: number;

    isPlaying?: boolean;
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
    events: TrackEvent[] = [];

    @state()
    private zIndex = 1;

    private played = new Set<string>();

    static styles = [
        css`
            .event-container {
                position: relative;
                width: 100%;
                height: 80%;
            }

            .event {
                position: absolute;
                background-color: var(--color-tint-primary);
                box-shadow: 0 0px 10px rgba(0, 0, 0, 0.5);
                border-left: 4px solid var(--color-accent);
            }

            .event-drawing {
                border-right: none;
            }

            .event-done {
                border-right: 1px solid var(--color-accent);
            }
        `,
    ];

    protected updated(_changedProperties: PropertyValues): void {
        super.updated(_changedProperties);

        if (_changedProperties.has("currentTime")) {
            console.log(123);
            if (this.isPlaying) {
                this.playTrack();
            }
        }
    }

    private playTrack() {
        // const currentTime = this.currentTime;
        // this.events.forEach((ev) => {
        //     if (this.played.has(ev.id)) {
        //         return;
        //     }
        //     if (ev.startTime && currentTime > ev.startTime) {
        //         this.played.add(ev.id);
        //         queueMicrotask(() => {
        //             console.log("Playing track", this.track.id, ev.id);
        //             this.track.channel.play(0, 0);
        //         });
        //     }
        //     return ev;
        // });
    }

    connectedCallback(): void {
        super.connectedCallback();

        this.track.channel.onPlay(({ detail: { id, duration } }) => {
            if (!this.isRecording && !this.isPlaying) {
                return;
            }

            const zIndex = this.zIndex + 1;

            this.events = [
                {
                    id,
                    done: false,
                    xStart: getPlayheadPosition(this.bpm, this.currentTime),
                    xEnd: msToSeconds(duration ?? 0),
                    zIndex,
                    startTime: this.currentTime,
                    isPlaying: false,
                },
                ...this.events,
            ];

            this.zIndex = zIndex;
        });

        this.track.channel.onStop(({ detail: { id } }) => {
            if (!this.isRecording && !this.isPlaying) {
                return;
            }

            this.events = this.events.map((ev) => {
                if (ev.id === id) {
                    return {
                        ...ev,
                        done: true,
                        xEnd:
                            getPlayheadPosition(this.bpm, this.currentTime) -
                            (ev.xStart ?? 0),
                    };
                }

                return ev;
            });
        });
    }

    override render() {
        return html` <div class="event-container">
            ${this.events.map(({ xEnd = 0, done, xStart, zIndex }) => {
                const pos = done
                    ? xEnd
                    : getPlayheadPosition(this.bpm, this.currentTime) -
                      (xStart ?? 0);

                const styles = styleMap({
                    transform: `translateX(${xStart}px)`,
                    width: `${pos}px`,
                    top: "0px",
                    height: "100%",
                    zIndex,
                });

                const classes = classMap({
                    event: true,
                    "event-done": !!done,
                    "event-drawing": this.isRecording,
                });

                return html`<div class="${classes}" style=${styles}></div>`;
            })}
        </div>`;
    }
}
