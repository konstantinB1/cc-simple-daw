import AudioSample from "@/lib/AudioSample";
import type { GlobalAudioContext } from "@/types";

export default class AudioSampleMock implements AudioSample {
    private ctx!: GlobalAudioContext;
    rawBuffer!: ArrayBuffer;
    audioBuffer?: AudioBuffer | undefined;
    duration?: number | undefined;
    load(_rawBuffer?: ArrayBuffer): Promise<AudioBuffer> {
        throw new Error("Method not implemented.");
    }
}
