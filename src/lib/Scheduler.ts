import type { PlaybackContextStore } from "@/context/playbackContext";
import type AudioSource from "./AudioSource";

export type QueueItemParams = {
    startTime: number;
    endTime?: number;
};

export type QueueItem = {
    audioSource: AudioSource;
    params: QueueItemParams;
};

// Contains logic for scheduling playback of audio sources
// By itself it does not handle actual time measurement, as it
// relies on external clock (Stopwatch) to provide current time
// This way we keep the clock separate from the scheduling logic
// because the clock need to be used by Lit context consumers
export default class Scheduler {
    private playbackQueue: QueueItem[] = [];
    private stopQueue: QueueItem[] = [];

    private store: PlaybackContextStore;

    private lookahead: number;

    private interval?: NodeJS.Timeout;

    constructor(store: PlaybackContextStore, lookahead: number = 0.2) {
        this.store = store;
        this.lookahead = lookahead;
    }

    addToQueue(audioSource: AudioSource, params: QueueItemParams): void {
        this.playbackQueue.push({
            params,
            audioSource,
        });
    }

    // Sync with external clock (Stopwatch) so we don't need
    // to use pooling to check for changes, but rather rely
    // on real time updates for the queue scheduling
    // This method needs to be called on each "tick" of the clock
    // (ie window.requestAnimationFrame + performance.now())
    startWithSyncedClock(currentTime: number): void {
        let next: QueueItem = this.playbackQueue?.[0];

        while (next) {
            this.tick(currentTime, next);
            next = this.playbackQueue.shift() as QueueItem;
        }
    }

    private tick(
        currentTime: number,
        next: QueueItem | undefined = this.playbackQueue?.[0],
    ): void {
        const { audioSource, params } = next;

        const ctxTime = this.store.audioContext.currentTime;
        const endTime = params.endTime
            ? ctxTime + params.endTime - params.startTime
            : undefined;

        audioSource.play(ctxTime + params.startTime, 0, endTime, false);

        if (params?.endTime && currentTime > params.endTime) {
            audioSource.stop(0);
        } else {
            this.stopQueue.push({
                audioSource,
                params,
            });
        }
    }

    reschedule(): void {
        for (const item of this.stopQueue) {
            item.audioSource.stop(0);
        }

        this.playbackQueue = this.stopQueue;
        this.stopQueue = [];
    }

    stop(): void {
        if (this.interval) {
            clearTimeout(this.interval);
            this.interval = undefined;
            console.log("Scheduler stopped");
        }

        for (const item of this.stopQueue) {
            item.audioSource.stop(0);
        }

        this.playbackQueue = [];
        this.stopQueue = [];
    }
}
