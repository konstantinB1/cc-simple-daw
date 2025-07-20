import "vitest/globals";

export function newNodeAudioBuffer(
    length: number,
    sampleRate: number = 44100,
): AudioBuffer {
    return new globalThis.AudioBuffer({
        length,
        sampleRate,
    });
}