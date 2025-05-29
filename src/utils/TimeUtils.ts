export class StopWatch {
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private running: boolean = false;
    private requestId: number | null = null;

    start(
        onTick?: () => void,
        interval: number = 20,
    ): (() => void) | undefined {
        if (!this.running) {
            this.startTime = performance.now();
            this.running = true;

            if (onTick && interval) {
                return this.onTick(onTick);
            }
        }
    }

    stop() {
        if (this.running) {
            this.running = false;
            this.elapsedTime += performance.now() - this.startTime;
            console.log("Stopwatch stopped at:", this.getElapsedTime());
        }

        if (this.requestId !== null) {
            console.log("Cancelling animation frame:", this.requestId);
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

    private tick(cb: () => void = () => {}): void {
        if (!this.running) {
            return;
        }

        cb();

        this.requestId = window.requestAnimationFrame(this.tick.bind(this, cb));
    }

    public onTick(callback: () => void): () => void {
        console.log(this.running);
        if (!this.running) return () => {};
        this.requestId = window.requestAnimationFrame(
            this.tick.bind(this, callback),
        );

        return () => {
            if (this.requestId !== null) {
                window.cancelAnimationFrame(this.requestId);
                this.requestId = null;
            }
        };
    }
}
