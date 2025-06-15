import { WorkerPool } from "./WorkerThread";

export default class AudioLoader {
    parallelWorkers: number = 4; // Number of parallel workers
    data: ArrayBuffer[] = [];
    private pool = new WorkerPool(
        new URL("./workers/audioLoader.worker.ts", import.meta.url).href,
        4,
    );
}
