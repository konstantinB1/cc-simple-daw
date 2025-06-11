import {
    playbackContext,
    PlaybackContextStore,
    type TimeChangeEvent,
} from "@/context/playbackContext";
import type AudioSource from "@/lib/AudioSource";
import type { Constructor } from "@/utils/types";
import { consume } from "@lit/context";
import { LitElement } from "lit";
import { state } from "lit/decorators.js";

// Standalone, reusable event dispatcher
export class PlaybackContextConsumerBase {
    protected host: LitElement;

    constructor(host: LitElement) {
        this.host = host;
    }

    $setBpm(bpm: number) {
        this.host.dispatchEvent(
            new CustomEvent<number>("playback-context/bpm", {
                detail: bpm,
                bubbles: true,
                composed: true,
            }),
        );
    }

    $play() {
        this.host.dispatchEvent(
            new CustomEvent("playback-context/play", {
                bubbles: true,
                composed: true,
            }),
        );
    }

    $addChannel(...channel: AudioSource[]) {
        this.host.dispatchEvent(
            new CustomEvent<AudioSource[]>("playback-context/add-channel", {
                detail: channel,
                bubbles: true,
                composed: true,
            }),
        );
    }

    $stop() {
        this.host.dispatchEvent(
            new CustomEvent("playback-context/stop", {
                bubbles: true,
                composed: true,
            }),
        );
    }

    $toggleIsPlaying() {
        this.host.dispatchEvent(
            new CustomEvent("playback-context/toggle-is-playing", {
                bubbles: true,
                composed: true,
            }),
        );
    }

    $toggleIsRecording() {
        this.host.dispatchEvent(
            new CustomEvent("playback-context/record", {
                bubbles: true,
                composed: true,
            }),
        );
    }

    $setCurrentTime(ev: TimeChangeEvent) {
        this.host.dispatchEvent(
            new CustomEvent<TimeChangeEvent>(
                "playback-context/set-current-time",
                {
                    detail: ev,
                    bubbles: true,
                    composed: true,
                },
            ),
        );
    }

    $onBpmChange(callback: (bpm: number) => void) {
        this.host.addEventListener("playback-context/bpm", (event: Event) => {
            callback((event as CustomEvent<number>).detail);
        });
    }

    $onCurrentTimeChange(callback: (currentTime: number) => void) {
        this.host.addEventListener(
            "playback-context/set-current-time",
            (event: Event) => {
                callback((event as CustomEvent<number>).detail);
            },
        );
    }
}

export const WithPlaybackContextConsumer = <T extends Constructor<LitElement>>(
    superClass: T,
) => {
    class PlaybackContextConsumer extends superClass {
        public consumer = new PlaybackContextConsumerBase(this);
    }

    return PlaybackContextConsumer as unknown as T &
        Constructor<PlaybackContextConsumer>;
};

export const WithPlaybackContext = <T extends Constructor<LitElement>>(
    superClass: T,
) => {
    class PlaybackContextConsumer extends superClass {
        @consume({ context: playbackContext, subscribe: true })
        @state()
        protected playbackContext!: PlaybackContextStore;

        public consumer = new PlaybackContextConsumerBase(this);
    }

    return PlaybackContextConsumer as unknown as T &
        Constructor<PlaybackContextConsumer>;
};

export default WithPlaybackContext;
