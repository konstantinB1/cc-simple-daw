import Sample from "./Sample";

export default class Sampler {
    public samples: Map<string, Sample> = new Map();

    private ctx: AudioContext | null = null;

    constructor(ctx: AudioContext) {
        this.ctx = ctx;
    }

    add(id: string, data: ArrayBuffer) {
        if (!this.ctx) {
            throw new Error("Audio context is not initialized");
        }

        const sample = new Sample(this.ctx, data, id);

        this.samples.set(id, sample);
    }

    play(id: string) {
        const sample = this.samples.get(id);

        console.log(this.samples);

        if (sample) {
            sample.play();
        } else {
            console.error(`Sample with id ${id} not found`);
        }
    }

    stop(id: string) {
        const sample = this.samples.get(id);

        if (sample) {
            sample.stop();
        } else {
            console.error(`Sample with id ${id} not found`);
        }
    }
}
