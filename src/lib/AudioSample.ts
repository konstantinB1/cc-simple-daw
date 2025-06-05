export default class AudioSample {
    private ctx: AudioContext;

    rawBuffer!: ArrayBuffer;

    audioBuffer?: AudioBuffer;

    duration?: number;

    constructor(ctx: AudioContext) {
        this.ctx = ctx;
    }

    async load(rawBuffer?: ArrayBuffer): Promise<AudioBuffer> {
        if (!this.rawBuffer && rawBuffer) {
            this.rawBuffer = rawBuffer;
        }

        if (this.audioBuffer) {
            console.warn(
                "Audio buffer already loaded, do not call load() again",
            );
            return this.audioBuffer;
        }

        try {
            const buffer = await this.ctx.decodeAudioData(
                this.rawBuffer as ArrayBuffer,
            );

            this.audioBuffer = buffer;
            this.duration = buffer.duration;

            return this.audioBuffer;
        } catch (error) {
            throw new Error("Failed to decode audio data");
        }
    }
}
