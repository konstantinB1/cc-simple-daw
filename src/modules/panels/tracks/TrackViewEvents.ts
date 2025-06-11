import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import type { Track } from "./TracksView";
import { consumeProp } from "@/decorators/sync";
import { playbackContext, TimeEventChange } from "@/context/playbackContext";
import { styleMap } from "lit/directives/style-map.js";
import { classMap } from "lit/directives/class-map.js";
import type { PlayEvent, StopEvent } from "@/lib/AudioSource";
import { msToSeconds } from "@/utils/TimeUtils";
import type Scheduler from "@/lib/Scheduler";
import { getPlayheadPosition } from "./TimeTracker";

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
    @consumeProp({ context: playbackContext })
    scheduler!: Scheduler;

    @consumeProp({ context: playbackContext, subscribe: true })
    currentTime!: number;

    @consumeProp({ context: playbackContext, subscribe: true })
    isPlaying!: boolean;

    @consumeProp({ context: playbackContext, subscribe: true })
    isRecording!: boolean;

    @consumeProp({ context: playbackContext, subscribe: true })
    bpm!: number;

    @consumeProp({ context: playbackContext, subscribe: true })
    lastTimeEventChange?: TimeEventChange;

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
                height: 40%;
                display: flex;
            }

            .event {
                position: absolute;
                background: var(--color-tint-primary);
                box-shadow: 0 0px 5 px rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                min-width: 10px;
            }

            .event-drawing {
                border-right: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }

            .event-done {
                border-right: 1px solid var(--color-accent);
            }
        `,
    ];

    connectedCallback(): void {
        super.connectedCallback();

        this.track.channel.onPlay(this.handlePlayEvent.bind(this));
        this.track.channel.onStop(this.handleStopEvent.bind(this));
    }

    updated(
        _changedProperties: PropertyValues<{
            lastTimeEventChange: TimeEventChange;
            currentTime: number;
            isPlaying: boolean;
            isRecording: boolean;
            bpm: number;
            track: Track;
        }>,
    ): void {
        const children = Array.from(this.eventContainer.children);

        if (_changedProperties.has("isPlaying")) {
            this.scheduleEvents();
        }

        if (
            _changedProperties.has("currentTime") &&
            this.isPlaying &&
            this.isRecording
        ) {
            children.forEach(this.animateWidth.bind(this));
        }

        super.updated(_changedProperties);
    }

    private scheduleEvents() {
        if (!this.isPlaying) {
            return;
        }

        this.events.forEach((ev) => {
            const startTime = msToSeconds(ev.startTime);
            const endTime = msToSeconds(ev.endTime ?? 0);

            this.scheduler.addToQueue(this.track.channel, {
                startTime,
                endTime,
            });
        });
    }

    private handlePlayEvent({
        detail: { id, duration },
    }: CustomEvent<PlayEvent>) {
        if (!this.isRecording) {
            return;
        }

        const zIndex = this.zIndex + 1;

        this.events = [
            {
                id,
                startTime: this.currentTime,
                done: false,
                endTime: duration,
                xStart: getPlayheadPosition(this.bpm, this.currentTime),
                zIndex,
            },
            ...this.events,
        ];

        this.zIndex = zIndex;
    }

    private handleStopEvent({ detail: { id } }: CustomEvent<StopEvent>) {
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
