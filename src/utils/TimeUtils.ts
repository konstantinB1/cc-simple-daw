export type StopWatchTickCallback = (elapsedTime: number) => void;

export class StopWatch {
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private running: boolean = false;
    private requestId: number | null = null;

    constructor(startTime: number = 0, elapsedTime: number = 0) {
        this.startTime = startTime;
        this.elapsedTime = elapsedTime;
    }

    start(onTick?: StopWatchTickCallback): (() => void) | undefined {
        if (!this.running) {
            this.startTime = performance.now();
            this.running = true;

            if (onTick) {
                return this.onTick(onTick.bind(this, this.getElapsedTime()));
            }
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

export const msToSeconds = (ms: number, fixed = 4): number =>
    Number((ms / 1000).toFixed(fixed));
