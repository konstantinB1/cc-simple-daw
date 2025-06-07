import type AudioSource from "@/lib/AudioSource";
import { getAudioAsset } from "@/utils";

export default class Metronome {
    private channel: AudioSource;

    private lastTick: number = -1;

    private countdownInterval: NodeJS.Timeout | null = null;

    constructor(channel: AudioSource) {
        this.channel = channel;
    }

    private getNextBeatTime(currentTime: number, bpm: number): number {
        const interval = this.metronomeInterval(bpm);
        const nextBeat = Math.floor(currentTime / interval) + 1;
        return nextBeat * interval;
    }

    public tick(currentTime: number, bpm: number) {
        const nextBeatTime = this.getNextBeatTime(currentTime, bpm);

        if (nextBeatTime > this.lastTick) {
            this.lastTick = nextBeatTime;
            this.channel.play();
        }
    }

    public fixedCountdown(bpm: number, timeSignature: number = 4) {
        return new Promise<void>((resolve) => {
            let ticks = 3;

            this.countdownInterval = setInterval(() => {
                if (ticks === 0) {
                    clearInterval(this.countdownInterval!);
                    this.lastTick = -1;
                    resolve();
                } else {
                    this.channel.play();
                }

                ticks--;
            }, this.metronomeInterval(bpm));
        });
    }

    public cancelCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    stop(): void {
        this.lastTick = -1;
    }

    rewind(): void {
        this.lastTick = -1;
    }

    public async preloadTickSound(): Promise<void> {
        const sound = await getAudioAsset(
            "/cc-simple-daw/assets/sounds/metronome-tick.wav",
        );

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
