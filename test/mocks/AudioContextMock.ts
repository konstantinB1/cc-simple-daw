import { AudioBufferSource, GainNode } from "../setup";

export default class AudioContextMock implements AudioContext {
    baseLatency!: number;
    outputLatency!: number;
    close(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createMediaElementSource(
        mediaElement: HTMLMediaElement,
    ): MediaElementAudioSourceNode {}

    createMediaStreamDestination(): MediaStreamAudioDestinationNode {
        throw new Error("Method not implemented.");
    }
    createMediaStreamSource(
        mediaStream: MediaStream,
    ): MediaStreamAudioSourceNode {
        throw new Error("Method not implemented.");
    }
    getOutputTimestamp(): AudioTimestamp {
        throw new Error("Method not implemented.");
    }
    resume(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    suspend(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addEventListener(
        type: unknown,
        listener: unknown,
        options?: unknown,
    ): void {
        throw new Error("Method not implemented.");
    }
    removeEventListener(
        type: unknown,
        listener: unknown,
        options?: unknown,
    ): void {
        throw new Error("Method not implemented.");
    }
    audioWorklet: AudioWorklet;
    destination: AudioDestinationNode;
    listener: AudioListener;
    onstatechange: ((this: BaseAudioContext, ev: Event) => any) | null;
    sampleRate: number;
    state: AudioContextState;
    createAnalyser(): AnalyserNode {
        throw new Error("Method not implemented.");
    }
    createBiquadFilter(): BiquadFilterNode {
        throw new Error("Method not implemented.");
    }
    createBuffer(
        numberOfChannels: number,
        length: number,
        sampleRate: number,
    ): AudioBuffer {
        throw new Error("Method not implemented.");
    }
    createBufferSource(): AudioBufferSourceNode {
        throw new Error("Method not implemented.");
    }
    createChannelMerger(numberOfInputs?: number): ChannelMergerNode {
        throw new Error("Method not implemented.");
    }
    createChannelSplitter(numberOfOutputs?: number): ChannelSplitterNode {
        throw new Error("Method not implemented.");
    }
    createConstantSource(): ConstantSourceNode {
        throw new Error("Method not implemented.");
    }
    createConvolver(): ConvolverNode {
        throw new Error("Method not implemented.");
    }
    createDelay(maxDelayTime?: number): DelayNode {
        throw new Error("Method not implemented.");
    }
    createDynamicsCompressor(): DynamicsCompressorNode {
        throw new Error("Method not implemented.");
    }
    createGain(): globalThis.GainNode {
        throw new Error("Method not implemented.");
    }
    createIIRFilter(feedforward: unknown, feedback: unknown): IIRFilterNode {
        throw new Error("Method not implemented.");
    }
    createOscillator(): OscillatorNode {
        throw new Error("Method not implemented.");
    }
    createPanner(): PannerNode {
        throw new Error("Method not implemented.");
    }
    createPeriodicWave(
        real: unknown,
        imag: unknown,
        constraints?: unknown,
    ): PeriodicWave {
        throw new Error("Method not implemented.");
    }
    createScriptProcessor(
        bufferSize?: number,
        numberOfInputChannels?: number,
        numberOfOutputChannels?: number,
    ): ScriptProcessorNode {
        throw new Error("Method not implemented.");
    }
    createStereoPanner(): StereoPannerNode {
        throw new Error("Method not implemented.");
    }
    createWaveShaper(): WaveShaperNode {
        throw new Error("Method not implemented.");
    }
    dispatchEvent(event: Event): boolean {
        throw new Error("Method not implemented.");
    }
    currentTime = 0;
    decodeAudioData = async () => {
        return new AudioBuffer({
            length: 44100,
            sampleRate: 44100,
        });
    };
}
