interface IAudioEffect {
    process: (input: Float32Array, output: Float32Array) => void;
    reset: () => void;
    result: Float32Array;
}

export default class AudioEffect implements IAudioEffect {
    readonly result: Float32Array;

    constructor(bufferSize: number) {
        this.result = new Float32Array(bufferSize);
    }

    process(_input: Float32Array): void {
        // Default implementation does nothing
    }

    reset(): void {
        // Default implementation does nothing
        this.result.fill(0);
    }
}
