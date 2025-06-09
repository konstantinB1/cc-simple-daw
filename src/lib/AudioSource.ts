import { generateUUID } from "@/utils/uuid";
import type AudioEffect from "./AudioEffect";
import AudioSample from "./AudioSample";
import Logger from "./Logger";

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

// AudioSource is responsible for separation of audio channels
// from WebAudio API into more coherent structure, so it can be used
// with pub/sub system for communication between different parts of the application.
// AudioSource is a base class for multiple parts of the app such as
// mixer, tracks sequencer, and all VSTs that need to handle audio data.
export default class AudioSource extends EventTarget {
    private ctx: AudioContext;

    logger = Logger.getInstance();

    id: string;

    name?: string;

    effects: AudioEffect[] = [];

    buffer?: AudioBuffer;

    muted: boolean = false;

    private gainNode?: GainNode;

    subChannels: Map<string, AudioSource> = new Map<string, AudioSource>();

    master?: AudioSource;

    source: AudioSample;

    private bufferSources: Set<AudioBufferSourceNode> = new Set();

    public isPlaying: boolean = false;

    // Flag to indicate if this channel is only used for mixing
    // and does not represent a track or a sample, so we dont
    // need to render it in the UI on the sequencer for example.
    isMixerChannel: boolean = false;

    constructor(
        id: string,
        ctx: AudioContext,
        name?: string,
        master?: AudioSource,
        isMixerChannel: boolean = false,
    ) {
        super();

        this.ctx = ctx;
        this.id = id;
        this.name = name;
        this.master = master;
        this.isMixerChannel = isMixerChannel;

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
        if (this.isMixerChannel) {
            throw new Error("Cannot load sample into a mixer channel");
        }

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
        if (!this.buffer) throw new Error("No sample loaded to play");
        if (this.muted) return Promise.resolve();

        const source = this.ctx.createBufferSource();
        source.buffer = this.buffer;
        const uuid = generateUUID();

        source.onended = () => {
            this.bufferSources.delete(source);
            // ...existing onended logic...
            if (emitEvents) {
                const event = new CustomEvent<StopEvent>(
                    "audio-channel/ended",
                    {
                        detail: { id: uuid, isPlaying: false },
                    },
                );
                this.dispatchEvent(event);
            }
            onEnd?.();
        };

        if (loopStart !== undefined && loopEnd !== undefined) {
            source.loop = true;
            source.loopStart = loopStart;
            source.loopEnd = loopEnd;
        } else {
            source.loop = false;
        }

        source.connect(this.ctx.destination);
        source.start(when, offset, duration);

        if (emitEvents) {
            const event = new CustomEvent<PlayEvent>("audio-channel/play", {
                detail: {
                    id: uuid,
                    when,
                    offset,
                    duration: duration ?? this.buffer.duration,
                    isPlaying: true,
                },
            });

            this.dispatchEvent(new CustomEvent("audio-channel/play", event));
        }

        this.bufferSources.add(source);

        onStart?.();

        return new Promise((resolve) => {
            source.onended = () => {
                this.bufferSources.delete(source);
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

    stop(when: number = 0, emitEvents: boolean = true): void {
        this.bufferSources.forEach((source) => {
            try {
                source.stop(this.ctx.currentTime + when);
            } catch {}
            source.disconnect();
        });
        this.bufferSources.clear();

        if (emitEvents) {
            this.dispatchEvent(new CustomEvent("stop"));
        }
    }

    addSubChannel(channel: AudioSource): AudioSource {
        if (this.subChannels.has(channel.id)) {
            throw new Error(`SubChannel with id ${channel.id} already exists`);
        }

        this.subChannels.set(channel.id, channel);

        channel.setVolume(this.getGainNode.gain.value);
        channel.setMuted(this.muted);

        channel.getGainNode.connect(this.getGainNode);

        this.subChannels.forEach((subChannel) => {
            subChannel.setVolume(this.getGainNode.gain.value);
            subChannel.setMuted(this.muted);

            subChannel.getGainNode.connect(this.ctx.destination);
        });

        this.dispatchEvent(
            new CustomEvent("audio-channel/sub-channel-added", {
                detail: { channel },
            }),
        );

        return channel;
    }
}
