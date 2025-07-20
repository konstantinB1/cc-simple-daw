import type AudioEffect from "@/lib/AudioEffect";
import AudioSample from "@/lib/AudioSample";
import type AudioSource from "@/lib/AudioSource";
import type { PlayEvent } from "@/lib/AudioSource";
import type { Logger } from "vite";
import { GainNode } from "../setup";

export default class AudioSourceMock implements AudioSource {
    logger!: Logger;
    id!: string;
    name?: string | undefined;
    effects!: AudioEffect[];
    buffer?: AudioBuffer | undefined;
    muted!: boolean;
    subChannels!: Map<string, AudioSource>;
    master?: AudioSource | undefined;
    source!: AudioSample = new AudioSample(new AudioContext());
    public isPlaying!: boolean;
    isMixerChannel!: boolean;

    get getGainNode(): GainNode {
        return new GainNode();
    }

    isLoaded(): boolean {
        return !!this.buffer;
    }

    setVolume(_volume: number): void {
        throw new Error("Method not implemented.");
    }

    setMuted(_muted: boolean): void {
        throw new Error("Method not implemented.");
    }

    onPlay(_callback: (event: CustomEvent<PlayEvent>) => void): void {
        throw new Error("Method not implemented.");
    }

    stop(_when?: number, _emitEvents?: boolean): void {
        throw new Error("Method not implemented.");
    }

    addSubChannel(_channel: AudioSource): AudioSource {}

    addEventListener(
        _type: string,
        _callback: EventListenerOrEventListenerObject | null,
        _options?: AddEventListenerOptions | boolean,
    ): void {
        throw new Error("Method not implemented.");
    }

    dispatchEvent(_event: Event): boolean {
        throw new Error("Method not implemented.");
    }

    removeEventListener(
        _type: string,
        _callback: EventListenerOrEventListenerObject | null,
        _options?: EventListenerOptions | boolean,
    ): void {
        throw new Error("Method not implemented.");
    }

    async play(): Promise<void> {
        return Promise.resolve();
    }

    async load(_arrayBuffer: ArrayBuffer): Promise<void> {
        return Promise.resolve();
    }
}
