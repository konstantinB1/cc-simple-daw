import type { PlaybackContextStore } from "@/context/playbackContext";
import type AudioSource from "./AudioSource";

export type QueueItemParams = {
    startTime: number;
    endTime?: number;
};

export type QueueItem = {
    audioSource: AudioSource; // The audio source to be played
    params: QueueItemParams; // Parameters for the audio playback
};

export default class Scheduler {
    private playbackQueue: QueueItem[] = [];
    private stopQueue: QueueItem[] = [];

    private interval: NodeJS.Timeout | null = null;

    private store: PlaybackContextStore;

    constructor(store: PlaybackContextStore) {
        this.store = store;

        this.workLoop = this.workLoop.bind(this);
    }

    addToQueue(audioSource: AudioSource, params: QueueItemParams): void {
        this.playbackQueue.push({
            params,
            audioSource,
        });
    }

    start(): void {
        if (this.interval != null) {
            return;
        }

        this.workLoop();
        this.interval = setInterval(this.workLoop, 25);
    }

    reschedule(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        for (const item of this.stopQueue) {
            item.audioSource.stop(0);
        }

        this.playbackQueue = this.stopQueue;
        this.stopQueue = [];

        this.start();
    }

    stop(): void {
        if (!this.interval) {
            return;
        }

        for (const item of this.stopQueue) {
            item.audioSource.stop(0);
        }

        clearInterval(this.interval);

        this.playbackQueue = [];
        this.stopQueue = [];
        this.interval = null;
    }

    private async workLoop(): Promise<void> {
        const currentTime = this.store.audioContext.currentTime;
        const next = this.playbackQueue?.[0];

        if (!next) {
            return;
        }

        const { audioSource, params } = next;

        const endTime = params.endTime
            ? currentTime + params.endTime
            : undefined;

        audioSource.play(currentTime + params.startTime, 0, endTime, false);

        if (params?.endTime && this.store.currentTime >= params.endTime) {
            audioSource.stop(0, true);
        } else {
            this.stopQueue.push({
                audioSource,
                params,
            });
        }

        this.playbackQueue.shift();

        if (this.playbackQueue.length > 0) {
            requestAnimationFrame(this.workLoop);
        }
    }
}
