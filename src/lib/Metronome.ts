import type { GlobalAudioContext } from "@/types";
import AudioSource from "./AudioSource";

export type NextBeatCallback = (
    nextBeatTime: number,
    currentBeat: number,
) => void;

export type MetronomeConfig = {
    ctx: GlobalAudioContext;
    channel: AudioSource;
};

export default class Metronome {
    private rafId: number | null = null;
    private startTime: number = 0;
    private nextBeatTime: number = 0;
    private currentBeat: number = 0;
    private beatInterval: number = 0;

    // Exposed for testing
    public readonly source: AudioSource;

    constructor({ channel, ctx }: MetronomeConfig) {
        this.source = new AudioSource(
            "__metronome__",
            ctx,
            "Metronome",
            channel,
            false,
        );

        channel.addSubChannel(this.source);
    }

    async loadMetronomeSound(src: string): Promise<void> {
        const response = await fetch(src, {
            method: "GET",
            headers: {
                "Content-Type": "audio/wav",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Unable to fetch metronome sound: ${response.statusText}`,
            );
        }

        try {
            const arrayBuffer = await response.arrayBuffer();
            await this.source.load(arrayBuffer);
        } catch (error) {
            throw new Error(`Failed to load metronome sound: ${error}`);
        }
    }

    private scheduleTick(
        bpm: number,
        beatsPerBar: number,
        callback?: NextBeatCallback,
    ): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
        }

        this.beatInterval = (60 / bpm) * 1000; // Convert BPM to milliseconds
        this.startTime = performance.now();
        this.nextBeatTime = this.startTime;
        this.currentBeat = 0;

        const tick = (currentTime: number) => {
            if (currentTime >= this.nextBeatTime) {
                // Keep the metronome on the beat, and only

                if (!this.source.muted) {
                    this.source.play({
                        when: 0,
                        playbackRate: this.currentBeat === 0 ? 1.1 : 1.0,
                    });
                }

                callback?.(this.nextBeatTime, this.currentBeat);
                this.currentBeat = (this.currentBeat + 1) % beatsPerBar;
                this.nextBeatTime += this.beatInterval;
            }

            this.rafId = requestAnimationFrame(tick);
        };

        this.rafId = requestAnimationFrame(tick);
    }

    start(bpm: number, beatsPerBar: number, callback?: NextBeatCallback): void {
        if (!this.source.isLoaded()) {
            throw new Error(
                "Metronome sound not loaded. Call loadMetronomeSound first.",
            );
        }

        this.scheduleTick(bpm, beatsPerBar, callback);
    }

    stop(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        this.nextBeatTime = 0;
    }

    restart(
        bpm: number,
        beatsPerBar: number,
        callback?: NextBeatCallback,
    ): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
        }

        this.start(bpm, beatsPerBar, callback);
    }

    mute(): void {
        this.source.setMuted(true);
    }

    unmute(): void {
        this.source.setMuted(false);
    }
}
