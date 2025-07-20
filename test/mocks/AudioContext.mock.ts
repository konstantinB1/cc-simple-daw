import { AudioBufferSource, GainNode } from "../setup";
import AudioBuffer from "./AudioBuffer";

export class AudioContextMocker {
    context: AudioContext;

    constructor(ctx: AudioContext) {
        this.context = ctx;
    }
}

export default class AudioContextMock {
    currentTime = 0;
    createGain = () => new GainNode();
    createBufferSource = () => new AudioBufferSource();
    decodeAudioData = async () => {
        return new AudioBuffer({
            length: 44100,
            sampleRate: 44100,
        });
    };
}
