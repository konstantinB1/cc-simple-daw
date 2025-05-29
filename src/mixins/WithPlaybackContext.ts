import {
    playbackContext,
    PlaybackContextStore,
} from "@/context/playbackContext";
import { consume } from "@lit/context";
import { LitElement } from "lit";
import { state } from "lit/decorators.js";

type Constructor<T = {}> = new (...args: any[]) => T;

const WithPlaybackContext = <T extends Constructor<LitElement>>(
    superClass: T,
) => {
    class PlaybackContextConsumer extends superClass {
        @consume({ context: playbackContext, subscribe: true })
        @state()
        protected playbackContext!: PlaybackContextStore;

        protected $setBpm(bpm: number) {
            this.dispatchEvent(
                new CustomEvent<number>("playback-context/bpm", {
                    detail: bpm,
                    bubbles: true,
                    composed: true,
                }),
            );
        }

        protected $play() {
            this.dispatchEvent(
                new CustomEvent("playback-context/play", {
                    bubbles: true,
                    composed: true,
                }),
            );
        }

        protected $stop() {
            this.dispatchEvent(
                new CustomEvent("playback-context/stop", {
                    bubbles: true,
                    composed: true,
                }),
            );
        }

        protected $toggleIsPlaying() {
            this.dispatchEvent(
                new CustomEvent("playback-context/toggle-is-playing", {
                    bubbles: true,
                    composed: true,
                }),
            );
        }

        protected $toggleIsRecording() {
            this.dispatchEvent(
                new CustomEvent("playback-context/record", {
                    bubbles: true,
                    composed: true,
                }),
            );
        }

        protected $setCurrentTime(currentTime: number) {
            this.dispatchEvent(
                new CustomEvent<number>("playback-context/set-current-time", {
                    detail: currentTime,
                    bubbles: true,
                    composed: true,
                }),
            );
        }
    }

    return PlaybackContextConsumer as unknown as T &
        Constructor<PlaybackContextConsumer>;
};

export default WithPlaybackContext;
