import type AudioChannel from "@/lib/AudioChannel";
import { getAudioAsset } from "@/utils";

export default class Metronome {
    private channel: AudioChannel;

    private lastTick: number = -1;

    constructor(channel: AudioChannel) {
        this.channel = channel;
    }

    public tick(currentTime: number, bpm: number) {
        const nextBeatTime = this.getNextBeatTime(currentTime, bpm);

        if (nextBeatTime > this.lastTick) {
            this.lastTick = nextBeatTime;
            this.channel.play();
        }
    }

    private getNextBeatTime(currentTime: number, bpm: number): number {
        const interval = this.metronomeInterval(bpm);
        const nextBeat = Math.floor(currentTime / interval) + 1;
        return nextBeat * interval;
    }

    public start() {}

    stop(): void {
        this.lastTick = -1;
    }

    rewind(): void {
        this.lastTick = -1;
    }

    public async preloadTickSound(): Promise<void> {
        const sound = await getAudioAsset("/assets/sounds/metronome-tick.wav");

        if (!sound) {
            throw new Error("Metronome sound not found");
        }

        await this.channel.load(sound).catch((err) => {
            console.error("Failed to load metronome sound:", err);
        });
    }

    private metronomeInterval(bpm: number): number {
        return Math.floor((60 / bpm) * 1000);
    }
}
