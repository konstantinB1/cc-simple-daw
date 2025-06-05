export interface VSTPlugin {
    name: string;
    id: string;
    worklet: AudioWorkletNode;
    category: string;
    version: string;
    description: string;
    parameters: Record<string, any>;
    isActive: boolean;
    activate(): void;
    deactivate(): void;
    process(
        inputs: Float32Array[][],
        outputs: Float32Array[][],
        parameters: Record<string, Float32Array>,
    ): void;
}

export interface VSTInstrument {
    delegateChannelData: (channel: number, data: Float32Array) => void;
}
