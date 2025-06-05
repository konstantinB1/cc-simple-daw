export default class Sample {
    private context: AudioContext;

    public id: string;

    public source: AudioBufferSourceNode | null = null;

    public buffer: ArrayBuffer;

    constructor(context: AudioContext, buffer: ArrayBuffer, id: string) {
        this.context = context;
        this.id = id;
        this.buffer = buffer;
    }

    private async decodeSource(buffer: ArrayBuffer) {
        try {
            const decodedData = await this.context.decodeAudioData(buffer);
            this.createSource(decodedData);
        } catch (error) {
            console.error("Error decoding audio data:", error);
        }
    }

    private createSource(decodedData: AudioBuffer) {
        const source = this.context.createBufferSource();
        source.buffer = decodedData;
        source.connect(this.context.destination);

        this.source = source;
    }

    public async play() {
        const clonedBuffer = this.buffer.slice(0);
        await this.decodeSource(this.buffer);

        this.source?.start(0);
        this.buffer = clonedBuffer;
    }

    public stop() {
        if (this.source) {
            this.source.stop(0);
        } else {
            console.error("Source is not initialized");
        }
    }
}
