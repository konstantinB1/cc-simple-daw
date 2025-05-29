export default class MasterAudio {
    public audioContext: AudioContext;

    constructor() {
        this.audioContext = new AudioContext();
    }

    gainNode(): GainNode {
        return this.audioContext.createGain();
    }

    destination(): AudioDestinationNode {
        return this.audioContext.destination;
    }

    streamDestination(): MediaStreamAudioDestinationNode {
        const dest = this.audioContext.createMediaStreamDestination();

        MasterAudio.connect(dest, this.audioContext.destination);

        return dest;
    }

    static connect(source: AudioNode, destination: AudioNode): void {
        source.connect(destination);
    }
}
