import type { PlaybackContextStore } from "@/context/playbackContext";
import type AudioSource from "./AudioSource";

export type QueueItemParams = {
    startTime: number; // Time in seconds when the audio should start playing
    endTime?: number; // Optional time in seconds when the audio should stop playing
    loop?: boolean; // Whether the audio should loop
    volume?: number; // Volume level for the audio playback
    pitch?: number; // Pitch adjustment for the audio playback
    fadeIn?: number; // Fade-in duration in seconds
    fadeOut?: number; // Fade-out duration in seconds
};

export type QueueItem = {
    audioSource: AudioSource; // The audio source to be played
    params: QueueItemParams; // Parameters for the audio playback
};

export default class Scheduler {
    private master: AudioSource;
    private audioContext: AudioContext;

    private playbackQueue: QueueItem[] = [];
    private stopQueue: QueueItem[] = [];

    private interval: NodeJS.Timeout | null = null;

    constructor(store: PlaybackContextStore) {
        this.audioContext = store.audioContext;
        this.master = store.master;

        this.workLoop = this.workLoop.bind(this);
    }

    addToQueue(audioSource: AudioSource, params: QueueItemParams): void {
        this.playbackQueue.push({
            params,
            audioSource,
        });
    }

    removeFromQueue(source: AudioSource): void {}

    clearQueue(): void {
        this.playbackQueue = [];
        this.interval = null;
    }

    start(): void {
        if (this.interval != null) {
            return;
        }

        this.workLoop();

        this.interval = setInterval(this.workLoop.bind(this), 1);
    }

    stop(): void {
        console.log("Stopping scheduler...", this.interval);
        if (this.interval) {
            for (const item of this.stopQueue) {
                console.log(
                    `Stopping audio source ${item.audioSource.id} at time ${this.audioContext.currentTime}`,
                );
                item.audioSource.stop(0);
            }

            clearInterval(this.interval);
            this.interval = null;

            this.playbackQueue = [];
            this.stopQueue = [];
        }
    }

    private async workLoop(): Promise<void> {
        const currentTime = this.audioContext.currentTime;
        const next = this.playbackQueue?.[0];

        if (!next) {
            return;
        }

        const { audioSource, params } = next;

        audioSource.play(currentTime + params.startTime, 0, undefined, false);
        console.log(
            `Playing audio source ${audioSource.id} at time ${currentTime + params.startTime}`,
        );

        this.playbackQueue.shift();
        this.stopQueue.push({
            audioSource,
            params,
        });

        if (this.playbackQueue.length > 0) {
            requestAnimationFrame(this.workLoop);
        }
    }
}
