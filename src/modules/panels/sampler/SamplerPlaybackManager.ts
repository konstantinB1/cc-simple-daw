import type { MappedPadKeyWithPressed } from "./Pads";

export default class SamplerPlaybackManager {
    private activePads: Set<MappedPadKeyWithPressed> = new Set();

    public handlePadPress(pad: MappedPadKeyWithPressed) {
        if (this.activePads.has(pad)) {
            if (pad.pressed) {
                pad.sample.stop();
            }

            this.activePads.delete(pad);
        } else {
            this.activePads.add(pad);
            pad.sample.play().catch((err) => {
                console.error(
                    `Failed to play sample for pad ${pad.name}:`,
                    err,
                );
            });
        }
    }
}
