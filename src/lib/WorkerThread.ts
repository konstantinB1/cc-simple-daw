export default class WorkerThread {
    private worker: Worker;

    constructor(workerScript: string) {
        if (typeof Worker === "undefined") {
            throw new Error(
                "Web Workers are not supported in this environment.",
            );
        }

        this.worker = new Worker(workerScript);
    }

    postMessage(message: any): void {
        this.worker.postMessage(message);
    }

    onMessage(callback: (event: MessageEvent) => void): void {
        this.worker.onmessage = callback;
    }

    terminate(): void {
        this.worker.terminate();
    }
}

export class WorkerPool {
    private workers: WorkerThread[] = [];
    private taskQueue: any[] = [];
    private isProcessing: boolean = false;

    constructor(workerScript: string, size: number) {
        for (let i = 0; i < size; i++) {
            this.workers.push(new WorkerThread(workerScript));
        }
    }

    postMessage(message: any): void {
        this.taskQueue.push(message);
        this.processQueue();
    }

    private processQueue(): void {
        if (this.isProcessing || this.taskQueue.length === 0) {
            return;
        }

        this.isProcessing = true;
        const worker = this.workers.shift();

        if (!worker) {
            throw new Error("No available workers in the pool.");
        }

        const task = this.taskQueue.shift();
        worker.postMessage(task);

        worker.onMessage((event) => {
            // Handle the response from the worker
            console.log("Worker response:", event.data);
            this.workers.push(worker);
            this.isProcessing = false;
            this.processQueue();
        });
    }
}
