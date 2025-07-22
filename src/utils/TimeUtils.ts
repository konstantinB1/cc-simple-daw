import type { PlaybackTime } from "@/types";

export type StopWatchTickCallback = (elapsedTime: number) => void;
export type TempoClockTickCallback = (
    currentTime: number,
    beat: number,
    bar: number,
) => void;

// Legacy StopWatch - kept for backward compatibility
export class StopWatch {
    private startTime: PlaybackTime = 0;
    private elapsedTime: PlaybackTime = 0;
    private requestId: number | null = null;

    // Exposed for testing
    public running: boolean = false;

    start(
        onTick?: StopWatchTickCallback,
        startTime: PlaybackTime = 0,
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
        if (this.running) {
            this.running = false;
            this.elapsedTime += performance.now() - this.startTime;
        }

        if (this.requestId !== null) {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = null;
        }
    }

    pause() {
        if (!this.running) {
            return;
        }

        this.running = false;
        this.elapsedTime += performance.now() - this.startTime;

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

    setElapsedTime(time: PlaybackTime): void {
        this.elapsedTime = time;
        this.startTime = performance.now();
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

export const generateBeatsTimers = (
    bpm: number,
    [start, end]: [number, number] = [4, 4],
) => {
    const beatDuration = 60 / bpm;
    const totalBeats = start * end;
    const timers: number[] = [];

    for (let i = 0; i < totalBeats; i++) {
        timers.push(i * beatDuration);
    }

    return timers;
};

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
