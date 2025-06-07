import { generateUUID } from "@/utils/uuid";
import type AudioEffect from "./AudioEffect";
import AudioSample from "./AudioSample";

export type PlayEvent = {
    id: string;
    when: number;
    offset: number;
    duration?: number;
    isPlaying?: boolean;
};

export type StopEvent = {
    id: string;
    isPlaying: boolean;
};

// AudioChannel is responsible for separation of audio channels
// from WebAudio API into more coherent structure, so it can be used
// with pub/sub system for communication between different parts of the application.
// AudioChannel is a base class for multiple parts of the app such as
// mixer, tracks sequencer, and all VSTs that need to handle audio data.
export default class AudioChannel extends EventTarget {
    private ctx: AudioContext;

    id: string;

    name?: string;

    effects: AudioEffect[] = [];

    buffer?: AudioBuffer;

    muted: boolean = false;

    private gainNode?: GainNode;

    subChannels: AudioChannel[] = [];

    master?: AudioChannel;

    source: AudioSample;

    private bufferSource?: AudioBufferSourceNode;

    public isPlaying: boolean = false;

    constructor(
        id: string,
        ctx: AudioContext,
        name?: string,
        master?: AudioChannel,
    ) {
        super();

        this.ctx = ctx;
        this.id = id;
        this.name = name;
        this.master = master;

        this.source = new AudioSample(ctx);

        if (this.master) {
            this.getGainNode.connect(this.master.getGainNode);
        } else {
            this.getGainNode.connect(this.ctx.destination);
        }
    }

    get getGainNode(): GainNode {
        if (!this.gainNode) {
            this.gainNode = this.ctx.createGain();
        }

        return this.gainNode;
    }

    get isLoaded(): boolean {
        return this.buffer !== undefined;
    }

    setVolume(volume: number): void {
        const gain = this.getGainNode;
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);

        this.dispatchEvent(
            new CustomEvent("volumeChange", { detail: { volume } }),
        );
    }

    setMuted(muted: boolean): void {
        this.muted = muted;

        if (muted) {
            this.getGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        } else {
            this.getGainNode.gain.setValueAtTime(1, this.ctx.currentTime);
        }

        this.dispatchEvent(
            new CustomEvent("muteChange", { detail: { muted } }),
        );
    }

    async load(sample: ArrayBuffer): Promise<void> {
        const audioBuffer = await this.source.load(sample);

        if (!audioBuffer) {
            throw new Error("Failed to load audio sample");
        }

        this.buffer = audioBuffer;

        this.dispatchEvent(
            new CustomEvent("sampleLoaded", {
                detail: { sample: audioBuffer },
            }),
        );
    }

    async play(
        when: number = this.ctx.currentTime,
        offset: number = 0,
        duration?: number,
        emitEvents: boolean = true,
        loopStart?: number,
        loopEnd?: number,
        onStart?: () => void,
        onEnd?: () => void,
    ): Promise<void> {
        if (!this.buffer) {
            throw new Error("No sample loaded to play");
        }

        if (this.muted) {
            return Promise.resolve();
        }

        this.bufferSource = this.ctx.createBufferSource();
        this.bufferSource.buffer = this.buffer;

        this.bufferSource.connect(this.getGainNode);

        this.bufferSource.start(when, offset, duration);

        onStart?.();

        this.isPlaying = true;

        if (loopStart !== undefined && loopEnd !== undefined) {
            this.bufferSource.loop = true;
            this.bufferSource.loopStart = loopStart;
            this.bufferSource.loopEnd = loopEnd;
        } else {
            this.bufferSource.loop = false;
        }

        this.bufferSource.connect(this.ctx.destination);

        const id = generateUUID();

        const event = new CustomEvent<PlayEvent>("audio-channel/play", {
            detail: {
                id,
                when,
                offset,
                duration: duration ?? this.buffer.duration,
                isPlaying: true,
            },
        });

        if (emitEvents) {
            this.dispatchEvent(new CustomEvent("audio-channel/play", event));
        }

        return new Promise((resolve) => {
            this.bufferSource!.onended = () => {
                this.isPlaying = false;

                if (emitEvents) {
                    const event = new CustomEvent<StopEvent>(
                        "audio-channel/ended",
                        {
                            detail: {
                                id,
                                isPlaying: false,
                            },
                        },
                    );

                    this.dispatchEvent(
                        new CustomEvent("audio-channel/ended", event),
                    );
                }

                onEnd?.();
                resolve();
            };
        });
    }

    onPlay(callback: (event: CustomEvent<PlayEvent>) => void): void {
        this.addEventListener("audio-channel/play", (event: Event) => {
            const playEvent = event as CustomEvent<PlayEvent>;
            callback(playEvent);
        });
    }

    onStop(callback: (event: CustomEvent<StopEvent>) => void): void {
        this.addEventListener("audio-channel/ended", (event: Event) => {
            const stopEvent = event as CustomEvent<StopEvent>;
            callback(stopEvent);
        });
    }

    stop(): void {
        this.getGainNode.disconnect();
        this.bufferSource?.stop();
        this.dispatchEvent(new CustomEvent("stop"));
        this.bufferSource = undefined;
    }

    addSubChannel(channel: AudioChannel): void {
        this.subChannels.push(channel);

        // Set initial volume/mute state
        channel.setVolume(this.getGainNode.gain.value);
        channel.setMuted(this.muted);

        channel.getGainNode.connect(this.getGainNode);

        this.subChannels.forEach((subChannel) => {
            subChannel.setVolume(this.getGainNode.gain.value);
            subChannel.setMuted(this.muted);

            subChannel.getGainNode.connect(this.ctx.destination);
        });
    }
}
