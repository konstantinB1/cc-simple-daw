import Sample from "@/lib/audio/Sample";
import { getAudioAsset } from "@/utils";

export default class Metronome {
    private ctx?: AudioContext;

    private interval: NodeJS.Timeout | null = null;

    private metronomeSound: Sample | null = null;

    constructor(audioContext: AudioContext) {
        this.ctx = audioContext;
    }

    public async start(bpm: number): Promise<void> {
        if (!this.metronomeSound) {
            throw new Error("Metronome sound not loaded");
        }

        this.metronomeSound?.play();

        this.interval = setInterval(() => {
            this.metronomeSound?.play();
        }, this.metronomeInterval(bpm));
    }

    public stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    public async preloadTickSound(): Promise<void> {
        const sound = await getAudioAsset("/assets/sounds/metronome-tick.wav");

        if (!sound) {
            throw new Error("Metronome sound not found");
        }

        this.metronomeSound = new Sample(this.ctx!, sound, "metronome");
    }

    private metronomeInterval(bpm: number): number {
        return Math.floor((60 / bpm) * 1000);
    }
}
