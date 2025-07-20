import AudioBuffer from "@mocks/AudioBuffer";
import "@webcomponents/scoped-custom-element-registry";

export class AudioParam {
    defaultValue!: number;
    value!: number;
    minValue!: number;
    maxValue!: number;

    setValueAtTime(value: number, _startTime: number): void {
        this.value = value;
    }
}

export class GainNode extends EventTarget {
    connect = () => {};
    disconnect = () => {};
    gain = new AudioParam();
    channelCount = 2;
}

export class AudioBufferSource {
    loop = false;
    loopStart = false;
    loopEnd = false;
    detune = 0;
    playbackRate = new AudioParam();

    start() {}
    stop() {}
    connect() {}
}

export class AudioContext {
    currentTime = 0;
    createGain = () => new GainNode();
    createBufferSource = () => new AudioBufferSource();
    decodeAudioData = async () => {
        const buffer = new AudioBuffer({
            length: 44100,
            sampleRate: 44100,
        });

        return buffer;
    };
}

Object.defineProperty(globalThis, "GainNode", {
    value: GainNode,
    writable: true,
    configurable: true,
});

Object.defineProperty(globalThis, "AudioContext", {
    value: AudioContext,
    writable: true,
    configurable: true,
});

Object.defineProperty(globalThis, "AudioBufferSourceNode", {});
