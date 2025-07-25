import { generateUUID } from "@/utils/uuid";
import type AudioEffect from "./AudioEffect";
import AudioSample from "./AudioSample";
import Logger from "./Logger";
import type { GlobalAudioContext } from "@/types";

export type AudioEvent = {
    data: PlayEvent;
    startTime: number;
    endTime: number;
    trackId: string;
};

export type PlayEvent = {
    id: string;
    when: number;
    offset: number;
    duration?: number;
    isPlaying?: boolean;
};

export type PlayParameters = {
    when?: number; // When to start playback, defaults to current time
    offset?: number; // Offset in seconds to start playback from
    duration?: number; // Duration in seconds to play, if not specified, plays the whole sample
    emitEvents?: boolean; // Whether to emit play events, defaults to true
    loopStart?: number; // Start of the loop in seconds
    loopEnd?: number; // End of the loop in seconds
    onStart?: () => void; // Callback when playback starts
    onEnd?: () => void; // Callback when playback ends
    playbackRate?: number; // Playback rate, defaults to 1.0
};

// AudioSource is responsible for separation of audio channels
// from WebAudio API into more coherent structure, so it can be used
// with pub/sub system for communication between different parts of the application.
// AudioSource is a base class for multiple parts of the app such as
// mixer, tracks sequencer, and all VSTs that need to handle audio data.
export default class AudioSource extends EventTarget {
    private ctx: GlobalAudioContext;

    logger = Logger.getInstance();

    id: string;

    name?: string;

    effects: AudioEffect[] = [];

    // Exposed for testing purposes
    public buffer?: AudioBuffer;

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

    isLoaded(): boolean {
        return !!this.buffer;
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
            new CustomEvent("sample-loaded", {
                detail: { sample: audioBuffer },
            }),
        );
    }

    async play({
        when = 0,
        offset = 0,
        duration,
        emitEvents = true,
        loopStart,
        loopEnd,
        onStart,
        onEnd,
        playbackRate = 1.0,
    }: PlayParameters = {}): Promise<void> {
        if (!this.buffer) throw new Error("No sample loaded to play");
        if (this.muted) return Promise.resolve();

        const source = this.ctx.createBufferSource();
        source.buffer = this.buffer;
        const uuid = generateUUID();

        source.playbackRate.setValueAtTime(playbackRate, this.ctx.currentTime);

        if (loopStart !== undefined && loopEnd !== undefined) {
            source.loop = true;
            source.loopStart = loopStart;
            source.loopEnd = loopEnd;
        } else {
            source.loop = false;
        }

        source.connect(this.ctx.destination);

        source.start(when, offset, duration);

        const eventData: PlayEvent = {
            id: uuid,
            when,
            offset,
            duration: duration ?? this.buffer.duration,
            isPlaying: true,
        };

        if (emitEvents) {
            const event = new CustomEvent<PlayEvent>("audio-channel/play", {
                detail: eventData,
            });

            this.dispatchEvent(new CustomEvent("audio-channel/play", event));
        }

        this.bufferSources.add(source);

        onStart?.();

        return new Promise((resolve) => {
            source.onended = () => {
                if (emitEvents) {
                    eventData.isPlaying = false;

                    const stopEvent = new CustomEvent<PlayEvent>(
                        "audio-channel/play",
                        {
                            detail: eventData,
                        },
                    );
                    this.dispatchEvent(stopEvent);
                }

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
