import type { PlaybackTime } from "@/types";
import { debug } from "debug";

export type StopWatchTickCallback = (elapsedTime: number) => void;
export type TempoClockTickCallback = (
    currentTime: number,
    beat: number,
    bar: number,
) => void;

// Legacy StopWatch - kept for backward compatibility
export class StopWatch {
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private running: boolean = false;
    private requestId: number | null = null;

    start(
        onTick?: StopWatchTickCallback,
        startTime: number = 0,
    ): (() => void) | undefined {
        if (this.running) {
            return;
        }

        this.startTime = performance.now();
        this.elapsedTime = startTime;
        this.running = true;

        if (onTick) {
            return this.onTick(onTick.bind(this, this.getElapsedTime()));
        }
    }

    stop() {
        console.log(this);
        if (this.running) {
            this.running = false;
            this.elapsedTime += performance.now() - this.startTime;
        }

        if (this.requestId !== null) {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = null;
        }
    }

    reset() {
        this.elapsedTime = 0;
        this.startTime = 0;
        this.running = false;
    }

    getElapsedTime(): number {
        if (this.running) {
            return this.elapsedTime + (performance.now() - this.startTime);
        }

        return this.elapsedTime;
    }

    private tick(cb: StopWatchTickCallback): void {
        if (!this.running) {
            return;
        }

        cb(this.getElapsedTime());

        this.requestId = window.requestAnimationFrame(this.tick.bind(this, cb));
    }

    onTick(callback: StopWatchTickCallback): () => void {
        if (!this.running) {
            return () => {};
        }

        this.requestId = window.requestAnimationFrame(
            this.tick.bind(this, callback.bind(this, this.getElapsedTime())),
        );

        return () => {
            if (this.requestId !== null) {
                window.cancelAnimationFrame(this.requestId);
                this.requestId = null;
            }
        };
    }
}

// New tempo-aware clock for DAW applications
export class TempoClock {
    private startTime: number = 0;
    private pausedTime: number = 0;
    private running: boolean = false;
    private requestId: number | null = null;
    private timeSignature: [number, number]; // [beats per bar, note value]

    bpm: number;

    constructor(bpm: number = 120, timeSignature: [number, number] = [4, 4]) {
        this.bpm = bpm;
        this.timeSignature = timeSignature;
    }

    start(
        startTime: PlaybackTime = 0,
        onTick?: TempoClockTickCallback,
    ): (() => void) | undefined {
        if (this.running) {
            return;
        }

        this.startTime = performance.now() - this.pausedTime;
        this.running = true;
        this.pausedTime = startTime || 0;

        if (onTick) {
            return this.tick(onTick);
        }
    }

    startFromZero(onTick?: TempoClockTickCallback): (() => void) | undefined {
        if (this.running) {
            return;
        }

        this.startTime = performance.now();
        this.pausedTime = 0;
        this.running = true;

        if (onTick) {
            return this.tick(onTick);
        }
    }

    stop() {
        if (this.running) {
            this.pausedTime = performance.now() - this.startTime;
            this.running = false;
        }

        if (this.requestId !== null) {
            cancelAnimationFrame(this.requestId);
            this.requestId = null;
        }
    }

    reset() {
        this.pausedTime = 0;
        this.startTime = 0;
        this.running = false;

        if (this.requestId !== null) {
            cancelAnimationFrame(this.requestId);
            this.requestId = null;
        }
    }

    setBpm(bpm: number) {
        this.bpm = bpm;
    }

    setTimeSignature(timeSignature: [number, number]) {
        this.timeSignature = timeSignature;
    }

    getCurrentTime(): number {
        if (this.running) {
            return performance.now() - this.startTime;
        }

        return this.pausedTime;
    }

    getCurrentBeat(): number {
        const timeMs = this.getCurrentTime();
        const beatLengthMs = (60 / this.bpm) * 1000;
        return timeMs / beatLengthMs;
    }

    getCurrentBar(): number {
        const beat = this.getCurrentBeat();
        return Math.floor(beat / this.timeSignature[0]);
    }

    getBeatInBar(): number {
        const beat = this.getCurrentBeat();
        return beat % this.timeSignature[0];
    }

    getPosition() {
        const currentTime = this.getCurrentTime();
        const beat = this.getCurrentBeat();
        const bar = this.getCurrentBar();
        const beatInBar = this.getBeatInBar();

        return {
            time: currentTime,
            beat,
            bar,
            beatInBar,
            bpm: this.bpm,
            timeSignature: this.timeSignature,
        };
    }

    private tick(callback: TempoClockTickCallback): () => void {
        const tickLoop = () => {
            if (!this.running) return;

            const position = this.getPosition();
            callback(position.time, position.beat, position.bar);

            this.requestId = requestAnimationFrame(tickLoop);
        };

        this.requestId = requestAnimationFrame(tickLoop);

        return () => {
            if (this.requestId !== null) {
                cancelAnimationFrame(this.requestId);
                this.requestId = null;
            }
        };
    }

    // Convert time to musical position
    timeToPosition(timeMs: number) {
        const beatLengthMs = (60 / this.bpm) * 1000;
        const beat = timeMs / beatLengthMs;
        const bar = Math.floor(beat / this.timeSignature[0]);
        const beatInBar = beat % this.timeSignature[0];

        return { bar, beat: beatInBar, totalBeats: beat };
    }

    // Convert musical position to time
    positionToTime(bar: number, beat: number): number {
        const beatLengthMs = (60 / this.bpm) * 1000;
        const totalBeats = bar * this.timeSignature[0] + beat;
        return totalBeats * beatLengthMs;
    }
}

// Audio Context aware clock for precise timing
export class AudioClock {
    private audioContext: AudioContext;
    private startTime: number = 0;
    private pausedTime: number = 0;
    private running: boolean = false;

    constructor(audioContext: AudioContext) {
        this.audioContext = audioContext;
    }

    start() {
        if (this.running) return;

        this.startTime = this.audioContext.currentTime - this.pausedTime;
        this.running = true;
    }

    stop() {
        if (this.running) {
            this.pausedTime = this.audioContext.currentTime - this.startTime;
            this.running = false;
        }
    }

    reset() {
        this.pausedTime = 0;
        this.startTime = 0;
        this.running = false;
    }

    getCurrentTime(): number {
        if (this.running) {
            return this.audioContext.currentTime - this.startTime;
        }
        return this.pausedTime;
    }

    // Get time in milliseconds for UI display
    getCurrentTimeMs(): number {
        return this.getCurrentTime() * 1000;
    }
}

export const msToSeconds = (ms: number, fixed = 4): number =>
    Number((ms / 1000).toFixed(fixed));

export const secondsToMs = (seconds: number): number => seconds * 1000;

export const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor(ms % 1000);

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
};

export const formatMusicalTime = (
    bar: number,
    beat: number,
    tick: number = 0,
): string => {
    return `${(bar + 1).toString().padStart(3, "0")}.${(Math.floor(beat) + 1).toString().padStart(2, "0")}.${tick.toString().padStart(3, "0")}`;
};
