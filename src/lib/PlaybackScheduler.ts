import type AudioSource from "./AudioSource";
import type { GlobalAudioContext, PlaybackTime } from "@/types";

export type QueueItemParams = {
    startTime: number;
    endTime?: number;
    id: string;
    scheduled?: boolean;
    isPlaying?: boolean;
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
export default class PlaybackScheduler {
    private audioContext: GlobalAudioContext;
    private playbackQueue: QueueItem[] = [];
    private stopQueue: QueueItem[] = [];

    private lookahead: number;

    private prevTimeWindow: PlaybackTime = 0;

    constructor(ctx: AudioContext, lookahead: number = 0.1) {
        this.audioContext = ctx;
        this.lookahead = lookahead;
    }

    // Every play event will have a unique ID, so there is no need to
    // check for duplicates in the queue, but just skip it since its
    // guaranteed to be the same event
    private hasId(id: string): boolean {
        return this.playbackQueue.some((item) => item.params.id === id);
    }

    private getItemIndex(id: string): number {
        return this.playbackQueue.findIndex((item) => item.params.id === id);
    }

    addToQueue(audioSource: AudioSource, params: QueueItemParams): void {
        if (this.hasId(params.id)) {
            const id = this.getItemIndex(params.id);
            this.playbackQueue.splice(id, 1, { audioSource, params });
        } else {
            this.playbackQueue.push({
                params,
                audioSource,
            });
        }
    }

    // Sync with external clock (Stopwatch) so we don't need
    // to use pooling to check for changes, but rather rely
    // on real time updates for the queue scheduling
    // This method needs to be called on each "tick" of the clock
    // (ie window.requestAnimationFrame + performance.now())
    startFrom(currentTime: PlaybackTime): void {
        if (this.prevTimeWindow === 0) {
            // If this is the first call, we need to reset the previous time window
            this.prevTimeWindow = currentTime;
        }

        this.playbackQueue.forEach((cur) => {
            if (
                !cur.params.scheduled &&
                cur.params.startTime < currentTime + this.lookahead &&
                cur.params.startTime >= this.prevTimeWindow
            ) {
                this.tick(currentTime, cur);
                cur.params.scheduled = true;
            }
        });

        this.prevTimeWindow = currentTime + this.lookahead;
    }

    private tick(
        currentTime: number,
        next: QueueItem | undefined = this.playbackQueue?.[0],
    ): void {
        const { audioSource, params } = next;

        const ctxTime = this.audioContext.currentTime;

        // Schedule at the correct offset relative to AudioContext
        const when = ctxTime + (params.startTime - currentTime);
        const endTime = params.endTime;

        audioSource.play({
            when,
            offset: 0,
            duration: endTime,
            emitEvents: false,
        });

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
        this.stopAndReschedule();
    }

    private stopAndReschedule(): void {
        this.prevTimeWindow = 0;
        this.playbackQueue = this.playbackQueue.map((item) => {
            if (item.params.scheduled) {
                item.audioSource.stop(0);
            }

            return {
                ...item,
                params: {
                    ...item.params,
                    scheduled: false,
                },
            };
        });
    }

    stop(): void {
        this.stopAndReschedule();
    }
}
