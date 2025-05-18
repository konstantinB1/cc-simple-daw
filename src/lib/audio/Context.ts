export default class AudioManager {
    private static instance: AudioContext | null = null;

    private constructor() {}

    public static getInstance(): AudioContext {
        if (!this.instance) {
            this.instance = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
        }

        return this.instance;
    }

    public static async loadSample(
        kit: string,
        file: string,
    ): Promise<AudioBuffer> {
        const context = AudioManager.getInstance();
        const response = await fetch(`./assets/kits/${kit}/${file}`);
        const arrayBuffer = await response.arrayBuffer();
        return context.decodeAudioData(arrayBuffer);
    }

    public static async playSample(
        kit: string,
        file: string,
        volume: number = 1,
    ): Promise<void> {
        const context = this.getInstance();
        const buffer = await this.loadSample(kit, file);
        const source = context.createBufferSource();
        const gainNode = context.createGain();

        gainNode.gain.setValueAtTime(volume, context.currentTime);
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.start(0);
    }

    public static playFromAudioBuffer(buffer: ArrayBuffer) {
        const context = AudioManager.getInstance();
        const source = context.createBufferSource();
        const gainNode = context.createGain();

        gainNode.gain.setValueAtTime(1, context.currentTime);

        context.decodeAudioData(buffer, (decodedBuffer) => {
            source.buffer = decodedBuffer;
        });

        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.start(0);
    }

    public static close(): void {
        if (this.instance) {
            this.instance.close();
            this.instance = null;
        }
    }
}
