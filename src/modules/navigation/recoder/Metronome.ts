import AudioManager from "@/lib/audio/Context";
import Sample from "@/lib/audio/Sample";
import { getAudioAsset } from "@/utils";

export default class Metronome {
    private interval: NodeJS.Timeout | null = null;

    private isPlaying: boolean = false;

    private metronomeSound: Sample | null = null;

    public async start(bpm: number): Promise<void> {
        if (this.isPlaying) {
            return;
        }

        this.isPlaying = true;

        if (!this.metronomeSound) {
            throw new Error("Metronome sound not loaded");
        }

        this.metronomeSound?.play();

        this.interval = setInterval(() => {
            this.metronomeSound?.play();
        }, this.metronomeInterval(bpm));
    }

    public stop(): void {
        if (!this.isPlaying) {
            return;
        }

        this.isPlaying = false;

        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    public async preloadTickSound(): Promise<void> {
        const sound = await getAudioAsset("/assets/sounds/metronome-tick.wav");

        if (!sound) {
            throw new Error("Metronome sound not found");
        }

        this.metronomeSound = new Sample(
            AudioManager.getInstance(),
            sound,
            "metronome",
        );
    }

    private metronomeInterval(bpm: number): number {
        return Math.floor((60 / bpm) * 1000);
    }
}
